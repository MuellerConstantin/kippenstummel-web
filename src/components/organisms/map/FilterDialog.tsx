import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Select, SelectItem } from "@/components/atoms/Select";
import { ChevronDown, ChevronUp, Equal, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store";
import usabilitySlice from "@/store/slices/usability";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FilterDialogProps extends Omit<DialogProps, "children"> {}

export function FilterDialog(props: FilterDialogProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("FilterDialog");

  const mapVariant = useAppSelector((state) => state.usability.mapVariant);

  const [selectedVariant, setSelectedVariant] = useState<string>(
    `layer-variant-${mapVariant}`,
  );

  useEffect(() => {
    if (selectedVariant) {
      switch (selectedVariant) {
        case "layer-variant-rN8p": {
          dispatch(usabilitySlice.actions.setMapVariant("rN8p"));
          break;
        }
        case "layer-variant-r0P": {
          dispatch(usabilitySlice.actions.setMapVariant("r0P"));
          break;
        }
        case "layer-variant-r5p": {
          dispatch(usabilitySlice.actions.setMapVariant("r5p"));
          break;
        }
        case "layer-variant-rAll":
        default: {
          dispatch(usabilitySlice.actions.setMapVariant("rAll"));
          break;
        }
      }
    }
  }, [dispatch, selectedVariant]);

  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            {t("title")}
          </Heading>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              <Select
                label={t("variant.label")}
                selectedKey={selectedVariant}
                onSelectionChange={(property) =>
                  setSelectedVariant(property as string)
                }
              >
                <SelectItem id="layer-variant-r5p" key="layer-variant-r5p">
                  <div className="flex items-center gap-2">
                    <div>{t("variant.options.r5p")}</div>
                    <div className="flex items-center gap-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-green-600">
                        <ChevronUp className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem id="layer-variant-r0P" key="layer-variant-r0P">
                  <div className="flex items-center gap-2">
                    <div>{t("variant.options.r0P")}</div>
                    <div className="flex items-center gap-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-green-600">
                        <ChevronUp className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-slate-500">
                        <Equal className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem id="layer-variant-rN8p" key="layer-variant-rN8p">
                  <div className="flex items-center gap-2">
                    <div>{t("variant.options.rN8p")}</div>
                    <div className="flex items-center gap-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-green-600">
                        <ChevronUp className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-slate-500">
                        <Equal className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-red-500">
                        <ChevronDown className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem id="layer-variant-rAll" key="layer-variant-rAll">
                  <div className="flex items-center gap-2">
                    <div>{t("variant.options.rAll")}</div>
                    <div className="flex items-center gap-1">
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-green-600">
                        <ChevronUp className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-slate-500">
                        <Equal className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-red-500">
                        <ChevronDown className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white bg-red-800">
                        <X className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </SelectItem>
              </Select>
            </div>
            <div className="flex justify-start gap-4">
              <Button onPress={close} className="w-full">
                {t("close")}
              </Button>
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
