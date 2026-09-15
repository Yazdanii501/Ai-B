import { Howl, Howler } from "howler";
import { synthChime, synthCorrect, synthFzzt, synthGoldSwell, synthHoverTick, synthHum } from "./synthWav";

let hum: Howl | null = null;
let openChime: Howl | null = null;
let correctDing: Howl | null = null;
let wrongBuzz: Howl | null = null;
let badgeSwell: Howl | null = null;
let hoverTick: Howl | null = null;

function ensureLoaded() {
  if (hum) return;
  hum = new Howl({ src: [synthHum()], format: ["wav"], loop: true, volume: 0.35 });
  openChime = new Howl({ src: [synthChime()], format: ["wav"], volume: 0.55 });
  correctDing = new Howl({ src: [synthCorrect()], format: ["wav"], volume: 0.8 });
  wrongBuzz = new Howl({ src: [synthFzzt()], format: ["wav"], volume: 0.55 });
  badgeSwell = new Howl({ src: [synthGoldSwell()], format: ["wav"], volume: 0.85 });
  hoverTick = new Howl({ src: [synthHoverTick()], format: ["wav"], volume: 0.3 });
}

export function startAmbient() {
  ensureLoaded();
  if (hum && !hum.playing()) hum.play();
}

export function playOpen() {
  ensureLoaded();
  openChime?.play();
}

export function playCorrect() {
  ensureLoaded();
  correctDing?.play();
}

export function playWrong() {
  ensureLoaded();
  wrongBuzz?.play();
}

export function playBadge() {
  ensureLoaded();
  badgeSwell?.play();
}

export function playHover() {
  ensureLoaded();
  hoverTick?.play();
}

export function setMuted(muted: boolean) {
  Howler.mute(muted);
}
