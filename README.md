# Numark Party Mix III — Mixxx Mapping

A guide to using the **Numark Party Mix III with Mixxx**: playing and mixing tracks, browsing your library, using cues and loops, triggering samples, controlling stems, and managing AutoDJ - a bit opinionated

## Contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Decks, pads, and Shift](#decks-pads-and-shift)
- [Playback and jog wheels](#playback-and-jog-wheels)
- [Mixer and headphones](#mixer-and-headphones)
- [Browsing and loading tracks](#browsing-and-loading-tracks)
- [Choosing a pad mode](#choosing-a-pad-mode)
- [Hot Cue mode](#hot-cue-mode)
- [Loop mode](#loop-mode)
- [Sampler mode](#sampler-mode)
- [Stem mode](#stem-mode)
- [Acapella and Instrumental](#acapella-and-instrumental)
- [AutoDJ](#autodj)
- [Button lights](#button-lights)
- [Troubleshooting](#troubleshooting)

## Installation

You need both mapping files:

- `Numark-Party-Mix3.midi.xml`
- `Numark-Party-Mix3.scripts.js`

1. Connect the Party Mix III to your computer by USB.
2. In Mixxx, open **Preferences → Controllers → Open User Mapping Folder**.
3. Copy both files into that folder. Keep their names unchanged. If the script download ends in `.js.txt`, remove the final `.txt`.
4. Restart Mixxx if the mapping is not listed.
5. In **Preferences → Controllers**, select your Party Mix III and choose this custom mapping.
6. Check **Enabled** and click **Apply**.
7. In **Preferences → Sound Hardware**, select the outputs for your speakers and headphones. You can use the controller's audio device or a separate audio interface.

For stem controls, use a Mixxx version and tracks that support four separate stems. To use every sampler pad, configure **16 sampler slots** in Mixxx.

## Quick start

1. Turn **BROWSE** to select a track. Briefly press it to switch between your library folders/crates and the track list.
2. With AutoDJ off, press the left or right **LOAD** button to load the corresponding deck.
3. Press that deck's headphone **PFL/CUE** button to preview it in headphones.
4. Press **PLAY/PAUSE**. Adjust the channel fader, main volume, and crossfader.
5. Both decks start in **Hot Cue** mode. Tap pads 1–4 to save or use hot cues.
6. Tap **MODE** to enter **Loop** mode. Pad 1 starts an 8-beat loop; pad 2 exits it or returns to it.

**Two things to remember:** holding a pad for one second in Hot Cue mode deletes its cue or marker. **FADE FX** switches AutoDJ on/off, which also changes what the LOAD buttons do.

## Decks, pads, and Shift

The left side controls **Deck 1**, and the right side controls **Deck 2**. Each side has its own pad mode.

Throughout this guide, pads are numbered separately on each deck:

| Row | Left to right |
| --- | --- |
| Top | 1, 2, 3, 4 |
| Bottom | 5, 6, 7, 8 |

The same instructions apply to both decks unless stated otherwise.

**Shift means holding the MODE button for a longer press.** For a Shift combination, hold MODE, press the other button while still holding MODE, then release. A brief tap of MODE changes the pad mode instead.

## Playback and jog wheels

| Control | What it does |
| --- | --- |
| PLAY/PAUSE | Starts or pauses the track. |
| CUE | Uses Mixxx's main cue point. Typically, press while paused to set the cue, or during playback to return to it. The exact behavior follows your Mixxx cue-mode setting. |
| SYNC | Synchronizes the track's tempo and, depending on Mixxx settings, beat alignment with the other deck. |
| Pitch fader | Changes the track's speed and BPM. The adjustment range is set in Mixxx. |
| Touch and hold the jog wheel's top | Holds the audio under your finger, even if you stop moving the wheel. |
| Touch and turn the jog wheel's top | Scratches forwards or backwards. Works while playing or paused. |
| Release the jog wheel's top | Releases the hold. A playing track continues; a paused track remains paused. |
| Turn the rim while playing | Temporarily speeds up or slows down the track to align beats. |
| Turn the rim while paused | Moves through the track to find a position. |

Touch the top to scratch; use the rim to nudge. There is no separate vinyl-mode button to enable first.

The main **CUE** button, the **Hot Cue pads**, and the headphone **PFL/CUE** buttons serve different purposes: a main cue point, multiple saved jump points, and headphone monitoring respectively.

## Mixer and headphones

| Control | What it does |
| --- | --- |
| Channel fader | Adjusts that deck's volume. |
| HIGH EQ | Adjusts treble. |
| MID EQ | Adjusts midrange. |
| LOW EQ | Adjusts bass. |
| FILTER | Adjusts the deck's selected Quick Effect in Mixxx, normally a filter. |
| Crossfader | Blends between the decks according to your Mixxx crossfader settings. |
| MAIN GAIN | Adjusts the main output volume. |
| CUE LEVEL | Adjusts headphone volume. |
| Headphone PFL/CUE | Toggles that deck's headphone preview. Each deck switches independently, so both can be monitored together. |

Headphone preview lets you prepare a track before raising its channel fader for the audience. Adjust the headphone cue/main blend and individual track gain in Mixxx when needed.

The FILTER knob's sound depends on the Quick Effect selected in Mixxx. EQ behavior follows your chosen equalizer.

## Browsing and loading tracks

| Action | Result |
| --- | --- |
| Turn BROWSE | Moves up or down in the selected library area. |
| Briefly press and release BROWSE | Switches between folders/crates and the track list. |
| Hold BROWSE and turn | Moves between library areas instead of scrolling the current list. |
| Hold BROWSE, then release | Does not perform the short-click switch if held long enough. |
| Left LOAD with AutoDJ off | Loads the selected track into Deck 1. |
| Right LOAD with AutoDJ off | Loads the selected track into Deck 2. |
| Left LOAD with AutoDJ on | Adds the selected track to the **top** of the AutoDJ queue. |
| Right LOAD with AutoDJ on | Adds the selected track to the **bottom** of the AutoDJ queue. |

The short Browse click takes effect when you release the knob. If you press, turn, and release very quickly, it can also switch library areas on release.

Mixxx's normal protection against loading a track into a playing deck still applies, according to your preferences.

## Choosing a pad mode

| Action | Result |
| --- | --- |
| Tap MODE while in Hot Cue mode | Switches to Loop mode. |
| Tap MODE while in Loop mode | Switches to Hot Cue mode. |
| **Shift + ACAPELLA** | Enters Sampler mode. |
| **Shift + INSTRUMENTAL** | Enters Stem mode. |
| Tap MODE while in Sampler or Stem mode | Returns to Hot Cue mode. |

For example, to enter Sampler mode, **hold MODE, press ACAPELLA, then release**.

MODE alternates between **Hot Cue and Loop**. Use the Shift combinations to reach Sampler and Stem directly.

The mode lights indicate Hot Cue, Loop, Sampler, or Stem. **The EFX indicator is used for Stem mode in this mapping.**

Changing pad mode only changes what the pads do. It does not stop a playing sample, exit a loop, turn off effects, or restore muted stems.

## Hot Cue mode

This is the starting mode on both decks.

| Pad | Brief press | Hold for 1 second |
| --- | --- | --- |
| 1 | Set or activate Hot Cue 1 | Delete Hot Cue 1 |
| 2 | Set or activate Hot Cue 2 | Delete Hot Cue 2 |
| 3 | Set or activate Hot Cue 3 | Delete Hot Cue 3 |
| 4 | Set or activate Hot Cue 4 | Delete Hot Cue 4 |
| 5 | Set or jump to Intro Start | Delete Intro Start |
| 6 | Set or jump to Intro End | Delete Intro End |
| 7 | Set or jump to Outro Start | Delete Outro Start |
| 8 | Set or jump to Outro End | Delete Outro End |

### Using hot cues

A hot cue is a saved position in a track, such as the first beat, a chorus, or a useful transition point.

- If a pad has no cue, press it to save the current position.
- If a cue already exists, press the pad during playback to jump to it.
- While paused, an existing hot cue can be held for a brief preview using Mixxx's normal hot-cue behavior. Release before one second if you want to keep it.
- **Shift + pads 1–4** clears the corresponding hot cue while in Hot Cue mode. Shift + pads 5–8 has no assigned action.

### Intro and outro markers

Pads 5–8 mark the start and end of the intro and outro sections. They are separate from Hot Cues 1–4.

Press a marker pad to set it at the current position if it is missing. If it already exists, the pad jumps to it without changing whether the track is playing or paused.

To move a marker, delete it, find the new position, then tap its pad again. Mixxx can also use these markers for AutoDJ transitions, depending on your AutoDJ settings.

### Deleting with a long press

Hold any pad in this mode for **one second** to delete its cue or marker.

**The pad's normal action happens immediately when pressed.** Holding an existing cue can therefore jump to it before deleting it. Holding an empty pad can create a cue and then delete it a second later.

Release sooner to keep the cue. Changing modes or loading another track cancels a pending deletion.

## Loop mode

Tap MODE from Hot Cue mode to enter Loop mode.

| Pad | Action | Behavior |
| --- | --- | --- |
| 1 | **8-beat loop** | Starts an 8-beat loop at the current position, with timing following Mixxx's quantize settings. |
| 2 | **Exit / Reloop** | Exits an active loop. Press again to return to the saved loop's start and repeat it. |
| 3 | **Back to Intro Start** | Exits any active loop and jumps to an existing Intro Start marker. |
| 4 | **Effect Unit 1 on/off for this deck** | Adds or removes this deck from Effect Unit 1. |
| 5 | **Half loop length** | For example: 8 beats → 4 → 2 → 1. |
| 6 | **Double loop length** | For example: 1 beat → 2 → 4 → 8. |
| 7 | **Move loop back** | Moves the loop one beat backwards. |
| 8 | **Move loop forward** | Moves the loop one beat forwards. |

An 8-beat loop is two bars in a typical 4/4 track. Accurate track analysis and a correct beatgrid help loops stay in time.

Pad 2 has no effect if no valid loop exists. Pad 3 preserves play/pause state; if Intro Start is missing, it exits the loop but does not jump or create a marker.

Pads 7–8 move the repeating section by one beat. Long-press cue deletion does not apply in Loop mode.

### Using the effect pad

Before using pad 4, choose and enable your effects in **Effect Unit 1** in Mixxx and set the wet/dry blend—the balance of original and processed sound.

Pad 4 controls whether that deck goes through the effect unit. It does not select an effect or change its strength. Both decks share Effect Unit 1, but each deck can be switched into it independently.

The FILTER knob controls a separate Quick Effect.

### Example

1. Press pad 1 to start an 8-beat loop.
2. Press pad 5 to shorten it to 4 beats, then again for 2 beats.
3. Use pads 7–8 to reposition the loop if needed.
4. Press pad 2 to exit and continue through the song.
5. Press pad 2 again to jump back into the saved loop.

## Sampler mode

**Enter with Shift + ACAPELLA:** hold MODE and press ACAPELLA.

Samplers are separate players for short sounds, jingles, beats, or other tracks. The pads control these slots:

| Pad | Left deck sampler | Right deck sampler |
| --- | --- | --- |
| 1 | 1 | 5 |
| 2 | 2 | 6 |
| 3 | 3 | 7 |
| 4 | 4 | 8 |
| 5 | 9 | 13 |
| 6 | 10 | 14 |
| 7 | 11 | 15 |
| 8 | 12 | 16 |

| Sampler state | What a pad press does |
| --- | --- |
| Empty | Loads the currently selected library track. Press again to play it. |
| Loaded and stopped | Plays from the beginning. |
| Playing | Stops playback and returns to the beginning. |

You do not need to hold the pad while a sample plays. Each press alternates between starting and stopping; it does not pause and resume from the same position.

Enable **16 sampler slots** in Mixxx to use all pads. Set sampler volume and outputs in Mixxx. Replace or unload samples through Mixxx's interface.

Tap MODE to return to Hot Cue mode. Any playing samples continue until stopped.

## Stem mode

**Enter with Shift + INSTRUMENTAL:** hold MODE and press INSTRUMENTAL.

Stems are separate musical parts of a track. These controls expect four parts in this order: **Drums, Bass, Other instruments, Vocals**. Use a stem-enabled track and a Mixxx version that supports it; this mapping does not separate an ordinary track into stems.

| Pad | Action |
| --- | --- |
| 1 | Toggle Drums on/off |
| 2 | Toggle Bass on/off |
| 3 | Toggle Other instruments on/off |
| 4 | Toggle Vocals on/off |
| 5 | Solo Drums |
| 6 | Solo Bass |
| 7 | Solo Other instruments |
| 8 | Solo Vocals |

**Solo** means only that part is heard. Press its solo pad again while it is the only active stem to restore all four parts. Press a different solo pad to hear that part instead.

These controls switch parts between muted and full level. Restoring stems does not restore an earlier custom volume balance or mute combination.

Tap MODE to return to Hot Cue mode. Muted or soloed parts stay that way until you change them again.

## Acapella and Instrumental

Press these buttons **without Shift** to change the sound of the track. They work in any pad mode.

| Button | First press | Press again |
| --- | --- | --- |
| ACAPELLA | Keeps Vocals; mutes Drums, Bass, and Other instruments | Restores all four parts |
| INSTRUMENTAL | Mutes Vocals; keeps Drums, Bass, and Other instruments | Restores all four parts |

Pressing the opposite button switches directly to its sound. For example, ACAPELLA followed by INSTRUMENTAL changes from vocals-only to music-only.

As with Stem pads, restored parts return to full level. If you also change stems using pads, another controller, or the screen, you may need a second press to reach the expected sound. Check the stem levels in Mixxx if unsure.

**With Shift, these buttons select a pad mode instead:** ACAPELLA opens Sampler mode; INSTRUMENTAL opens Stem mode.

## AutoDJ

Press **FADE FX** to switch AutoDJ on or off. In this mapping, that button controls automatic DJ playback.

Prepare your queue and choose your transition settings in Mixxx's AutoDJ panel. While AutoDJ is enabled:

- **Left LOAD** adds the selected track to the **top** of the queue.
- **Right LOAD** adds it to the **bottom** of the queue.
- The FADE FX light indicates that AutoDJ is active.
- Adding a track makes the light blink briefly as confirmation.

Turn AutoDJ off with FADE FX to make the LOAD buttons load tracks directly into their decks again.

## Button lights

Inactive buttons generally remain dimly lit. Brighter lights indicate an active function or a saved cue, depending on the mode.

| Mode | What the pad lights represent |
| --- | --- |
| Hot Cue | Saved hot cues and intro/outro markers. |
| Loop | Pad 1: active 8-beat loop. Pad 2: looping enabled. Pad 3: Intro Start exists. Pad 4: deck assigned to Effect Unit 1. Pads 5–8: looping enabled. |
| Sampler | Sample playback. |
| Stem | Top row: parts currently enabled. Bottom row: the part currently soloed. |

Some lights may lag behind the actual state after startup, a mode change, or changes made on screen or another controller—particularly stem lights. When a light and the sound disagree, check Mixxx's on-screen controls.

The mapping attempts to keep the decorative party lights off. Their response can vary with the controller.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Mapping is not listed | Copy both files into the user mapping folder and restart Mixxx. |
| Some controls work but pads or jog wheels do not | Make sure both mapping files are present, correctly named, and this custom mapping is selected. |
| LOAD adds a track to a queue | AutoDJ is enabled. Press FADE FX to turn it off. |
| A cue disappears when held | Holding for one second deletes it. Use a short press to keep it. |
| MODE never reaches Sampler or Stem | Hold MODE and press ACAPELLA for Sampler, or INSTRUMENTAL for Stem. |
| Loop pad 3 does not jump | Set Intro Start first using pad 5 in Hot Cue mode. |
| Loop pad 4 makes no audible difference | Choose and enable an effect in Effect Unit 1, and check its wet/dry blend. |
| Lower-row sampler pads do not work | Enable 16 sampler slots in Mixxx. |
| Stem controls do not isolate the expected sound | Check that the track supports stems and uses the expected Drums/Bass/Other/Vocals order. |
| The song stays vocal-only after changing pad modes | Stem settings remain active. Restore the other parts using the stem controls. |
| Headphones are silent | Check headphone output selection, PFL, headphone level, and the cue/main blend in Mixxx. |
| Button lights do not match what you hear | Check the on-screen state in Mixxx. |

## Credits

Based on the Party Mix mapping credited to **olaf**.
