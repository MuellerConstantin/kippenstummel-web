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
];
