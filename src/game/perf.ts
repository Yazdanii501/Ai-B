/** Coarse device tier used to scale render cost — checked once at boot. */
export interface PerfProfile {
  isMobile: boolean;
  dpr: [number, number];
  transmissionSamples: number;
  bloomEnabled: boolean;
  dofEnabled: boolean;
  particleCount: number;
  /** Skip render-to-texture materials (transmission, reflections) entirely. */
  cheapMaterials: boolean;
}

export function detectPerfProfile(): PerfProfile {
  const isMobile =
    typeof window !== "undefined" &&
    (window.matchMedia("(max-width: 820px)").matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent));

  /** Debug override for constrained/software-rendering environments (?lowfi=1). */
  if (typeof window !== "undefined" && new URLSearchParams(window.location.search).has("lowfi")) {
    return {
      isMobile,
      dpr: [1, 1],
      transmissionSamples: 1,
      bloomEnabled: false,
      dofEnabled: false,
      particleCount: 40,
      cheapMaterials: true,
    };
  }

  if (isMobile) {
    return {
      isMobile: true,
      dpr: [1, 1.5],
      transmissionSamples: 2,
      bloomEnabled: true,
      dofEnabled: false,
      particleCount: 220,
      cheapMaterials: false,
    };
  }

  return {
    isMobile: false,
    dpr: [1, 2],
    transmissionSamples: 6,
    bloomEnabled: true,
    dofEnabled: true,
    particleCount: 600,
    cheapMaterials: false,
  };
}
