# Rive Buttons Library

A collection of interactive, production-ready vector UI buttons authored in **RML (Rive Markup Language)** and configured for the **Rive CLI (v1.3.0)**.

---

## Library Components

### 1. `magnetic-pill`
* **Artboard**: `260 × 80`
* **Concept**: Apple-grade action pill with subtle scale physics and glow border.
* **States**:
  * `Rest`: Flat matte dark plate (`#1D1D1F`), muted border.
  * `Hover`: Scales up to `1.04x`, border glows Apple Blue (`#0071E3`).
  * `Down`: Tactile squash & stretch (`scaleX: 1.08`, `scaleY: 0.92`, `y: +2px`), active glow (`#5AC8FA`).
* **View Model Properties**:
  * `hover` (Boolean)
  * `down` (Boolean)
  * `cursor` (String: `"pointer"` / `"arrow"`)

### 2. `tactile-switch`
* **Artboard**: `160 × 100`
* **Concept**: iOS/macOS spring-loaded toggle switch with smooth state transitions.
* **States**:
  * `Switch Off`: Track dark gray (`#3A3A3C`), knob at `x = -20`.
  * `Switch On`: Track active blue (`#0071E3`), knob at `x = +20`.
* **Interaction**: Interactive click toggles `isOn` with `DataConverterBooleanNegate`.
* **View Model Properties**:
  * `isOn` (Boolean)
  * `cursor` (String: `"pointer"` / `"arrow"`)

### 3. `chibi-avatar-btn`
* **Artboard**: `160 × 160`
* **Concept**: Satya's signature chibi character avatar as a living interactive button.
* **States**:
  * `Rest`: Subtle breathing scale (`1.0x`), neutral posture.
  * `Hover`: Eyes open wide (`scaleY: 1.25`), outer ring glows blue (`#0071E3`).
  * `Down`: Squashes down (`scaleX: 1.12`, `scaleY: 0.88`), happy squinting eyes (`scaleY: 0.25`), emerald ring (`#30D158`).
* **View Model Properties**:
  * `hover` (Boolean)
  * `down` (Boolean)
  * `cursor` (String: `"pointer"` / `"arrow"`)

### 4. `laser-burst-btn`
* **Artboard**: `180 × 180`
* **Concept**: Inspired by the portfolio's laser cannon launcher.
* **States**:
  * `Rest`: Glowing cyan/blue core with metallic armor ring.
  * `Hover`: Emitter ring and core expand (`1.08x`), glowing bright cyan (`#5AC8FA`).
  * `Down`: Cannon recoils backward (`0.92x`) while the core flashes blinding white (`#FFFFFF`).
* **View Model Properties**:
  * `hover` (Boolean)
  * `down` (Boolean)
  * `cursor` (String: `"pointer"` / `"arrow"`)

---

## CLI Commands

To verify any component:
```bash
rive ./magnetic-pill --verify
rive ./tactile-switch --verify
rive ./chibi-avatar-btn --verify
rive ./laser-burst-btn --verify
```

To open a live preview window:
```bash
rive ./magnetic-pill
```

To push to your Rive Cloud account:
```bash
rive push ./magnetic-pill
```
