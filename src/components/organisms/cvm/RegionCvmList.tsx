"use client";

import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";
import { Pagination } from "@/components/molecules/Pagination";
import useApi from "@/hooks/useApi";
import { useRouter } from "@/i18n/navigation";
import { CvmRegion } from "@/lib/regions";
import { Cvm } from "@/lib/types/cvm";
import { Page } from "@/lib/types/pagination";
import { ChevronDown, ChevronUp, Equal, MapPin, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

export interface RegionCvmListProps {
  region: CvmRegion;
}

export function RegionCvmList(props: RegionCvmListProps) {
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
      locale,
    });

    return `/cvms?${params.toString()}`;
  }, [page, perPage, locale]);

  const { data, isLoading, error } = useSWR<Page<Cvm>, unknown, string | null>(
    url,
    (url) => api.get(url).then((res) => res.data),
  );

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
            {data?.content.map((cvm) => (
              <ListBoxItem id={`cvm-list-item-${cvm.id}`} key={cvm.id}>
                <div className="flex cursor-pointer gap-2 overflow-hidden">
                  <div className="relative z-[50] h-fit w-fit">
                    {cvm.score < -8 ? (
                      <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-800">
                        <X className="h-2.5 w-2.5 text-white" />
                      </div>
                    ) : cvm.score < 0 ? (
                      <div className="absolute top-1 right-1 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-red-500">
                        <ChevronDown className="h-2.5 w-2.5 text-white" />
                      </div>
                    ) : cvm.score >= 5 ? (
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
                      {cvm.id}
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <div>Score:</div>
                      <div>{cvm.score}</div>
                    </div>
                  </div>
                </div>
              </ListBoxItem>
            ))}
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
        <div className="max-h-[40rem] min-h-[20rem] w-full max-w-full">
          <div className="text-sm italic">{t("empty")}</div>
        </div>
      )}
    </div>
  );
}
