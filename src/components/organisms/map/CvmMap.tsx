"use client";

import { GeoCoordinates } from "@/lib/types/geo";
import { CvmMapViewProvider } from "@/contexts/CvmMapViewContext";
import { CvmMapView } from "./CvmMapView";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { useTranslations } from "next-intl";
import { useAppDispatch, useAppSelector } from "@/store";
import privacySlice from "@/store/slices/privacy";
import usabilitySlice from "@/store/slices/usability";

export interface CvmMapProps {
  onRegister?: (position: GeoCoordinates) => void;
  onReposition?: (
    id: string,
    position: GeoCoordinates,
    editorPosition: GeoCoordinates,
  ) => void;
  onReport?: (
    id: string,
    position: GeoCoordinates,
    type: "missing" | "spam" | "inactive" | "inaccessible",
  ) => void;
  onUpvote?: (id: string, position: GeoCoordinates) => void;
  onDownvote?: (id: string, position: GeoCoordinates) => void;
  sharedCvmId: string | null;
  enableOptIn?: boolean;
}

export function CvmMap(props: CvmMapProps) {
  const t = useTranslations("CvmOptInMap");
  const dispatch = useAppDispatch();

  const mapOptInAllowed = useAppSelector(
    (state) => state.privacy.mapOptInAllowed,
  );

  const allowOptIn = () => {
    dispatch(privacySlice.actions.setMapOptInAllowed(true));
    dispatch(usabilitySlice.actions.setRecurringUser(true));
  };

  if (props.enableOptIn && !mapOptInAllowed) {
    return (
      <div className="relative flex h-full grow overflow-auto py-12">
        <div className="preview absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm dark:bg-black/40" />
        <div className="relative z-20 flex grow flex-col items-center justify-center gap-12 lg:flex-row">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="max-w-sm text-center text-xl font-semibold text-slate-500 drop-shadow-lg">
              {t("title")}
            </div>
            <div className="max-w-sm text-center text-sm text-slate-400 drop-shadow-lg">
              {t.rich("description", {
                br: () => <br />,
                tos: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
                pp: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
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
      <CvmMapViewProvider>
        <CvmMapView {...props} />
      </CvmMapViewProvider>
    </div>
  );
}
