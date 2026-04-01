import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { TextField } from "@/components/atoms/TextField";
import { Spinner } from "@/components/atoms/Spinner";
import { useRouter } from "next/navigation";

interface ImportIdentDialogContentProps {
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function ImportIdentDialogContent({
  onCancel,
  onConfirm,
}: ImportIdentDialogContentProps) {
  const t = useTranslations("ImportIdentDialog");
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");

  const onSubmit = useCallback(async () => {
    setLoading(true);
    router.push(`/transfer?token=${token}`);
    onConfirm?.();
  }, [router, token, onConfirm]);

  return (
    <div className="flex flex-col gap-4">
      <div className="text-sm">{t("description")}</div>
      <div className="flex flex-col gap-4">
        <TextField
          placeholder={t("tokenPlaceholder")}
          value={token}
          onChange={setToken}
          isDisabled={loading}
        />
        <Button
          onPress={() => onSubmit()}
          className="w-full"
          isDisabled={loading || token.length === 0}
        >
          <div className="flex justify-center">
            {loading ? <Spinner /> : t("confirm")}
          </div>
        </Button>
      </div>
      <div className="text-xs">
        {t.rich("disclaimer", {
          tos: (chunks) => <Link href="/terms-of-service">{chunks}</Link>,
          pp: (chunks) => <Link href="/privacy-policy">{chunks}</Link>,
        })}
      </div>
      <div className="flex justify-center">
        <Link
          onPress={onCancel}
          variant="secondary"
          className="!cursor-pointer !text-xs"
        >
          {t("cancel")}
        </Link>
      </div>
    </div>
  );
}
