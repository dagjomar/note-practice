var PitchView = require('./PitchView');
var PitchDetector = require('./pitchdetector');

var AudioContext = window.AudioContext || window.webkitAudioContext;


// PitchDetectorSettings from https://lab.madebymark.nl/pitch-detector/example/
// var pitchDetectorSettings = {
//     "start": true,
//     "length": 1024,
//     "stopAfterDetection": true,
//     "normalize": "rms",
//     "onDetect": false,
//     "minRms": 0.01,
//     "minCorrelationIncrease": 0.5,
//     "minCorrelation": false,
//     "minNote": 0,
//     "maxNote": 0
// };


var PitchDetect = function(parent){
    this.$parent = $(parent);
    this.$view = null;

    this.events = $({});
};

PitchDetect.prototype.init = function(){
    // this.$canvas = $('<canvas style="margin:0px;" id="canvasRain">Canvas Not Supported</canvas>');
     this.$view = $( PitchView() );
     this.$parent.append(this.$view);


    this.detector = new PitchDetector({
        // Audio Context (Required)
        context: new AudioContext(),

        // Input AudioNode (Required)
        input: false, // default: Microphone input

        // Output AudioNode (Optional)
        output: false, // default: no output

        // interpolate frequency (Optional)
        //
        // Auto-correlation is calculated for different (discrete) signal periods
        // The true frequency is often in-beween two periods.
        //
        // We can interpolate (very hacky) by looking at neighbours of the best
        // auto-correlation period and shifting the frequency a bit towards the
        // highest neighbour.
        interpolateFrequency: true, // default: true

        // Callback on pitch detection (Optional)
        onDetect: this.onDetect.bind(this),
        // onDetect: function(stats, pitchDetector) {

        //     stats.frequency // 440
        //     stats.detected // --> true
        //     stats.worst_correlation // 0.03 - local minimum, not global minimum!
        //     stats.best_correlation // 0.98
        //     stats.worst_period // 80
        //     stats.best_period // 100
        //     stats.time // 2.2332 - audioContext.currentTime
        //     stats.rms // 0.02

        // },

        // Debug Callback for visualisation (Optional)
        onDebug: function(/*stats, pitchDetector*/) { return; },

        // Minimal signal strength (RMS, Optional)
        minRms: 0.013, //0.028, //default 0.01,

        // Detect pitch only with minimal correlation of: (Optional)
        minCorrelation: 0.9, //default 0.9,

        // Detect pitch only if correlation increases with at least: (Optional)
        minCorreationIncrease: 0.4, //default 0.5,

        // Note: you cannot use minCorrelation and minCorreationIncrease
        // at the same time!

        // Signal Normalization (Optional)
        normalize: "rms", // or "peak". default: undefined

        // Only detect pitch once: (Optional)
        stopAfterDetection: false,

        // Buffer length (Optional)
        length: 1024, // default 1024

        // Limit range (Optional):
        minNote: 55, //G3 //by MIDI note number
        maxNote: 74, //D5

        // minFrequency: 440,    // by Frequency in Hz
        // maxFrequency: 20000,

        minPeriod: 2,  // by period (i.e. actual distance of calculation in audio buffer)
        maxPeriod: 512, // --> convert to frequency: frequency = sampleRate / period

        // Start right away
        start: true // default: false
    });

};

PitchDetect.prototype.onDetect = function(stats, pitchDetector) {
    //console.log('@onDetect func', stats, pitchDetector);
    console.log('PitchDetect.js @ onDetect');
    this.events.trigger('onDetect', [stats, pitchDetector]);
    // setTimeout(function(){
    //     console.log('trying to restart detection: ');
    //     pitchDetector.start();
    // }, 1000);
};

module.exports = PitchDetect;
