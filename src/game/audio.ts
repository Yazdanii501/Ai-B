import { Howl, Howler } from "howler";
import { synthBubble, synthChime, synthFzzt, synthGoldSwell, synthHum } from "./synthWav";

let hum: Howl | null = null;
let bubble: Howl | null = null;
let chime: Howl | null = null;
let fzzt: Howl | null = null;
let goldSwell: Howl | null = null;

function ensureLoaded() {
  if (hum) return;
  hum = new Howl({ src: [synthHum()], format: ["wav"], loop: true, volume: 0.5 });
  bubble = new Howl({ src: [synthBubble()], format: ["wav"], loop: true, volume: 0.6 });
  chime = new Howl({ src: [synthChime()], format: ["wav"], volume: 0.8 });
  fzzt = new Howl({ src: [synthFzzt()], format: ["wav"], volume: 0.7 });
  goldSwell = new Howl({ src: [synthGoldSwell()], format: ["wav"], volume: 0.9 });
}

export function startAmbient() {
  ensureLoaded();
  if (hum && !hum.playing()) hum.play();
  if (bubble && !bubble.playing()) bubble.play();
}

export function duckAmbient() {
  if (hum?.playing()) hum.fade(hum.volume(), 0.08, 1200);
  if (bubble?.playing()) bubble.fade(bubble.volume(), 0.05, 1200);
}

export function playChime() {
  ensureLoaded();
  chime?.play();
}

export function playFail() {
  ensureLoaded();
  fzzt?.play();
}

export function playGoldSwell() {
  ensureLoaded();
  goldSwell?.play();
}

export function setMuted(muted: boolean) {
  Howler.mute(muted);
}
