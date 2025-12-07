# 🔊 Alert Sounds Guide

## Available Alert Sounds

EcoMonitor includes 4 distinct alert sounds, each designed for different notification preferences:

---

### 1. 🔔 Default Beep
**Character:** Classic, Simple, Clear

**Sound Pattern:**
```
Beep-Beep
(880 Hz, 150ms apart)
```

**Description:**
- Two identical beeps
- Clean sine wave
- Short duration (0.3 seconds total)
- Medium volume
- Easy to recognize

**Best For:**
- General alerts
- Non-urgent notifications
- Office environments
- When you want simple, clear alerts

**Technical Details:**
- Frequency: 880 Hz (A5 note)
- Waveform: Sine
- Duration: 150ms per beep
- Gap: 150ms between beeps

---

### 2. 🎵 Chime
**Character:** Pleasant, Musical, Gentle

**Sound Pattern:**
```
Do-Mi-Sol
(C-E-G major chord)
```

**Description:**
- Three ascending musical notes
- Harmonious major chord
- Smooth, pleasant sound
- Longer duration (0.9 seconds)
- Gentle volume

**Best For:**
- Positive notifications
- Non-critical alerts
- Home environments
- When you want pleasant, non-intrusive sounds

**Technical Details:**
- Notes: C5 (523 Hz), E5 (659 Hz), G5 (784 Hz)
- Waveform: Sine
- Duration: 600ms per note
- Gap: 150ms between notes
- Total: ~0.9 seconds

---

### 3. 🔔 Bell
**Character:** Resonant, Rich, Attention-Getting

**Sound Pattern:**
```
DONG~~~~~
(Single bell tone with harmonics)
```

**Description:**
- Single resonant bell tone
- Multiple harmonics for richness
- Long decay (1.5 seconds)
- Realistic bell sound
- Medium-high volume

**Best For:**
- Important notifications
- Threshold warnings
- When you want attention without urgency
- Professional environments

**Technical Details:**
- Fundamental: 800 Hz
- Harmonics: 1x, 2x, 3x, 4.2x, 5.4x
- Waveform: Sine (multiple oscillators)
- Duration: 1.5 seconds
- Envelope: Quick attack, long decay

---

### 4. 🚨 Siren (Urgent)
**Character:** Urgent, Alarming, Impossible to Ignore

**Sound Pattern:**
```
Wee-Woo-Wee-Woo-Wee-Woo
(3 cycles of alternating pitch)
```

**Description:**
- Alternating high-low pitch
- Three complete cycles
- Harsh, urgent sound
- Longest duration (1.5 seconds)
- Highest volume

**Best For:**
- Critical alerts
- Emergency situations
- Threshold violations
- When immediate attention is required

**Technical Details:**
- Frequency sweep: 600-900-600 Hz
- Waveform: Sawtooth (harsh)
- Cycles: 3 complete wee-woo patterns
- Duration: 450ms per cycle
- Total: ~1.5 seconds

---

## Sound Comparison Table

| Sound | Duration | Volume | Urgency | Pleasantness | Best Use Case |
|-------|----------|--------|---------|--------------|---------------|
| Default Beep | 0.3s | Medium | Low | Neutral | General alerts |
| Chime | 0.9s | Low-Med | Very Low | High | Positive notifications |
| Bell | 1.5s | Medium | Medium | Medium | Important warnings |
| Siren | 1.5s | High | Very High | Low | Critical emergencies |

---

## How to Change Alert Sound

### In Web Dashboard:
1. Click **⚙️ Settings** button
2. Scroll to **🔊 Alert Sound** section
3. Select your preferred sound from dropdown
4. Click **🔊 Test Sound** to preview
5. Click **💾 Save Settings**

### Sound Selection Tips:

**For Home Use:**
- 🎵 **Chime** - Pleasant, won't disturb others
- 🔔 **Bell** - Clear but not harsh

**For Office Use:**
- 🔔 **Default Beep** - Professional, simple
- 🔔 **Bell** - Attention-getting but appropriate

**For Critical Monitoring:**
- 🚨 **Siren** - Impossible to miss
- 🔔 **Bell** - Important but not alarming

**For Testing/Development:**
- 🔔 **Default Beep** - Quick, won't annoy you

---

## Technical Implementation

### Audio Context
All sounds use the Web Audio API for precise control:
```javascript
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
```

### Waveform Types
- **Sine:** Pure, smooth tone (Default, Chime, Bell)
- **Sawtooth:** Harsh, buzzy tone (Siren)
- **Triangle:** Softer than sawtooth (not currently used)
- **Square:** Very harsh (not currently used)

### Frequency Ranges
- **Low:** 400-600 Hz (Siren low)
- **Medium:** 600-900 Hz (Default, Siren high)
- **High:** 800-1000 Hz (Bell, Chime)

---

## Customization

Want to create your own alert sound? Edit `features.js`:

```javascript
const alertSounds = {
    // Add your custom sound
    custom: function(audioContext) {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();
        osc.connect(gain);
        gain.connect(audioContext.destination);
        
        // Your custom settings
        osc.frequency.value = 440;  // A4 note
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.3, audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        osc.start(audioContext.currentTime);
        osc.stop(audioContext.currentTime + 0.5);
    }
};
```

Then add to the dropdown in `index.html`:
```html
<option value="custom">My Custom Sound</option>
```

---

## Troubleshooting

### No Sound Playing
1. Check browser audio permissions
2. Unmute browser tab
3. Check system volume
4. Try different browser (Chrome/Edge recommended)
5. Click anywhere on page first (audio requires user interaction)

### Sound Too Quiet/Loud
Edit the `gain.gain.setValueAtTime()` values in `features.js`:
- Increase: `0.3` → `0.5` (louder)
- Decrease: `0.3` → `0.1` (quieter)

### Sound Not Distinct Enough
Each sound now has unique characteristics:
- Different frequencies
- Different waveforms
- Different durations
- Different patterns

If still not distinct, try:
1. Increase volume
2. Use headphones
3. Test in quiet environment

---

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | ✅ Full | Best support |
| Edge | ✅ Full | Chromium-based |
| Firefox | ✅ Full | Good support |
| Safari | ✅ Full | May require user interaction |
| Mobile Chrome | ✅ Full | Works well |
| Mobile Safari | ⚠️ Limited | Requires user interaction first |

---

## Performance

All sounds are generated in real-time using Web Audio API:
- **No audio files** - No loading time
- **Lightweight** - Pure JavaScript
- **Instant** - No latency
- **Customizable** - Easy to modify

---

## Accessibility

For users with hearing impairments:
- Visual alerts are always shown
- Heartbeat animations provide visual feedback
- Status colors indicate severity
- Popup notifications with text

For users sensitive to sound:
- Sounds can be disabled in settings
- Volume is moderate by default
- Chime option is gentle and pleasant

---

**Enjoy your customized alert sounds!** 🔊
