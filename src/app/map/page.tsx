import { Map as MapComponent } from "@/components/organisms/Map";

export default function Map() {
  return (
    <div className="flex h-0 grow flex-col">
      <MapComponent
        tileLayerUrl="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        tileLayerAttribution='&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
    </div>
  );
}
