// eslint-disable-next-line no-var
var NumarkPartyMix3 = {};

// The jogwheel is behaving inconsistently
// when scratching the point in the song moves
// this is according to my theory because
// the movements are not properly registered by the encoder
// (this can happen when the sampling rate of the sensor is too low)
NumarkPartyMix3.jogScratchSensitivity = 340;
NumarkPartyMix3.jogScratchAlpha = 1 / 8; // do NOT set to 2 or higher
NumarkPartyMix3.jogScratchBeta = 1 / 8 / 32;
NumarkPartyMix3.jogPitchSensitivity = 10;
NumarkPartyMix3.jogSearchSensitivity = 1 / 2;

// autoloop sizes, for available values see:
// https://manual.mixxx.org/2.3/en/chapters/appendix/mixxx_controls.html#control-[ChannelN]-beatloop_X_toggle
NumarkPartyMix3.autoLoopSizes = [
    "4",
    "8",
    "16",
    "32"
];

// dim all lights when inactive instead of turning them off
components.Button.prototype.off = 0x01;

components.Button.prototype.shutdown = function() {
    if (this.midi === undefined || this.midi[0] === undefined || this.midi[1] === undefined) {
        return;
    }
    // LEDs are switched off using node off messages
    // on shutdown LEDs are not dimmed but switched off
    midi.sendShortMsg(this.midi[0] - 0x10, this.midi[1], 0x00);
};

// pad modes control codes
NumarkPartyMix3.PadModeControls = {
    HOTCUE: 0x00,
    LOOP: 0x0B,
    SAMPLER: 0x0E,
    STEM: 0x18,
};

NumarkPartyMix3.initBackgroundLeds = function() {
    var i;

    var deckButtons = [
        0x00,
        0x01,
        0x02,
        0x04,
        0x05,
        0x46, // Acapella
        0x48  // Instrumental
    ];

    for (i = 0; i < deckButtons.length; i++) {
        midi.sendShortMsg(0x90, deckButtons[i], 0x01);
        midi.sendShortMsg(0x91, deckButtons[i], 0x01);
    }

    for (i = 0x01; i <= 0x04; i++) {
        midi.sendShortMsg(0x94, i, 0x01);
        midi.sendShortMsg(0x95, i, 0x01);
    }

    for (i = 0x14; i <= 0x23; i++) {
        midi.sendShortMsg(0x94, i, 0x01);
        midi.sendShortMsg(0x95, i, 0x01);
    }

    midi.sendShortMsg(0x9F, 0x46, 0x01); // Fade FX / AutoDJ
    midi.sendShortMsg(0x9F, 0x47, 0x01);

	//backlit acapella and instrumental
    midi.sendShortMsg(0x90, 0x46, 0x01);
    midi.sendShortMsg(0x90, 0x48, 0x01);
    midi.sendShortMsg(0x91, 0x46, 0x01); 
    midi.sendShortMsg(0x91, 0x48, 0x01);
};

NumarkPartyMix3.init = function(_id, _debugging) {
    /// specific "party led off" initialization for III
    console.log("Party Mix III: init");

    // Stop the firmware LED cycling/demo mode
    var identityRequest = [
        0xF0,
        0x7E,
        0x7F,
        0x06,
        0x01,
        0xF7
    ];

    midi.sendSysexMsg(identityRequest, identityRequest.length);
    console.log("Party Mix III: Identity Request sent");

	NumarkPartyMix3.autoDjLedConnection =
	    engine.makeConnection(
		"[AutoDJ]",
		"enabled",
		function(value) {
		    midi.sendShortMsg(
			0x9F,
			0x46,
			value ? 0x7F : 0x01
		    );
		}
	    );
	NumarkPartyMix3.autoDjLedConnection.trigger();
    //init beat connection
	NumarkPartyMix3.beat1Connection =
	    engine.makeConnection(
		"[Channel1]",
		"beat_active",
		function(value) {
		    NumarkPartyMix3.onBeat(1, value);
		}
	    );

	NumarkPartyMix3.beat2Connection =
	    engine.makeConnection(
		"[Channel2]",
		"beat_active",
		function(value) {
		    NumarkPartyMix3.onBeat(2, value);
		}
	    );

    //continuation of "default init"
    /// init party led switch off
    midi.sendShortMsg(0xb0, 0x40, 0x00);//0x60 seems to be max
    midi.sendShortMsg(0xb0, 0x42, 0x00);
    midi.sendShortMsg(0xb0, 0x43, 0x00);

    // initialize component containers
    if (engine.getValue("[App]", "num_samplers") < 8) {
        engine.setValue("[App]", "num_samplers", 8);
    }
    NumarkPartyMix3.deck = new components.ComponentContainer();
    for (let i = 0; i < 2; i++) {
        NumarkPartyMix3.deck[i] = new NumarkPartyMix3.Deck(i + 1);
    }

    NumarkPartyMix3.browse = new NumarkPartyMix3.Browse();
    NumarkPartyMix3.gains = new NumarkPartyMix3.Gains();

    // 0x00 0x01 0x3F is Numark mfg. ID used in SysEx messages.
    midi.sendSysexMsg([0xF0, 0x00, 0x01, 0x3F, 0x38, 0x48, 0xF7]);

    //engine.beginTimer(2000, function() { NumarkPartyMix3.initBackgroundLeds(); }, true);
    NumarkPartyMix3.initBackgroundLeds();

    engine.beginTimer(2000, function() { 
	 console.log("TESTING ACAPELLA/INSTRUMENTAL LEDs, because it does not work in initBackgroundLeds");
    	 midi.sendShortMsg(0x90, 0x46, 0x01); 
	 midi.sendShortMsg(0x90, 0x48, 0x01);
	 midi.sendShortMsg(0x91, 0x46, 0x01);
	 midi.sendShortMsg(0x91, 0x48, 0x01);
     }, true);
};

NumarkPartyMix3.shutdown = function() {
    NumarkPartyMix3.deck.shutdown();
};

NumarkPartyMix3.Deck = function(deckNumber) {
    components.Deck.call(this, deckNumber);

    const channel = deckNumber - 1;
    const deck = this;
    this.scratchModeEnabled = false;

    this.playButton = new components.PlayButton({
        midi: [0x90 + channel, 0x00],
    });

    this.cueButton = new components.CueButton({
        midi: [0x90 + channel, 0x01],
    });

    this.syncButton = new components.SyncButton({
        midi: [0x90 + channel, 0x02],
    });

    this.headphoneButton = new components.Button({
	    midi: [0x90 + channel, 0x1B],
	    key: "pfl",

	    type: components.Button.prototype.types.toggle,

	    output: function(value) {
		const note = (value === 0x00 ? 0x80 : 0x90) + channel;
		midi.sendShortMsg(note, 0x1B, this.outValueScale(value));
	    }
    });

    this.loadButton = new components.Button({
        midi: [0x9F, 0x01 + channel],
        inKey: "LoadSelectedTrack"
    });

    this.volume = new components.Pot({
        inKey: "volume"
    });

    this.gain = new components.Pot({
        inKey: "pregain"
    });

    this.treble = new components.Pot({
        group: `[EqualizerRack1_${ this.currentDeck }_Effect1]`,
        inKey: "parameter3"
    });

    this.bass = new components.Pot({
        group: `[EqualizerRack1_${ this.currentDeck }_Effect1]`,
        inKey: "parameter1"
    });

    this.pitch = new components.Pot({
        inKey: "rate",
        invert: true
    });

    this.padSection = new NumarkPartyMix3.PadSection(deckNumber);

    this.scratchToggle = new components.Button({
        midi: [0x90 + channel, 0x07],
        type: components.Button.prototype.types.toggle,
        inToggle: function() {
            deck.scratchModeEnabled = !deck.scratchModeEnabled;
            if (deck.scratchModeEnabled) {
                this.send(this.on);
            } else {
                engine.scratchDisable(deckNumber);
                this.send(this.off);
            }
        }
    });

    this.wheelTurn = new components.Encoder({
        group: "[Channel" + deckNumber + "]",
        key: "wheelTurn",
        touchTimer: 0,
        touchTimout: 0,
        input: function(channel, _control, value, _status, group) {
            //clockwise (slow-fast) 0x01 - 0x06
            //counter-clockwise (slow-fast) 0x7F - 0x7A
            //transform counter-clockwise messages to negative values
            var newValue = (value < 0x40) ? value : (value - 0x80);

            if (this.touchTimer !== 0) {
                engine.stopTimer(this.touchTimer);
                this.touchTimer = 0;
            }

            if (deck.scratchModeEnabled) {
                this.touchTimer = engine.beginTimer(50, () => {
                    engine.scratchDisable(deckNumber);
                }, true);

                if (!engine.isScratching(deckNumber)) {
                    engine.scratchEnable(deckNumber, NumarkPartyMix3.jogScratchSensitivity, 33 + 1 / 3, NumarkPartyMix3.jogScratchAlpha, NumarkPartyMix3.jogScratchBeta, true);
                }
                engine.scratchTick(deckNumber, newValue); // Scratch!
            } else {
                if (engine.getValue(group, "play") > 0) {
                    engine.setValue(group, "jog", newValue / NumarkPartyMix3.jogPitchSensitivity); // fine jog to sync
                } else {
                    engine.setValue(group, "jog", newValue / NumarkPartyMix3.jogSearchSensitivity); // scrup through track

                }
            }
        }
    });

    this.reconnectComponents(function(component) {
        if (component.group === undefined) {
            component.group = this.currentDeck;
        }
    });
//acapella and instrumental
this.stemMode = "full";

this.setStemMode = function(mode) {

    const vocal = `[Channel${deckNumber}_Stem4]`;

    const instrumental = [
        `[Channel${deckNumber}_Stem1]`,
        `[Channel${deckNumber}_Stem2]`,
        `[Channel${deckNumber}_Stem3]`
    ];

    switch (mode) {

    case "acapella":
        engine.setValue(vocal, "volume", 1.0);

        instrumental.forEach(function(group) {
            engine.setValue(group, "volume", 0.0);
        });

        midi.sendShortMsg(0x90 + channel, 0x46, 0x7F);
        midi.sendShortMsg(0x90 + channel, 0x48, 0x01);
        break;


    case "instrumental":
        engine.setValue(vocal, "volume", 0.0);

        instrumental.forEach(function(group) {
            engine.setValue(group, "volume", 1.0);
        });

        midi.sendShortMsg(0x90 + channel, 0x46, 0x01);
        midi.sendShortMsg(0x90 + channel, 0x48, 0x7F);
        break;


    default: // FULL
        engine.setValue(vocal, "volume", 1.0);

        instrumental.forEach(function(group) {
            engine.setValue(group, "volume", 1.0);
        });

        midi.sendShortMsg(0x90 + channel, 0x46, 0x01);
        midi.sendShortMsg(0x90 + channel, 0x48, 0x01);

        mode = "full";
        break;
    }

    deck.stemMode = mode;
};

this.acapellaButton = new components.Button({
    midi: [0x90 + channel, 0x46],

    input: function(ch, control, value, status) {
        if (!this.isPress(ch, control, value, status)) {
            return;
        }

        if (deck.stemMode === "acapella") {
            deck.setStemMode("full");
        } else {
            deck.setStemMode("acapella");
        }
    }
});

this.instrumentalButton = new components.Button({
    midi: [0x90 + channel, 0x48],

    input: function(ch, control, value, status) {
        if (!this.isPress(ch, control, value, status)) {
            return;
        }

        if (deck.stemMode === "instrumental") {
            deck.setStemMode("full");
        } else {
            deck.setStemMode("instrumental");
        }
    }
});


//autodj
NumarkPartyMix3.autoDjToggle = function(channel, control, value, status) {
    // react only to press
    if ((status & 0xF0) !== 0x90 || value === 0) {
        return;
    }

    var enabled = engine.getValue("[AutoDJ]", "enabled");

    engine.setValue("[AutoDJ]", "enabled", enabled ? 0 : 1);

    // LED feedback
    // midi.sendShortMsg( 0x9F, 0x46, enabled ? 0x01 : 0x7F);
};

NumarkPartyMix3.blinkAutoDjLed = function() {
    // Force bright
    midi.sendShortMsg(0x9F, 0x46, 0x7F);

    engine.beginTimer(150, function() {
        midi.sendShortMsg(0x9F, 0x46, 0x01);

        engine.beginTimer(150, function() {
            midi.sendShortMsg(0x9F, 0x46, 0x7F);

            engine.beginTimer(150, function() {
                var enabled = engine.getValue("[AutoDJ]", "enabled");

                midi.sendShortMsg(
                    0x9F,
                    0x46,
                    enabled ? 0x7F : 0x01
                );
            }, true);

        }, true);

    }, true);
};


NumarkPartyMix3.loadDeck1 = function(channel, control, value, status, group) {
    if (value === 0) {
        return;
    }

    if (engine.getValue("[AutoDJ]", "enabled")) {
        engine.setValue("[Library]", "AutoDjAddTop", 1);
         NumarkPartyMix3.blinkAutoDjLed();
    } else {
        engine.setValue("[Channel1]", "LoadSelectedTrack", 1);
    }
};

NumarkPartyMix3.loadDeck2 = function(channel, control, value, status, group) {
    if (value === 0) {
        return;
    }

    if (engine.getValue("[AutoDJ]", "enabled")) {
        engine.setValue("[Library]", "AutoDjAddBottom", 1);
         NumarkPartyMix3.blinkAutoDjLed();
    } else {
        engine.setValue("[Channel2]", "LoadSelectedTrack", 1);
    }
};


NumarkPartyMix3.onBeat = function(deckNumber, value) {
    if (value !== 1 && value !== 2) {
        return;
    }

    midi.sendShortMsg(0x9F, 0x40, 0x00);
    midi.sendShortMsg(0xBF, 0x40, 0x00);
    midi.sendShortMsg(0xBF, 0x41, 0x00);
    midi.sendShortMsg(0xBF, 0x43, 0x00);
};


//end of deck constructor, I hope
};

NumarkPartyMix3.Deck.prototype = Object.create(components.Deck.prototype);
NumarkPartyMix3.modeButtonDeck1 = function(channel, control, value, status, group) {
    console.log(
        "MODE1 value=" + value +
        " status=0x" + status.toString(16)
    );

    NumarkPartyMix3.deck[0].padSection.modeButtonPress(
        channel, control, value, status, group
    );
};


NumarkPartyMix3.modeButtonDeck2 = function(channel, control, value, status, group) {
    console.log(
        "MODE2 value=" + value +
        " status=0x" + status.toString(16)
    );

    NumarkPartyMix3.deck[1].padSection.modeButtonPress(
        channel, control, value, status, group
    );
};

NumarkPartyMix3.PadSection = function(deckNumber) {
    components.ComponentContainer.call(this);
	this.shiftPressed = false;
	this.shiftUsed = false;

    const padChannel = 0x93 + deckNumber;   // Deck1=0x94, Deck2=0x95

    this.modes = {};
    this.modes[NumarkPartyMix3.PadModeControls.HOTCUE] =
        new NumarkPartyMix3.ModeHotcue(deckNumber);
    this.modes[NumarkPartyMix3.PadModeControls.LOOP] =
        new NumarkPartyMix3.ModeLoop(deckNumber);
    this.modes[NumarkPartyMix3.PadModeControls.SAMPLER] =
        new NumarkPartyMix3.ModeSampler(deckNumber);
    this.modes[NumarkPartyMix3.PadModeControls.STEM] =
        new NumarkPartyMix3.ModeStem(deckNumber);

    // Order used when pressing the single MODE button
    this.modeOrder = [
        NumarkPartyMix3.PadModeControls.HOTCUE,
        NumarkPartyMix3.PadModeControls.LOOP,
        NumarkPartyMix3.PadModeControls.SAMPLER,
        NumarkPartyMix3.PadModeControls.STEM
    ];

    this.modeIndex = 0;

    /*
     * Party Mix III mode LEDs:
     *
     * Note 1 = Hot Cue
     * Note 2 = Loop
     * Note 3 = Sampler
     * Note 4 = EFX
     *
     * 0x7F = bright/on
     * 0x01 = dim/inactive
     */
    this.updateModeLeds = function(mode) {

        // First dim all four mode LEDs
        for (let note = 1; note <= 4; note++) {
            midi.sendShortMsg(padChannel, note, 0x01);
        }

        let ledNote;

        switch (mode) {
        case NumarkPartyMix3.PadModeControls.HOTCUE:
            ledNote = 1;
            break;

        case NumarkPartyMix3.PadModeControls.LOOP:
            ledNote = 2;
            break;

        case NumarkPartyMix3.PadModeControls.SAMPLER:
            ledNote = 3;
            break;

        case NumarkPartyMix3.PadModeControls.STEM:
            ledNote = 4;
            break;
        }

        if (ledNote !== undefined) {
            midi.sendShortMsg(padChannel, ledNote, 0x7F);
        }
    };

this.modeButtonPress = function(_channel, _control, value) {
    if (value === 0) {
        return;
    }

    // If currently in a "rare" mode, go straight back to HOTCUE
    if (
        this.currentMode.control === NumarkPartyMix3.PadModeControls.SAMPLER ||
        this.currentMode.control === NumarkPartyMix3.PadModeControls.STEM
    ) {
        this.modeIndex = 0;
        this.setMode(NumarkPartyMix3.PadModeControls.HOTCUE);
        return;
    }

    // Otherwise toggle HOTCUE <-> LOOP
    if (
        this.currentMode.control === NumarkPartyMix3.PadModeControls.HOTCUE
    ) {
        this.modeIndex = 1;
        this.setMode(NumarkPartyMix3.PadModeControls.LOOP);
    } else {
        this.modeIndex = 0;
        this.setMode(NumarkPartyMix3.PadModeControls.HOTCUE);
    }
};

this.samplerModeButton = function(_channel, _control, value) {
    if (value === 0) {
        return;
    }

    this.modeIndex = 0;
    this.setMode(NumarkPartyMix3.PadModeControls.SAMPLER);
};

this.stemModeButton = function(_channel, _control, value) {
    if (value === 0) {
        return;
    }

    this.modeIndex = 0;
    this.setMode(NumarkPartyMix3.PadModeControls.STEM);
};


this.padPress = function(channel, control, value, status, group) {
        const i = (control - 0x14) % 8;
       var isPress = ((status & 0xF0) === 0x90) && value > 0;

    var connection = this.currentMode.connections[i];

    if (typeof connection === "undefined") {
        return;
    }

        connection.input(
            channel,
            control,
            value,
            status,
            group
        );
 };

this.shiftPadPress = function(channel, control, value, status, group) {
    var i = control - 0x1C;

    // Ignore release
    if ((status & 0xF0) !== 0x90 || value === 0) {
        return;
    }

    if (typeof this.currentMode.shiftPadPress === "function") {
        this.currentMode.shiftPadPress(i, group);
    }
};


    this.setMode = function(control) {

        const newMode = this.modes[control];

        if (newMode === undefined) {
            console.log(
                "Party Mix III: unknown pad mode 0x" +
                control.toString(16)
            );
            return;
        }

        this.currentMode.forEachComponent(function(component) {
            component.disconnect();
        });

        newMode.forEachComponent(function(component) {
            component.connect();
            component.trigger();
        });

        this.currentMode = newMode;

        // <<< THIS updates the MODE LEDs
        this.updateModeLeds(control);
    };


    // Initial state = HOT CUE
    this.currentMode =
        this.modes[NumarkPartyMix3.PadModeControls.HOTCUE];

    this.updateModeLeds(
        NumarkPartyMix3.PadModeControls.HOTCUE
    );
};

NumarkPartyMix3.PadSection.prototype = Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.ModeHotcue = function(deckNumber) {
    components.ComponentContainer.call(this);

    this.control = NumarkPartyMix3.PadModeControls.HOTCUE;
    this.connections = new components.ComponentContainer();

    var midiChannel = 0x93 + deckNumber;
    var group = `[Channel${deckNumber}]`;

    // Pads 1-4 = Hot Cues 1-4
    for (var i = 0; i < 4; i++) {
        this.connections[i] = new components.HotcueButton({
            group: group,
            midi: [midiChannel, 0x14 + i],
            number: i + 1,
            outConnect: false
        });
    }

    // Pad 5 = Intro Start
    this.connections[4] = new components.Button({
        group: group,
        midi: [midiChannel, 0x18],
        inKey: "intro_start_activate",
        outKey: "intro_start_enabled",
        outConnect: false
    });

    // Pad 6 = Intro End
    this.connections[5] = new components.Button({
        group: group,
        midi: [midiChannel, 0x19],
        inKey: "intro_end_activate",
        outKey: "intro_end_enabled",
        outConnect: false
    });

    // Pad 7 = Outro Start
    this.connections[6] = new components.Button({
        group: group,
        midi: [midiChannel, 0x1A],
        inKey: "outro_start_activate",
        outKey: "outro_start_enabled",
        outConnect: false
    });

    // Pad 8 = Outro End
    this.connections[7] = new components.Button({
        group: group,
        midi: [midiChannel, 0x1B],
        inKey: "outro_end_activate",
        outKey: "outro_end_enabled",
        outConnect: false
    });
    //shift pad 
	this.shiftPadPress = function(i, group) {
	    if (i >= 0 && i < 4) {
		engine.setValue(
		    group,
		    "hotcue_" + (i + 1) + "_clear",
		    1
		);
	    }
	};

};

NumarkPartyMix3.ModeHotcue.prototype =
    Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.ModeLoop = function(deckNumber) {
    components.ComponentContainer.call(this);

    this.control = NumarkPartyMix3.PadModeControls.LOOP;

    const group = `[Channel${deckNumber}]`;
    const midiChannel = 0x93 + deckNumber;

    this.connections = new components.ComponentContainer();

    // PAD 1: halve loop size
    this.connections[0] = new components.Button({
        group: group,
        midi: [midiChannel, 0x14],
        inKey: "loop_halve",
        outConnect: false
    });

    // PAD 2: double loop size
    this.connections[1] = new components.Button({
        group: group,
        midi: [midiChannel, 0x15],
        inKey: "loop_double",
        outConnect: false
    });

    // PAD 3: create current-size loop / exit active loop
    this.connections[2] = new components.Button({
        group: group,
        midi: [midiChannel, 0x16],
        outKey: "loop_enabled",
        outConnect: false,

        input: function(channel, control, value, status) {
            if (!this.isPress(channel, control, value, status)) {
                return;
            }

            if (engine.getValue(group, "loop_enabled")) {
                // Exit current loop
                engine.setValue(group, "loop_enabled", 0);
            } else {
                // Create a new loop using beatloop_size
                engine.setValue(group, "beatloop_activate", 1);
            }
        }
    });

    // PAD 4: RELOOP
    //
    // Re-enable the previous loop. Mixxx will return to it as
    // appropriate according to reloop_toggle semantics.
    this.connections[3] = new components.Button({
        group: group,
        midi: [midiChannel, 0x17],
        inKey: "reloop_toggle",
        outConnect: false
    });

    // PAD 5: fixed 1 beat loop
    this.connections[4] = new components.Button({
        group: group,
        midi: [midiChannel, 0x18],
        inKey: "beatloop_1_toggle",
        outKey: "beatloop_1_enabled",
        outConnect: false
    });

    // PAD 6: fixed 2 beat loop
    this.connections[5] = new components.Button({
        group: group,
        midi: [midiChannel, 0x19],
        inKey: "beatloop_2_toggle",
        outKey: "beatloop_2_enabled",
        outConnect: false
    });

    // PAD 7: fixed 4 beat loop
    this.connections[6] = new components.Button({
        group: group,
        midi: [midiChannel, 0x1A],
        inKey: "beatloop_4_toggle",
        outKey: "beatloop_4_enabled",
        outConnect: false
    });

    // PAD 8: fixed 8 beat loop
    //this.connections[7] = new components.Button({
    //    group: group,
    //    midi: [midiChannel, 0x1B],
    //    inKey: "beatloop_8_toggle",
    //    outKey: "beatloop_8_enabled",
    //    outConnect: false
    //});

	// PAD 8: toggle FX1 routing to this deck
	this.connections[7] = new components.Button({
	    group: "[EffectRack1_EffectUnit1]",
	    midi: [midiChannel, 0x1B],
	    key: `group_[Channel${deckNumber}]_enable`,
	    type: components.Button.prototype.types.toggle,
	    outConnect: false
	});
};

NumarkPartyMix3.ModeLoop.prototype =
    Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.ModeSampler = function(deckNumber) {
    components.ComponentContainer.call(this);

    this.control = NumarkPartyMix3.PadModeControls.SAMPLER;
    this.connections = new components.ComponentContainer();

    var samplerMap;

    if (deckNumber === 1) {
        samplerMap = [
            1, 2, 3, 4,
            9, 10, 11, 12
        ];
    } else {
        samplerMap = [
            5, 6, 7, 8,
            13, 14, 15, 16
        ];
    }

    for (var i = 0; i < 8; i++) {
        var samplerNumber = samplerMap[i];

        this.connections[i] = new components.SamplerButton({
            midi: [
                0x93 + deckNumber,
                0x14 + i
            ],

            number: samplerNumber,

            outConnect: false,
            unshift: null,
            outKey: "play_indicator",

            input: function(channel, control, value, status, group) {
                if (!this.isPress(channel, control, value, status)) {
                    return;
                }

                if (engine.getValue(this.group, "track_loaded") === 0) {
                    engine.setValue(this.group, "LoadSelectedTrack", 1);
                } else {
                    if (engine.getValue(this.group, "play") === 1) {
                        engine.setValue(this.group, "start_stop", 1);
                    } else {
                        engine.setValue(this.group, "start_play", 1);
                    }
                }
            }
        });
    }
};

NumarkPartyMix3.ModeSampler.prototype =
    Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.ModeStem = function(deckNumber) {
    components.ComponentContainer.call(this);

    this.control = NumarkPartyMix3.PadModeControls.STEM;
    this.connections = new components.ComponentContainer();

    const midiChannel = 0x93 + deckNumber;
    const stemGroups = [
        `[Channel${deckNumber}_Stem1]`, // Drums
        `[Channel${deckNumber}_Stem2]`, // Bass
        `[Channel${deckNumber}_Stem3]`, // Other
        `[Channel${deckNumber}_Stem4]`  // Vox
    ];

    function setPadLed(padIndex, on) {
        midi.sendShortMsg(midiChannel, 0x14 + padIndex, on ? 0x7F : 0x01);
    }

    function updateLeds() {
        // Pads 1-4: stem enabled/muted state
        for (let i = 0; i < 4; i++) {
            setPadLed(i, engine.getValue(stemGroups[i], "volume") > 0.001);
        }

        // Pads 5-8: light only when that stem is currently soloed
        let enabled = [];
        for (let i = 0; i < 4; i++) {
            enabled[i] = engine.getValue(stemGroups[i], "volume") > 0.001;
        }
        const enabledCount = enabled.filter(Boolean).length;
        for (let i = 0; i < 4; i++) {
            setPadLed(4 + i, enabledCount === 1 && enabled[i]);
        }
    }

    // Pads 1-4: toggle Drums, Bass, Other, Vox
    for (let i = 0; i < 4; i++) {
        this.connections[i] = new components.Button({
            midi: [midiChannel, 0x14 + i],
            input: function(channel, control, value, status) {
                if ((status & 0xF0) !== 0x90 || value === 0) {
                    return;
                }
                const current = engine.getValue(stemGroups[i], "volume");
                engine.setValue(stemGroups[i], "volume", current > 0.001 ? 0.0 : 1.0);
                updateLeds();
            },
            outConnect: false
        });
    }

    // Pads 5-8: solo Drums, Bass, Other, Vox.
    // Press the active SOLO pad again to restore all four stems.
    for (let i = 0; i < 4; i++) {
        this.connections[4 + i] = new components.Button({
            midi: [midiChannel, 0x18 + i],
            input: function(channel, control, value, status) {
                if ((status & 0xF0) !== 0x90 || value === 0) {
                    return;
                }

                let enabled = [];
                for (let j = 0; j < 4; j++) {
                    enabled[j] = engine.getValue(stemGroups[j], "volume") > 0.001;
                }
                const alreadySolo = enabled[i] && enabled.filter(Boolean).length === 1;

                for (let j = 0; j < 4; j++) {
                    engine.setValue(stemGroups[j], "volume", alreadySolo || j === i ? 1.0 : 0.0);
                }
                updateLeds();
            },
            outConnect: false
        });
    }

    // Refresh pad LEDs whenever this mode is entered.
    this.trigger = updateLeds;
};

NumarkPartyMix3.ModeStem.prototype =
    Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.Browse = function() {
    components.ComponentContainer.call(this);

    const browse = this;
    this.knobpressed = false;

    this.knob = new components.Encoder({
        input: function(channel, control, value) {
            let direction;
            if (browse.knobpressed) {
                if (value > 0x40) {
                    engine.setParameter("[Library]", "MoveFocusForward", 1);
                } else {
                    engine.setParameter("[Library]", "MoveFocusBackward", 1);
                }
            } else {
                direction = (value > 0x40) ? -1 : 1;
                engine.setParameter("[Library]", "MoveVertical", direction);
            }
        }
    });

    this.knobButton = new components.Button({
        group: "[Library]",
        type: components.Button.prototype.types.powerWindow,
        isLongPressed: false,
        input: function(channel, control, value, status) {
            browse.knobpressed = this.isPress(channel, control, value, status);
            if (browse.knobpressed) {
                this.isLongPressed = false;
                this.longPressTimer = engine.beginTimer(this.longPressTimeout, () => {
                    this.isLongPressed = true;
                    this.longPressTimer = 0;
                }, true);
            } else {
                if (!this.isLongPressed) {
                    this.inToggle();
                }
                if (this.longPressTimer !== 0) {
                    engine.stopTimer(this.longPressTimer);
                    this.longPressTimer = 0;
                }
                this.isLongPressed = false;
            }
        },
        inToggle: function() {
            engine.setParameter("[Library]", "GoToItem", 1);
        }
    });
};
NumarkPartyMix3.Browse.prototype = Object.create(components.ComponentContainer.prototype);

NumarkPartyMix3.Gains = function() {
    this.mainGain = new components.Pot({
        group: "[Master]",
        inKey: "gain"
    });

    this.cueGain = new components.Pot({
        group: "[Master]",
        inKey: "headGain"
    });

    this.cueMix = new components.Pot({
        group: "[Master]",
        inKey: "headMix"
    });
};
NumarkPartyMix3.Gains.prototype = Object.create(components.ComponentContainer.prototype);
