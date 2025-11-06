"use client";

import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import {
  Coins,
  RefreshCw,
  HeartHandshake,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/atoms/Button";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@/components/atoms/Disclosure";
import { Link } from "@/components/atoms/Link";
import { usePWAInstallPrompt } from "@/contexts/PWAInstallProvider";
import { TooltipTrigger } from "react-aria-components";
import { Tooltip } from "@/components/atoms/Tooltip";
import { AnimatePresence } from "motion/react";
import { Modal } from "@/components/atoms/Modal";
import { IOSInstallInstructionsDialog } from "@/components/organisms/IOSInstallInstructionsDialog";

function InstallAppButton() {
  const t = useTranslations("HomePage");
  const { isInstallable, promptInstall, isIOSInstallable } =
    usePWAInstallPrompt();

  const [
    isIOSInstallInstructionDialogOpen,
    setIsIOSInstallInstructionDialogOpen,
  ] = useState(false);

  const triggerInstall = useCallback(() => {
    if (isIOSInstallable) {
      setIsIOSInstallInstructionDialogOpen(true);
    } else if (isInstallable) {
      promptInstall().then((result) => {
        if (result) {
          window.location.reload();
        }
      });
    }
  }, [promptInstall, isInstallable, isIOSInstallable]);

  if (!isInstallable && !isIOSInstallable) return null;

  return (
    <>
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
              className="h-5 w-5 fill-slate-800 dark:fill-white"
            >
              <path d="M4 4H24V24H4zM26 4H46V24H26zM4 26H24V46H4zM26 26H46V46H26z" />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
              className="h-5 w-5 fill-slate-800 dark:fill-white"
            >
              <path d="M 44.527344 34.75 C 43.449219 37.144531 42.929688 38.214844 41.542969 40.328125 C 39.601563 43.28125 36.863281 46.96875 33.480469 46.992188 C 30.46875 47.019531 29.691406 45.027344 25.601563 45.0625 C 21.515625 45.082031 20.664063 47.03125 17.648438 47 C 14.261719 46.96875 11.671875 43.648438 9.730469 40.699219 C 4.300781 32.429688 3.726563 22.734375 7.082031 17.578125 C 9.457031 13.921875 13.210938 11.773438 16.738281 11.773438 C 20.332031 11.773438 22.589844 13.746094 25.558594 13.746094 C 28.441406 13.746094 30.195313 11.769531 34.351563 11.769531 C 37.492188 11.769531 40.8125 13.480469 43.1875 16.433594 C 35.421875 20.691406 36.683594 31.78125 44.527344 34.75 Z M 31.195313 8.46875 C 32.707031 6.527344 33.855469 3.789063 33.4375 1 C 30.972656 1.167969 28.089844 2.742188 26.40625 4.78125 C 24.878906 6.640625 23.613281 9.398438 24.105469 12.066406 C 26.796875 12.152344 29.582031 10.546875 31.195313 8.46875 Z" />
            </svg>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 50 50"
              width="50px"
              height="50px"
              className="h-5 w-5 fill-slate-800 dark:fill-white"
            >
              <path d="M 16.28125 0.03125 C 16.152344 0.0546875 16.019531 0.078125 15.90625 0.15625 C 15.449219 0.464844 15.347656 1.105469 15.65625 1.5625 L 17.8125 4.78125 C 14.480469 6.546875 11.996094 9.480469 11.1875 13 L 38.8125 13 C 38.003906 9.480469 35.519531 6.546875 32.1875 4.78125 L 34.34375 1.5625 C 34.652344 1.105469 34.550781 0.464844 34.09375 0.15625 C 33.632813 -0.152344 32.996094 -0.0195313 32.6875 0.4375 L 30.3125 3.9375 C 28.664063 3.335938 26.875 3 25 3 C 23.125 3 21.335938 3.335938 19.6875 3.9375 L 17.3125 0.4375 C 17.082031 0.09375 16.664063 -0.0429688 16.28125 0.03125 Z M 19.5 8 C 20.328125 8 21 8.671875 21 9.5 C 21 10.332031 20.328125 11 19.5 11 C 18.667969 11 18 10.332031 18 9.5 C 18 8.671875 18.667969 8 19.5 8 Z M 30.5 8 C 31.332031 8 32 8.671875 32 9.5 C 32 10.332031 31.332031 11 30.5 11 C 29.671875 11 29 10.332031 29 9.5 C 29 8.671875 29.671875 8 30.5 8 Z M 8 15 C 6.34375 15 5 16.34375 5 18 L 5 32 C 5 33.65625 6.34375 35 8 35 C 8.351563 35 8.6875 34.925781 9 34.8125 L 9 15.1875 C 8.6875 15.074219 8.351563 15 8 15 Z M 11 15 L 11 37 C 11 38.652344 12.347656 40 14 40 L 36 40 C 37.652344 40 39 38.652344 39 37 L 39 15 Z M 42 15 C 41.648438 15 41.3125 15.074219 41 15.1875 L 41 34.8125 C 41.3125 34.921875 41.648438 35 42 35 C 43.65625 35 45 33.65625 45 32 L 45 18 C 45 16.34375 43.65625 15 42 15 Z M 15 42 L 15 46 C 15 48.207031 16.792969 50 19 50 C 21.207031 50 23 48.207031 23 46 L 23 42 Z M 27 42 L 27 46 C 27 48.207031 28.792969 50 31 50 C 33.207031 50 35 48.207031 35 46 L 35 42 Z" />
            </svg>
          </div>
        </div>
        <Button variant="secondary" onPress={triggerInstall}>
          {t("cta.install.button")}
        </Button>
      </div>
      <AnimatePresence>
        {isIOSInstallInstructionDialogOpen && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            isOpen={isIOSInstallInstructionDialogOpen}
            onOpenChange={setIsIOSInstallInstructionDialogOpen}
            className="max-w-xl"
          >
            <IOSInstallInstructionsDialog />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}

function FaqItem({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      setTimeout(() => {
        setIsOpen(true);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [id]);

  return (
    <div id={id}>
      <Disclosure isExpanded={isOpen} onExpandedChange={setIsOpen}>
        <DisclosureHeader>{question}</DisclosureHeader>
        <DisclosurePanel>{answer}</DisclosurePanel>
      </Disclosure>
    </div>
  );
}

export default function Home() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const { isInstallable, isIOSInstallable } = usePWAInstallPrompt();

  const features = useMemo(() => {
    return [
      {
        title: t("features.items.simple.title"),
        description: t("features.items.simple.description"),
        icon: Coins,
      },
      {
        title: t("features.items.current.title"),
        description: t("features.items.current.description"),
        icon: RefreshCw,
      },
      {
        title: t("features.items.community.title"),
        description: t("features.items.community.description"),
        icon: HeartHandshake,
      },
      {
        title: t("features.items.device.title"),
        description: t("features.items.device.description"),
        icon: MonitorSmartphone,
      },
    ];
  }, [t]);

  return (
    <div>
      <div className="relative w-full overflow-hidden pt-20 pb-32">
        <div className="preview absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm dark:bg-black/40" />
        <div className="relative z-20 flex flex-col gap-12 lg:flex-row lg:justify-center">
          <div className="flex flex-col items-center justify-center gap-8 p-4">
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-2 text-center text-slate-600 md:flex-row md:gap-8 dark:text-slate-200">
                <div className="relative h-20 w-20 -rotate-16">
                  <Image
                    src="/images/logo.svg"
                    alt="Logo"
                    fill
                    objectFit="contain"
                  />
                </div>
                <div className="text-4xl font-bold drop-shadow-lg md:text-6xl">
                  Kippenstummel
                </div>
              </div>
              <div className="text-center text-xl text-slate-500 drop-shadow-lg md:text-2xl dark:text-slate-400">
                &ldquo;{t("slogan")}&rdquo;
              </div>
            </div>
            <div>
              <Button
                onPress={() => router.push("/map")}
                className="p-3 font-bold"
              >
                {t("cta.gettingStarted")}
              </Button>
            </div>
            {(isInstallable || isIOSInstallable) && (
              <div className="flex flex-col items-center gap-8">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-16 flex-1 border-t border-slate-600 dark:border-slate-400"></div>
                  <span className="text-sm text-gray-600 uppercase dark:text-slate-400">
                    {t("cta.install.or")}
                  </span>
                  <div className="w-16 flex-1 border-t border-gray-600 dark:border-slate-400"></div>
                </div>
                <TooltipTrigger>
                  <InstallAppButton />
                  <Tooltip>{t("cta.install.tooltip")}</Tooltip>
                </TooltipTrigger>
              </div>
            )}
          </div>
          <div className="flex justify-center pr-[5rem]">
            <div className="relative">
              <div className="w-[10rem]">
                <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-800 p-0.5 shadow-[0_1rem_2rem_-1rem_rgb(45_55_75_/_20%),_0_1rem_2rem_-1rem_rgb(45_55_75_/_30%)] dark:bg-neutral-600 dark:shadow-[0_1rem_2rem_-1rem_rgb(0_0_0_/_20%),_0_1rem_2rem_-1rem_rgb(0_0_0_/_30%)]">
                    <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-full w-full object-cover dark:hidden"
                        src="/images/mockup/home-light.png"
                        alt="Mockup"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hidden h-full w-full object-cover dark:block"
                        src="/images/mockup/home-dark.png"
                        alt="Mockup"
                      />
                    </div>
                  </div>
                </figure>
              </div>
              <div className="absolute top-1/6 left-1/2">
                <div className="w-[10rem]">
                  <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                    <div className="relative h-full w-full overflow-hidden rounded-lg bg-gray-800 p-0.5 shadow-[0_1rem_2rem_-1rem_rgb(45_55_75_/_20%),_0_1rem_2rem_-1rem_rgb(45_55_75_/_30%)] dark:bg-neutral-600 dark:shadow-[0_1rem_2rem_-1rem_rgb(0_0_0_/_20%),_0_1rem_2rem_-1rem_rgb(0_0_0_/_30%)]">
                      <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="h-full w-full object-cover dark:hidden"
                          src="/images/mockup/map-light.png"
                          alt="Mockup"
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          className="hidden h-full w-full object-cover dark:block"
                          src="/images/mockup/map-dark.png"
                          alt="Mockup"
                        />
                      </div>
                    </div>
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto my-8 flex max-w-[80rem] flex-col items-center gap-16 p-4">
        <section className="flex flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <div className="text-center text-lg font-semibold text-green-600">
              {t("features.slogan")}
            </div>
            <div className="text-center text-2xl font-bold">
              {t("features.title")}
            </div>
            <div className="text-center">{t("features.description")}</div>
          </div>
          <div className="grid w-full max-w-[60rem] grid-cols-1 gap-8 md:grid-cols-2">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="flex justify-start gap-4 rounded-md bg-slate-50 p-4 dark:bg-slate-900"
              >
                <div>
                  <feature.icon className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                  <div className="font-bold">{feature.title}</div>
                  <div>{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="flex w-full max-w-[60rem] flex-col gap-4 rounded-md bg-green-50 p-4 dark:bg-green-900">
            <div className="font-semibold">{t("banner.title")}</div>
            <div>
              {t.rich("banner.description", {
                link1: (chunks) => (
                  <Link target="_blank" href="www.rauchfrei-info.de">
                    {chunks}
                  </Link>
                ),
                link2: (chunks) => (
                  <Link target="_blank" href="tel:08008313131">
                    {chunks}
                  </Link>
                ),
              })}
            </div>
          </div>
        </section>
        <section className="flex w-full flex-col items-center gap-16 p-4 text-slate-800 dark:text-white">
          <div className="max-w-[40rem] space-y-4">
            <div className="text-center text-2xl font-bold">
              {t("faq.title")}
            </div>
            <div className="text-center">
              {t.rich("faq.description", {
                link: (chunks) => (
                  <Link href="mailto:info@mueller-constantin.de">{chunks}</Link>
                ),
              })}
            </div>
          </div>
          <div className="flex w-full max-w-[60rem] flex-col gap-4">
            <FaqItem
              id="faq-1"
              question={t("faq.items.1.question")}
              answer={t("faq.items.1.answer")}
            />
            <FaqItem
              id="faq-2"
              question={t("faq.items.2.question")}
              answer={t("faq.items.2.answer")}
            />
            <FaqItem
              id="faq-3"
              question={t("faq.items.3.question")}
              answer={t("faq.items.3.answer")}
            />
            <FaqItem
              id="faq-4"
              question={t("faq.items.4.question")}
              answer={t("faq.items.4.answer")}
            />
            <FaqItem
              id="faq-5"
              question={t("faq.items.5.question")}
              answer={t("faq.items.5.answer")}
            />
            <FaqItem
              id="faq-6"
              question={t("faq.items.6.question")}
              answer={t.rich("faq.items.6.answer", {
                link1: (chunks) => (
                  <Link target="_blank" href="https://rauchfrei-info.de">
                    {chunks}
                  </Link>
                ),
                link2: (chunks) => (
                  <Link target="_blank" href="https://www.dhs.de/">
                    {chunks}
                  </Link>
                ),
              })}
            />
            <FaqItem
              id="faq-7"
              question={t("faq.items.7.question")}
              answer={t("faq.items.7.answer")}
            />
            <FaqItem
              id="faq-8"
              question={t("faq.items.8.question")}
              answer={t("faq.items.8.answer")}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
