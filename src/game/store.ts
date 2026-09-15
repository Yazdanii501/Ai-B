import { create } from "zustand";
import {
  ALL_DISCOVERIES,
  RECIPES,
  TIER1_DISCOVERIES,
  TIER1_UNLOCK_THRESHOLD,
  TIER_RAW_UNLOCKS,
  findPairRecipe,
  findTripleRecipe,
} from "./recipes";
import type { ElementId, Tier, VesselSlot } from "./types";

export type GamePhase = "intro" | "playing" | "finale" | "sandbox";

export interface ReactionEvent {
  key: number;
  type: "success" | "fail";
  resultId?: ElementId;
  /** True when the result was already known — still plays a (quieter) success beat. */
  repeat?: boolean;
}

export interface TierUnlockEvent {
  key: number;
  tier: Tier;
}

const BASE_REAGENTS: ElementId[] = ["fire", "water", "earth", "air"];

const ALL_REAGENTS: ElementId[] = [
  ...BASE_REAGENTS,
  ...TIER_RAW_UNLOCKS[2],
  ...TIER_RAW_UNLOCKS[3],
  ...ALL_DISCOVERIES,
];

export function vesselCapacity(tier: Tier): 2 | 3 {
  return tier >= 3 ? 3 : 2;
}

function tierOfDiscoveryCount(discovered: Set<ElementId>): number {
  return TIER1_DISCOVERIES.filter((id) => discovered.has(id)).length;
}

interface GameState {
  phase: GamePhase;
  tier: Tier;
  vessel: VesselSlot[];
  availableReagents: ElementId[];
  discovered: Set<ElementId>;
  transmutationCount: number;
  failsThisTier: number;
  hintElementId: ElementId | null;
  pickedId: ElementId | null;
  draggingId: ElementId | null;
  reaction: ReactionEvent | null;
  tierUnlockEvent: TierUnlockEvent | null;
  grimoireOpen: boolean;
  selectedLoreId: ElementId | null;
  muted: boolean;
  hasInteractedWithAudio: boolean;
  startedAt: number | null;
  finishedAt: number | null;

  startGame: () => void;
  dropReagent: (id: ElementId) => void;
  pickReagent: (id: ElementId) => void;
  dropPicked: () => void;
  cancelPick: () => void;
  setDraggingId: (id: ElementId | null) => void;
  clearVessel: () => void;
  toggleMute: () => void;
  markAudioInteracted: () => void;
  toggleGrimoire: () => void;
  openLore: (id: ElementId) => void;
  closeLore: () => void;
  enterSandbox: () => void;
}

let reactionKeySeq = 0;
let tierEventKeySeq = 0;

export const useGameStore = create<GameState>((set, get) => ({
  phase: "intro",
  tier: 1,
  vessel: [],
  availableReagents: [...BASE_REAGENTS],
  discovered: new Set(),
  transmutationCount: 0,
  failsThisTier: 0,
  hintElementId: null,
  pickedId: null,
  draggingId: null,
  reaction: null,
  tierUnlockEvent: null,
  grimoireOpen: false,
  selectedLoreId: null,
  muted: true,
  hasInteractedWithAudio: false,
  startedAt: null,
  finishedAt: null,

  startGame: () => {
    if (get().phase !== "intro") return;
    set({ phase: "playing", startedAt: Date.now() });
  },

  dropReagent: (id) => {
    const s = get();
    if (s.phase !== "playing" && s.phase !== "sandbox") return;
    if (!s.availableReagents.includes(id)) return;
    const capacity = vesselCapacity(s.tier);
    if (s.vessel.length >= capacity) return;

    const slot: VesselSlot = { elementId: id, key: `${id}-${Date.now()}-${Math.random()}` };
    const vessel = [...s.vessel, slot];

    if (vessel.length === 2) {
      const recipe = findPairRecipe(vessel[0].elementId, vessel[1].elementId);
      if (recipe) {
        resolveSuccess(set, get, recipe.result);
        return;
      }
      if (capacity === 2) {
        resolveFail(set, get);
        return;
      }
      set({ vessel });
      return;
    }

    if (vessel.length === 3) {
      const recipe = findTripleRecipe(
        vessel[0].elementId,
        vessel[1].elementId,
        vessel[2].elementId
      );
      if (recipe) {
        resolveSuccess(set, get, recipe.result);
        return;
      }
      resolveFail(set, get);
      return;
    }

    set({ vessel });
  },

  pickReagent: (id) => {
    const s = get();
    if (s.phase !== "playing" && s.phase !== "sandbox") return;
    if (!s.availableReagents.includes(id)) return;
    set({ pickedId: s.pickedId === id ? null : id });
  },

  dropPicked: () => {
    const id = get().pickedId;
    if (!id) return;
    set({ pickedId: null });
    get().dropReagent(id);
  },

  cancelPick: () => set({ pickedId: null }),
  setDraggingId: (id) => set({ draggingId: id }),
  clearVessel: () => set({ vessel: [] }),

  toggleMute: () => set((s) => ({ muted: !s.muted })),
  markAudioInteracted: () => set({ hasInteractedWithAudio: true }),

  toggleGrimoire: () => set((s) => ({ grimoireOpen: !s.grimoireOpen })),
  openLore: (id) => set({ selectedLoreId: id, grimoireOpen: true }),
  closeLore: () => set({ selectedLoreId: null }),

  enterSandbox: () =>
    set({
      phase: "sandbox",
      vessel: [],
      hintElementId: null,
      pickedId: null,
      tier: 3,
      availableReagents: ALL_REAGENTS,
      discovered: new Set(ALL_DISCOVERIES),
    }),
}));

function resolveSuccess(
  set: (partial: Partial<GameState> | ((s: GameState) => Partial<GameState>)) => void,
  get: () => GameState,
  resultId: ElementId
) {
  const s = get();
  const alreadyKnown = s.discovered.has(resultId);
  const discovered = new Set(s.discovered);
  discovered.add(resultId);

  const availableReagents = s.availableReagents.includes(resultId)
    ? s.availableReagents
    : [...s.availableReagents, resultId];

  let tier = s.tier;
  let tierUnlockEvent: TierUnlockEvent | null = null;

  if (tier === 1 && tierOfDiscoveryCount(discovered) >= TIER1_UNLOCK_THRESHOLD) {
    tier = 2;
    tierUnlockEvent = { key: ++tierEventKeySeq, tier: 2 };
    for (const raw of TIER_RAW_UNLOCKS[2]) {
      if (!availableReagents.includes(raw)) availableReagents.push(raw);
    }
  } else if (
    tier === 2 &&
    discovered.has("essence") &&
    discovered.has("livingMetal") &&
    discovered.has("purifiedSalt")
  ) {
    tier = 3;
    tierUnlockEvent = { key: ++tierEventKeySeq, tier: 3 };
    for (const raw of TIER_RAW_UNLOCKS[3]) {
      if (!availableReagents.includes(raw)) availableReagents.push(raw);
    }
  }

  const isGold = resultId === "gold";

  set({
    vessel: [],
    discovered,
    availableReagents,
    tier,
    tierUnlockEvent,
    transmutationCount: s.transmutationCount + 1,
    failsThisTier: 0,
    hintElementId: null,
    reaction: { key: ++reactionKeySeq, type: "success", resultId, repeat: alreadyKnown },
    phase: isGold ? "finale" : s.phase,
    finishedAt: isGold ? Date.now() : s.finishedAt,
  });
}

function resolveFail(
  set: (partial: Partial<GameState> | ((s: GameState) => Partial<GameState>)) => void,
  get: () => GameState
) {
  const s = get();
  const failsThisTier = s.failsThisTier + 1;
  const hintElementId =
    failsThisTier >= 4 ? computeHint(s.tier, s.discovered, s.availableReagents) : s.hintElementId;

  set({
    vessel: [],
    failsThisTier,
    hintElementId,
    reaction: { key: ++reactionKeySeq, type: "fail" },
  });
}

function computeHint(
  tier: Tier,
  discovered: Set<ElementId>,
  available: ElementId[]
): ElementId | null {
  const capacity = vesselCapacity(tier);
  for (const recipe of RECIPES) {
    if (discovered.has(recipe.result)) continue;
    if (recipe.kind === "triple" && capacity < 3) continue;
    const inputsReady = recipe.inputs.every((id) => available.includes(id));
    if (!inputsReady) continue;
    return recipe.inputs[0];
  }
  return null;
}

export const DISCOVERY_TOTAL = ALL_DISCOVERIES.length;
