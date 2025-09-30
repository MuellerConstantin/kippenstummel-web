import { useMemo } from "react";
import useSWR, { SWRConfiguration } from "swr";
import { latLonToTile, tileToLatLon } from "@/lib/geo";
import useApi from "./useApi";
import { useAppSelector } from "@/store";

export interface UseMapViewportCvmDataProps {
  zoom: number;
  bottomLeft: [number, number];
  topRight: [number, number];
}

/**
 * This hook is used to fetch the map viewport data and prepare it for the map
 * component.
 *
 * Internally the viewport (bottomLeft and topRight) as well as the zoom level
 * are normalized to support caching. In addition, the filters set in the
 * application state are applied.
 *
 * @param props The props passed to the hook.
 * @returns The map viewport data.
 */
export default function useMapViewportCvmData(
  props: UseMapViewportCvmDataProps & SWRConfiguration,
) {
  const { zoom, bottomLeft, topRight } = props;

  const api = useApi();

  const mapFilters = useAppSelector((state) => state.usability.mapFilters);

  const mapFilterQuery = useMemo(() => {
    if (!mapFilters) {
      return undefined;
    } else {
      const appliedFilters: string[] = [];

      if (mapFilters.score) {
        if (mapFilters.score.min !== undefined) {
          appliedFilters.push(`score >= ${mapFilters.score.min}`);
        }

        if (mapFilters.score.max !== undefined) {
          appliedFilters.push(`score <= ${mapFilters.score.max}`);
        }
      }

      const finalFilter = appliedFilters.filter(Boolean).join(" and ");
      return finalFilter.length > 0 ? finalFilter : undefined;
    }
  }, [mapFilters]);

  const normalizedZoom = useMemo(() => {
    if (zoom == null || zoom == undefined) return undefined;
    return zoom > 18 ? 18 : zoom;
  }, [zoom]);

  /**
   * The normalized bottom left coordinates. The coordinates are normalized
   * to the lower left corner of the tile that contains the given coordinates.
   */
  const normalizedBottomLeft = useMemo(() => {
    if (!bottomLeft || zoom == null || zoom == undefined) return undefined;

    const [lat, lon] = bottomLeft;
    const { x, y, z } = latLonToTile(lat, lon, zoom);

    const { latitude: normalizedLat, longitude: normalizedLon } = tileToLatLon(
      x,
      y + 1,
      z,
    );

    return [normalizedLat, normalizedLon];
  }, [bottomLeft, zoom]);

  /**
   * The normalized top right coordinates. The coordinates are normalized
   * to the upper right corner of the tile that contains the given coordinates.
   */
  const normalizedTopRight = useMemo(() => {
    if (!topRight || zoom == null || zoom == undefined) return undefined;

    const [lat, lon] = topRight;
    const { x, y, z } = latLonToTile(lat, lon, zoom);

    const { latitude: normalizedLat, longitude: normalizedLon } = tileToLatLon(
      x + 1,
      y,
      z,
    );

    return [normalizedLat, normalizedLon];
  }, [topRight, zoom]);

  const searchParams = useMemo(() => {
    if (!normalizedBottomLeft || !normalizedTopRight || !normalizedZoom) {
      return null;
    }

    const params = new URLSearchParams({
      bottomLeft: normalizedBottomLeft.join(","),
      topRight: normalizedTopRight.join(","),
      zoom: String(normalizedZoom),
    });

    if (mapFilterQuery) {
      params.append("filter", mapFilterQuery);
    }

    return params;
  }, [
    normalizedBottomLeft,
    normalizedTopRight,
    normalizedZoom,
    mapFilterQuery,
  ]);

  const { data, isLoading, error } = useSWR<
    (
      | {
          id: string;
          longitude: number;
          latitude: number;
          score: number;
          recentlyReported: {
            missing: number;
            spam: number;
            inactive: number;
            inaccessible: number;
          };
          alreadyVoted?: "upvote" | "downvote";
        }
      | {
          id: string;
          cluster: true;
          longitude: number;
          latitude: number;
          count: number;
        }
    )[],
    unknown,
    string | null
  >(
    !!searchParams ? `/cvms?${searchParams.toString()}` : null,
    (url) => api.get(url).then((res) => res.data),
    { keepPreviousData: true, ...props },
  );

  const markers = useMemo(
    () =>
      data?.filter((item) => !("cluster" in item)) as {
        id: string;
        longitude: number;
        latitude: number;
        score: number;
        recentlyReported: {
          missing: number;
          spam: number;
          inactive: number;
          inaccessible: number;
        };
        alreadyVoted?: "upvote" | "downvote";
      }[],
    [data],
  );

  const clusters = useMemo(
    () =>
      data?.filter((item) => "cluster" in item) as {
        id: string;
        cluster: true;
        longitude: number;
        latitude: number;
        count: number;
      }[],
    [data],
  );

  return {
    markers,
    clusters,
    isLoading,
    error,
  };
}
