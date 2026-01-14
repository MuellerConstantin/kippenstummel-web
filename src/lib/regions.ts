export interface CvmRegion {
  slug: string;
  name: string;
  bbox: {
    bottomLeft: string;
    topRight: string;
  };
}

export const REGIONS: CvmRegion[] = [
  // Baden-Württemberg
  {
    slug: "stuttgart",
    name: "Stuttgart",
    bbox: { bottomLeft: "9.0600,48.7200", topRight: "9.3000,48.8600" },
  },
  {
    slug: "mannheim",
    name: "Mannheim",
    bbox: { bottomLeft: "8.4200,49.4300", topRight: "8.5500,49.5500" },
  },
  {
    slug: "karlsruhe",
    name: "Karlsruhe",
    bbox: { bottomLeft: "8.3150,48.9650", topRight: "8.4800,49.0500" },
  },
  {
    slug: "freiburg-im-breisgau",
    name: "Freiburg im Breisgau",
    bbox: { bottomLeft: "7.7500,47.9800", topRight: "7.9200,48.0800" },
  },
  {
    slug: "heidelberg",
    name: "Heidelberg",
    bbox: { bottomLeft: "8.6200,49.3700", topRight: "8.7500,49.4500" },
  },

  // Bayern
  {
    slug: "muenchen",
    name: "München",
    bbox: { bottomLeft: "11.3600,48.0610", topRight: "11.7220,48.2480" },
  },
  {
    slug: "nuernberg",
    name: "Nürnberg",
    bbox: { bottomLeft: "11.0000,49.3800", topRight: "11.2000,49.5200" },
  },
  {
    slug: "augsburg",
    name: "Augsburg",
    bbox: { bottomLeft: "10.8500,48.3000", topRight: "10.9800,48.4200" },
  },
  {
    slug: "regensburg",
    name: "Regensburg",
    bbox: { bottomLeft: "12.0000,49.0000", topRight: "12.2000,49.1000" },
  },
  {
    slug: "ingolstadt",
    name: "Ingolstadt",
    bbox: { bottomLeft: "11.3500,48.7000", topRight: "11.5000,48.8200" },
  },

  // Berlin
  {
    slug: "berlin",
    name: "Berlin",
    bbox: { bottomLeft: "13.0884,52.3383", topRight: "13.7611,52.6755" },
  },

  // Brandenburg
  {
    slug: "potsdam",
    name: "Potsdam",
    bbox: { bottomLeft: "12.9500,52.3500", topRight: "13.1500,52.4500" },
  },
  {
    slug: "cottbus",
    name: "Cottbus",
    bbox: { bottomLeft: "14.3000,51.7200", topRight: "14.4200,51.8200" },
  },
  {
    slug: "brandenburg-an-der-havel",
    name: "Brandenburg an der Havel",
    bbox: { bottomLeft: "12.4800,52.3800", topRight: "12.6500,52.4500" },
  },
  {
    slug: "oranienburg",
    name: "Oranienburg",
    bbox: { bottomLeft: "13.2000,52.7200", topRight: "13.3000,52.8000" },
  },
  {
    slug: "falkensee",
    name: "Falkensee",
    bbox: { bottomLeft: "13.0500,52.5400", topRight: "13.1500,52.6200" },
  },

  // Bremen
  {
    slug: "bremen",
    name: "Bremen",
    bbox: { bottomLeft: "8.6500,53.0000", topRight: "8.9500,53.1500" },
  },
  {
    slug: "bremerhaven",
    name: "Bremerhaven",
    bbox: { bottomLeft: "8.5300,53.5000", topRight: "8.6500,53.6000" },
  },

  // Hamburg
  {
    slug: "hamburg",
    name: "Hamburg",
    bbox: { bottomLeft: "9.7300,53.3900", topRight: "10.3300,53.7400" },
  },

  // Hessen
  {
    slug: "frankfurt-am-main",
    name: "Frankfurt am Main",
    bbox: { bottomLeft: "8.5000,50.0200", topRight: "8.8000,50.2000" },
  },
  {
    slug: "wiesbaden",
    name: "Wiesbaden",
    bbox: { bottomLeft: "8.1500,50.0500", topRight: "8.3500,50.1500" },
  },
  {
    slug: "kassel",
    name: "Kassel",
    bbox: { bottomLeft: "9.4000,51.2500", topRight: "9.6000,51.3500" },
  },
  {
    slug: "darmstadt",
    name: "Darmstadt",
    bbox: { bottomLeft: "8.6000,49.8200", topRight: "8.7500,49.9000" },
  },
  {
    slug: "offenbach-am-main",
    name: "Offenbach am Main",
    bbox: { bottomLeft: "8.7200,50.0700", topRight: "8.8200,50.1200" },
  },

  // Nordrhein-Westfalen
  {
    slug: "koeln",
    name: "Köln",
    bbox: { bottomLeft: "6.7700,50.8400", topRight: "7.1000,51.0200" },
  },
  {
    slug: "duesseldorf",
    name: "Düsseldorf",
    bbox: { bottomLeft: "6.6800,51.1500", topRight: "6.9000,51.3000" },
  },
  {
    slug: "dortmund",
    name: "Dortmund",
    bbox: { bottomLeft: "7.3500,51.4300", topRight: "7.6500,51.6000" },
  },
  {
    slug: "essen",
    name: "Essen",
    bbox: { bottomLeft: "6.9000,51.4000", topRight: "7.1000,51.5000" },
  },
  {
    slug: "duisburg",
    name: "Duisburg",
    bbox: { bottomLeft: "6.6500,51.3500", topRight: "6.8500,51.4800" },
  },

  // Mecklenburg-Vorpommern
  {
    slug: "rostock",
    name: "Rostock",
    bbox: { bottomLeft: "11.9000,54.0500", topRight: "12.2000,54.2000" },
  },
  {
    slug: "schwerin",
    name: "Schwerin",
    bbox: { bottomLeft: "11.3500,53.5800", topRight: "11.5000,53.6800" },
  },
  {
    slug: "neubrandenburg",
    name: "Neubrandenburg",
    bbox: { bottomLeft: "13.2000,53.5000", topRight: "13.3500,53.6000" },
  },
  {
    slug: "greifswald",
    name: "Greifswald",
    bbox: { bottomLeft: "13.3500,54.0500", topRight: "13.4500,54.1200" },
  },
  {
    slug: "stralsund",
    name: "Stralsund",
    bbox: { bottomLeft: "13.0000,54.2800", topRight: "13.1500,54.3800" },
  },

  // Rheinland-Pfalz
  {
    slug: "mainz",
    name: "Mainz",
    bbox: { bottomLeft: "8.1500,49.9500", topRight: "8.3500,50.0500" },
  },
  {
    slug: "ludwigshafen-am-rhein",
    name: "Ludwigshafen am Rhein",
    bbox: { bottomLeft: "8.3500,49.4300", topRight: "8.5000,49.5200" },
  },
  {
    slug: "koblenz",
    name: "Koblenz",
    bbox: { bottomLeft: "7.5200,50.3200", topRight: "7.6500,50.3800" },
  },
  {
    slug: "trier",
    name: "Trier",
    bbox: { bottomLeft: "6.6000,49.7300", topRight: "6.7500,49.8000" },
  },
  {
    slug: "kaiserslautern",
    name: "Kaiserslautern",
    bbox: { bottomLeft: "7.7200,49.4200", topRight: "7.8500,49.5000" },
  },
];
