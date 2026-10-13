import type { PrimeThemeKey } from "../entities/types";
import laraLightBlue from "primereact/resources/themes/lara-light-blue/theme.css?raw";
import laraLightIndigo from "primereact/resources/themes/lara-light-indigo/theme.css?raw";
import laraDarkBlue from "primereact/resources/themes/lara-dark-blue/theme.css?raw";
import sagaBlue from "primereact/resources/themes/saga-blue/theme.css?raw";
import sagaGreen from "primereact/resources/themes/saga-green/theme.css?raw";
import sagaOrange from "primereact/resources/themes/saga-orange/theme.css?raw";
import sagaPurple from "primereact/resources/themes/saga-purple/theme.css?raw";
import sohoLight from "primereact/resources/themes/soho-light/theme.css?raw";
import sohoDark from "primereact/resources/themes/soho-dark/theme.css?raw";
import vivaLight from "primereact/resources/themes/viva-light/theme.css?raw";
import vivaDark from "primereact/resources/themes/viva-dark/theme.css?raw";

export const primeThemeOptions: { label: string; value: PrimeThemeKey }[] = [
  { label: "Lara светлая синяя", value: "lara-light-blue" },
  { label: "Lara светлая индиго", value: "lara-light-indigo" },
  { label: "Lara тёмная синяя", value: "lara-dark-blue" },
  { label: "Saga синяя", value: "saga-blue" },
  { label: "Saga зелёная", value: "saga-green" },
  { label: "Saga оранжевая", value: "saga-orange" },
  { label: "Saga фиолетовая", value: "saga-purple" },
  { label: "Soho светлая", value: "soho-light" },
  { label: "Soho тёмная", value: "soho-dark" },
  { label: "Viva светлая", value: "viva-light" },
  { label: "Viva тёмная", value: "viva-dark" }
];

export const primeThemeCssByKey: Record<PrimeThemeKey, string> = {
  "lara-light-blue": laraLightBlue,
  "lara-light-indigo": laraLightIndigo,
  "lara-dark-blue": laraDarkBlue,
  "saga-blue": sagaBlue,
  "saga-green": sagaGreen,
  "saga-orange": sagaOrange,
  "saga-purple": sagaPurple,
  "soho-light": sohoLight,
  "soho-dark": sohoDark,
  "viva-light": vivaLight,
  "viva-dark": vivaDark
};
