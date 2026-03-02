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

interface PodiumCardProps {
  place: 1 | 2 | 3;
  member: LeaderboardMember | null;
  isLoading: boolean;
  error?: AxiosError<ApiError>;
}

function PodiumCard({ place, member, isLoading, error }: PodiumCardProps) {
  const gradient =
    place === 1
      ? "from-yellow-400 to-yellow-600"
      : place === 2
        ? "from-slate-300 to-slate-500"
        : "from-amber-500 to-amber-700";

  const height =
    place === 1
      ? "h-48 md:h-56"
      : place === 2
        ? "h-40 md:h-44"
        : "h-36 md:h-40";

  const badgeColor =
    place === 1
      ? "bg-yellow-500"
      : place === 2
        ? "bg-slate-500"
        : "bg-amber-600";

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {/* Avatar + Name */}
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative">
          {isLoading ? (
            <div className="h-20 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-700" />
          ) : error ? (
            <div className="h-20 w-20 rounded-full bg-red-300 dark:bg-red-800" />
          ) : member ? (
            <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-xl dark:border-slate-900">
              <IdentIcon value={member.identity} />
            </div>
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-200 text-xl font-bold dark:bg-slate-700">
              ?
            </div>
          )}
          {/* Rank Badge */}
          <div
            className={`absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-bold text-white shadow-lg ${badgeColor}`}
          >
            #{place}
          </div>
        </div>
        {/* Name */}
        <div className="font-semibold text-slate-800 dark:text-white">
          {isLoading ? (
            <div className="h-4 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
          ) : error ? (
            <div className="h-4 w-24 rounded-md bg-red-300 dark:bg-red-800" />
          ) : (
            member?.displayName || "Anonymous"
          )}
        </div>
        {/* Karma Badge */}
        <div>
          {isLoading ? (
            <div className="h-4 w-10 animate-pulse rounded-md bg-slate-200 text-xs font-medium dark:bg-slate-700" />
          ) : error ? (
            <div className="h-4 w-10 rounded-md bg-red-300 text-xs font-medium dark:bg-red-800" />
          ) : (
            <div className="rounded-md bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              {member?.karma ?? "-"} Karma
            </div>
          )}
        </div>
      </div>
      {/* Podium Block */}
      <div className="relative w-full">
        <div
          className={`relative flex w-full items-center justify-center rounded-t-2xl bg-gradient-to-b ${gradient} ${height}`}
        >
          <Medal className="h-8 w-8 text-white drop-shadow-lg" />
        </div>
      </div>
    </div>
  );
}

export function VictoryPodium({
  firstPlace,
  secondPlace,
  thirdPlace,
  isLoading,
  error,
}: VictoryPodiumProps) {
  return (
    <div className="grid w-full grid-cols-1 items-end gap-8 md:grid-cols-3">
      {/* 2nd */}
      <div className="order-2 flex justify-center md:order-1">
        <PodiumCard
          place={2}
          member={secondPlace}
          isLoading={isLoading}
          error={error}
        />
      </div>
      {/* 1st */}
      <div className="order-1 flex justify-center md:order-2">
        <PodiumCard
          place={1}
          member={firstPlace}
          isLoading={isLoading}
          error={error}
        />
      </div>
      {/* 3rd */}
      <div className="order-3 flex justify-center">
        <PodiumCard
          place={3}
          member={thirdPlace}
          isLoading={isLoading}
          error={error}
        />
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
              {Array.from(Array(10).keys()).map((key) => (
                <li key={key} className="flex items-center gap-4 px-4 py-4">
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
              {Array.from(Array(10).keys()).map((key) => (
                <li key={key} className="flex items-center gap-4 px-4 py-4">
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
                <li key={index} className="flex items-center gap-4 px-4 py-4">
                  <span className="h-6 w-6 text-center text-slate-400">
                    {(page - 1) * perPage + index + 4}
                  </span>
                  <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                    <IdentIcon value={member.identity} />
                  </div>
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
