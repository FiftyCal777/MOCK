/**
 * Converts a hex color string (e.g. "#3B82F6" or "3B82F6") to HSL space format "h s% l%"
 */
export function hexToHsl(hex?: string | null): string | null {
  if (!hex) return null;
  let c = hex.replace('#', '').trim();
  if (c.length === 3) {
    c = c.split('').map((x) => x + x).join('');
  }
  if (c.length !== 6) return null;
  const num = parseInt(c, 16);
  if (isNaN(num)) return null;

  const r = ((num >> 16) & 255) / 255;
  const g = ((num >> 8) & 255) / 255;
  const b = (num & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  const hDeg = Math.round(h * 360);
  const sPct = Math.round(s * 100);
  const lPct = Math.round(l * 100);

  return `${hDeg} ${sPct}% ${lPct}%`;
}

/**
 * Dynamically applies the institution's primary and secondary theme colors
 * to CSS variables on the root document element.
 */
export function applyInstitutionTheme(primaryHex?: string | null, secondaryHex?: string | null) {
  const root = document.documentElement;

  if (primaryHex) {
    const primaryHsl = hexToHsl(primaryHex);
    if (primaryHsl) {
      root.style.setProperty('--primary', primaryHsl);
      root.style.setProperty('--ring', primaryHsl);
    }
  } else {
    root.style.removeProperty('--primary');
    root.style.removeProperty('--ring');
  }

  if (primaryHex && secondaryHex) {
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(135deg, ${primaryHex} 0%, ${secondaryHex} 100%)`
    );
  } else if (primaryHex) {
    root.style.setProperty(
      '--gradient-primary',
      `linear-gradient(135deg, ${primaryHex} 0%, ${primaryHex}ee 100%)`
    );
  } else {
    root.style.removeProperty('--gradient-primary');
  }
}
