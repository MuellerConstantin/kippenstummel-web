"use client";

import React, { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu as MenuIcon,
  EllipsisVertical,
  Languages,
  IdCard,
  Signature,
  User,
  Info,
} from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Switch } from "@/components/atoms/Switch";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { Popover } from "@/components/atoms/Popover";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";
import { IdentityDialog } from "./ident/IdentityDialog";
import { useAppSelector, useAppDispatch } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { useRouter, usePathname } from "@/i18n/navigation";
import { RequestIdentDialog } from "./ident/RequestIdentDialog";
import { IdentInfo } from "@/lib/types/ident";
import { AxiosError } from "axios";
import { ApiError } from "next/dist/server/api-utils";
import useSWR from "swr";
import useApi from "@/hooks/useApi";
import { AnimatedDialogModal } from "../molecules/AnimatedDialogModal";
import { AboutDialog } from "./navigation/AboutDialog";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { IdentityModalSheet } from "./ident/IdentityModalSheet";
import { AboutModalSheet } from "./navigation/AboutModalSheet";

export function Navbar() {
  const t = useTranslations("Navbar");

  const navigation = useMemo(() => {
    return [
      { name: t("home"), href: "/home" },
      { name: t("map"), href: "/map" },
    ];
  }, [t]);

  return (
    <nav className="relative border-b border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      <div className="relative flex items-center justify-between space-x-10 p-4">
        <div className="md:hidden">
          <MenuTrigger>
            <Button variant="icon">
              <MenuIcon className="h-6 w-6" />
            </Button>
            <Menu>
              {navigation.map((item) => (
                <MenuItem
                  key={item.name}
                  id={`nav-${item.name}`}
                  href={item.href}
                >
                  {item.name}
                </MenuItem>
              ))}
            </Menu>
          </MenuTrigger>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:static md:top-auto md:left-auto md:translate-x-0 md:translate-y-0">
          <Link href="/home" className="!no-underline">
            <div className="relative flex w-fit items-center justify-center md:space-x-4">
              <Image
                src="/images/logo.svg"
                width={42}
                height={32}
                className="h-6 -rotate-16 sm:h-9"
                alt="Kippenstummel"
              />
              <span className="hidden self-center text-xl font-semibold whitespace-nowrap md:block dark:text-white">
                Kippenstummel
              </span>
            </div>
          </Link>
        </div>
        <div className="flex items-center justify-center space-x-4">
          <div className="hidden space-x-2 md:flex">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium font-semibold !text-slate-800 !no-underline hover:bg-slate-200 dark:!text-white dark:hover:bg-slate-800"
              >
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex">
            <MenuTrigger>
              <Button variant="icon">
                <Languages className="h-6 w-6" />
              </Button>
              <NavbarLanguagesMenu />
            </MenuTrigger>
            <NavbarOptionsMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavbarUnauthenticatedOptionsMenu() {
  const t = useTranslations("Navbar");

  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.usability.darkMode);

  const [showNewIdentityDialog, setShowNewIdentityDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <div className="flex w-[15rem] flex-col gap-4 overflow-hidden p-2">
        <div className="flex gap-4 overflow-hidden">
          <Switch
            isSelected={darkMode}
            onChange={(newDarkMode) =>
              dispatch(usabilitySlice.actions.setDarkMode(newDarkMode))
            }
            className="w-fit"
          >
            Dark Mode
          </Switch>
        </div>
        <div className="flex flex-col gap-2">
          <div className="text-xs">{t("no-identity")}</div>
          <ListBox>
            <ListBoxItem onAction={() => setShowNewIdentityDialog(true)}>
              <div className="flex w-full items-center gap-2">
                <Signature className="h-4 w-4" />
                <span>{t("options.new-identity")}</span>
              </div>
            </ListBoxItem>
            <ListBoxItem onAction={() => setShowAboutDialog(true)}>
              <div className="flex w-full items-center gap-2">
                <Info className="h-4 w-4" />
                <span>{t("options.about")}</span>
              </div>
            </ListBoxItem>
          </ListBox>
          <AnimatedDialogModal
            isOpen={showNewIdentityDialog}
            onOpenChange={setShowNewIdentityDialog}
          >
            <RequestIdentDialog />
          </AnimatedDialogModal>
          <AnimatedDialogModal
            isOpen={showAboutDialog}
            onOpenChange={setShowAboutDialog}
            className="max-w-xl"
          >
            <AboutDialog />
          </AnimatedDialogModal>
        </div>
      </div>
    </Popover>
  );
}

function NavbarAuthenticatedOptionsMenu() {
  const t = useTranslations("Navbar");
  const dispatch = useAppDispatch();
  const api = useApi();

  const isSmDown = useBreakpointDown("sm");

  const darkMode = useAppSelector((state) => state.usability.darkMode);
  const identity = useAppSelector((state) => state.ident.identity);

  const [showIdentityDialog, setShowIdentityDialog] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);

  const { data, error, isLoading } = useSWR<
    IdentInfo,
    AxiosError<ApiError>,
    string
  >("/ident/me", (url) => api.get(url).then((res) => res.data), {
    refreshInterval: 300000, // 5 minutes
  });

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <div>
        <div className="relative flex justify-end bg-green-600 p-2">
          <div className="flex h-fit w-fit flex-col items-center rounded-md bg-white p-1 dark:bg-slate-900">
            {isLoading ? (
              <div className="h-5 w-12 animate-pulse truncate rounded-lg bg-slate-300 dark:bg-slate-700" />
            ) : error ? (
              <div className="h-5 w-12 truncate rounded-lg bg-red-300 dark:bg-red-800" />
            ) : (
              data && (
                <div className="w-fit truncate text-[0.8rem] font-bold text-green-600">
                  {data.karma >= 0 ? `+${data.karma}` : data.karma}
                </div>
              )
            )}
            <div className="text-[0.6rem]">{t("myKarma")}</div>
          </div>
          <div className="absolute bottom-0 left-1/6 translate-x-[-50%] translate-y-1/2 rounded-full border-4 border-white dark:border-slate-900">
            <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <IdentIcon value={identity || ""} />
            </div>
          </div>
        </div>
        <div className="h-8" />
      </div>
      <div className="flex w-[15rem] flex-col gap-4 overflow-hidden px-2 pb-2">
        {data?.displayName && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center overflow-hidden">
              <span className="truncate font-semibold text-slate-800 dark:text-white">
                {data.displayName.split("#")[0]}
              </span>
              <span className="text-slate-400 dark:text-slate-400">
                #{data.displayName.split("#")[1]}
              </span>
            </div>
            <hr className="border-slate-200 dark:border-slate-800" />
          </div>
        )}
        <div className="flex flex-col gap-4">
          <Switch
            isSelected={darkMode}
            onChange={(newDarkMode) =>
              dispatch(usabilitySlice.actions.setDarkMode(newDarkMode))
            }
            className="w-fit"
          >
            Dark Mode
          </Switch>
          <ListBox>
            <ListBoxItem onAction={() => setShowIdentityDialog(true)}>
              <div className="flex w-full items-center gap-2">
                <IdCard className="h-4 w-4" />
                <span>{t("options.identity")}</span>
              </div>
            </ListBoxItem>
            <ListBoxItem onAction={() => setShowAboutDialog(true)}>
              <div className="flex w-full items-center gap-2">
                <Info className="h-4 w-4" />
                <span>{t("options.about")}</span>
              </div>
            </ListBoxItem>
          </ListBox>
        </div>
        {!isSmDown && (
          <AnimatedDialogModal
            isOpen={showIdentityDialog}
            onOpenChange={setShowIdentityDialog}
            className="max-w-xl"
          >
            <IdentityDialog />
          </AnimatedDialogModal>
        )}
        {isSmDown && showIdentityDialog && (
          <IdentityModalSheet
            isOpen={showIdentityDialog}
            onIsOpenChange={setShowIdentityDialog}
          />
        )}
        {!isSmDown && (
          <AnimatedDialogModal
            isOpen={showAboutDialog}
            onOpenChange={setShowAboutDialog}
            className="max-w-xl"
          >
            <AboutDialog />
          </AnimatedDialogModal>
        )}
        {isSmDown && showAboutDialog && (
          <AboutModalSheet
            isOpen={showAboutDialog}
            onIsOpenChange={setShowAboutDialog}
          />
        )}
      </div>
    </Popover>
  );
}

export function NavbarOptionsMenu() {
  const isAuthenticated =
    useAppSelector((state) => state.ident.identity) !== null;

  return (
    <MenuTrigger>
      <Button variant="icon">
        {isAuthenticated ? (
          <User className="h-6 w-6" />
        ) : (
          <EllipsisVertical className="h-6 w-6" />
        )}
      </Button>
      {isAuthenticated ? (
        <NavbarAuthenticatedOptionsMenu />
      ) : (
        <NavbarUnauthenticatedOptionsMenu />
      )}
    </MenuTrigger>
  );
}

export function NavbarLanguagesMenu() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const onLocaleChange = useCallback(
    (newLocale: string) => {
      router.replace(pathname, { locale: newLocale });
    },
    [pathname, router],
  );

  return (
    <Menu
      selectionMode="single"
      selectedKeys={[`locale-${locale}`]}
      onSelectionChange={(key) =>
        onLocaleChange([...(key as Set<string>)][0].split("-")[1])
      }
    >
      <MenuItem id={`locale-en`}>{t("languages.en")}</MenuItem>
      <MenuItem id={`locale-de`}>{t("languages.de")}</MenuItem>
    </Menu>
  );
}
