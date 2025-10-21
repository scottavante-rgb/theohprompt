# OhPrompt! Design System

> Teenage Engineering meets modernist minimalism

## 🎨 Core Visual Language

### Brand Identity
**Philosophy**: Precision, craft, and intentional playfulness. The interface feels like a beautiful mechanical instrument, not a website.

**Signature Element**: **Loop Arc (⟳)** - A minimal semicircular arc that rotates during prompt transformation. Replaces sparkles/stars for a more mechanical, precise feel.

### Color Palette

```
Soft Cream:    #FAF8F3  (background)
Orange:        #FF6E00  (primary accent)
Graphite:      #333333  (headings, primary text)
Charcoal Grey: #4B4B4B  (tagline)
Mid Grey:      #777777  (footer, metadata)
Light Grey:    #999999  (placeholders)
```

### Typography

**Font**: JetBrains Mono (all weights: 400, 500, 600, 700)

**Hierarchy**:
- Logo: 6xl-7xl, bold, tracking-tight
- Tagline: base, letter-spacing +0.08em
- Body: 15px, line-height 1.6
- Labels: 11px, uppercase, tracking-wider
- Buttons: 13px, medium weight

## 🧩 Component System

### Loop Arc
- **Idle**: 60% opacity, static
- **Active**: 100% opacity, rotates 180° in 400ms
- **Hover**: Faint glow effect
- **Symbol**: ⟳ (used throughout UI for consistency)

### Mode Selector Pills
- **Active**: Orange fill (#FF6E00), white text, scale(1.05), shadow
- **Inactive**: White/60 bg, graphite text, subtle border
- **Hover**: Orange/10 tint, orange/20 border
- **Transition**: 200ms smooth scale

### Mechanical Button
- **Idle**: Cream bg, orange text, 2-3px shadow
- **Hover**: Gradient sweep, shadow +1px
- **Press**: translateY(2px), shadow retract
- **Processing**: Thin orange pulse line slides across

### Input Field
- **Dimensions**: 10px rounded corners, min-height 140px
- **Border**: 1px rgba(0,0,0,0.05)
- **Focus**: 2px orange ring at 40% opacity, border orange
- **Placeholder**: Swaps to example text on focus
- **Shadow**: 0 1px 3px rgba(0,0,0,0.08)

### Output Card
- **Background**: White
- **Shadow**: 0 2px 6px rgba(0,0,0,0.06)
- **Border**: None (clean edge)
- **Inner box**: Cream bg, 4px rounded, minimal border
- **Header**: 11px uppercase, 60% opacity, ⟳ prefix

### Action Buttons
- **Size**: Small, 12px text
- **Border**: rgba(0,0,0,0.1)
- **Hover**: Border → orange/30
- **Shadow**: 0 1px 2px subtle
- **Icons**: 3x3 grid, 1.5 spacing

## ⚡ Motion Language

### Timing Functions
- Fast actions: 150ms ease-out
- Mode change: 200ms smooth
- Button rotation: 400ms ease-in-out
- Page load: 600ms ease-out
- Output reveal: 400ms fade + slide

### Key Animations

**fade-scale-in**
```
from: opacity 0, scale(0.98)
to: opacity 1, scale(1)
duration: 600ms
```

**loop-pulse** (footer)
```
0%/100%: opacity 0.4
50%: opacity 1
duration: 10s
easing: ease-in-out
repeat: infinite
```

**processing-pulse**
```
Orange gradient line slides left-to-right
duration: 1.5s
repeat: infinite while loading
```

**pill-chip-select**
```
Scale: 1 → 1.05
Shadow: fade in
duration: 200ms
```

## 🪄 Micro-Interactions

| Event | Animation | Duration |
|-------|-----------|----------|
| Page load | Logo fade + scale | 600ms |
| Loop Arc on generate | Rotate 180° | 400ms |
| Mode select | Chip scale + glow | 200ms |
| Button hover | Depth shift | 150ms |
| Button press | translateY(2px) | 150ms |
| Output render | Fade + slide up | 400ms |
| Copy success | Toast notification | instant |
| Footer hover | Text swap easter egg | instant |

## 📐 Layout System

**Max Width**: 640px centered column
**Spacing**: Generous breathing room (mb-8, mb-12, mt-16)
**Padding**: 6 units (p-6) on mobile
**Shadow Philosophy**: Minimal depth (1-3px blur) for physicality

## 🧠 Design Principles

1. **Mechanical Precision**: Every animation has purpose, no decoration
2. **Tactile Feedback**: Buttons feel pressable, inputs feel focused
3. **Quiet Intelligence**: Smart without being flashy
4. **Intentional Humor**: Easter eggs and copy, never visual gimmicks
5. **Instrument First**: Feels like using a tool, not browsing a site

## 🎯 Brand Voice

**UI Copy Examples**:
- "Lazy prompt? Let's fix that." (confident, slightly cheeky)
- "Make it Smart" (direct, active)
- "Nothing to save yet" (honest, conversational)
- "(mostly humans, tbh)" (self-aware humor)

**Tone**: Clever but confident, humor feels intentional not whimsical.

## 🔮 Future Considerations

- Tone selector (Professional / Playful / Academic)
- "Remix Prompt" with shaking loop animation
- Sound design (soft mechanical clicks)
- Dark / Nocturne color themes
- Saved prompt library with mode filters

---

Made with ⟳ by humans and AI.
