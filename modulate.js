const five = require('johnny-five'),
      SAMPLE_WINDOW = 50,
      MIC_PIN = 'A0',
      SPEAKER_PIN = 2;
    
var board = new five.Board(),
    sample = 0,
    start = null;


var normalizeMic = function(range, min, max, val) {
    var num = range * (val - min) / (max - min);
    return num;
};

var toSpeakerFreq = function(val, inMin, inMax, outMin, outMax) {
    var range = outMax - outMin;
    var num = (val - inMin) / (inMax - inMin);
    var returnVal = (num > 0.5) ? 1 : 0;
    // var num = range * (val - inMin) / (inMax - inMin) + outMin;
    return returnVal;
};

var millis = function () {
    if (start instanceof Date) {
        var current = new Date();
        return current - start;
    }
    return 0;
};

var resample = function () {
    var analogRead = Q.nfbind(this.analogRead),
        startMillis = millis(),
        peakToPeak = 0,
        signalMax = 0,
        signalMin = 1024,
        working = 0;

    while (millis() - startMillis < SAMPLE_WINDOW) {
        working += 1;
        analogRead(MIC_PIN)
        .then(function (data) {
            sample = data;
            if (sample < 1024) {
                if (sample > signalMax) {
                    signalMax = sample;
                } else if (sample < signalMin) {
                    signalMin = sample;
                }
            }
            working -= 1;
        });
    }
    while (working > 0) {
        console.log('sampling...');
    }
    peakToPeak = signalMax - signalMin;
    volts = (peakToPeak * 3.3) / 1024;
    return volts;
};

board.on("ready", function() {
    var mic = new five.Sensor(MIC_PIN),
        piezo = new five.Piezo(SPEAKER_PIN);
    start = new Date();
    
    
    // if above a certain threshold, output to speaker

    // otherwise, calculate a threshold
    mic.on('data', function () {
        this.loop(1, function () {
            console.log(resample);
        });
    });
    
    
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
