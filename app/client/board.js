const five = require("johnny-five"),
    SAMPLE_WINDOW = 50,
    MIC_PIN = "A0",
    SPEAKER_PIN = 2,
    MAJOR_SCALE = {
        c4: 262,
        d4: 294,
        e4: 330,
        f4: 349,
        g4: 392,
        a4: 440,
        b4: 494,
        c5: 523,
    };

var socket, user, start, volts, startTime, mic, piezo,
    sample = 0,
    signalMin = 1024,
    signalMax = 0;

var toSpeakerFreq = function (val, inMin, inMax, outMin, outMax) {
    var range = outMax - outMin;
    var num = range * (val - inMin) / (inMax - inMin) + outMin;
    num = (num < outMin) ? outMin : num;
    num = (num > outMax) ? outMax : num;
    return num;
};


/**
 * A function that keeps track of how many milliseconds
 * it has been since the board started. It checks to see if 
 * there is already a value associated with start, and if so,
 * returns the current time minus the start time. Otherwise,
 * it return 0
 */
var millis = function () {
    if (start instanceof Date) {
        var current = new Date();
        return current - start;
    }
    return 0;
};

var resetSignal = function () {
    signalMax = 0;
    signalMin = 1024;
};

/**
 * Map the output to a value in the Piezo notes object
 */
var mapToNote = function (val, scale, threshold) {
    var closestVal = 0;
    if (val > threshold) {
        for (var key in scale) {
            if (scale.hasOwnProperty(key)) {
                if (scale[key] < val && scale[key] > closestVal) {
                    closestVal = scale[key];
                }
            }
        }
    }
    return closestVal;
};

var input = function () {
    rawMic = this.value;
};

var resample = function (micVal) {
    if (millis() - startTime < SAMPLE_WINDOW) {
        if (micVal < 1024) {
            if (micVal > signalMax) {
                signalMax = micVal;
            } else if (micVal < signalMin) {
                signalMin = micVal;
            }
        }
    } else {
        var peakToPeak = signalMax - signalMin;
        volts = peakToPeak * 3.3 / 1024;
        
        resetSignal();
        startTime = millis();
        
        socket.emit('talking', {
            mic: volts,
            name: user.name,
            id: user.id
        });
    }
};

var output = function (volts) {
    var out = toSpeakerFreq(volts, .018, .1, 0, 1047);
    var mapped = mapToNote(out, MAJOR_SCALE, 262);
    if (mapped > 0) {
        piezo.frequency(mapped, time);
    } else {
        piezo.noTone();
    }
};

var ready = function () {
    mic = new five.Sensor(MIC_PIN);
    piezo = new five.Piezo(SPEAKER_PIN);
    start = new Date();
    startTime = millis();

    mic.on("data", input);
    this.loop(1, resample);
};

module.exports = function (sock, usr) {
    if (!sock) {
        throw new Error('No socket was passed.');
    } else if (!usr) {
        throw new Error('No user was passed');
    }

    socket = sock;
    user = usr;

    var board = new five.Board();
    board.on("ready", ready);
    board.output = function (data) {
        if (typeof data === 'number') {
            output(data);
        } else if (typeof data.mic === 'number') {
            output(data.mic)
        } else {
            console.log('Stay silent friend');
        }
    }

    return board;
}