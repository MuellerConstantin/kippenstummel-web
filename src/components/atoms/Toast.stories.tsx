import type { Meta, StoryObj } from "@storybook/react";
import { ToastRegion, ToastQueue } from "@/components/atoms/Toast";
import { Button } from "@/components/atoms/Button";

let index = 0;
const queue = new ToastQueue();

const meta: Meta = {
  title: "Atoms/Toast",
  parameters: {
    layout: "centered",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "icon"],
    },
  },
  args: {
    isDisabled: false,
    children: "Button",
  },
};

export default meta;

export const Default: StoryObj = {
  args: {},
  render: () => (
    <>
      <ToastRegion queue={queue} />
      <div className="flex flex-wrap gap-2">
        <Button
          variant="secondary"
          onPress={() =>
            queue.add({
              title: `Toast #${index++}`,
              description:
                "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
            })
          }
        >
          Publish Default Toast
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            queue.add({
              title: `Toast #${index++}`,
              description:
                "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
              variant: "success",
            })
          }
        >
          Publish Success Toast
        </Button>
        <Button
          variant="secondary"
          onPress={() =>
            queue.add({
              title: `Toast #${index++}`,
              description:
                "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut l",
              variant: "error",
            })
          }
        >
          Publish Error Toast
        </Button>
      </div>
    </>
  ),
};
