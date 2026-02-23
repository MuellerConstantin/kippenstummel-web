"use client";

import { Link } from "@/components/atoms/Link";
import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";
import { Pagination } from "@/components/molecules/Pagination";
import useApi from "@/hooks/useApi";
import { useRouter } from "@/i18n/navigation";
import {
  SCORING_DELETION_UPPER_LIMIT,
  SCORING_GOOD_LOWER_LIMIT,
  SCORING_NEUTRAL_LOWER_LIMIT,
} from "@/lib/constants";
import { Region } from "@/lib/regions";
import { Cvm } from "@/lib/types/cvm";
import { GeoCoordinates } from "@/lib/types/geo";
import { Page } from "@/lib/types/pagination";
import axios from "axios";
import { ChevronDown, ChevronUp, Equal, MapPin, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

export interface RegionCvmListProps {
  region: Region;
}

export function RegionCvmList(props: RegionCvmListProps) {
  const { region } = props;

  const t = useTranslations("RegionCvmList");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const api = useApi();
  const router = useRouter();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 10;

  const [selected, setSelected] = useState<string | null>(null);

  const updateQuery = (updates: Record<string, string | number>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    router.push(`?${params.toString()}`);
  };

  const url = useMemo(() => {
    const apiPage = Math.max(page - 1, 0);

    const params = new URLSearchParams({
      perPage: String(perPage),
      page: String(apiPage),
      filter: `bbox=="${region.bbox.bottomLeft},${region.bbox.topRight}"`,
      locale,
    });

    return `/cvms?${params.toString()}`;
  }, [page, perPage, locale, region]);

  const { data, isLoading, error } = useSWR<Page<Cvm>, unknown, string | null>(
    url,
    (url) => api.get(url).then((res) => res.data),
  );

  const fetchOsmAddress = useCallback(async (key: GeoCoordinates) => {
    const url = "/api/geocoding/reverse";

    return await axios.get<{
      place_id: number;
      licence: string;
      osm_type: "node" | "way" | "relation";
      osm_id: number;
      lat: string;
      lon: string;
      class: string;
      type: string;
      place_rank: number;
      importance: number;
      addresstype: string;
      name: string;
      display_name: string;
      address: {
        amenity?: string;
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        ISO3166_2_lvl4?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
      };
      boundingbox: [
        string, // south latitude
        string, // north latitude
        string, // west longitude
        string, // east longitude
      ];
    }>(url, {
      params: {
        lat: key.latitude,
        lon: key.longitude,
        format: "json",
      },
      headers: {
        Accept: "application/json",
      },
    });
  }, []);

  const { data: osmAddresses } = useSWR<
    {
      place_id: number;
      licence: string;
      osm_type: "node" | "way" | "relation";
      osm_id: number;
      lat: string;
      lon: string;
      class: string;
      type: string;
      place_rank: number;
      importance: number;
      addresstype: string;
      name: string;
      display_name: string;
      address: {
        amenity?: string;
        road?: string;
        neighbourhood?: string;
        suburb?: string;
        city?: string;
        town?: string;
        village?: string;
        state?: string;
        ISO3166_2_lvl4?: string;
        postcode?: string;
        country?: string;
        country_code?: string;
      };
      boundingbox: [
        string, // south latitude
        string, // north latitude
        string, // west longitude
        string, // east longitude
      ];
    }[],
    unknown,
    ["osmAddresses", GeoCoordinates[]] | null
  >(
    data
      ? [
          "osmAddresses",
          data?.content.map((cvm) => ({
            latitude: cvm.latitude,
            longitude: cvm.longitude,
          })) || [],
        ]
      : null,
    (key) =>
      Promise.all(key[1].map(fetchOsmAddress)).then((responses) =>
        responses.map((res) => res.data),
      ),
    {
      revalidateOnFocus: false,
      dedupingInterval: 1000 * 60 * 60 * 24, // 24h
    },
  );

  const formattedAddresses = useMemo(() => {
    return osmAddresses?.map((addr) => {
      const { road, city, town, village, postcode } = addr.address ?? {};
      return [road, postcode, city || town || village]
        .filter(Boolean)
        .join(", ");
    });
  }, [osmAddresses]);

  const handleSelect = useCallback((key: string) => {
    setSelected(key);
  }, []);

  return (
    <div className="w-full">
      <p className="sr-only">
        {t("description", { region: props.region.name })}
      </p>
      {isLoading ? (
        <div className="flex w-full flex-col gap-4">
          <ListBox className="max-h-[40rem] min-h-[20rem] w-full max-w-full space-y-1 overflow-y-auto">
            {Array.from(Array(10).keys()).map((key) => (
              <ListBoxItem key={key}>
                <div className="flex gap-2 overflow-hidden">
                  <div className="h-7 w-7 animate-pulse rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="h-3 w-[12rem] animate-pulse truncate rounded-md bg-slate-300 dark:bg-slate-700" />
                    <div className="h-2 w-[8rem] animate-pulse truncate rounded-md bg-slate-300 dark:bg-slate-700" />
                  </div>
                </div>
              </ListBoxItem>
            ))}
          </ListBox>
        </div>
      ) : error ? (
        <div className="flex w-full flex-col gap-4">
          <ListBox className="max-h-[40rem] min-h-[20rem] w-full max-w-full space-y-1 overflow-y-auto">
            {Array.from(Array(10).keys()).map((key) => (
              <ListBoxItem key={key}>
                <div className="flex gap-2 overflow-hidden">
                  <div className="h-7 w-7 rounded-full bg-red-300 dark:bg-red-800" />
                  <div className="flex flex-col gap-1 overflow-hidden">
                    <div className="h-3 w-[12rem] truncate rounded-md bg-red-300 dark:bg-red-800" />
                    <div className="h-2 w-[8rem] truncate rounded-md bg-red-300 dark:bg-red-800" />
                  </div>
                </div>
              </ListBoxItem>
            ))}
          </ListBox>
        </div>
      ) : data && data.content.length > 0 ? (
        <div className="flex w-full flex-col gap-4">
          <ListBox
            className="max-h-[40rem] min-h-[20rem] w-full max-w-full space-y-1 overflow-y-auto"
            selectionMode="single"
            selectedKeys={selected ? [selected] : []}
            onSelectionChange={(keys) =>
              handleSelect([...(keys as Set<string>)][0])
            }
          >
            {data?.content.map((cvm, index) => {
              const formattedAddress = formattedAddresses?.[index];

              return (
                <ListBoxItem id={`cvm-list-item-${cvm.id}`} key={cvm.id}>
                  <div className="flex h-full w-full justify-between gap-2">
                    <div className="flex cursor-pointer gap-2 overflow-hidden">
                      <div className="relative z-[50] h-fit w-fit">
                        {cvm.score <= SCORING_DELETION_UPPER_LIMIT ? (
                          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-800">
                            <X className="h-2.5 w-2.5 text-white" />
                          </div>
                        ) : cvm.score < SCORING_NEUTRAL_LOWER_LIMIT ? (
                          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
                            <ChevronDown className="h-2.5 w-2.5 text-white" />
                          </div>
                        ) : cvm.score >= SCORING_GOOD_LOWER_LIMIT ? (
                          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-green-600">
                            <ChevronUp className="h-2.5 w-2.5 text-white" />
                          </div>
                        ) : (
                          <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-slate-500">
                            <Equal className="h-2.5 w-2.5 text-white" />
                          </div>
                        )}
                        <MapPin className="h-8 w-8 fill-green-600 text-white" />
                      </div>
                      <div className="flex flex-col gap-1 overflow-hidden">
                        <div className="truncate text-sm font-semibold text-nowrap">
                          {t("cvm")}
                        </div>
                        <div>
                          {formattedAddress && formattedAddress.length > 0 ? (
                            <div className="truncate text-xs">
                              {formattedAddress}
                            </div>
                          ) : (
                            <div className="truncate text-xs">
                              {cvm.latitude} / {cvm.longitude} (lat/lng)
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <div>Score:</div>
                          <div>{cvm.score}</div>
                        </div>
                      </div>
                    </div>
                    {selected === `cvm-list-item-${cvm.id}` && (
                      <Link
                        href={`/map/share/${cvm.id}`}
                        className="pressed:bg-gray-300 dark:pressed:bg-slate-400 h-fit w-fit cursor-pointer self-center rounded-lg border border-black/10 bg-gray-100 px-5 py-2 text-center text-sm text-gray-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition hover:bg-gray-200 hover:no-underline dark:border-white/10 dark:bg-slate-600 dark:text-slate-100 dark:shadow-none dark:hover:bg-slate-500"
                      >
                        {t("show")}
                      </Link>
                    )}
                  </div>
                </ListBoxItem>
              );
            })}
          </ListBox>
          <div className="flex flex-col gap-2">
            <Pagination
              totalPages={data!.info.totalPages}
              currentPage={page}
              onPageChange={(page) => updateQuery({ page })}
              size="sm"
            />
          </div>
        </div>
      ) : (
        <div className="flex max-h-[40rem] min-h-[20rem] w-full max-w-full flex-col items-center justify-center rounded-md border border-slate-200 bg-slate-100 p-4 dark:border-slate-600 dark:bg-slate-900">
          <div className="text-center text-sm text-slate-400 italic md:max-w-2/3 lg:max-w-1/3">
            {t("empty", { region: region.name })}
          </div>
        </div>
      )}
    </div>
  );
}
