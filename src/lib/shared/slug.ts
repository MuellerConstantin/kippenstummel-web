const EXPANSIONS: Record<string, string> = {
  ä: "ae",
  ö: "oe",
  ü: "ue",
  ß: "ss",
};

const EXPANDABLE = new RegExp(`[${Object.keys(EXPANSIONS).join("")}]`, "g");

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(EXPANDABLE, (char) => EXPANSIONS[char])
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-|-$/g, "");
}
