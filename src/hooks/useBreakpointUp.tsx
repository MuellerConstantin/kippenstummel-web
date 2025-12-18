import { useEffect, useState } from "react";
import defaultTheme from "tailwindcss/defaultTheme";

export function useBreakpointUp(min: keyof typeof defaultTheme.screens) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(min-width: ${defaultTheme.screens[min]})`;
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    listener();

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [min]);

  return matches;
}
