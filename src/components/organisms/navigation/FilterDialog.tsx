import React, { useCallback } from "react";
import { useTranslations } from "next-intl";
import { DialogProps, Heading } from "react-aria-components";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";
import { useAppDispatch, useAppSelector } from "@/store";
import usabilitySlice from "@/store/slices/usability";
import { Slider } from "@/components/atoms/Slider";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface FilterDialogProps extends Omit<DialogProps, "children"> {}

export function FilterDialog(props: FilterDialogProps) {
  const dispatch = useAppDispatch();
  const t = useTranslations("FilterDialog");

  const isFiltered = useAppSelector(
    (state) => state.usability.mapFilters !== undefined,
  );
  const minScore = useAppSelector(
    (state) => state.usability.mapFilters?.score?.min,
  );
  const maxScore = useAppSelector(
    (state) => state.usability.mapFilters?.score?.max,
  );

  const reset = useCallback(() => {
    dispatch(usabilitySlice.actions.setMapFilters(undefined));
  }, [dispatch]);

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
            <div className="flex">
              <Slider
                defaultValue={[-10, 10]}
                minValue={-10}
                maxValue={10}
                value={
                  minScore !== undefined && maxScore !== undefined
                    ? [minScore, maxScore]
                    : [-10, 10]
                }
                onChange={(values) => {
                  dispatch(
                    usabilitySlice.actions.setScoreMapFilters({
                      min: values[0],
                      max: values[1],
                    }),
                  );
                }}
                label={t("score.label")}
                step={1}
                className="grow"
              />
            </div>
            <div className="flex flex-col justify-start gap-4">
              <Button onPress={close} className="w-full">
                {t("close")}
              </Button>
              {isFiltered && (
                <div className="flex justify-center">
                  <Link
                    onPress={reset}
                    variant="secondary"
                    className="!cursor-pointer !text-xs"
                  >
                    {t("reset")}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
