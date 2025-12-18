"use client";

import {
  AnimatePresence,
  motion,
  animate,
  useMotionTemplate,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
  cubicBezier,
} from "motion/react";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { Dialog, ModalOverlay, Modal, Button } from "react-aria-components";

const MotionModal = motion.create(Modal);
const MotionModalOverlay = motion.create(ModalOverlay);

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 300,
  bounceDamping: 40,
  timeConstant: 300,
};

const staticTransition = {
  duration: 0.5,
  ease: cubicBezier(0.32, 0.72, 0, 1),
};

const SHEET_MARGIN = 34;
const SHEET_RADIUS = 12;

export interface ModalSheetProps {
  children: React.ReactNode;
  isOpen: boolean;
  onIsOpenChange?: (isOpen: boolean) => void;
}

export function ModalSheet({
  children,
  isOpen,
  onIsOpenChange,
}: ModalSheetProps) {
  const t = useTranslations("ModalSheet");

  const rootRef = useRef<HTMLElement | null>(null);

  const h = window.innerHeight - SHEET_MARGIN;
  const y = useMotionValue(h);
  const bgOpacity = useTransform(y, [0, h], [0.4, 0]);
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  useEffect(() => {
    rootRef.current = document.querySelector(
      "body > div:first-of-type",
    ) as HTMLElement | null;
  }, []);

  const bodyScale = useTransform(
    y,
    [0, h],
    [(window.innerWidth - SHEET_MARGIN) / window.innerWidth, 1],
  );

  const bodyTranslate = useTransform(
    y,
    [0, h],
    [SHEET_MARGIN - SHEET_RADIUS, 0],
  );

  const bodyBorderRadius = useTransform(y, [0, h], [SHEET_RADIUS, 0]);

  useMotionValueEvent(bodyScale, "change", (v) => {
    const root = rootRef.current;
    if (root) root.style.scale = `${v}`;
  });

  useMotionValueEvent(bodyTranslate, "change", (v) => {
    const root = rootRef.current;
    if (root) root.style.translate = `0 ${v}px`;
  });

  useMotionValueEvent(bodyBorderRadius, "change", (v) => {
    const root = rootRef.current;
    if (root) root.style.borderRadius = `${v}px`;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <MotionModalOverlay
          isOpen
          onOpenChange={onIsOpenChange}
          className="fixed inset-0 z-10"
          style={{ backgroundColor: bg }}
        >
          <MotionModal
            className="absolute bottom-0 w-full rounded-t-xl bg-white font-sans shadow-lg will-change-transform dark:bg-slate-900 dark:text-white"
            initial={{ y: h }}
            animate={{ y: 0 }}
            exit={{ y: h }}
            transition={staticTransition}
            style={{
              y,
              maxHeight: `calc(100vh - ${SHEET_MARGIN}px)`,
            }}
            drag="y"
            dragConstraints={{ top: 0 }}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.y > window.innerHeight * 0.75 || velocity.y > 10) {
                onIsOpenChange?.(false);
              } else {
                animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
              }
            }}
          >
            <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-400" />
            <Dialog className="relative flex max-h-[inherit] flex-col gap-2 p-4 outline-hidden outline-0 [[data-placement]>&]:p-4">
              <div className="flex shrink-0 justify-end">
                <Button
                  className="pressed:text-green-700 rounded-sm border-none bg-transparent font-semibold text-green-600 outline-hidden focus-visible:ring-3"
                  onPress={() => onIsOpenChange?.(false)}
                >
                  {t("done")}
                </Button>
              </div>
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {children}
              </div>
            </Dialog>
          </MotionModal>
        </MotionModalOverlay>
      )}
    </AnimatePresence>
  );
}
