import { useEffect, useState } from "react";
import defaultTheme from "tailwindcss/defaultTheme";

export function useBreakpointDown(max: keyof typeof defaultTheme.screens) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const query = `(max-width: ${defaultTheme.screens[max]})`;
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    listener();

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [max]);

  return matches;
}
