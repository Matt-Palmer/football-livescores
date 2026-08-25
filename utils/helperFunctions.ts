export const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/** WCAG relative luminance of an sRGB channel (0-255). */
const channelLuminance = (channel: number): number => {
  const normalised = channel / 255;

  return normalised <= 0.03928
    ? normalised / 12.92
    : Math.pow((normalised + 0.055) / 1.055, 2.4);
};

/** WCAG relative luminance of a "#RRGGBB" colour. */
const relativeLuminance = (hexColour: string): number => {
  const r = parseInt(hexColour.slice(1, 3), 16);
  const g = parseInt(hexColour.slice(3, 5), 16);
  const b = parseInt(hexColour.slice(5, 7), 16);

  return (
    0.2126 * channelLuminance(r) +
    0.7152 * channelLuminance(g) +
    0.0722 * channelLuminance(b)
  );
};

/**
 * Black or white, whichever contrasts better against a "#RRGGBB" background
 * (kit colours can be light enough that white text disappears into them).
 * Falls back to white — the previous fixed colour — for anything that isn't
 * a valid hex colour, e.g. a kit colour Sportmonks didn't send for this fixture.
 */
export const getContrastTextColour = (hexColour: string | undefined): string => {
  if (!hexColour || !/^#[0-9a-fA-F]{6}$/.test(hexColour)) return "#FFFFFF";

  const luminance = relativeLuminance(hexColour);

  const contrastWithWhite = 1.05 / (luminance + 0.05);
  const contrastWithBlack = (luminance + 0.05) / 0.05;

  return contrastWithWhite >= contrastWithBlack ? "#FFFFFF" : "#000000";
};