var five = require("johnny-five"),
    board = new five.Board();

var normalizeMic = function (range, min, max, val) {
    var num = range * (val-min)/(max - min);
    return num;
};

var toSpeakerFreq = function (val, inMin, inMax, outMin, outMax) {
    var range = outMax - outMin;
    var num = (val - inMin) / (inMax - inMin);
    var returnVal = (num > 0.5) ? 1 : 0;
    // var num = range * (val - inMin) / (inMax - inMin) + outMin;
    return returnVal; 
};

board.on("ready", function() {
    var mic = new five.Sensor("A0");
    var piezo = new five.Piezo(2);
    var time = 16;
    
    var signalMin = 1024;
    var signalMax = 0;
    var count = 0;
    var peakToPeak = 0;
    var volts = 0;
    
    // if above a certain threshold, output to speaker
    
    // otherwise, calculate a threshold
    this.wait(1, function() {
        mic.on("data", function() {
            if (count < 50) {
                if (this.value < 1024) {
                    if (this.value > signalMax) {
                        signalMax = this.value;
                    } else if (this.value < signalMin) {
                        signalMin = this.value;
                    }
                }
                count++;
            } else {
                peakToPeak = signalMax - signalMin;
                volts = peakToPeak * 3.3 / 1024;
                console.log(volts);       
            }
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
