import { ChevronDown } from "lucide-react";
import React from "react";
import {
  Select as AriaSelect,
  SelectProps as AriaSelectProps,
  Button,
  ListBox,
  ListBoxItemProps,
  SelectValue,
  ValidationResult,
} from "react-aria-components";
import { tv } from "tailwind-variants";
import { Description, FieldError, Label } from "./Field";
import { DropdownItem, DropdownSection, DropdownSectionProps } from "./ListBox";
import { Popover } from "./Popover";
import { composeTailwindRenderProps, focusRing } from "@/components/utils";

const styles = tv({
  extend: focusRing,
  base: "flex items-center text-start gap-4 w-full cursor-default border border-black/10 dark:border-white/10 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] dark:shadow-none rounded-lg pl-3 pr-2 py-2 min-w-[150px] transition bg-gray-50 dark:bg-slate-700",
  variants: {
    isDisabled: {
      false:
        "text-gray-800 dark:text-slate-300 hover:bg-gray-100 pressed:bg-gray-200 dark:hover:bg-slate-600 dark:pressed:bg-slate-500 group-invalid:border-red-600 forced-colors:group-invalid:border-[Mark]",
      true: "text-gray-200 dark:text-slate-600 forced-colors:text-[GrayText] dark:bg-slate-800 dark:border-white/5 forced-colors:border-[GrayText]",
    },
  },
});

export interface SelectProps<T extends object>
  extends Omit<AriaSelectProps<T>, "children"> {
  label?: string;
  description?: string;
  errorMessage?: string | ((validation: ValidationResult) => string);
  items?: Iterable<T>;
  children: React.ReactNode | ((item: T) => React.ReactNode);
}

export function Select<T extends object>({
  label,
  description,
  errorMessage,
  children,
  items,
  ...props
}: SelectProps<T>) {
  return (
    <AriaSelect
      {...props}
      className={composeTailwindRenderProps(
        props.className,
        "group flex flex-col gap-1",
      )}
    >
      {label && <Label>{label}</Label>}
      <Button className={styles}>
        <SelectValue className="flex-1 truncate overflow-hidden text-sm whitespace-nowrap placeholder-shown:italic" />
        <ChevronDown
          aria-hidden
          className="h-4 w-4 text-gray-600 group-disabled:text-gray-200 dark:text-slate-400 dark:group-disabled:text-slate-600 forced-colors:text-[ButtonText] forced-colors:group-disabled:text-[GrayText]"
        />
      </Button>
      {description && <Description>{description}</Description>}
      <FieldError>{errorMessage}</FieldError>
      <Popover className="!z-[150000] min-w-(--trigger-width)">
        <ListBox
          items={items}
          className="max-h-[inherit] overflow-auto p-1 outline-hidden [clip-path:inset(0_0_0_0_round_.75rem)]"
        >
          {children}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}

export function SelectItem(props: ListBoxItemProps) {
  return <DropdownItem {...props} />;
}

export function SelectSection<T extends object>(
  props: DropdownSectionProps<T>,
) {
  return <DropdownSection {...props} />;
}
