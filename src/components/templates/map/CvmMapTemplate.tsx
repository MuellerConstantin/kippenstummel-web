import { BaseMap, BaseMapProps } from "../../organisms/map/BaseMap";

export interface CvmMapTemplateProps extends BaseMapProps {
  north?: React.ReactNode;
  south?: React.ReactNode;
  children?: React.ReactNode;
}

export function CvmMapTemplate({
  north,
  south,
  children,
  ...props
}: CvmMapTemplateProps) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <div className="shrink-0">{north}</div>
      <div className="grow">
        <BaseMap {...props}>{children}</BaseMap>
      </div>
      <div className="shrink-0">{south}</div>
    </div>
  );
}
