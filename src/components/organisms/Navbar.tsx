"use client";

import React, { useCallback, useMemo } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Menu as MenuIcon, EllipsisVertical, Languages } from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Switch } from "@/components/atoms/Switch";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { Popover } from "@/components/atoms/Popover";
import { useAppSelector, useAppDispatch } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { useRouter, usePathname } from "@/i18n/navigation";

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
          <NextLink href="/home">
            <div className="flex w-fit items-center justify-center md:space-x-4">
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
          </NextLink>
        </div>
        <div className="flex items-center space-x-4">
          <div className="hidden space-x-4 md:flex">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                {item.name}
              </Link>
            ))}
          </div>
          <div className="flex self-end">
            <MenuTrigger>
              <Button variant="icon">
                <Languages className="h-6 w-6" />
              </Button>
              <NavbarLanguagesMenu />
            </MenuTrigger>
            <MenuTrigger>
              <Button variant="icon">
                <EllipsisVertical className="h-6 w-6" />
              </Button>
              <NavbarOptionsMenu />
            </MenuTrigger>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function NavbarOptionsMenu() {
  const t = useTranslations("Navbar");

  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.usability.darkMode);

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <Switch
        isSelected={darkMode}
        onChange={(newDarkMode) =>
          dispatch(usabilitySlice.actions.setDarkMode(newDarkMode))
        }
      >
        {t("darkMode")}
      </Switch>
    </Popover>
  );
}

export function NavbarLanguagesMenu() {
  const t = useTranslations("Navbar");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  const onLocaleChange = useCallback(
    (newLocale: string) => {
      router.replace(
        {
          pathname,
          query: { ...params, locale: newLocale },
        },
        { locale: newLocale },
      );
    },
    [pathname, params, router],
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
