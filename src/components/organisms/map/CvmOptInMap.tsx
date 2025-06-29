import { useTranslations } from "next-intl";
import { useAppSelector, useAppDispatch } from "@/store";
import { CvmMapProps, CvmMap } from "./CvmMap";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import privacySlice from "@/store/slices/privacy";
import usabilitySlice from "@/store/slices/usability";

export interface CvmOptInMap extends CvmMapProps {
  selectedCvm?: {
    id: string;
    longitude: number;
    latitude: number;
    score: number;
  } | null;
}

export function CvmOptInMap(props: CvmOptInMap) {
  const t = useTranslations("CvmOptInMap");
  const dispatch = useAppDispatch();

  const mapOptInAllowed = useAppSelector(
    (state) => state.privacy.mapOptInAllowed,
  );

  const allowOptIn = () => {
    dispatch(privacySlice.actions.setMapOptInAllowed(true));
    dispatch(privacySlice.actions.setCookiesAllowed(true));
    dispatch(usabilitySlice.actions.setRecurringUser(true));
  };

  if (!mapOptInAllowed) {
    return (
      <div className="relative flex h-full grow overflow-auto py-12">
        <div className="absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 bg-white/30 backdrop-blur-sm" />
        <div className="relative z-20 flex grow flex-col items-center justify-center gap-12 lg:flex-row">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="max-w-sm text-center text-slate-500">
              {t.rich("title", {
                tos: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
                pp: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
              })}
            </div>
            <div className="max-w-sm text-center text-xs text-slate-400">
              {t.rich("description", {
                br: () => <br />,
              })}
            </div>
            <Button onPress={allowOptIn}>{t("accept")}</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-0 grow flex-col overflow-auto">
      <CvmMap {...props} />
    </div>
  );
}
