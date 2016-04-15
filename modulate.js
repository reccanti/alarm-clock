const five = require("johnny-five"),
    SAMPLE_WINDOW = 50,
    MIC_PIN = 0,
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
    }
    

var board = new five.Board(),
    sample = 0,
    start = null;


/**
 * TEST FUNCTION
 */
var normalizeMic = function (range, min, max, val) {
    var num = range * (val-min)/(max - min);
    return num;
};


/**
 * TEST FUNCTION
 */
var toSpeakerFreq = function (val, inMin, inMax, outMin, outMax) {
    var range = outMax - outMin;
    // var num = (val - inMin) / (inMax - inMin);
    // var returnVal = (num > 0.5) ? 1 : 0;
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
}


/**
 * Resample the signal max and min values to 
 * to determine the voltage
 */
var resample = function (cur, min, max, start) {
    if (millis() - start < SAMPLE_WINDOW) {
        console.log(cur);
    }
}


/**
 * Map the output to a value in the Piezo notes object
 */
var mapToNote = function (val, scale, threshold) {
    var closestVal = 0;
    if (val > threshold) {
        for (key in scale) {
            if (scale.hasOwnProperty(key)) {
                if (scale[key] < val && scale[key] > closestVal) {
                    closestVal = scale[key];
                }
            }
        }
    }
    return closestVal;
}


board.on("ready", function() {
    var mic = new five.Sensor("A0");
    var piezo = new five.Piezo(2);
    var time = 250;
    
    var signalMin = 1024;
    var signalMax = 0;
    var count = 0;
    var peakToPeak = 0;
    var volts = 0;
    
    start = new Date();
    
    var micVal = 0;
    mic.on("data", function () {
        micVal = this.value;
    });
    
    
    console.log(five.Piezo.Notes)
    var startTime = millis();
    // this.loop(1, function() {
    //     resample(micVal, signalMin, signalMax, startTime);
    // });
    
    
    // // if above a certain threshold, output to speaker
    
    // otherwise, calculate a threshold4
    
    /**
     * This loop samples the microphones input and
     * logs it in a volt variable. After each sample, it
     * resets itself.
     */
    this.loop(1, function () {
        if (millis() - startTime < SAMPLE_WINDOW) {
            if (micVal < 1024) {
                if (micVal > signalMax) {
                    signalMax = micVal;
                } else if (micVal < signalMin) {
                    signalMin = micVal;
                }
            }
        } else {
            peakToPeak = signalMax - signalMin;
            volts = peakToPeak * 3.3 / 1024;
            signalMax = 0;
            signalMin = 1024;
            startTime = millis();
        }
    });
    
    
    /**
     * This loop converts the volt into a value that the
     * speaker can use and then outputs it.
     */
    this.loop(time, function() {
        var out = toSpeakerFreq(volts, .018, .1, 0, 1047);
        // console.log(out);
        var mapped = mapToNote(out, MAJOR_SCALE, 262);
        if (mapped > 0) {
            piezo.frequency(mapped, time);
        } else {
            piezo.noTone();
        }
    });
    
    
    // this.wait(1, function() {
    //     mic.on("data", function() {
    //         if (count < 50) {
    //             if (this.value < 1024) {
    //                 if (this.value > signalMax) {
    //                     signalMax = this.value;
    //                 } else if (this.value < signalMin) {
    //                     signalMin = this.value;
    //                 }
    //             }
    //             count++;
    //         } else {
    //             peakToPeak = signalMax - signalMin;
    //             volts = peakToPeak * 3.3 / 1024;
    //             console.log(volts);       
    //         }
    //     });
    // });
    // peakToPeak = signalMax - signalMin;
    // var volts = peakToPeak * 3.3 / 1024;
    // console.log(volts);
    
    
       // collect data for 50 mS
//    while (millis() - startMillis < sampleWindow)
//    {
//       sample = analogRead(0);
//       if (sample < 1024)  // toss out spurious readings
//       {
//          if (sample > signalMax)
//          {
//             signalMax = sample;  // save just the max levels
//          }
//          else if (sample < signalMin)
//          {
//             signalMin = sample;  // save just the min levels
//          }
//       }
//    }
//    peakToPeak = signalMax - signalMin;  // max - min = peak-peak amplitude
//    double volts = (peakToPeak * 3.3) / 1024;  // convert to volts
    
    
    
    // this.wait(time, function() {
        
    //     // if above a certain threshhold, output the value
        
    //     // otherwise, use the data 
    //     mic.on("data", function() {
    //         // var num = normalizeMic(30, 330, 380, this.value);
    //         var num = toSpeakerFreq(this.value, 320, 360, 370, 784);
    //         console.log(num);
    //         (num === 1) ? piezo.frequency(988, time) : piezo.noTone(time);
    //     });
    // });
    
});
