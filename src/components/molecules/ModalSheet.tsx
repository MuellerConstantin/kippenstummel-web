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
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/atoms/Button";
import { Dialog, ModalOverlay, Modal } from "react-aria-components";

const MotionModal = motion.create(Modal);
const MotionModalOverlay = motion.create(ModalOverlay);

const inertiaTransition = {
  type: "inertia" as const,
  bounceStiffness: 500,
  bounceDamping: 45,
  timeConstant: 220,
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
  const rootRef = useRef<HTMLElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

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
      <MotionModalOverlay
        isOpen={isOpen}
        onOpenChange={onIsOpenChange}
        className="fixed inset-0 z-[120000]"
        style={{ backgroundColor: bg }}
      >
        <MotionModal
          ref={sheetRef}
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
          dragElastic={{ top: 0, bottom: 0.2 }}
          dragConstraints={{ top: 0 }}
          onDragEnd={(e, { offset, velocity }) => {
            const sheetHeight =
              sheetRef.current?.getBoundingClientRect().height ?? h;

            const CLOSE_DISTANCE = Math.min(sheetHeight * 0.33, 180);
            const CLOSE_VELOCITY = 900;

            if (offset.y > CLOSE_DISTANCE || velocity.y > CLOSE_VELOCITY) {
              onIsOpenChange?.(false);
            } else {
              animate(y, 0, { ...inertiaTransition, min: 0, max: 0 });
            }
          }}
        >
          <div className="mx-auto mt-2 h-1.5 w-12 rounded-full bg-gray-400" />
          <Dialog className="relative flex max-h-[inherit] flex-col gap-2 p-4 outline-hidden outline-0 [[data-placement]>&]:p-4">
            <div className="flex shrink-0 justify-end">
              <Button variant="icon" onPress={() => onIsOpenChange?.(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </Dialog>
        </MotionModal>
      </MotionModalOverlay>
    </AnimatePresence>
  );
}
