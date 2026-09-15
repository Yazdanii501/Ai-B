/** Coarse device tier used to scale render cost — checked once at boot. */
export interface PerfProfile {
  isMobile: boolean;
  dpr: [number, number];
  bloomEnabled: boolean;
  /** Particle count for the canvas-2D dust ambience behind the table. */
  dustCount: number;
}

export function detectPerfProfile(): PerfProfile {
  const isMobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 820px)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  /** Debug override for constrained/software-rendering environments (?lowfi=1). */
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lowfi")) {
    return { isMobile, dpr: [1, 1], bloomEnabled: false, dustCount: 20 };
  }

  if (isMobile) {
    return { isMobile: true, dpr: [1, 1.5], bloomEnabled: true, dustCount: 40 };
  }

  return { isMobile: false, dpr: [1, 2], bloomEnabled: true, dustCount: 90 };
}
