// JetpacishBeeperAudio.js - ZX Spectrum Beeper Chiptune & MIDI Player
class JetpacishTheme {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.noiseBuffer = null;
    this.isPlaying = false;
    this.baseVolume = 0.24;
    this.timer = null;

    // Playback state
    this.notes = [];
    this.loopDuration = 25.6; // 16 bars @ 150 BPM
    this.playbackStartTime = 0;
    this.scheduledUntil = 0;
    this.fadeTimeout = null;

    // Embedded default theme MIDI data (base64) so it plays instantly with 0ms latency
    this.defaultMidiBase64 = "TVRoZAAAAAYAAQADAeBNVHJrAAAAGAD/AwlUZW1wbyBNYXAA/1EDBhqAAP8vAE1UcmsAAAgeAP8DE1NwZWN0cnVtIEJlZXBlciBBcnAAwFAAkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQPH88gDx/AJA/fzyAP38AkEN/PIBDfwCQSH88gEh/AJA8fzyAPH8AkD9/PIA/fwCQQ388gEN/AJBIfzyASH8AkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQPH88gDx/AJA/fzyAP38AkEN/PIBDfwCQSH88gEh/AJA8fzyAPH8AkD9/PIA/fwCQQ388gEN/AJBIfzyASH8AkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQPH88gDx/AJA/fzyAP38AkEN/PIBDfwCQSH88gEh/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDp/PIA6fwCQPn88gD5/AJBBfzyAQX8AkEZ/PIBGfwCQOn88gDp/AJA+fzyAPn8AkEF/PIBBfwCQRn88gEZ/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDp/PIA6fwCQPn88gD5/AJBBfzyAQX8AkEZ/PIBGfwCQOn88gDp/AJA+fzyAPn8AkEF/PIBBfwCQRn88gEZ/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDp/PIA6fwCQPn88gD5/AJBBfzyAQX8AkEZ/PIBGfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA4fzyAOH8AkDx/PIA8fwCQP388gD9/AJBEfzyARH8AkDh/PIA4fwCQPH88gDx/AJA/fzyAP38AkER/PIBEfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA4fzyAOH8AkDx/PIA8fwCQP388gD9/AJBEfzyARH8AkDh/PIA4fwCQPH88gDx/AJA/fzyAP38AkER/PIBEfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA4fzyAOH8AkDx/PIA8fwCQP388gD9/AJBEfzyARH8AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwCQN388gDd/AJA7fzyAO38AkD5/PIA+fwCQQ388gEN/AJA3fzyAN38AkDt/PIA7fwCQPn88gD5/AJBDfzyAQ38AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwCQN388gDd/AJA7fzyAO38AkD5/PIA+fwCQQ388gEN/AJA3fzyAN38AkDt/PIA7fwCQPn88gD5/AJBDfzyAQ38AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwCQN388gDd/AJA7fzyAO38AkD5/PIA+fwCQQ388gEN/AJA8fzyAPH8AkD9/PIA/fwCQQ388gEN/AJBIfzyASH8AkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQPH88gDx/AJA/fzyAP38AkEN/PIBDfwCQSH88gEh/AJA8fzyAPH8AkD9/PIA/fwCQQ388gEN/AJBIfzyASH8AkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQPH88gDx/AJA/fzyAP38AkEN/PIBDfwCQSH88gEh/AJA8fzyAPH8AkD9/PIA/fwCQQ388gEN/AJBIfzyASH8AkDx/PIA8fwCQP388gD9/AJBDfzyAQ38AkEh/PIBIfwCQOn88gDp/AJA+fzyAPn8AkEF/PIBBfwCQRn88gEZ/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDp/PIA6fwCQPn88gD5/AJBBfzyAQX8AkEZ/PIBGfwCQOn88gDp/AJA+fzyAPn8AkEF/PIBBfwCQRn88gEZ/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDp/PIA6fwCQPn88gD5/AJBBfzyAQX8AkEZ/PIBGfwCQOn88gDp/AJA+fzyAPn8AkEF/PIBBfwCQRn88gEZ/AJA6fzyAOn8AkD5/PIA+fwCQQX88gEF/AJBGfzyARn8AkDh/PIA4fwCQPH88gDx/AJA/fzyAP38AkER/PIBEfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA4fzyAOH8AkDx/PIA8fwCQP388gD9/AJBEfzyARH8AkDh/PIA4fwCQPH88gDx/AJA/fzyAP38AkER/PIBEfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA4fzyAOH8AkDx/PIA8fwCQP388gD9/AJBEfzyARH8AkDh/PIA4fwCQPH88gDx/AJA/fzyAP38AkER/PIBEfwCQOH88gDh/AJA8fzyAPH8AkD9/PIA/fwCQRH88gER/AJA3fzyAN38AkDt/PIA7fwCQPn88gD5/AJBDfzyAQ38AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwCQN388gDd/AJA7fzyAO38AkD5/PIA+fwCQQ388gEN/AJA3fzyAN38AkDt/PIA7fwCQPn88gD5/AJBDfzyAQ38AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwCQN388gDd/AJA7fzyAO38AkD5/PIA+fwCQQ388gEN/AJA3fzyAN38AkDt/PIA7fwCQPn88gD5/AJBDfzyAQ38AkDd/PIA3fwCQO388gDt/AJA+fzyAPn8AkEN/PIBDfwD/LwBNVHJrAAAEVwD/AwxCZWVwZXIgRHJ1bXMAwVAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAACRMH8egTB/AJEkf4NCgSR/AJFgfx6BYH+DQpEAAACBAAAAkVR/PIFUfwCRT3+DJIFPfwCRYH8egWB/g0KRAAAAgQAAAJEwfx6BMH8AkSR/g0KBJH8AkWB/HoFgf4NCkQAAAIEAAACRVH88gVR/AJFPf4MkgU9/AJFgfx6BYH+DQpEAAACBAAAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAACRMH8egTB/AJEkf4NCgSR/AJFgfx6BYH+DQpEAAACBAAAAkVR/PIFUfwCRT3+DJIFPfwCRYH8egWB/g0KRAAAAgQAAAJEwfx6BMH8AkSR/g0KBJH8AkWB/HoFgf4NCkQAAAIEAAACRVH88gVR/AJFPf4MkgU9/AJFgfx6BYH+DQpEAAACBAAAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAACRMH8egTB/AJEkf4NCgSR/AJFgfx6BYH+DQpEAAACBAAAAkVR/PIFUfwCRT3+DJIFPfwCRYH8egWB/g0KRAAAAgQAAAJEwfx6BMH8AkSR/g0KBJH8AkWB/HoFgf4NCkQAAAIEAAACRVH88gVR/AJFPf4MkgU9/AJFgfx6BYH+DQpEAAACBAAAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAACRMH8egTB/AJEkf4NCgSR/AJFgfx6BYH+DQpEAAACBAAAAkVR/PIFUfwCRT3+DJIFPfwCRYH8egWB/g0KRAAAAgQAAAJEwfx6BMH8AkSR/g0KBJH8AkWB/HoFgf4NCkQAAAIEAAACRVH88gVR/AJFPf4MkgU9/AJFgfx6BYH+DQpEAAACBAAAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAACRMH8egTB/AJEkf4NCgSR/AJFgfx6BYH+DQpEAAACBAAAAkVR/PIFUfwCRT3+DJIFPfwCRYH8egWB/g0KRAAAAgQAAAJEwfx6BMH8AkSR/g0KBJH8AkWB/HoFgf4NCkQAAAIEAAACRVH88gVR/AJFPf4MkgU9/AJFgfx6BYH+DQpEAAACBAAAAkTB/HoEwfwCRJH+DQoEkfwCRYH8egWB/g0KRAAAAgQAAAJFUfzyBVH8AkU9/gySBT38AkWB/HoFgf4NCkQAAAIEAAAD/LwA=";

    this.loadFromBase64(this.defaultMidiBase64);
    console.log(`[JetpacishAudio] Initialized. Ready with ${this.notes.length} MIDI notes (${this.loopDuration}s loop).`);
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.baseVolume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
        this.generateNoiseBuffer();
        console.log(`[JetpacishAudio] AudioContext created. State: "${this.ctx.state}"`);
      } else {
        console.warn('[JetpacishAudio] Web Audio API is not supported in this browser.');
      }
    }
  }

  generateNoiseBuffer() {
    if (!this.ctx) return;
    const bufferSize = this.ctx.sampleRate * 1.0;
    this.noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // Pure 1-bit white noise
    }
  }

  midiNoteToFreq(note) {
    return 440 * Math.pow(2, (note - 69) / 12);
  }

  playTone(freq, startTime, duration, type = "square", volume = 0.14) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    // Spectrum 1-bit instant envelope
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.setValueAtTime(volume, startTime + Math.max(0.005, duration - 0.005));
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playKick(startTime, duration = 0.04) {
    if (!this.ctx || !this.masterGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(140, startTime);
    osc.frequency.exponentialRampToValueAtTime(35, startTime + duration);

    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(startTime);
    osc.stop(startTime + duration);
  }

  playNoise(startTime, duration = 0.04, volume = 0.1) {
    if (!this.ctx || !this.masterGain || !this.noiseBuffer) return;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(volume, startTime);
    gain.gain.linearRampToValueAtTime(0, startTime + duration);

    noise.connect(gain);
    gain.connect(this.masterGain);

    noise.start(startTime);
    noise.stop(startTime + duration);
  }

  playSnare(startTime) {
    this.playNoise(startTime, 0.045, 0.12);
    this.playTone(220, startTime, 0.015, "square", 0.08);
  }

  playHiHat(startTime) {
    this.playNoise(startTime, 0.02, 0.06);
  }

  // Parse Standard MIDI File (SMF)
  parseMidi(arrayBuffer) {
    const data = new Uint8Array(arrayBuffer);
    let pos = 0;
    const readString = len => {
      let s = "";
      for (let i = 0; i < len; i++) s += String.fromCharCode(data[pos++]);
      return s;
    };
    const readUInt32 = () => {
      const v = (data[pos] << 24) | (data[pos + 1] << 16) | (data[pos + 2] << 8) | data[pos + 3];
      pos += 4;
      return v >>> 0;
    };
    const readUInt16 = () => {
      const v = (data[pos] << 8) | data[pos + 1];
      pos += 2;
      return v;
    };
    const readVarLen = () => {
      let v = 0;
      while (true) {
        const b = data[pos++];
        v = (v << 7) | (b & 0x7F);
        if (!(b & 0x80)) break;
      }
      return v;
    };

    if (readString(4) !== "MThd") return null;
    const headerLen = readUInt32();
    const format = readUInt16();
    const numTracks = readUInt16();
    const timeDivision = readUInt16();

    if (headerLen > 6) pos += (headerLen - 6);

    let tempo = 500000;
    const rawEvents = [];

    for (let t = 0; t < numTracks; t++) {
      if (pos >= data.length) break;
      const trackHeader = readString(4);
      if (trackHeader !== "MTrk") break;
      const trackLen = readUInt32();
      const endPos = pos + trackLen;
      let currentTick = 0;
      let runningStatus = 0;
      const activeNotes = new Map();

      while (pos < endPos && pos < data.length) {
        const delta = readVarLen();
        currentTick += delta;
        let status = data[pos];
        if (status >= 0x80) {
          runningStatus = status;
          pos++;
        } else {
          status = runningStatus;
        }

        if (status === 0xFF) {
          const metaType = data[pos++];
          const metaLen = readVarLen();
          const metaBytes = data.subarray(pos, pos + metaLen);
          pos += metaLen;
          if (metaType === 0x51 && metaLen === 3) {
            tempo = (metaBytes[0] << 16) | (metaBytes[1] << 8) | metaBytes[2];
          }
        } else if (status === 0xF0 || status === 0xF7) {
          pos += readVarLen();
        } else {
          const cmd = status >> 4;
          const ch = status & 0x0F;
          if (cmd === 0x9 || cmd === 0x8) {
            const note = data[pos++];
            const vel = data[pos++];
            const isNoteOn = cmd === 0x9 && vel > 0;
            if (isNoteOn) {
              if (activeNotes.has(note)) {
                const prev = activeNotes.get(note);
                rawEvents.push({ track: t, ch, note, startTick: prev.startTick, durationTicks: currentTick - prev.startTick, vel: prev.vel });
              }
              activeNotes.set(note, { startTick: currentTick, vel, ch });
            } else {
              if (activeNotes.has(note)) {
                const prev = activeNotes.get(note);
                rawEvents.push({ track: t, ch, note, startTick: prev.startTick, durationTicks: Math.max(1, currentTick - prev.startTick), vel: prev.vel });
                activeNotes.delete(note);
              }
            }
          } else if (cmd === 0xC || cmd === 0xD) {
            pos++;
          } else {
            pos += 2;
          }
        }
      }
    }

    const secondsPerTick = (tempo / 1000000) / timeDivision;
    const parsedNotes = rawEvents.map(e => ({
      track: e.track,
      ch: e.ch,
      note: e.note,
      time: e.startTick * secondsPerTick,
      duration: Math.min(0.06, e.durationTicks * secondsPerTick),
      vel: e.vel / 127
    })).sort((a, b) => a.time - b.time);

    let maxDuration = 0;
    for (const n of parsedNotes) {
      if (n.time + n.duration > maxDuration) maxDuration = n.time + n.duration;
    }

    const beatDuration = tempo / 1000000;
    const totalBeats = Math.ceil(maxDuration / beatDuration);
    const loopDuration = Math.max(1, totalBeats * beatDuration);

    return {
      tempo,
      bpm: Math.round(60000000 / tempo),
      loopDuration,
      notes: parsedNotes
    };
  }

  loadFromBase64(base64Str) {
    try {
      let binaryStr = "";
      if (typeof window !== "undefined" && window.atob) {
        binaryStr = window.atob(base64Str);
      } else if (typeof Buffer !== "undefined") {
        binaryStr = Buffer.from(base64Str, "base64").toString("binary");
      }
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      const parsed = this.parseMidi(bytes.buffer);
      if (parsed && parsed.notes.length > 0) {
        this.notes = parsed.notes;
        this.loopDuration = parsed.loopDuration;
      }
    } catch (e) {
      console.warn("Error parsing base64 MIDI:", e);
    }
  }

  async loadMidiUrl(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) return;
      const buffer = await resp.arrayBuffer();
      const parsed = this.parseMidi(buffer);
      if (parsed && parsed.notes.length > 0) {
        this.notes = parsed.notes;
        this.loopDuration = parsed.loopDuration;
      }
    } catch (e) {
      console.warn("Could not load external MIDI url:", e);
    }
  }

  scheduleNotes(fromTime, toTime) {
    if (!this.notes || this.notes.length === 0) return;
    const loopLen = this.loopDuration || 25.6;

    for (const noteEvent of this.notes) {
      let occurrenceTime = this.playbackStartTime + noteEvent.time;
      while (occurrenceTime < fromTime - 0.05) {
        occurrenceTime += loopLen;
      }
      while (occurrenceTime >= fromTime && occurrenceTime < toTime) {
        this.dispatchNote(noteEvent, occurrenceTime);
        occurrenceTime += loopLen;
      }
    }
  }

  dispatchNote(event, time) {
    if (event.track === 2 || event.ch === 1 || event.note < 50 || event.note > 80) {
      if (event.note === 48 || event.note === 36) {
        this.playKick(time, 0.04);
      } else if (event.note === 84 || event.note === 79) {
        this.playSnare(time);
      } else if (event.note === 96) {
        this.playHiHat(time);
      } else {
        this.playTone(this.midiNoteToFreq(event.note), time, event.duration, "square", 0.12);
      }
    } else {
      const freq = this.midiNoteToFreq(event.note);
      this.playTone(freq, time, event.duration, "square", 0.14);
    }
  }

  start(fadeInDuration = 0.3) {
    this.init();
    if (!this.ctx) return;

    if (this.fadeTimeout) {
      clearTimeout(this.fadeTimeout);
      this.fadeTimeout = null;
    }

    if (this.ctx.state === "suspended") {
      console.log('%c[JetpacishAudio] ⏸ AudioContext suspended (browser autoplay policy). Waiting for user interaction to resume.', 'color: #ffaa00; font-weight: bold;');
      this.ctx.resume().then(() => {
        console.log('%c[JetpacishAudio] ▶ AudioContext resumed successfully!', 'color: #00ff88; font-weight: bold;');
      }).catch(e => console.warn('[JetpacishAudio] Resume failed:', e));
    }

    if (this.isPlaying) return;
    this.isPlaying = true;

    const now = this.ctx.currentTime;
    this.playbackStartTime = now + 0.05;
    this.scheduledUntil = now + 0.05;

    console.log(`%c[JetpacishAudio] ▶ Starting MIDI theme loop (${this.loopDuration}s, ${this.notes.length} notes, baseVolume: ${this.baseVolume})`, 'color: #00ffff; font-weight: bold;');

    // Smooth volume fade-in
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(0, now);
    this.masterGain.gain.linearRampToValueAtTime(this.baseVolume, now + fadeInDuration);

    // Lookahead scheduler
    this.timer = setInterval(() => {
      if (!this.isPlaying || !this.ctx) return;
      const lookahead = 0.25;
      const currentAudioTime = this.ctx.currentTime;
      if (this.scheduledUntil < currentAudioTime + lookahead) {
        this.scheduleNotes(this.scheduledUntil, currentAudioTime + lookahead);
        this.scheduledUntil = currentAudioTime + lookahead;
      }
    }, 80);
  }

  fadeOut(duration = 1.0) {
    console.log(`%c[JetpacishAudio] 🔉 Fading out theme music over ${duration}s...`, 'color: #ff88ff; font-weight: bold;');
    if (!this.isPlaying || !this.ctx || !this.masterGain) {
      this.stop();
      return;
    }

    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0.0001, now + duration);

    if (this.fadeTimeout) clearTimeout(this.fadeTimeout);
    this.fadeTimeout = setTimeout(() => {
      this.stop();
      this.fadeTimeout = null;
    }, duration * 1000);
  }

  stop() {
    console.log('%c[JetpacishAudio] ⏹ Theme music stopped.', 'color: #888888;');
    this.isPlaying = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(0, now);
    }
  }
}

// Global instance & export
const jetpacishAudio = new JetpacishTheme();
if (typeof window !== "undefined") {
  window.JetpacishTheme = JetpacishTheme;
  window.jetpacishAudio = jetpacishAudio;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { JetpacishTheme, jetpacishAudio };
}
