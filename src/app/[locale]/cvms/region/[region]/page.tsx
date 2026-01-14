import { Link } from "@/components/atoms/Link";
import { RegionCvmList } from "@/components/organisms/cvm/RegionCvmList";
import { REGIONS } from "@/lib/regions";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; region: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, region: regionSlug } = await params;
  const t = await getTranslations({ locale, namespace: "CvmRegionPage" });

  const region = REGIONS.find((region) => region.slug === regionSlug);

  if (!region) {
    notFound();
  }

  return {
    title: t("meta.title", {
      region: region!.name,
    }),
  };
}

export async function generateStaticParams() {
  return REGIONS.map((region) => ({
    region: region.slug,
  }));
}

export default async function CvmRegionPage({ params }: Props) {
  const { region: regionSlug } = await params;
  const t = await getTranslations("CvmRegionPage");

  const region = REGIONS.find((region) => region.slug === regionSlug);

  if (!region) {
    notFound();
  }

  return (
    <div className="my-8">
      <div className="relative mx-auto flex max-w-[80rem] flex-col items-center gap-12 overflow-hidden px-4 py-8">
        <div className="bg-map-pattern pointer-events-none absolute inset-0" />
        <div className="relative z-10 flex w-full flex-col items-center gap-8 md:flex-row">
          <div className="flex w-full flex-col gap-4 text-slate-800 md:w-3/5 dark:text-white">
            <h1 className="text-3xl font-bold md:text-4xl">
              {t("headline", { region: region.name })}
            </h1>
            <p className="text-slate-400">
              {t("description", { region: region.name })}
            </p>
          </div>
          <div className="flex aspect-square w-full grow flex-col rounded-lg border-2 border-slate-200 bg-slate-100 p-2 md:w-fit dark:border-slate-600 dark:bg-slate-900">
            <div className="relative flex h-0 w-full grow flex-col items-center overflow-hidden rounded-lg border-2 border-slate-200 bg-slate-100 dark:border-slate-600 dark:bg-slate-900">
              <div className="preview absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
              <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm dark:bg-black/40" />
              <div className="relative z-20 flex h-full items-center">
                <Link
                  href="/map"
                  className="pressed:bg-green-800 flex w-fit cursor-pointer items-center gap-2 rounded-lg border border-black/10 bg-green-600 px-5 py-2 text-center text-sm text-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] transition hover:bg-green-700 hover:no-underline dark:border-white/10 dark:text-white dark:shadow-none"
                >
                  {t("openMap")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="relative mx-auto flex max-w-[80rem] flex-col items-center gap-12 overflow-hidden p-4">
        <RegionCvmList region={region} />
      </div>
    </div>
  );
}
