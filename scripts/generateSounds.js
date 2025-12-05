/**
 * Horror Sound Generator Script
 * Run with: node scripts/generateSounds.js
 * 
 * This script generates synthetic WAV files for horror effects using advanced DSP techniques
 */

const fs = require('fs');
const path = require('path');

// Audio configuration
const SAMPLE_RATE = 44100;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

// Create WAV header
function createWavHeader(dataLength) {
  const buffer = Buffer.alloc(44);
  
  // "RIFF" chunk descriptor
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataLength, 4);
  buffer.write('WAVE', 8);
  
  // "fmt " sub-chunk
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16); // Subchunk1Size
  buffer.writeUInt16LE(1, 20); // AudioFormat (PCM)
  buffer.writeUInt16LE(CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * CHANNELS * BITS_PER_SAMPLE / 8, 28); // ByteRate
  buffer.writeUInt16LE(CHANNELS * BITS_PER_SAMPLE / 8, 32); // BlockAlign
  buffer.writeUInt16LE(BITS_PER_SAMPLE, 34);
  
  // "data" sub-chunk
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataLength, 40);
  
  return buffer;
}

// Convert samples to buffer
function samplesToBuffer(samples) {
  const buffer = Buffer.alloc(samples.length * 2);
  for (let i = 0; i < samples.length; i++) {
    const sample = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.floor(sample * 32767), i * 2);
  }
  return buffer;
}

// Save WAV file
function saveWav(filename, samples) {
  const dataBuffer = samplesToBuffer(samples);
  const headerBuffer = createWavHeader(dataBuffer.length);
  const wavBuffer = Buffer.concat([headerBuffer, dataBuffer]);
  
  const outputPath = path.join(__dirname, '..', 'public', 'sounds', filename);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, wavBuffer);
  console.log(`✓ Generated: ${filename}`);
}

// ============================================
// AUDIO PROCESSING UTILITIES
// ============================================

// Simple low-pass filter
function lowPassFilter(samples, cutoff) {
  const rc = 1.0 / (cutoff * 2 * Math.PI);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = dt / (rc + dt);
  const filtered = [samples[0]];
  
  for (let i = 1; i < samples.length; i++) {
    filtered[i] = filtered[i - 1] + alpha * (samples[i] - filtered[i - 1]);
  }
  return filtered;
}

// Simple high-pass filter
function highPassFilter(samples, cutoff) {
  const rc = 1.0 / (cutoff * 2 * Math.PI);
  const dt = 1.0 / SAMPLE_RATE;
  const alpha = rc / (rc + dt);
  const filtered = [0];
  
  for (let i = 1; i < samples.length; i++) {
    filtered[i] = alpha * (filtered[i - 1] + samples[i] - samples[i - 1]);
  }
  return filtered;
}

// Add reverb effect (simple comb filter)
function addReverb(samples, delay = 0.05, decay = 0.3) {
  const delaySamples = Math.floor(delay * SAMPLE_RATE);
  const output = [...samples];
  
  for (let i = delaySamples; i < samples.length; i++) {
    output[i] += output[i - delaySamples] * decay;
  }
  return output;
}

// Distortion/saturation
function distort(samples, amount = 2) {
  return samples.map(s => Math.tanh(s * amount) / Math.tanh(amount));
}

// ============================================
// SOUND GENERATORS - ENHANCED
// ============================================

// 1. Ghostly Whisper (filtered noise with formants)
function generateWhisper(duration = 3) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Pink noise (more natural than white)
    let noise = 0;
    for (let oct = 1; oct < 8; oct++) {
      noise += (Math.random() * 2 - 1) / oct;
    }
    noise *= 0.15;
    
    // Voice-like formants (resonant frequencies)
    const formant1 = Math.sin(t * 800 * Math.PI * 2) * 0.15;
    const formant2 = Math.sin(t * 1200 * Math.PI * 2 + Math.sin(t * 3) * 0.5) * 0.1;
    const formant3 = Math.sin(t * 2400 * Math.PI * 2 + Math.sin(t * 5) * 0.3) * 0.05;
    
    // Breathing modulation
    const breathMod = 0.6 + 0.4 * Math.sin(t * 2 * Math.PI * 2);
    
    // Envelope with irregular tremolo
    const envelope = Math.sin(t * Math.PI / duration) * (0.8 + 0.2 * Math.sin(t * 13));
    
    samples.push((noise + formant1 + formant2 + formant3) * breathMod * envelope);
  }
  
  // Apply filters
  let filtered = highPassFilter(samples, 600);
  filtered = lowPassFilter(filtered, 3000);
  filtered = addReverb(filtered, 0.08, 0.4);
  
  return filtered;
}

// 2. Heartbeat (realistic with sub-bass)
function generateHeartbeat(duration = 4) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  const bpm = 65;
  const beatInterval = 60 / bpm;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const beatPhase = (t % beatInterval) / beatInterval;
    
    let sample = 0;
    
    // First thump (LUB) - lower frequency, stronger
    if (beatPhase < 0.12) {
      const lubPhase = beatPhase / 0.12;
      const lubEnv = Math.sin(lubPhase * Math.PI);
      // Sub-bass + harmonics
      sample += Math.sin(40 * Math.PI * 2 * t) * lubEnv * 1.2;
      sample += Math.sin(80 * Math.PI * 2 * t) * lubEnv * 0.5;
      sample += Math.sin(120 * Math.PI * 2 * t) * lubEnv * 0.2;
      // Attack transient
      if (beatPhase < 0.02) {
        sample += (Math.random() * 2 - 1) * 0.4 * Math.exp(-lubPhase * 100);
      }
    }
    // Second thump (DUB) - slightly higher, weaker
    else if (beatPhase > 0.18 && beatPhase < 0.28) {
      const dubPhase = (beatPhase - 0.18) / 0.10;
      const dubEnv = Math.sin(dubPhase * Math.PI);
      sample += Math.sin(50 * Math.PI * 2 * t) * dubEnv * 0.8;
      sample += Math.sin(100 * Math.PI * 2 * t) * dubEnv * 0.3;
    }
    
    // Overall fade
    const fade = Math.sin(t * Math.PI / duration);
    samples.push(sample * fade * 0.7);
  }
  
  // Add slight reverb for chest cavity resonance
  return addReverb(samples, 0.03, 0.2);
}

// 3. Crack/Break sound (for broken button)
function generateClick(duration = 0.2) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Sharp attack with metallic resonance
    const attack = Math.exp(-t * 40);
    const resonance = Math.exp(-t * 15);
    
    // Multiple impact frequencies
    let sample = 0;
    sample += Math.sin(t * 900 * Math.PI * 2) * attack * 0.6;
    sample += Math.sin(t * 1400 * Math.PI * 2) * attack * 0.4;
    sample += Math.sin(t * 2200 * Math.PI * 2) * attack * 0.3;
    
    // Glass-like ringing
    sample += Math.sin(t * 3500 * Math.PI * 2) * resonance * 0.25;
    sample += Math.sin(t * 5000 * Math.PI * 2) * resonance * 0.15;
    
    // Crunch texture
    sample += (Math.random() * 2 - 1) * attack * 0.5;
    
    samples.push(sample * 0.8);
  }
  
  return samples;
}

// 4. Jumpscare Impact (enhanced with sub-bass punch)
function generateJumpscare(duration = 1.2) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    // Ultra-fast attack, long decay
    const attack = t < 0.001 ? t * 1000 : 1;
    const decay = Math.exp(-t * 3);
    
    // Sub-bass impact (feel it in your chest)
    const subBass = Math.sin(t * 35 * Math.PI * 2) * decay * 1.5;
    
    // Descending sweep for drama
    const sweepFreq = 250 * Math.exp(-t * 5) + 40;
    const sweep = Math.sin(t * sweepFreq * Math.PI * 2) * decay;
    
    // Distorted harmonics
    let harmonics = 0;
    for (let h = 2; h <= 5; h++) {
      harmonics += Math.sin(t * sweepFreq * h * Math.PI * 2) * decay / h;
    }
    
    // Noise burst for impact texture
    const noiseBurst = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.8;
    
    samples.push((subBass + sweep * 0.6 + harmonics * 0.4 + noiseBurst) * attack);
  }
  
  // Heavy distortion for intensity
  return distort(samples, 1.8);
}

// 5. Ambient Drone (deep, unsettling atmosphere)
function generateAmbientDrone(duration = 8) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Deep bass drone (infrasonic range, barely audible but felt)
    const bass1 = Math.sin(t * 28 * Math.PI * 2) * 0.4;
    const bass2 = Math.sin(t * 35 * Math.PI * 2 + Math.sin(t * 0.3) * 2) * 0.3;
    
    // Mid drones with detuning for thickness
    const mid1 = Math.sin(t * 70 * Math.PI * 2) * 0.2;
    const mid2 = Math.sin(t * 70.5 * Math.PI * 2 + Math.sin(t * 0.7) * 1.5) * 0.18;
    
    // High partials with slow modulation
    const high1 = Math.sin(t * 140 * Math.PI * 2 + Math.sin(t * 0.2) * 3) * 0.12;
    const high2 = Math.sin(t * 210 * Math.PI * 2 + Math.sin(t * 0.5) * 2) * 0.08;
    
    // Evolving noise texture
    const noise = (Math.random() * 2 - 1) * 0.08 * (0.5 + 0.5 * Math.sin(t * 0.1));
    
    // Breathing amplitude modulation
    const ampMod = 0.7 + 0.3 * Math.sin(t * 0.15 * Math.PI * 2);
    
    // Smooth fade in/out
    const envelope = Math.min(1, t * 2) * Math.min(1, (duration - t) * 2);
    
    samples.push((bass1 + bass2 + mid1 + mid2 + high1 + high2 + noise) * ampMod * envelope);
  }
  
  // Add spatial depth with reverb
  return addReverb(samples, 0.15, 0.5);
}

// 6. Creaking Door (realistic old wood door slowly opening)
function generateCreak(duration = 2.5) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  // Multiple creak "events" at different times for realism
  const creakEvents = [
    { start: 0.0, duration: 0.8, freqBase: 180, intensity: 0.7 },
    { start: 0.6, duration: 1.0, freqBase: 220, intensity: 1.0 },
    { start: 1.4, duration: 0.9, freqBase: 160, intensity: 0.8 },
    { start: 2.0, duration: 0.5, freqBase: 250, intensity: 0.5 },
  ];
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    
    for (const event of creakEvents) {
      const eventT = t - event.start;
      if (eventT < 0 || eventT > event.duration) continue;
      
      const localPhase = eventT / event.duration;
      
      // Frequency modulation - slow wavering like real wood stress
      const freqMod = event.freqBase * (1 + 
        0.3 * Math.sin(eventT * 4.5) + // Slow wobble
        0.15 * Math.sin(eventT * 13.7) + // Faster variation
        0.08 * Math.sin(eventT * 31.2) // Quick tremor
      );
      
      // Main creak tone with inharmonic overtones (wood doesn't resonate cleanly)
      let creak = 0;
      const harmonics = [1, 1.73, 2.41, 3.17, 4.23, 5.89]; // Non-integer ratios for wood
      const harmonicAmps = [1, 0.5, 0.35, 0.25, 0.15, 0.08];
      
      for (let h = 0; h < harmonics.length; h++) {
        // Each harmonic has slight frequency drift
        const drift = 1 + 0.02 * Math.sin(eventT * (7 + h * 3));
        const phase = eventT * freqMod * harmonics[h] * drift * Math.PI * 2;
        creak += Math.sin(phase) * harmonicAmps[h];
      }
      
      // Stick-slip effect - the characteristic stuttering of real creaks
      const stickSlipFreq = 15 + 10 * Math.sin(eventT * 2);
      const stickSlip = 0.5 + 0.5 * Math.pow(Math.abs(Math.sin(eventT * stickSlipFreq)), 0.3);
      
      // Wood grain friction noise
      const grainNoise = (Math.random() * 2 - 1) * 0.12;
      const grainFiltered = grainNoise * (0.5 + 0.5 * Math.sin(eventT * freqMod * 0.5));
      
      // Resonant body - low frequency thump of the door
      const bodyResonance = Math.sin(eventT * 45 * Math.PI * 2) * 0.15 * 
        Math.exp(-eventT * 3) * (localPhase < 0.3 ? localPhase / 0.3 : 1);
      
      // Envelope - starts abruptly (stick), sustains (slip), ends with release
      let envelope;
      if (localPhase < 0.05) {
        envelope = Math.pow(localPhase / 0.05, 0.5); // Quick attack
      } else if (localPhase < 0.7) {
        envelope = 1 - 0.2 * (localPhase - 0.05); // Slight decay
      } else {
        envelope = 0.8 * Math.pow(1 - (localPhase - 0.7) / 0.3, 1.5); // Release
      }
      
      // Add some amplitude tremor
      const tremor = 0.85 + 0.15 * Math.sin(eventT * 23);
      
      sample += ((creak * 0.7 + grainFiltered) * stickSlip + bodyResonance) * 
                envelope * tremor * event.intensity;
    }
    
    samples.push(sample * 0.45);
  }
  
  // Processing chain for realistic wood sound
  let filtered = lowPassFilter(samples, 3500); // Wood doesn't have bright highs
  filtered = highPassFilter(filtered, 80); // Remove sub-bass rumble
  
  // Apply subtle distortion for grit
  filtered = filtered.map(s => {
    const drive = 1.3;
    return Math.tanh(s * drive) / Math.tanh(drive);
  });
  
  // Room reverb - sounds like it's in an old house
  filtered = addReverb(filtered, 0.08, 0.35);
  
  return filtered;
}

// 7. Heavy Breathing (realistic respiratory sounds)
function generateBreathing(duration = 5) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  const breathCycle = 2.5;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    const breathPhase = (t % breathCycle) / breathCycle;
    
    // Turbulent airflow noise
    let airflow = 0;
    for (let oct = 1; oct < 6; oct++) {
      airflow += (Math.random() * 2 - 1) / (oct * oct);
    }
    
    // Breath envelope (inhale sharp, exhale longer)
    let breathEnv;
    if (breathPhase < 0.35) {
      // Inhale (sharp)
      breathEnv = Math.pow(breathPhase / 0.35, 0.7);
    } else if (breathPhase < 0.4) {
      // Pause
      breathEnv = 1;
    } else if (breathPhase < 0.85) {
      // Exhale (gradual)
      breathEnv = Math.pow(1 - (breathPhase - 0.4) / 0.45, 1.2);
    } else {
      breathEnv = 0;
    }
    
    // Vocal tract resonance (throat sounds)
    const throat = Math.sin(t * 180 * Math.PI * 2 + Math.sin(t * 5) * 0.5) * 0.15;
    
    // Nasal resonance
    const nasal = Math.sin(t * 250 * Math.PI * 2) * 0.08;
    
    // Wetness (slight liquid sounds)
    const wet = Math.sin(t * 3000 * Math.PI * 2) * (Math.random() * 0.1) * breathEnv;
    
    // Overall fade
    const fade = Math.sin(t * Math.PI / duration);
    
    samples.push((airflow * 0.3 + throat + nasal + wet) * breathEnv * fade * 0.5);
  }
  
  // Filter to human vocal range
  let filtered = lowPassFilter(samples, 2500);
  filtered = highPassFilter(filtered, 120);
  filtered = addReverb(filtered, 0.04, 0.15);
  
  return filtered;
}

// 8. Static/Interference (radio-like disturbance)
function generateStatic(duration = 1.5) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // White noise base
    let noise = (Math.random() * 2 - 1);
    
    // Interference modulation (radio tuning effect)
    const interference = Math.sin(t * 60 * Math.PI * 2) * Math.sin(t * 173 * Math.PI * 2);
    const modulate = interference > 0.6 ? 2 : 1;
    
    // Random pops and clicks
    const pop = Math.random() > 0.996 ? (Math.random() * 4 - 2) : 0;
    
    // Burst patterns
    const burst = Math.sin(t * 7) > 0.8 ? 1.5 : 1;
    
    // Envelope with fade
    const envelope = Math.sin(t * Math.PI / duration);
    
    samples.push((noise * modulate + pop) * burst * envelope * 0.35);
  }
  
  return samples;
}

// 9. Distant Bell (ominous church bell)
function generateBell(duration = 4) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  const fundamentalFreq = 196; // G3
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Bell has inharmonic partials (not perfect multiples)
    const decay1 = Math.exp(-t * 1.2);
    const decay2 = Math.exp(-t * 2);
    const decay3 = Math.exp(-t * 3.5);
    const decay4 = Math.exp(-t * 5);
    
    // Fundamental and partials (bell-like ratios)
    let sample = Math.sin(t * fundamentalFreq * Math.PI * 2) * decay1 * 0.5;
    sample += Math.sin(t * fundamentalFreq * 2.41 * Math.PI * 2) * decay2 * 0.35;
    sample += Math.sin(t * fundamentalFreq * 3.89 * Math.PI * 2) * decay2 * 0.25;
    sample += Math.sin(t * fundamentalFreq * 5.98 * Math.PI * 2) * decay3 * 0.15;
    sample += Math.sin(t * fundamentalFreq * 8.72 * Math.PI * 2) * decay4 * 0.1;
    
    // Strike transient (hammer hit)
    if (t < 0.01) {
      sample += (Math.random() * 2 - 1) * Math.exp(-t * 200) * 0.4;
    }
    
    // Slow amplitude wobble (doppler from swing)
    const wobble = 1 + 0.03 * Math.sin(t * 1.5);
    
    samples.push(sample * wobble * 0.7);
  }
  
  // Long reverb for cathedral effect
  return addReverb(samples, 0.25, 0.6);
}

// 10. Growl (deep, menacing creature sound)
function generateGrowl(duration = 2) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Extremely low fundamental (subharmonic)
    const baseFreq = 45 + 25 * Math.sin(t * 3 + Math.sin(t * 7) * 2);
    
    // Rich harmonic content
    let growl = 0;
    for (let h = 1; h <= 8; h++) {
      const harmDecay = 1 / Math.pow(h, 0.8);
      growl += Math.sin(t * baseFreq * h * Math.PI * 2) * harmDecay;
    }
    
    // Harsh distortion for aggression
    growl = Math.tanh(growl * 4) * 0.4;
    
    // Guttural texture (throat friction)
    let texture = 0;
    for (let oct = 1; oct < 5; oct++) {
      texture += (Math.random() * 2 - 1) / oct;
    }
    texture *= 0.25 * Math.abs(Math.sin(t * 13));
    
    // Rumble modulation
    const rumble = 0.7 + 0.3 * Math.sin(t * 8);
    
    // Envelope with snarl
    const envelope = Math.sin(t * Math.PI / duration) * (0.8 + 0.2 * Math.abs(Math.sin(t * 17)));
    
    samples.push((growl + texture) * rumble * envelope);
  }
  
  // Filter and add darkness
  let filtered = lowPassFilter(samples, 800);
  filtered = addReverb(filtered, 0.08, 0.35);
  
  return filtered;
}

// 11. Buzz (error/denial sound - harsh electronic buzz like MSN nudge)
function generateBuzz(duration = 0.4) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    
    // Base buzz frequency (harsh and mechanical)
    const baseFreq = 120;
    
    // Square wave with harmonics for harsh buzzing
    let buzz = 0;
    for (let h = 1; h <= 12; h += 2) { // Odd harmonics only for square-ish wave
      buzz += Math.sin(t * baseFreq * h * Math.PI * 2) / h;
    }
    
    // Rapid tremolo for vibration effect (like phone buzz)
    const tremolo = 0.5 + 0.5 * Math.sign(Math.sin(t * 60 * Math.PI * 2));
    
    // Add high frequency edge for harshness
    const edge = Math.sin(t * 800 * Math.PI * 2) * 0.15;
    const edge2 = Math.sin(t * 1200 * Math.PI * 2) * 0.1;
    
    // Distortion for more aggression
    let signal = (buzz * tremolo + edge + edge2) * 0.6;
    signal = Math.tanh(signal * 3);
    
    // Quick attack, quick decay envelope
    const attack = Math.min(1, t * 50); // 20ms attack
    const decay = Math.max(0, 1 - (t - duration * 0.7) / (duration * 0.3)); // 30% decay
    const envelope = attack * (t < duration * 0.7 ? 1 : decay);
    
    samples.push(signal * envelope * 0.7);
  }
  
  // Slight low-pass to remove extreme harshness
  return lowPassFilter(samples, 3000);
}

// 12. Piano Sting (Resident Evil style - DISSONANT and unsettling)
function generatePianoSting(duration = 1.8) {
  const samples = [];
  const totalSamples = SAMPLE_RATE * duration;
  
  // Dissonant cluster - intentionally detuned and clashing notes
  // Minor 2nd intervals and tritones for maximum unease
  const notes = [
    { freq: 155.56, delay: 0, amp: 1.0 },      // Eb3 (slightly flat)
    { freq: 165.00, delay: 0.015, amp: 0.9 },  // E3 - minor 2nd clash!
    { freq: 233.08, delay: 0.03, amp: 0.8 },   // Bb3 (tritone from E)
    { freq: 277.18, delay: 0.05, amp: 0.7 },   // C#4 
    { freq: 293.66, delay: 0.07, amp: 0.6 },   // D4 - another minor 2nd
    { freq: 369.99, delay: 0.1, amp: 0.5 },    // F#4 (tritone from C)
  ];
  
  for (let i = 0; i < totalSamples; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;
    
    for (const note of notes) {
      const noteT = t - note.delay;
      if (noteT < 0) continue;
      
      // Detuned harmonics - each harmonic slightly off for "broken piano" feel
      let tone = 0;
      
      // Fundamental with slight pitch wobble (like old untuned piano)
      const wobble = 1 + 0.003 * Math.sin(noteT * 5 + note.freq * 0.01);
      tone += Math.sin(noteT * note.freq * wobble * Math.PI * 2) * 1.0;
      
      // 2nd harmonic - slightly sharp
      tone += Math.sin(noteT * note.freq * 2.01 * Math.PI * 2) * 0.6 * Math.exp(-noteT * 2);
      
      // 3rd harmonic - slightly flat (creates beating)
      tone += Math.sin(noteT * note.freq * 2.98 * Math.PI * 2) * 0.4 * Math.exp(-noteT * 3);
      
      // 4th harmonic - more detuned
      tone += Math.sin(noteT * note.freq * 4.03 * Math.PI * 2) * 0.25 * Math.exp(-noteT * 4);
      
      // Inharmonic "broken string" partial
      tone += Math.sin(noteT * note.freq * 5.67 * Math.PI * 2) * 0.15 * Math.exp(-noteT * 5);
      
      // Metallic resonance (like old dusty piano)
      tone += Math.sin(noteT * note.freq * 7.23 * Math.PI * 2) * 0.1 * Math.exp(-noteT * 6);
      
      // Harsh attack transient with some noise
      const attack = Math.exp(-noteT * 60) * 0.4;
      const attackNoise = (Math.random() * 2 - 1) * attack;
      
      // Add subtle string buzz/rattle
      const rattle = Math.sin(noteT * note.freq * 0.5 * Math.PI * 2) * 0.05 * Math.exp(-noteT * 8);
      
      // Slower decay for eerie lingering
      const envelope = Math.exp(-noteT * 1.8) * note.amp;
      
      sample += (tone * 0.25 + attackNoise + rattle) * envelope;
    }
    
    // Add room resonance that builds unease
    const roomTone = Math.sin(t * 55 * Math.PI * 2) * 0.03 * Math.exp(-t * 0.8);
    
    // Subtle low rumble
    const rumble = Math.sin(t * 30 * Math.PI * 2) * 0.02 * (1 - t / duration);
    
    samples.push((sample + roomTone + rumble) * 0.7);
  }
  
  // Heavy reverb for haunted mansion feel
  let processed = addReverb(samples, 0.15, 0.55);
  
  // Keep some low end for weight
  processed = highPassFilter(processed, 50);
  
  // Slight low-pass to make it sound old/distant
  processed = lowPassFilter(processed, 4000);
  
  return processed;
}

// ============================================
// GENERATE ALL SOUNDS
// ============================================

console.log('\n🎃 Generating enhanced horror sounds...\n');

saveWav('whisper.wav', generateWhisper(3));
saveWav('heartbeat.wav', generateHeartbeat(4));
saveWav('click.wav', generateClick(0.2));
saveWav('jumpscare.wav', generateJumpscare(1.2));
saveWav('ambient-drone.wav', generateAmbientDrone(8));
saveWav('creak.wav', generateCreak(2));
saveWav('breathing.wav', generateBreathing(5));
saveWav('static.wav', generateStatic(1.5));
saveWav('bell.wav', generateBell(4));
saveWav('growl.wav', generateGrowl(2));
saveWav('buzz.wav', generateBuzz(0.4));
saveWav('piano-sting.wav', generatePianoSting(1.5));

console.log('\n✅ All sounds generated in /public/sounds/\n');
console.log('Available sounds:');
console.log('  - whisper.wav       : Ghostly whisper with voice formants');
console.log('  - heartbeat.wav     : Realistic heartbeat with sub-bass');
console.log('  - click.wav         : Glass crack/break sound');
console.log('  - jumpscare.wav     : Dramatic impact with sub-bass punch');
console.log('  - ambient-drone.wav : Deep unsettling atmosphere');
console.log('  - creak.wav         : Realistic creaking door');
console.log('  - breathing.wav     : Heavy respiratory sounds');
console.log('  - static.wav        : Radio interference/disturbance');
console.log('  - bell.wav          : Ominous church bell');
console.log('  - growl.wav         : Deep menacing creature sound');
console.log('  - buzz.wav          : Error/denial buzz (vibration effect)');
console.log('  - piano-sting.wav   : Resident Evil style discovery/alert');
console.log('');
