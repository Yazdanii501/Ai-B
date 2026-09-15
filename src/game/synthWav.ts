/** Tiny procedural WAV synthesis so the game ships with zero external audio
 * assets — every sound is generated once at boot and handed to howler as a
 * data URI. */

const SAMPLE_RATE = 22050;

function makeBuffer(durationSeconds: number): Float32Array {
  return new Float32Array(Math.floor(SAMPLE_RATE * durationSeconds));
}

function encodeWav(samples: Float32Array): string {
  const bytesPerSample = 2;
  const blockAlign = bytesPerSample;
  const byteRate = SAMPLE_RATE * blockAlign;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
}

function writeString(view: DataView, offset: number, text: string) {
  for (let i = 0; i < text.length; i++) view.setUint8(offset + i, text.charCodeAt(i));
}

function fadeEdges(samples: Float32Array, fadeSamples: number) {
  for (let i = 0; i < fadeSamples; i++) {
    const g = i / fadeSamples;
    samples[i] *= g;
    samples[samples.length - 1 - i] *= g;
  }
}

/** Warm low drone, seamlessly loopable. */
export function synthHum(): string {
  const duration = 4;
  const samples = makeBuffer(duration);
  const f1 = 55; // A1, integer cycles over 4s
  const f2 = 82.5;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    samples[i] =
      Math.sin(2 * Math.PI * f1 * t) * 0.35 +
      Math.sin(2 * Math.PI * f2 * t) * 0.15 +
      Math.sin(2 * Math.PI * f1 * 2 * t) * 0.08;
  }
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.22;
  return encodeWav(samples);
}

/** Soft, sporadic bubbling blips. */
export function synthBubble(): string {
  const duration = 5;
  const samples = makeBuffer(duration);
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff;
  };

  const blipCount = 9;
  for (let b = 0; b < blipCount; b++) {
    const start = Math.floor(rand() * (samples.length - SAMPLE_RATE * 0.3));
    const len = Math.floor(SAMPLE_RATE * (0.06 + rand() * 0.05));
    const freq = 300 + rand() * 500;
    for (let i = 0; i < len; i++) {
      const t = i / SAMPLE_RATE;
      const env = Math.exp(-t * 40);
      samples[start + i] += Math.sin(2 * Math.PI * freq * (1 + t * 4) * t) * env * 0.5;
    }
  }
  fadeEdges(samples, 400);
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.3;
  return encodeWav(samples);
}

/** Bright discovery chime — a few decaying harmonics. */
export function synthChime(): string {
  const duration = 1.3;
  const samples = makeBuffer(duration);
  const root = 660;
  const partials = [1, 1.5, 2, 3];
  const gains = [0.5, 0.28, 0.16, 0.09];
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 3.2);
    let v = 0;
    for (let p = 0; p < partials.length; p++) {
      v += Math.sin(2 * Math.PI * root * partials[p] * t) * gains[p];
    }
    samples[i] = v * env;
  }
  fadeEdges(samples, 40);
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.5;
  return encodeWav(samples);
}

/** Short dry "fzzt" fail texture — filtered noise burst. */
export function synthFzzt(): string {
  const duration = 0.28;
  const samples = makeBuffer(duration);
  let seed = 7;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return seed / 0x7fffffff - 0.5;
  };
  let prev = 0;
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.exp(-t * 16);
    const noise = rand();
    prev = prev * 0.7 + noise * 0.3; // one-pole lowpass, softens harshness
    samples[i] = prev * env * 1.6;
  }
  fadeEdges(samples, 30);
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.4;
  return encodeWav(samples);
}

/** Rising, swelling major chord for the gold finale. */
export function synthGoldSwell(): string {
  const duration = 2.8;
  const samples = makeBuffer(duration);
  const chord = [220, 277.18, 329.63, 440]; // A major-ish
  for (let i = 0; i < samples.length; i++) {
    const t = i / SAMPLE_RATE;
    const env = Math.min(t / 0.9, 1) * Math.exp(-Math.max(0, t - 1.8) * 1.4);
    const pitchLift = 1 + t * 0.015;
    let v = 0;
    for (const f of chord) v += Math.sin(2 * Math.PI * f * pitchLift * t);
    samples[i] = (v / chord.length) * env;
  }
  fadeEdges(samples, 60);
  for (let i = 0; i < samples.length; i++) samples[i] *= 0.55;
  return encodeWav(samples);
}
