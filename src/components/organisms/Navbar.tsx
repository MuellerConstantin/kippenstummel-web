"use client";

import React, { useCallback, useMemo, useState } from "react";
import NextLink from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  Menu as MenuIcon,
  EllipsisVertical,
  Languages,
  Check,
  Copy,
  IdCard,
  Signature,
} from "lucide-react";
import { MenuTrigger } from "react-aria-components";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { Switch } from "@/components/atoms/Switch";
import { Menu, MenuItem } from "@/components/molecules/Menu";
import { Popover } from "@/components/atoms/Popover";
import { IdentIcon } from "@/components/atoms/IdentIcon";
import { ListBox, ListBoxItem } from "@/components/atoms/ListBox";
import { Modal } from "@/components/atoms/Modal";
import { IdentityDialog } from "./ident/IdentityDialog";
import { useAppSelector, useAppDispatch } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { useRouter, usePathname } from "@/i18n/navigation";
import { RequestIdentDialog } from "./ident/RequestIdentDialog";
import { AnimatePresence } from "framer-motion";

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
            <NavbarOptionsMenu />
          </div>
        </div>
      </div>
    </nav>
  );
}

interface CopyButtonProps {
  text: string;
  disabled?: boolean;
}

function CopyButton(props: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(() => {
    navigator.clipboard.writeText(props.text);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  }, [props.text]);

  return (
    <button
      className="cursor-pointer text-slate-600 hover:text-slate-800 disabled:cursor-not-allowed"
      disabled={props.disabled}
      onClick={handleClick}
    >
      <div className="transition-all duration-300 ease-in-out">
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </div>
    </button>
  );
}

export function NavbarUnauthenticatedOptionsMenu() {
  const t = useTranslations("Navbar");

  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.usability.darkMode);

  const [showNewIdentityDialog, setShowNewIdentityDialog] = useState(false);

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <div className="flex w-[15rem] flex-col gap-4 overflow-hidden p-2">
        <div className="flex gap-4 overflow-hidden">
          <Switch
            isSelected={darkMode}
            onChange={(newDarkMode) =>
              dispatch(usabilitySlice.actions.setDarkMode(newDarkMode))
            }
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
          </ListBox>
          <Modal
            isOpen={showNewIdentityDialog}
            onOpenChange={setShowNewIdentityDialog}
          >
            <RequestIdentDialog />
          </Modal>
        </div>
      </div>
    </Popover>
  );
}

function NavbarAuthenticatedOptionsMenu() {
  const t = useTranslations("Navbar");
  const dispatch = useAppDispatch();

  const darkMode = useAppSelector((state) => state.usability.darkMode);
  const identity = useAppSelector((state) => state.ident.identity);

  const [showIdentityDialog, setShowIdentityDialog] = useState(false);

  return (
    <Popover className="entering:animate-in entering:fade-in entering:placement-bottom:slide-in-from-top-1 entering:placement-top:slide-in-from-bottom-1 exiting:animate-out exiting:fade-out exiting:placement-bottom:slide-out-to-top-1 exiting:placement-top:slide-out-to-bottom-1 fill-mode-forwards origin-top-left overflow-auto rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/10 outline-hidden dark:bg-slate-950 dark:ring-white/15">
      <div className="flex w-[15rem] flex-col gap-4 overflow-hidden p-2">
        <div className="flex gap-4 overflow-hidden">
          <div>
            <div className="h-12 w-12 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
              <IdentIcon value={identity || ""} />
            </div>
          </div>
          <div className="flex flex-col gap-2 overflow-hidden">
            <div className="flex gap-2">
              <div className="truncate text-sm text-slate-900 dark:text-slate-100">
                <span className="font-bold">ID:</span>{" "}
                {identity?.slice(0, 8) || "Anonymous"}
              </div>
              <CopyButton text={identity || ""} disabled={!identity} />
            </div>
            <Switch
              isSelected={darkMode}
              onChange={(newDarkMode) =>
                dispatch(usabilitySlice.actions.setDarkMode(newDarkMode))
              }
            >
              Dark Mode
            </Switch>
          </div>
        </div>
        <ListBox>
          <ListBoxItem onAction={() => setShowIdentityDialog(true)}>
            <div className="flex w-full items-center gap-2">
              <IdCard className="h-4 w-4" />
              <span>{t("options.identity")}</span>
            </div>
          </ListBoxItem>
        </ListBox>
        <AnimatePresence>
          {showIdentityDialog && (
            <Modal
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              isOpen={showIdentityDialog}
              onOpenChange={setShowIdentityDialog}
              className="max-w-xl"
            >
              <IdentityDialog />
            </Modal>
          )}
        </AnimatePresence>
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
        <EllipsisVertical className="h-6 w-6" />
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
