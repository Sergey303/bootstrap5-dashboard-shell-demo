import { useEffect } from "react";
import { primeThemeCssByKey } from "./primeThemes";
import { useDemoStore } from "./context";

const STYLE_ID = "prime-theme-runtime";

export function ThemeRuntime() {
  const { state } = useDemoStore();
  useEffect(() => {
    const style = document.getElementById(STYLE_ID) ?? document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = primeThemeCssByKey[state.selectedTheme];
    if (!style.parentElement) document.head.appendChild(style);
  }, [state.selectedTheme]);
  return null;
}
