import React, { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Key } from "react-aria-components";
import { motion, AnimatePresence } from "motion/react";
import { Tab, TabList, TabPanel, Tabs } from "@/components/atoms/Tabs";
import { useBreakpointDown } from "@/hooks/useBreakpointDown";
import { ProfileSection } from "./ProfileSection";
import { TransferIdentitySection } from "./TransferIdentitySection";
import { KarmaSection } from "./KarmaSection";

interface ProfileTabProps {
  close: () => void;
}

function ProfileTab({ close }: ProfileTabProps) {
  const t = useTranslations("IdentityDialog");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full space-y-2">
        <h2 className="text-base font-bold">{t("profile.title")}</h2>
        <ProfileSection close={close} />
      </div>
    </div>
  );
}

function AccountTab() {
  const t = useTranslations("IdentityDialog");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full space-y-2">
        <h2 className="text-base font-bold">{t("transfer.title")}</h2>
        <TransferIdentitySection />
      </div>
    </div>
  );
}

function KarmaTab() {
  const t = useTranslations("IdentityDialog");

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-full space-y-2">
        <h2 className="text-base font-bold">{t("karma.title")}</h2>
        <KarmaSection />
      </div>
    </div>
  );
}

export function IdentityDialogContent() {
  const t = useTranslations("IdentityDialog");
  const isSmDown = useBreakpointDown("sm");

  const tabs = useMemo(
    () => [
      {
        id: "identity-tab-overview",
        label: t("tabs.profile"),
        component: ({ close }: { close: () => void }) => (
          <ProfileTab close={close} />
        ),
      },
      {
        id: "identity-tab-karma",
        label: t("tabs.karma"),
        component: <KarmaTab />,
      },
      {
        id: "identity-tab-account",
        label: t("tabs.account"),
        component: <AccountTab />,
      },
    ],
    [t],
  );

  const [selectedKey, setSelectedKey] = useState<Key>(tabs[0].id);
  const [direction, setDirection] = useState(0);

  const onSelectionChange = useCallback(
    (newKey: Key) => {
      const oldIndex = tabs.findIndex((t) => t.id === selectedKey);
      const newIndex = tabs.findIndex((t) => t.id === newKey);
      setDirection(newIndex > oldIndex ? 1 : -1);
      setSelectedKey(newKey);
    },
    [selectedKey, tabs],
  );

  return (
    <div className="flex min-h-0 grow flex-col items-start gap-4">
      <Tabs
        orientation={isSmDown ? "horizontal" : "vertical"}
        className="min-h-0 w-full grow"
        selectedKey={selectedKey}
        onSelectionChange={onSelectionChange}
      >
        <TabList
          className="scrollbar-hide shrink-0 overflow-x-auto"
          items={tabs}
        >
          {(tab) => (
            <Tab className="w-fit min-w-fit" id={tab.id}>
              {tab.label}
            </Tab>
          )}
        </TabList>
        <div className="relative min-h-0 grow overflow-x-hidden overflow-y-auto">
          <AnimatePresence mode="wait" custom={direction}>
            {tabs.map(
              (tab) =>
                tab.id === selectedKey && (
                  <motion.div
                    key={tab.id}
                    custom={direction}
                    variants={{
                      enter: (dir) => ({
                        x: dir > 0 ? 50 : -50,
                        opacity: 0,
                        position: "absolute",
                      }),
                      center: {
                        x: 0,
                        opacity: 1,
                        position: "relative",
                      },
                      exit: (dir) => ({
                        x: dir > 0 ? -50 : 50,
                        opacity: 0,
                        position: "absolute",
                      }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className="absolute inset-0 p-0"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(_, info) => {
                      const offset = info.offset.x;
                      const velocity = info.velocity.x;

                      const currentIndex = tabs.findIndex(
                        (t) => t.id === selectedKey,
                      );

                      // Swipe to right -> previous tab
                      if (offset > 120 || velocity > 800) {
                        const prev = currentIndex - 1;
                        if (prev >= 0) {
                          setDirection(-1);
                          setSelectedKey(tabs[prev].id);
                        }
                      }

                      // Swipe to left → next tab
                      if (offset < -120 || velocity < -800) {
                        const next = currentIndex + 1;
                        if (next < tabs.length) {
                          setDirection(1);
                          setSelectedKey(tabs[next].id);
                        }
                      }
                    }}
                  >
                    <TabPanel id={tab.id} shouldForceMount className="!p-0">
                      {typeof tab.component === "function"
                        ? tab.component({ close })
                        : tab.component}
                    </TabPanel>
                  </motion.div>
                ),
            )}
          </AnimatePresence>
        </div>
      </Tabs>
    </div>
  );
}
