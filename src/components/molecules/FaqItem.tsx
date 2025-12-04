"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Disclosure,
  DisclosureHeader,
  DisclosurePanel,
} from "@/components/atoms/Disclosure";

export function FaqItem({
  id,
  question,
  answer,
}: {
  id: string;
  question: string;
  answer: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (window.location.hash === `#${id}`) {
      setTimeout(() => {
        setIsOpen(true);
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [id]);

  return (
    <div id={id}>
      <Disclosure isExpanded={isOpen} onExpandedChange={setIsOpen}>
        <DisclosureHeader>{question}</DisclosureHeader>
        <DisclosurePanel>{answer}</DisclosurePanel>
      </Disclosure>
    </div>
  );
}
