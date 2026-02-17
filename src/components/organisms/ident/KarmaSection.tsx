import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/components/atoms/Link";
import useApi from "@/hooks/useApi";
import { Page } from "@/lib/types/pagination";
import { IdentInfo, KarmaEvent } from "@/lib/types/ident";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/types/error";
import useSWR from "swr";
import { Pagination } from "@/components/molecules/Pagination";

export function KarmaSection() {
  const api = useApi();
  const t = useTranslations("IdentityDialog.karma");

  const [page, setPage] = useState(1);
  const [perPage] = useState(10);

  const {
    data: meData,
    error: meError,
    isLoading: meIsLoading,
  } = useSWR<IdentInfo, AxiosError<ApiError>, string>("/ident/me", (url) =>
    api.get(url).then((res) => res.data),
  );

  const { data, error, isLoading } = useSWR<
    Page<KarmaEvent>,
    AxiosError<ApiError>,
    string
  >(`/karma/me?page=${page - 1}&perPage=${perPage}`, (url) =>
    api.get(url).then((res) => res.data),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="text-sm">{t("description")}</div>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <div>{t("myKarma")}</div>
          {meIsLoading ? (
            <div className="h-5 w-12 animate-pulse truncate rounded-lg bg-slate-300 dark:bg-slate-700" />
          ) : meError ? (
            <div className="h-5 w-12 truncate rounded-lg bg-red-300 dark:bg-red-800" />
          ) : (
            meData && (
              <div className="w-fit truncate rounded-lg bg-green-600 p-1 text-xs text-white">
                {meData.karma >= 0 ? `+${meData.karma}` : meData.karma}
              </div>
            )
          )}
        </div>
        <hr className="border-slate-400 dark:border-gray-700" />
      </div>
      {isLoading ? (
        <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {Array.from(Array(5).keys()).map((key) => (
            <li
              key={key}
              className="flex items-center justify-between px-2 py-1"
            >
              <div className="h-5 w-10 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
                <div className="h-2 w-16 animate-pulse rounded-lg bg-slate-300 dark:bg-slate-700" />
              </div>
            </li>
          ))}
        </ul>
      ) : error ? (
        <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
          {Array.from(Array(5).keys()).map((key) => (
            <li
              key={key}
              className="flex items-center justify-between px-2 py-1"
            >
              <div className="h-5 w-10 rounded-lg bg-red-300 dark:bg-red-800" />
              <div className="flex flex-col items-end gap-1">
                <div className="h-4 w-32 rounded-lg bg-red-300 dark:bg-red-800" />
                <div className="h-2 w-16 rounded-lg bg-red-300 dark:bg-red-800" />
              </div>
            </li>
          ))}
        </ul>
      ) : data && data.content.length > 0 ? (
        <div className="flex flex-col gap-4">
          <ul className="divide-y divide-gray-200 rounded-md border border-slate-400 bg-white dark:divide-gray-700 dark:border-gray-700 dark:bg-gray-800">
            {data.content.map((event, index) => (
              <li
                key={index}
                className="flex items-center justify-between gap-4 px-2 py-1"
              >
                <div
                  className={`shrink-0 font-semibold ${
                    event.delta > 0
                      ? "text-green-600"
                      : event.delta < 0
                        ? "text-red-600"
                        : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {event.delta > 0
                    ? `+${event.delta}`
                    : event.delta < 0
                      ? `${event.delta}`
                      : `±${event.delta}`}
                </div>
                <div className="flex grow flex-col text-right">
                  <span className="text-left text-xs font-medium">
                    {t.rich(`messages.${event.type}`, {
                      link: (chunks) => (
                        <Link href={`/map/share/${event.cvmId}`}>{chunks}</Link>
                      ),
                    })}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(event.occurredAt).toLocaleString()}
                  </span>
                </div>
              </li>
            ))}
          </ul>
          <Pagination
            totalPages={data!.info.totalPages}
            currentPage={page}
            onPageChange={setPage}
            size="sm"
          />
        </div>
      ) : (
        <div className="text-center text-sm">{t("noEvents")}</div>
      )}
    </div>
  );
}
