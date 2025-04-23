import React from "react";
import { DialogProps, Heading } from "react-aria-components";
import { chain } from "react-aria";
import { Dialog } from "@/components/atoms/Dialog";
import { Button } from "@/components/atoms/Button";
import { Link } from "@/components/atoms/Link";

interface ConfirmCvmReportDialogProps extends Omit<DialogProps, "children"> {
  onConfirm?: () => void;
}

export function ConfirmCvmReportDialog(props: ConfirmCvmReportDialogProps) {
  return (
    <Dialog {...props}>
      {({ close }) => (
        <>
          <Heading
            slot="title"
            className="my-0 text-xl leading-6 font-semibold"
          >
            Report Cigarette Vending Machine
          </Heading>
          <div className="mt-4 flex flex-col gap-4">
            <div>
              Are you sure you want to report a cigarette vending machine at
              your current location?
            </div>
            <div className="flex justify-start gap-4">
              <Button
                variant="secondary"
                onPress={() => close()}
                className="w-full"
              >
                Cancel
              </Button>
              <Button
                onPress={chain(close, props.onConfirm)}
                className="w-full"
              >
                Confirm
              </Button>
            </div>
            <div className="text-xs">
              By confirming, you agree to our{" "}
              <Link href="/terms-of-service">Terms of Service</Link> and{" "}
              <Link href="/privacy-policy">Privacy Policy</Link>.
            </div>
          </div>
        </>
      )}
    </Dialog>
  );
}
