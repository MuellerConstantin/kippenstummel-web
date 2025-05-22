"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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

export function InstallAppButton() {
  const t = useTranslations("HomePage");
  const { isInstallable, promptInstall } = usePWAInstallPrompt();

  if (!isInstallable) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 50 50"
            width="50px"
            height="50px"
            className="h-5 w-5 fill-slate-800"
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
            className="h-5 w-5 fill-slate-800"
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
            className="h-5 w-5 fill-slate-800"
          >
            <path d="M 16.28125 0.03125 C 16.152344 0.0546875 16.019531 0.078125 15.90625 0.15625 C 15.449219 0.464844 15.347656 1.105469 15.65625 1.5625 L 17.8125 4.78125 C 14.480469 6.546875 11.996094 9.480469 11.1875 13 L 38.8125 13 C 38.003906 9.480469 35.519531 6.546875 32.1875 4.78125 L 34.34375 1.5625 C 34.652344 1.105469 34.550781 0.464844 34.09375 0.15625 C 33.632813 -0.152344 32.996094 -0.0195313 32.6875 0.4375 L 30.3125 3.9375 C 28.664063 3.335938 26.875 3 25 3 C 23.125 3 21.335938 3.335938 19.6875 3.9375 L 17.3125 0.4375 C 17.082031 0.09375 16.664063 -0.0429688 16.28125 0.03125 Z M 19.5 8 C 20.328125 8 21 8.671875 21 9.5 C 21 10.332031 20.328125 11 19.5 11 C 18.667969 11 18 10.332031 18 9.5 C 18 8.671875 18.667969 8 19.5 8 Z M 30.5 8 C 31.332031 8 32 8.671875 32 9.5 C 32 10.332031 31.332031 11 30.5 11 C 29.671875 11 29 10.332031 29 9.5 C 29 8.671875 29.671875 8 30.5 8 Z M 8 15 C 6.34375 15 5 16.34375 5 18 L 5 32 C 5 33.65625 6.34375 35 8 35 C 8.351563 35 8.6875 34.925781 9 34.8125 L 9 15.1875 C 8.6875 15.074219 8.351563 15 8 15 Z M 11 15 L 11 37 C 11 38.652344 12.347656 40 14 40 L 36 40 C 37.652344 40 39 38.652344 39 37 L 39 15 Z M 42 15 C 41.648438 15 41.3125 15.074219 41 15.1875 L 41 34.8125 C 41.3125 34.921875 41.648438 35 42 35 C 43.65625 35 45 33.65625 45 32 L 45 18 C 45 16.34375 43.65625 15 42 15 Z M 15 42 L 15 46 C 15 48.207031 16.792969 50 19 50 C 21.207031 50 23 48.207031 23 46 L 23 42 Z M 27 42 L 27 46 C 27 48.207031 28.792969 50 31 50 C 33.207031 50 35 48.207031 35 46 L 35 42 Z" />
          </svg>
        </div>
      </div>
      <Button variant="secondary" onPress={promptInstall}>
        {t("cta.install.button")}
      </Button>
    </div>
  );
}

export default function Home() {
  const t = useTranslations("HomePage");
  const router = useRouter();
  const { isInstallable } = usePWAInstallPrompt();

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
      <div className="relative w-full overflow-hidden py-20">
        <div className="absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm" />
        <div className="relative z-20 flex flex-col items-center justify-center gap-8 p-4">
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2 text-center text-slate-600 md:flex-row md:gap-8">
              <div className="relative h-20 w-20 -rotate-16">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  fill
                  objectFit="contain"
                />
              </div>
              <div className="text-4xl font-bold md:text-6xl">
                Kippenstummel
              </div>
            </div>
            <div className="text-center text-xl text-slate-500 md:text-2xl">
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
          {isInstallable && (
            <div className="flex flex-col items-center gap-8">
              <div className="flex items-center justify-center gap-4">
                <div className="w-16 flex-1 border-t border-slate-600"></div>
                <span className="text-sm text-gray-600 uppercase">
                  {t("cta.install.or")}
                </span>
                <div className="w-16 flex-1 border-t border-gray-600"></div>
              </div>
              <InstallAppButton />
            </div>
          )}
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
            <Disclosure>
              <DisclosureHeader>{t("faq.items.1.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.1.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.2.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.2.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.3.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.3.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.4.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.4.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.5.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.5.answer")}</DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.6.question")}</DisclosureHeader>
              <DisclosurePanel>
                {t.rich("faq.items.6.answer", {
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
              </DisclosurePanel>
            </Disclosure>
            <Disclosure>
              <DisclosureHeader>{t("faq.items.7.question")}</DisclosureHeader>
              <DisclosurePanel>{t("faq.items.7.answer")}</DisclosurePanel>
            </Disclosure>
          </div>
        </section>
      </div>
    </div>
  );
}
