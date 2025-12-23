"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { createPortal } from "react-dom";
import { useControl } from "react-map-gl/maplibre";

function LegalAndAttributionControlComponent() {
  const t = useTranslations("Footer");

  return (
    <div className="maplibregl-ctrl-attrib-inner">
      <div className="flex flex-wrap gap-x-4">
        <div>
          <a
            href="https://openfreemap.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenFreeMap
          </a>
          &nbsp;©&nbsp;
          <a
            href="https://openmaptiles.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenMapTiles
          </a>
          &nbsp;Data from&nbsp;
          <a
            href="https://www.openstreetmap.org/copyright"
            target="_blank"
            rel="noopener noreferrer"
          >
            OpenStreetMap
          </a>
        </div>
        <div className="flex gap-2">
          <a href="/imprint" target="_blank" rel="noopener noreferrer">
            {t("imprint")}
          </a>
          <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
            {t("privacyPolicy")}
          </a>
          <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
            {t("termsOfService")}
          </a>
        </div>
      </div>
    </div>
  );
}

interface LegalAndAttributionControlProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export function LegalAndAttributionControl({
  position = "bottom-right",
}: LegalAndAttributionControlProps) {
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  useControl(
    () => {
      class LegalControlWrapper {
        private _container: HTMLDivElement | null = null;

        onAdd() {
          this._container = document.createElement("div");
          this._container.className =
            "maplibregl-ctrl maplibregl-ctrl-attrib maplibregl-ctrl-legal";

          setContainer(this._container);
          return this._container;
        }

        onRemove() {
          this._container?.parentNode?.removeChild(this._container);
        }
      }

      return new LegalControlWrapper();
    },
    { position },
  );

  return container
    ? createPortal(<LegalAndAttributionControlComponent />, container)
    : null;
}
