import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { Checkbox } from "@/components/atoms/Checkbox";
import { useAppDispatch } from "@/store";
import identSlice from "@/store/slices/ident";

interface SignOutSectionProps {
  close: () => void;
}

export function SignOutSection({ close }: SignOutSectionProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("IdentityDialog.signOut");

  const [signOutConfirmed, setSignOutConfirmed] = useState(false);

  const onSignOut = useCallback(() => {
    dispatch(identSlice.actions.clearIdentity());
    close();
  }, [dispatch, close]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4 rounded-md border border-red-500 p-4">
        <div className="text-sm">{t("description")}</div>
        <div className="flex flex-col gap-4">
          <Checkbox
            isSelected={signOutConfirmed}
            onChange={(isSelected) => setSignOutConfirmed(isSelected)}
            className="!text-sm"
          >
            {t("confirm")}
          </Checkbox>
          <Button
            isDisabled={!signOutConfirmed}
            className="w-fit"
            variant="secondary"
            onPress={onSignOut}
          >
            {t("submit")}
          </Button>
        </div>
      </div>
    </div>
  );
}
