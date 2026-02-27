"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { JumbotronCta } from "@/components/organisms/JumbotronCta";

type HomeHeroProps = {
  slogan: string;
};

const mockupFrameClassName =
  "relative h-full w-full overflow-hidden rounded-lg bg-gray-800 p-0.5 shadow-[0_1rem_2rem_-1rem_rgb(45_55_75_/_20%),_0_1rem_2rem_-1rem_rgb(45_55_75_/_30%)] dark:bg-neutral-600 dark:shadow-[0_1rem_2rem_-1rem_rgb(0_0_0_/_20%),_0_1rem_2rem_-1rem_rgb(0_0_0_/_30%)]";

export function HomeHero({ slogan }: HomeHeroProps) {
  const shouldReduceMotion = useReducedMotion();

  const contentInitial = shouldReduceMotion ? false : { opacity: 0, y: 16 };
  const contentAnimate = { opacity: 1, y: 0 };
  const contentTransition = { duration: 0.7, ease: "easeOut" as const };

  const mockupInitial = shouldReduceMotion
    ? false
    : { opacity: 0, y: 24, scale: 0.98 };
  const mockupAnimate = { opacity: 1, y: 0, scale: 1 };
  const mockupTransition = {
    duration: 0.72,
    delay: 0.18,
    ease: "easeOut" as const,
  };

  const glowTransition = shouldReduceMotion
    ? { duration: 0 }
    : {
        duration: 7,
        ease: "easeInOut" as const,
        repeat: Infinity,
      };

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-white via-white to-slate-50 pt-20 pb-32 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div className="preview absolute inset-0 z-0 bg-[url(/images/preview.png)] bg-cover" />
      <motion.div
        className="pointer-events-none absolute -top-16 -left-16 z-10 h-56 w-56 rounded-full bg-green-500/20 blur-3xl"
        initial={shouldReduceMotion ? false : { opacity: 0.4, scale: 1 }}
        animate={{ opacity: [0.4, 0.72, 0.4], scale: [1, 1.06, 1] }}
        transition={glowTransition}
      />
      <motion.div
        className="pointer-events-none absolute right-0 bottom-0 z-10 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl"
        initial={shouldReduceMotion ? false : { opacity: 0.38, scale: 1 }}
        animate={{ opacity: [0.38, 0.68, 0.38], scale: [1, 1.05, 1] }}
        transition={{ ...glowTransition, delay: 1.2 }}
      />
      <div className="absolute inset-0 z-10 bg-white/40 backdrop-blur-sm dark:bg-black/40" />
      <div className="relative z-20 flex flex-col gap-12 lg:flex-row lg:justify-center">
        <motion.div
          className="flex flex-col items-center justify-center gap-8 p-4"
          initial={contentInitial}
          animate={contentAnimate}
          transition={contentTransition}
        >
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2 text-center text-slate-600 md:flex-row md:gap-8 dark:text-slate-200">
              <div className="relative h-20 w-20 -rotate-16">
                <Image
                  src="/images/logo.svg"
                  alt="Logo"
                  fill
                  objectFit="contain"
                />
              </div>
              <div className="text-4xl font-bold drop-shadow-lg md:text-6xl">
                Kippenstummel
              </div>
            </div>
            <div className="text-center text-xl text-slate-500 drop-shadow-lg md:text-2xl dark:text-slate-400">
              &ldquo;{slogan}&rdquo;
            </div>
          </div>
          <JumbotronCta />
        </motion.div>

        <motion.div
          className="flex justify-center pr-[5rem]"
          initial={mockupInitial}
          animate={mockupAnimate}
          transition={mockupTransition}
        >
          <div className="relative">
            <motion.div
              className="w-[10rem]"
              whileHover={
                shouldReduceMotion
                  ? undefined
                  : { y: -4, scale: 1.02, filter: "saturate(1.04)" }
              }
              transition={{ duration: 0.28, ease: "easeOut" }}
            >
              <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                <div className={mockupFrameClassName}>
                  <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="h-full w-full object-cover dark:hidden"
                      src="/images/mockup/home-light.png"
                      alt="Mockup"
                    />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="hidden h-full w-full object-cover dark:block"
                      src="/images/mockup/home-dark.png"
                      alt="Mockup"
                    />
                  </div>
                </div>
              </figure>
            </motion.div>

            <div className="absolute top-1/6 left-1/2">
              <motion.div
                className="w-[10rem]"
                whileHover={
                  shouldReduceMotion
                    ? undefined
                    : { y: -4, scale: 1.02, filter: "saturate(1.04)" }
                }
                transition={{ duration: 0.28, ease: "easeOut" }}
              >
                <figure className="mx-auto aspect-[0.4614] w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
                  <div className={mockupFrameClassName}>
                    <div className="h-full w-full overflow-hidden rounded-md bg-white dark:bg-slate-500">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="h-full w-full object-cover dark:hidden"
                        src="/images/mockup/map-light.png"
                        alt="Mockup"
                      />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        className="hidden h-full w-full object-cover dark:block"
                        src="/images/mockup/map-dark.png"
                        alt="Mockup"
                      />
                    </div>
                  </div>
                </figure>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
