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
    <div className="relative h-full w-full overflow-hidden">
      {north}
      <BaseMap {...props}>{children}</BaseMap>
      {south}
    </div>
  );
}
