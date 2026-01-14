export interface CvmRegion {
  slug: string;
  name: string;
  bbox: {
    bottomLeft: string;
    topRight: string;
  };
}

export const REGIONS: CvmRegion[] = [
  {
    slug: "berlin",
    name: "Berlin",
    bbox: {
      bottomLeft: "13.0884,52.3383",
      topRight: "13.7611,52.6755",
    },
  },
  {
    slug: "muenchen",
    name: "München",
    bbox: {
      bottomLeft: "11.360,48.061",
      topRight: "11.722,48.248",
    },
  },
  {
    slug: "karlsruhe",
    name: "Karlsruhe",
    bbox: {
      bottomLeft: "8.3150,48.9650",
      topRight: "8.4800,49.0500",
    },
  },
  {
    slug: "stuttgart",
    name: "Stuttgart",
    bbox: {
      bottomLeft: "9.0600,48.7200",
      topRight: "9.3000,48.8600",
    },
  },
  {
    slug: "mannheim",
    name: "Mannheim",
    bbox: {
      bottomLeft: "8.4200,49.4300",
      topRight: "8.5500,49.5500",
    },
  },
];
