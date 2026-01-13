"use client";

import { IdentIcon } from "@/components/atoms/IdentIcon";
import { Pagination } from "@/components/molecules/Pagination";
import useApi from "@/hooks/useApi";
import { useRouter } from "@/i18n/navigation";
import { ApiError } from "@/lib/types/error";
import { LeaderboardMember } from "@/lib/types/ident";
import { Page } from "@/lib/types/pagination";
import { AxiosError } from "axios";
import { Medal } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import useSWR from "swr";

interface VictoryPodiumProps {
  firstPlace: LeaderboardMember | null;
  secondPlace: LeaderboardMember | null;
  thirdPlace: LeaderboardMember | null;
  isLoading: boolean;
  error?: AxiosError<ApiError>;
}

function VictoryPodium(props: VictoryPodiumProps) {
  const { firstPlace, secondPlace, thirdPlace, isLoading, error } = props;

  return (
    <div className="grid w-full grid-cols-1 items-end gap-x-2 gap-y-6 md:grid-cols-3">
      <div className="order-2 w-full md:order-1">
        <div className="mb-4 flex flex-col items-center gap-2">
          {isLoading ? (
            <div className="h-16 w-16 animate-pulse overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900" />
          ) : error ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-red-300 dark:border-slate-600 dark:bg-red-800" />
          ) : secondPlace ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <IdentIcon value={secondPlace!.identity} />
            </div>
          ) : (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <div className="flex h-full w-full items-center justify-center">
                ?
              </div>
            </div>
          )}
          <div className="flex w-full flex-col items-center gap-1 px-4 text-center text-slate-800 dark:text-white">
            {isLoading ? (
              <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900" />
            ) : error ? (
              <div className="h-4 w-32 rounded-lg bg-red-300 dark:bg-red-800" />
            ) : (
              <div className="truncate font-bold">
                {secondPlace ? secondPlace.displayName || "Anonymous" : "-"}
              </div>
            )}
            <div className="text-slate-400">{secondPlace?.karma}</div>
          </div>
        </div>
        <div className="flex h-18 w-full justify-center rounded-t-lg bg-slate-400 p-4 md:h-32 md:rounded-tr-none dark:bg-slate-500">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-slate-400 font-bold text-white dark:bg-slate-500">
              <Medal className="h-6 w-6" />
            </span>
          </div>
        </div>
        <div className="h-10 bg-gradient-to-b from-slate-400 to-transparent dark:from-slate-500"></div>
      </div>
      <div className="order-1 w-full md:order-2">
        <div className="mb-4 flex flex-col items-center gap-2">
          {isLoading ? (
            <div className="h-16 w-16 animate-pulse overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900" />
          ) : error ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-red-300 dark:border-slate-600 dark:bg-red-800" />
          ) : firstPlace ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <IdentIcon value={firstPlace!.identity} />
            </div>
          ) : (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <div className="flex h-full w-full items-center justify-center">
                ?
              </div>
            </div>
          )}
          <div className="flex w-full flex-col items-center gap-1 px-4 text-center text-slate-800 dark:text-white">
            {isLoading ? (
              <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900" />
            ) : error ? (
              <div className="h-4 w-32 rounded-lg bg-red-300 dark:bg-red-800" />
            ) : (
              <div className="truncate font-bold">
                {firstPlace ? firstPlace.displayName || "Anonymous" : "-"}
              </div>
            )}
            <div className="text-slate-400">{firstPlace?.karma}</div>
          </div>
        </div>
        <div className="flex h-18 w-full justify-center rounded-t-lg bg-yellow-500 p-4 md:h-42 dark:bg-yellow-600">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-yellow-500 font-bold text-white dark:bg-yellow-600">
              <Medal className="h-6 w-6" />
            </span>
          </div>
        </div>
        <div className="h-10 bg-gradient-to-b from-yellow-500 to-transparent dark:from-yellow-600"></div>
      </div>
      <div className="order-3 w-full">
        <div className="mb-4 flex flex-col items-center gap-2">
          {isLoading ? (
            <div className="h-16 w-16 animate-pulse overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900" />
          ) : error ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-red-300 dark:border-slate-600 dark:bg-red-800" />
          ) : thirdPlace ? (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <IdentIcon value={thirdPlace!.identity} />
            </div>
          ) : (
            <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <div className="flex h-full w-full items-center justify-center">
                ?
              </div>
            </div>
          )}
          <div className="flex w-full flex-col items-center gap-1 px-4 text-center text-slate-800 dark:text-white">
            {isLoading ? (
              <div className="h-4 w-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-900" />
            ) : error ? (
              <div className="h-4 w-32 rounded-lg bg-red-300 dark:bg-red-800" />
            ) : (
              <div className="truncate font-bold">
                {thirdPlace ? thirdPlace.displayName || "Anonymous" : "-"}
              </div>
            )}
            <div className="text-slate-400">{thirdPlace?.karma}</div>
          </div>
        </div>
        <div className="flex h-18 w-full justify-center rounded-t-lg bg-amber-600 p-4 md:rounded-tl-none dark:bg-amber-700">
          <div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-amber-600 font-bold text-white dark:bg-amber-700">
              <Medal className="h-6 w-6" />
            </span>
          </div>
        </div>
        <div className="h-10 bg-gradient-to-b from-amber-600 to-transparent dark:from-amber-700"></div>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const api = useApi();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("LeaderboardPage");
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const perPage = Number(searchParams.get("perPage")) || 25;

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

    return `/ident/leaderboard?${params.toString()}`;
  }, [page, perPage, locale]);

  const { data, error, isLoading } = useSWR<
    Page<LeaderboardMember>,
    AxiosError<ApiError>,
    string
  >(url, (url) => api.get(url).then((res) => res.data), {
    refreshInterval: 300000, // 5 minutes
  });

  const members = useMemo(() => {
    if (!data) return [];
    return data.content;
  }, [data]);

  const firstPlace = useMemo(() => {
    return members?.length > 0 && page === 1 ? members[0] : null;
  }, [members, page]);

  const secondPlace = useMemo(() => {
    return members?.length > 1 && page === 1 ? members[1] : null;
  }, [members, page]);

  const thirdPlace = useMemo(() => {
    return members?.length > 2 && page === 1 ? members[2] : null;
  }, [members, page]);

  const remainingPlaces = useMemo(() => {
    return page === 1 ? members.slice(3) : members;
  }, [members, page]);

  return (
    <div className="mx-auto my-8 flex w-full max-w-[60rem] flex-col items-center gap-4 gap-12 p-4">
      <div className="flex items-center justify-center gap-1">
        <div className="relative h-10 w-10 overflow-hidden">
          <Image
            src="/icons/laurel-branch-left.svg"
            alt="Laurel Branch Left"
            fill
            objectFit="contain"
            layout="fill"
          />
        </div>
        <div className="text-center text-4xl font-bold text-slate-800 dark:text-white">
          {t("headline")}
        </div>
        <div className="relative h-10 w-10 overflow-hidden">
          <Image
            src="/icons/laurel-branch-right.svg"
            alt="Laurel Branch Left"
            fill
            objectFit="contain"
            layout="fill"
          />
        </div>
      </div>
      <div className="mx-auto max-w-[40rem] text-center text-slate-400">
        {t("description")}
      </div>
      {page === 1 && (
        <VictoryPodium
          firstPlace={firstPlace}
          secondPlace={secondPlace}
          thirdPlace={thirdPlace}
          isLoading={isLoading}
          error={error}
        />
      )}
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
          {isLoading ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {Array.from(Array(2).keys()).map((key) => (
                <li key={key} className="flex items-center gap-4 px-4 py-2">
                  <span className="h-6 w-6 text-center text-slate-400">
                    {key + 4}
                  </span>
                  <span className="flex-1 truncate text-slate-700 dark:text-slate-300">
                    <div className="h-3 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    <div className="h-3 w-6 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
                  </span>
                </li>
              ))}
            </ul>
          ) : error ? (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {Array.from(Array(2).keys()).map((key) => (
                <li key={key} className="flex items-center gap-4 px-4 py-2">
                  <span className="h-6 w-6 text-center text-slate-400">
                    {key + 4}
                  </span>
                  <span className="flex-1 truncate text-slate-700 dark:text-slate-300">
                    <div className="h-3 w-24 rounded-md bg-red-300 dark:bg-red-800" />
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    <div className="h-3 w-6 rounded-md bg-red-300 dark:bg-red-800" />
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
              {remainingPlaces.map((member, index) => (
                <li key={index} className="flex items-center gap-4 px-4 py-2">
                  <span className="h-6 w-6 text-center text-slate-400">
                    {(page - 1) * perPage + index + 4}
                  </span>
                  <span className="flex-1 truncate text-slate-700 dark:text-slate-300">
                    {member.displayName || "Anonymous"}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {member.karma}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        {!isLoading && !error && (
          <Pagination
            totalPages={data!.info.totalPages}
            currentPage={page}
            onPageChange={(newPage) => updateQuery({ page: newPage })}
          />
        )}
      </div>
    </div>
  );
}
