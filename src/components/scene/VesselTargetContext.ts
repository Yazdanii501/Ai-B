import { createContext, useContext } from "react";

/** A plain mutable ref shape, decoupled from React's ref typings so callback-ref
 * assignment never fights RefObject/MutableRefObject generic variance. */
export interface TargetRef<T> {
  current: T | null;
}

/** Shared ref to the vessel's DOM drop-target, used for drag hit-testing. */
export const VesselTargetContext = createContext<TargetRef<HTMLButtonElement> | null>(null);

export function useVesselTarget(): TargetRef<HTMLButtonElement> {
  const ctx = useContext(VesselTargetContext);
  if (!ctx) throw new Error("useVesselTarget must be used within VesselTargetContext.Provider");
  return ctx;
}

/** Simple point-in-rect hit test with forgiveness padding for touch. */
export function isPointInRect(x: number, y: number, rect: DOMRect, padding = 24): boolean {
  return (
    x >= rect.left - padding &&
    x <= rect.right + padding &&
    y >= rect.top - padding &&
    y <= rect.bottom + padding
  );
}
