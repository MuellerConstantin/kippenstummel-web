"use client";

import { useMemo } from "react";
import { Medal } from "lucide-react";
import useApi from "@/hooks/useApi";
import useSWR from "swr";
import { Page } from "@/lib/types/pagination";
import { LeaderboardMember } from "@/lib/types/ident";
import { AxiosError } from "axios";
import { ApiError } from "@/lib/types/error";
import { IdentIcon } from "@/components/atoms/IdentIcon";

export function Leaderboard() {
  const api = useApi();

  const { data, error, isLoading } = useSWR<
    Page<LeaderboardMember>,
    AxiosError<ApiError>,
    string
  >(
    "/ident/leaderboard?page=0&perPage=5",
    (url) => api.get(url).then((res) => res.data),
    {
      refreshInterval: 300000, // 5 minutes
    },
  );

  const members = useMemo(() => {
    if (!data) return [];
    return data.content;
  }, [data]);

  const firstPlace = useMemo(() => {
    return members.length > 0 ? members[0] : null;
  }, [members]);

  const secondPlace = useMemo(() => {
    return members.length > 1 ? members[1] : null;
  }, [members]);

  const thirdPlace = useMemo(() => {
    return members.length > 2 ? members[2] : null;
  }, [members]);

  const remainingPlaces = useMemo(() => {
    return members.slice(3);
  }, [members]);

  return (
    <div className="flex w-full flex-col rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
      <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 py-2 dark:border-slate-700 dark:bg-slate-900">
        <h2 className="font-semibold text-slate-800 dark:text-slate-100">
          Leaderboard
        </h2>
      </div>
      {isLoading ? (
        <ul className="divide-y divide-slate-200 dark:divide-slate-700">
          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white dark:bg-yellow-600">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 font-bold text-white dark:bg-slate-500">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 font-bold text-white dark:bg-amber-700">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 animate-pulse rounded-md bg-slate-200 dark:bg-slate-700" />
            </span>
          </li>

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
          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white dark:bg-yellow-600">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 font-bold text-white dark:bg-slate-500">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 font-bold text-white dark:bg-amber-700">
              <Medal className="h-4 w-4" />
            </span>
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              <div className="h-3 w-24 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              <div className="h-3 w-6 rounded-md bg-red-300 dark:bg-red-800" />
            </span>
          </li>

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
          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-yellow-500 font-bold text-white dark:bg-yellow-600">
              <Medal className="h-4 w-4" />
            </span>
            {firstPlace ? (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <IdentIcon value={firstPlace.identity} />
              </div>
            ) : (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <div className="flex h-full w-full items-center justify-center">
                  ?
                </div>
              </div>
            )}
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              {firstPlace ? firstPlace.displayName || "Anonymous" : "-"}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {firstPlace?.karma || "-"}
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-400 font-bold text-white dark:bg-slate-500">
              <Medal className="h-4 w-4" />
            </span>
            {secondPlace ? (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <IdentIcon value={secondPlace.identity} />
              </div>
            ) : (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <div className="flex h-full w-full items-center justify-center">
                  ?
                </div>
              </div>
            )}
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              {secondPlace ? secondPlace.displayName || "Anonymous" : "-"}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {secondPlace?.karma || "-"}
            </span>
          </li>

          <li className="flex items-center gap-4 px-4 py-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 font-bold text-white dark:bg-amber-700">
              <Medal className="h-4 w-4" />
            </span>
            {thirdPlace ? (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <IdentIcon value={thirdPlace.identity} />
              </div>
            ) : (
              <div className="h-6 w-6 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
                <div className="flex h-full w-full items-center justify-center">
                  ?
                </div>
              </div>
            )}
            <span className="flex-1 truncate font-medium text-slate-800 dark:text-slate-100">
              {thirdPlace ? thirdPlace.displayName || "Anonymous" : "-"}
            </span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {thirdPlace?.karma || "-"}
            </span>
          </li>

          {remainingPlaces.map((member, index) => (
            <li key={index} className="flex items-center gap-4 px-4 py-2">
              <span className="h-6 w-6 text-center text-slate-400">
                {index + 4}
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
  );
}
