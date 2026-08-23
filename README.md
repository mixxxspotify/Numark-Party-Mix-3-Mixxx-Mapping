# Numark Party Mix III – Opinionated Mixxx Mapping

An enhanced and highly opinionated [Mixxx](https://mixxx.org/) mapping for the **Numark Party Mix III / Party Mix MK3**.

The goal of this mapping is **not** to reproduce the controller's original Serato/djay behavior as closely as possible.

Instead, it turns the inexpensive Party Mix III into a surprisingly capable controller for:

- Two-deck DJing
- Pop/rock and party music
- Mixxx stems
- AutoDJ-assisted parties
- Loops and hot cues
- Samples
- Quick FX access

The mapping deliberately repurposes several controls where I found the original behavior less useful.

---

## Design philosophy

The Party Mix III has relatively few physical controls, so this mapping treats every button as valuable real estate.

The main principles are:

- **Hot Cue and Loop are the primary pad modes**
- Rarely used modes should not get in the way
- Hardware Shift combinations should expose additional functionality
- Mixxx stems should be usable directly from the controller
- AutoDJ should be genuinely useful during unattended/semi-attended party playback
- Controller LEDs should reflect the actual Mixxx state wherever possible
- Common actions should require as few button presses as possible

As a result, this mapping is intentionally different from the stock Numark behavior.

---

# Pad Modes

The eight performance pads support four modes:

- Hot Cue
- Loop
- Sampler
- Stems

However, **MODE does not cycle through all four modes**.

## MODE button

Normal MODE presses toggle only between the two most frequently used modes:

```text
HOT CUE → LOOP → HOT CUE → LOOP → ...
```

This avoids having to cycle through Sampler and Stems every time you want to switch between Hot Cues and Loops.

The less frequently used modes have dedicated shortcuts:

```text
MODE + ACAPELLA       → Sampler mode
MODE + INSTRUMENTAL   → Stems mode
```

After entering Sampler or Stems mode:

```text
MODE → Hot Cue mode
```

This makes **Hot Cue the "home" pad mode**.

---

# Hardware Shift Layer

An interesting feature of the Party Mix III is that MODE also acts as a hardware Shift modifier.

The controller itself generates different MIDI notes for shifted pads:

```text
Normal pads:       0x14 – 0x1B
MODE + pads:       0x1C – 0x23
```

This mapping uses the controller's native shifted MIDI layer rather than implementing timing-based or simulated Shift behavior in JavaScript.

This makes shifted actions deterministic and reliable.

---

# Hot Cue Mode

The first four pads provide the normal Hot Cue functions:

| Pad | Function |
|---|---|
| 1 | Hot Cue 1 |
| 2 | Hot Cue 2 |
| 3 | Hot Cue 3 |
| 4 | Hot Cue 4 |
| 5 | Intro Start |
| 6 | Intro End |
| 7 | Outro Start |
| 8 | Outro End |

The second row is deliberately repurposed for Mixxx track markers.

This is particularly useful when preparing tracks for AutoDJ and structured transitions.

## Delete Hot Cues

Holding MODE exposes the shifted pad layer:

| Combination | Function |
|---|---|
| MODE + Pad 1 | Delete Hot Cue 1 |
| MODE + Pad 2 | Delete Hot Cue 2 |
| MODE + Pad 3 | Delete Hot Cue 3 |
| MODE + Pad 4 | Delete Hot Cue 4 |

This provides a quick way to delete cue points directly from the controller without using the mouse.

---

# Loop Mode

Loop mode is designed around quick loop manipulation:

| Pad | Function |
|---|---|
| 1 | Halve current loop size |
| 2 | Double current loop size |
| 3 | Activate current-size loop / exit loop |
| 4 | Reloop |
| 5 | 1-beat loop |
| 6 | 2-beat loop |
| 7 | 4-beat loop |
| 8 | Toggle FX Unit 1 for this deck |

Pad 8 was deliberately changed from an 8-beat loop to an **FX1 routing toggle**, because direct FX access is more useful in this workflow.

---

# Stems

The Party Mix III's **Acapella** and **Instrumental** controls are integrated with Mixxx stems.

The mapping is designed around Mixxx's four-stem model:

- Vocals
- Bass
- Drums
- Other

The Acapella/Instrumental controls are used to provide quick musical manipulation of the stems directly from the controller.

Their LEDs also provide feedback for the current state.

Stems mode itself is entered with:

```text
MODE + INSTRUMENTAL
```

To leave Stems mode and return to the normal workflow:

```text
MODE → Hot Cue
```

---

# Sampler Mode

Sampler mode is entered with:

```text
MODE + ACAPELLA
```

All eight physical pads are used for samples rather than only the first four.

The sampler banks are distributed between the two decks:

```text
Deck 1 pads → Samplers 1–8
Deck 2 pads → Samplers 9–16
```

This provides direct access to all **16 Mixxx samplers** from the Party Mix III.

To leave Sampler mode:

```text
MODE → Hot Cue
```

---

# Fade FX Becomes AutoDJ

The physical **FADE FX** button is repurposed as an **AutoDJ toggle**.

```text
FADE FX → AutoDJ ON/OFF
```

Its LED follows the actual Mixxx AutoDJ state.

For example:

```text
Press FADE FX
    ↓
AutoDJ ON
    ↓
FADE FX LED ON
```

Press it again:

```text
AutoDJ OFF
    ↓
FADE FX LED OFF
```

Importantly, this feedback is **two-way**.

If AutoDJ is enabled or disabled from the Mixxx UI, the physical FADE FX LED is updated accordingly.

The LED therefore represents the **actual AutoDJ state**, not merely the last controller button press.

---

# LOAD Buttons Become AutoDJ Queue Controls

Normally the two LOAD buttons behave as expected:

```text
LOAD 1 → Load selected track into Deck 1
LOAD 2 → Load selected track into Deck 2
```

This remains the behavior while AutoDJ is disabled.

When AutoDJ is enabled, however, the buttons automatically change function:

```text
AutoDJ OFF

LOAD 1 → Load selected track into Deck 1
LOAD 2 → Load selected track into Deck 2
```

```text
AutoDJ ON

LOAD 1 → Add selected track to TOP of AutoDJ queue
LOAD 2 → Add selected track to BOTTOM of AutoDJ queue
```

In practice this makes the buttons behave roughly as:

```text
LOAD 1 = "Play this soon"
LOAD 2 = "Add this for later"
```

This is particularly useful during a party.

AutoDJ can continue playing while you browse the normal Mixxx track library. When you find something you want to hear, simply press LOAD 1 or LOAD 2 without having to switch to the AutoDJ view.

## AutoDJ Confirmation Blink

When browsing the normal Tracks view, you may not be able to see whether a track was actually added to the AutoDJ queue.

The mapping therefore provides physical confirmation.

After adding a track to AutoDJ, the **FADE FX / AutoDJ LED briefly blinks** and then returns to displaying the actual AutoDJ state.

This provides immediate visual confirmation that the command was executed.

---

# LED Feedback

LED feedback is treated as an important part of this mapping.

The Party Mix III supports two useful illumination levels:

```text
DIM     → available / inactive
BRIGHT  → active
```

rather than simply ON/OFF.

Where practical, the mapping uses the dim state as background illumination and the bright state to represent an active function.

Examples include:

- AutoDJ state
- Acapella/Instrumental state
- Pad functions
- FX routing
- Selected pad mode

This makes the controller considerably easier to operate in a dark room.

---

# Why This Mapping Is "Opinionated"

Several decisions in this mapping will not suit every DJ.

In particular:

- MODE only toggles **Hot Cue ↔ Loop**
- Sampler is accessed with **MODE + ACAPELLA**
- Stems are accessed with **MODE + INSTRUMENTAL**
- MODE from Sampler/Stems returns directly to Hot Cue
- FADE FX controls AutoDJ
- LOAD buttons become AutoDJ queue controls while AutoDJ is running
- Loop Pad 8 controls FX1 instead of an 8-beat loop
- Hot Cue Pads 5–8 control Intro/Outro markers
- All eight pads per deck are used for samplers
- Acapella/Instrumental controls are integrated with Mixxx stems
- Shifted pad MIDI messages are used for additional functionality

These choices are optimized for a workflow where **fast access to Hot Cues, Loops, stems and AutoDJ is more useful than faithfully reproducing the controller's factory mapping**.

If your workflow is similar, you may find the Party Mix III substantially more capable with this mapping than its limited control surface initially suggests.

---

# Quick Reference

## Mode Selection

| Control | Function |
|---|---|
| MODE | Toggle Hot Cue ↔ Loop |
| MODE + ACAPELLA | Sampler mode |
| MODE + INSTRUMENTAL | Stems mode |
| MODE while in Sampler/Stems | Return to Hot Cue |

## AutoDJ

| Control | AutoDJ OFF | AutoDJ ON |
|---|---|---|
| FADE FX | Enable AutoDJ | Disable AutoDJ |
| LOAD 1 | Load Deck 1 | Add to AutoDJ TOP |
| LOAD 2 | Load Deck 2 | Add to AutoDJ BOTTOM |

---

# Installation

Copy both mapping files into your Mixxx controller directory.

The mapping consists of:

```text
Numark-Party-Mix3.midi.xml
Numark-Party-Mix3.scripts.js
```

On macOS, the Mixxx controller mappings directory is typically located under your Mixxx user data directory.

After copying the files:

1. Restart Mixxx.
2. Open **Preferences**.
3. Select **Controllers**.
4. Select the **Numark Party Mix III**.
5. Choose/enable this mapping.
6. Apply the settings.

---

# Compatibility

This mapping was developed for:

- **Numark Party Mix III / Party Mix MK3**
- **Mixxx**

It relies on Party Mix III-specific MIDI behavior, particularly the controller's native shifted pad layer.

It should therefore **not be assumed to work unchanged with older Party Mix models**.

---

# Customization

This mapping is intentionally opinionated, but the JavaScript code can easily be modified to suit another workflow.

For example, you could:

- Restore an 8-beat loop to Loop Pad 8
- Assign different shifted-pad functions
- Change the AutoDJ LOAD button behavior
- Change the Intro/Outro pad assignments
- Use FADE FX for an actual effect again
- Change how the sampler banks are distributed
- Add additional LED feedback

Feel free to fork the mapping and make it your own.

---

# Contributions

Bug fixes and improvements are welcome.

When reporting an issue, please include:

- Mixxx version
- Operating system
- Exact controller model
- Relevant Mixxx controller log output
- MIDI messages if the issue appears to be controller-specific

Pull requests are welcome as well.
