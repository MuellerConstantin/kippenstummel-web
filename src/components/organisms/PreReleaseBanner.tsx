"use client";

import { useTranslations } from "next-intl";
import { AnimatePresence } from "framer-motion";
import { Link } from "@/components/atoms/Link";
import { Modal } from "@/components/atoms/Modal";
import { PreReleaseInfoDialog } from "./PreReleaseInfoDialog";
import { useState } from "react";

export default function PreReleaseBanner() {
  const t = useTranslations("PreReleaseBanner");

  const [showInfoDialog, setShowInfoDialog] = useState(false);

  return (
    <>
      <div className="bg-amber-600 text-white">
        <div className="flex items-center justify-center p-1">
          <div className="text-center text-xs">
            {t.rich("message", {
              bold: (chunks) => (
                <span className="font-bold">{chunks}&nbsp;</span>
              ),
              link: (chunks) => (
                <Link
                  variant="secondary"
                  className="cursor-pointer"
                  onPress={() => setShowInfoDialog(true)}
                >
                  {chunks}
                </Link>
              ),
            })}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showInfoDialog && (
          <Modal
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="!max-w-2xl"
            isOpen={showInfoDialog}
            onOpenChange={setShowInfoDialog}
          >
            <PreReleaseInfoDialog />
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
