import "client-only";

export type UmamiPayload = Readonly<Record<string, unknown>>;

/**
 * Fields the tracker reads on the device itself, which requires consent
 * (§ 25 TDDDG). All of them are optional for the Umami server.
 *
 * @see {@link https://github.com/umami-software/umami/blob/master/src/tracker/index.ts | Tracker payload (getPayload)}
 * @see {@link https://github.com/umami-software/umami/blob/master/src/app/api/send/route.ts | Request schema of /api/send}
 */
const CONSENT_REQUIRED_FIELDS = ["screen", "language", "referrer"];

export function filterUmamiPayload(
  payload: UmamiPayload,
  allowAnalytics: boolean,
): UmamiPayload {
  if (allowAnalytics) {
    return payload;
  }

  return Object.fromEntries(
    Object.entries(payload).filter(
      ([field]) => !CONSENT_REQUIRED_FIELDS.includes(field),
    ),
  );
}
