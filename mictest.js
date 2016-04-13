var five = require("johnny-five"),
    board = new five.Board();


var tenStars = function(min, max, val) {
    var numstars = Math.floor(10 * (val-min)/(max - min));
    var returnStr = '';
    for (var i = 0; i < numstars; i++) {
        returnStr += '*';
    }
    return returnStr;
};


var variableStars = function(numStars, min, max, val) {
    var num = Math.floor(numStars * (val-min)/(max - min));
    var returnStr = '';
    for (var i = 0; i < num; i++) {
        returnStr += '*';
    }
    return returnStr;
};


board.on("ready", function() {

    var mic = new five.Sensor("A0");
    var led = new five.Led(5);
    var min = 335;
    var max = 355;

    mic.on("data", function() {
        // var val = Math.floor(100 * (this.value-min)/(max - min));
        console.log(variableStars(20, min, max, this.value));
        // console.log(this.value);
    });
    // // Creates a piezo object and defines the pin to be used for the signal
    // var piezo = new five.Piezo(2);

    // var play = function(tempo) {
    //     // Plays a song
    //     piezo.play({
    //         // song is composed by an array of pairs of notes and beats
    //         // The first argument is the note (null means "no note")
    //         // The second argument is the length of time (beat) of the note (or non-note)
    //         song: [
    //             ["C4", 1 / 4],
    //             ["D4", 1 / 4],
    //             ["F4", 1 / 4],
    //             ["D4", 1 / 4],
    //             ["A4", 1 / 4],
    //             [null, 1 / 4],
    //             ["A4", 1],
    //             ["G4", 1],
    //             [null, 1 / 2],
    //             ["C4", 1 / 4],
    //             ["D4", 1 / 4],
    //             ["F4", 1 / 4],
    //             ["D4", 1 / 4],
    //             ["G4", 1 / 4],
    //             [null, 1 / 4],
    //             ["G4", 1],
    //             ["F4", 1],
    //             [null, 1 / 2]
    //         ],
    //         tempo: tempo
    //     });

    //     // Plays the same song with a string representation
    //     piezo.play({
    //         // song is composed by a string of notes
    //         // a default beat is set, and the default octave is used
    //         // any invalid note is read as "no note"
    //         song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
    //         beats: 1 / 4,
    //         tempo: tempo
    //     });

    // }

    // // Injects the piezo into the repl
    // board.repl.inject({
    //     piezo: piezo,
    //     play: play
    // });

    // play(100);

});
