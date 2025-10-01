import { useState, useEffect, useMemo, useCallback } from "react";
import useSWR from "swr";
import { AxiosError } from "axios";
import { CvmDto } from "@/lib/types/cvm";
import { ErrorDto } from "@/lib/types/error";
import useApi from "@/hooks/useApi";

interface UseCvmSelectionProps {
  /**
   * An optional shared CVM id. This id is used to pre-select a CVM on the map
   * after loading the page.
   */
  sharedCvmId: string | null;
}

/**
 * Contains the CVM selection logic.
 *
 * @param props The props passed to the hook.
 * @returns The CVM selection state.
 */
export function useMapCvmSelection({ sharedCvmId }: UseCvmSelectionProps) {
  const api = useApi();

  const [selectedCvmId, setSelectedCvmId] = useState<string | null>(null);
  const [isSharedSelection, setIsSharedSelection] = useState(false);

  useEffect(() => {
    if (sharedCvmId) {
      setSelectedCvmId(sharedCvmId);
      setIsSharedSelection(true);
    }
  }, [sharedCvmId]);

  const { data, error, isLoading } = useSWR<CvmDto, AxiosError<ErrorDto>>(
    selectedCvmId ? `/cvms/${selectedCvmId}` : null,
    (url) => api.get(url).then((res) => res.data),
    { shouldRetryOnError: false, revalidateOnFocus: false },
  );

  const selectedCvm = useMemo(() => {
    if (!selectedCvmId) return null;
    return data || null;
  }, [selectedCvmId, data]);

  const selectCvmId = useCallback((id: string | null) => {
    setSelectedCvmId(id);
    setIsSharedSelection(false);
  }, []);

  return {
    selectedCvm,
    error,
    isLoading,
    isSharedSelection,
    selectCvmId,
  };
}
