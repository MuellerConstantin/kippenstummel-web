import type { Metadata } from "next";
import type { TranslationValues } from "next-intl";
import { getTranslations } from "next-intl/server";
import { routing } from "@/i18n/routing";

export const BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.kippenstummel.de";

/**
 * Builds the canonical URL and the full set of hreflang alternates for a
 * locale-agnostic route path.
 */
export function buildAlternates(
  locale: string,
  path: string,
): NonNullable<Metadata["alternates"]> {
  return {
    canonical: `${BASE_URL}/${locale}${path}`,
    languages: {
      ...Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE_URL}/${l}${path}`]),
      ),
      "x-default": `${BASE_URL}/${routing.defaultLocale}${path}`,
    },
  };
}

type PageMetadataOptions = {
  locale: string;
  /** Locale-agnostic route path, leading slash included (e.g. `/imprint`). */
  path: string;
  /** Message namespace providing `meta.title` and optionally `meta.description`. */
  namespace: string;
  /** Values interpolated into `meta.title` and `meta.description`. */
  values?: TranslationValues;
  /** Set when the namespace provides a `meta.description`. */
  withDescription?: boolean;
  robots?: Metadata["robots"];
};

/**
 * Assembles the metadata every localized page shares: a translated title, the
 * canonical URL and its hreflang alternates. Pages needing more (Open Graph,
 * structured data) spread the result and add their own fields.
 */
export async function buildPageMetadata({
  locale,
  path,
  namespace,
  values,
  withDescription,
  robots,
}: PageMetadataOptions): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace });

  return {
    title: t("meta.title", values),
    ...(withDescription && { description: t("meta.description", values) }),
    ...(robots && { robots }),
    alternates: buildAlternates(locale, path),
  };
}
