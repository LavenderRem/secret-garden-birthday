// 原创八音盒小曲：72 BPM、三拍子、16 小节，使用加法合成，无外部采样。
// 运行 node scripts/generate-garden-music.mjs 可重新生成站点随附的配乐。
import { writeFileSync } from 'node:fs';

const sampleRate = 22050;
const beat = 60 / 72;
const duration = 48 * beat;
const samples = new Float64Array(Math.round(duration * sampleRate));
const frequency = midi => 440 * 2 ** ((midi - 69) / 12);

function note(midi, startBeat, lengthBeats, gain) {
  const start = Math.round(startBeat * beat * sampleRate);
  const length = Math.round((lengthBeats * beat + 3) * sampleRate);
  const hz = frequency(midi);
  for (let i = 0; i < length; i++) {
    const time = i / sampleRate;
    const attack = 1 - Math.exp(-time * 180);
    const decay = Math.exp(-time / (lengthBeats * beat * 0.45 + 0.4));
    const release = Math.min(1, (length - i) / (sampleRate * 0.2));
    const phase = 2 * Math.PI * hz * time;
    const tone = Math.sin(phase) + 0.22 * Math.sin(phase * 2) * Math.exp(-time * 2)
      + 0.08 * Math.sin(phase * 3) * Math.exp(-time * 4);
    const value = gain * attack * decay * release * tone;
    // 将混响尾音回绕到开头，保证循环接点连续。
    samples[(start + i) % samples.length] += value;
    samples[(start + i + Math.round(sampleRate * 0.23)) % samples.length] += value * 0.16;
    samples[(start + i + Math.round(sampleRate * 0.47)) % samples.length] += value * 0.07;
  }
}

const chords = [
  [48, 55, 60, 64], [45, 52, 57, 60], [41, 48, 53, 57], [43, 50, 55, 59],
];
const melody = [
  [76, 79, 83], [81, 79, 76], [77, 76, 72], [74, 76, 79],
  [79, 76, 74], [72, 76, 81], [79, 77, 76], [74, 71, 67],
  [72, 76, 79], [81, 84, 83], [81, 79, 77], [79, 77, 74],
  [76, 79, 76], [72, 76, 74], [72, 69, 72], [74, 71, 72],
];
for (let bar = 0; bar < 16; bar++) {
  const chord = chords[bar % chords.length];
  note(chord[0], bar * 3, 3, 0.09);
  for (let step = 0; step < 3; step++) {
    note(chord[step + 1], bar * 3 + step + 0.5, 1.5, 0.055);
    note(melody[bar][step], bar * 3 + step, 1.3, 0.12);
  }
}

const wav = Buffer.alloc(44 + samples.length * 2);
wav.write('RIFF', 0);
wav.writeUInt32LE(wav.length - 8, 4);
wav.write('WAVEfmt ', 8);
wav.writeUInt32LE(16, 16);
wav.writeUInt16LE(1, 20);
wav.writeUInt16LE(1, 22);
wav.writeUInt32LE(sampleRate, 24);
wav.writeUInt32LE(sampleRate * 2, 28);
wav.writeUInt16LE(2, 32);
wav.writeUInt16LE(16, 34);
wav.write('data', 36);
wav.writeUInt32LE(samples.length * 2, 40);
let peak = 0;
for (const value of samples) peak = Math.max(peak, Math.abs(value));
for (let i = 0; i < samples.length; i++) wav.writeInt16LE(Math.round(samples[i] / peak * 24000), 44 + i * 2);
writeFileSync(new URL('../public/assets/garden-lullaby.wav', import.meta.url), wav);
console.log(`已生成原创配乐：${duration} 秒，${wav.length} 字节`);
