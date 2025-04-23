import { useAppSelector, useAppDispatch } from "@/store";
import { CvmMapProps, CvmMap } from "./CvmMap";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import privacySlice from "@/store/slices/privacy";

export interface CvmOptInMap extends CvmMapProps {}

export function CvmOptInMap(props: CvmOptInMap) {
  const dispatch = useAppDispatch();

  const mapOptInAllowed = useAppSelector(
    (state) => state.privacy.mapOptInAllowed,
  );

  const allowOptIn = () => {
    dispatch(privacySlice.actions.setMapOptInAllowed(true));
    dispatch(privacySlice.actions.setCookiesAllowed(true));
  };

  if (!mapOptInAllowed) {
    return (
      <div className="relative h-full w-full">
        <div className="absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/30 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center gap-4 p-4">
            <div className="max-w-sm text-center text-slate-500">
              Please accept the{" "}
              <Link href="/privacy-policy">Privacy Policy</Link> and{" "}
              <Link href="/terms-of-service">Terms of Service</Link> to continue
              and use our services.
            </div>
            <div className="max-w-sm text-center text-xs text-slate-400">
              The services of this website use a number of features that require
              your consent. These include loading third-party tile layers for
              map visualizations, the use of cookies or similar technologies,
              and device fingerprinting. Furthermore, it may be necessary to
              query the user's current location for individual features.
            </div>
            <Button onPress={allowOptIn}>Accept & Continue</Button>
          </div>
        </div>
      </div>
    );
  }

  return <CvmMap {...props} />;
}
