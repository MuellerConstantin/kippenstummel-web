import React, { useContext } from "react";
import {
  Disclosure as AriaDisclosure,
  DisclosureGroup as AriaDisclosureGroup,
  DisclosureProps as AriaDisclosureProps,
  DisclosureGroupProps as AriaDisclosureGroupProps,
  DisclosurePanel as AriaDisclosurePanel,
  DisclosurePanelProps as AriaDisclosurePanelProps,
  composeRenderProps,
  Heading,
  Button,
  DisclosureStateContext,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { ChevronRight } from "lucide-react";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";
import { DisclosureGroupStateContext } from "react-aria-components";

const disclosure = tv({
  base: `
    group
    rounded-2xl
    border border-slate-200/60 dark:border-slate-800
    bg-white dark:bg-slate-900
    shadow-sm
    transition-all duration-300
    hover:shadow-md
  `,
  variants: {
    isInGroup: {
      true: "border-0 border-b last:border-b-0 rounded-b-none last:rounded-b-lg",
    },
  },
});

const disclosureButton = tv({
  extend: focusRing,
  base: `
    flex w-full items-center gap-4
    rounded-2xl
    px-6 py-5
    text-left
    cursor-pointer
    transition-colors duration-200
    hover:bg-slate-50 dark:hover:bg-slate-800/60
  `,
  variants: {
    isDisabled: {
      true: "text-gray-300 dark:text-slate-600 forced-colors:text-[GrayText]",
    },
    isInGroup: {
      true: "-outline-offset-2 rounded-none group-first:rounded-t-lg group-last:rounded-b-lg",
    },
  },
});

const chevron = tv({
  base: `
    w-5 h-5 shrink-0
    text-slate-400
    transition-transform duration-300 ease-out
  `,
  variants: {
    isExpanded: {
      true: "rotate-90 text-green-600",
    },
    isDisabled: {
      true: "text-gray-300 dark:text-slate-600 forced-colors:text-[GrayText]",
    },
  },
});

export interface DisclosureProps extends AriaDisclosureProps {
  children: React.ReactNode;
}

export function Disclosure({ children, ...props }: DisclosureProps) {
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;
  return (
    <AriaDisclosure
      {...props}
      className={composeRenderProps(props.className, (className, renderProps) =>
        disclosure({ ...renderProps, isInGroup, className }),
      )}
    >
      {children}
    </AriaDisclosure>
  );
}

export interface DisclosureHeaderProps {
  children: React.ReactNode;
}

export function DisclosureHeader({ children }: DisclosureHeaderProps) {
  const { isExpanded } = useContext(DisclosureStateContext)!;
  const isInGroup = useContext(DisclosureGroupStateContext) !== null;
  return (
    <Heading className="text-base font-semibold">
      <Button
        slot="trigger"
        className={(renderProps) =>
          disclosureButton({ ...renderProps, isInGroup })
        }
      >
        {({ isDisabled }) => (
          <>
            <ChevronRight
              aria-hidden
              className={chevron({ isExpanded, isDisabled })}
            />
            {children}
          </>
        )}
      </Button>
    </Heading>
  );
}

export interface DisclosurePanelProps extends AriaDisclosurePanelProps {
  children: React.ReactNode;
}

export function DisclosurePanel({ children, ...props }: DisclosurePanelProps) {
  return (
    <AriaDisclosurePanel
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "data-[entering]:fade-in-0 data-[entering]:slide-in-from-top-1 group-data-[expanded]:px-4 group-data-[expanded]:py-2",
      )}
    >
      {children}
    </AriaDisclosurePanel>
  );
}

export interface DisclosureGroupProps extends AriaDisclosureGroupProps {
  children: React.ReactNode;
}

export function DisclosureGroup({ children, ...props }: DisclosureGroupProps) {
  return (
    <AriaDisclosureGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "rounded-lg border border-gray-200 dark:border-slate-600",
      )}
    >
      {children}
    </AriaDisclosureGroup>
  );
}
