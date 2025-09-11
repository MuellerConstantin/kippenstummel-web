import React, { ReactNode } from "react";
import {
  Radio as RACRadio,
  RadioGroup as RACRadioGroup,
  RadioGroupProps as RACRadioGroupProps,
  RadioProps,
  ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError, Label } from "./Field";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";

export interface RadioGroupProps extends Omit<RACRadioGroupProps, "children"> {
  label?: string;
  children?: ReactNode;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
}

export function RadioGroup(props: RadioGroupProps) {
  return (
    <RACRadioGroup
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-2",
      )}
    >
      <Label>{props.label}</Label>
      <div className="flex flex-col gap-2">{props.children}</div>
      {props.description && <Description>{props.description}</Description>}
      <FieldError>{props.errorMessage}</FieldError>
    </RACRadioGroup>
  );
}

const styles = tv({
  extend: focusRing,
  base: "w-5 h-5 rounded-full border-2 bg-white dark:bg-slate-900 transition-all shrink-0",
  variants: {
    isSelected: {
      false:
        "border-slate-400 dark:border-slate-400 group-pressed:border-slate-500 dark:group-pressed:border-slate-300",
      true: "border-[7px] border-slate-700 dark:border-slate-300 forced-colors:border-[Highlight]! group-pressed:border-slate-800 dark:group-pressed:border-slate-200",
    },
    isInvalid: {
      true: "border-red-700 dark:border-red-600 group-pressed:border-red-800 dark:group-pressed:border-red-700 forced-colors:border-[Mark]!",
    },
    isDisabled: {
      true: "border-slate-200 dark:border-slate-700 forced-colors:border-[slateText]!",
    },
  },
});

export function Radio(props: RadioProps) {
  return (
    <RACRadio
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group relative flex items-center gap-2 text-sm text-slate-800 transition disabled:text-slate-300 dark:text-slate-200 dark:disabled:text-slate-600 forced-colors:disabled:text-[slateText]",
      )}
    >
      {(renderProps) => (
        <>
          <div className={styles(renderProps)} />
          {props.children}
        </>
      )}
    </RACRadio>
  );
}
