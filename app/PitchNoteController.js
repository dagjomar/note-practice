var Normalizer = require("DetectorNormalizer");

var Controller = function(noteCanvas, pitchDetector){
    this.noteCanvas = noteCanvas;
    this.pitchDetector = pitchDetector;
    this.normalizer = new Normalizer(this.pitchDetector);
    this.setUpListeners();

    this.currentNote = null;
};

Controller.prototype.onDetect = function(e, stats, pitchDetector){
    //console.log('controller @onDetect', stats, pitchDetector);
    var detected = pitchDetector.getNoteString();
    var current = this.currentNote && this.currentNote.noteStr || null;

    console.log('detected note: ' + detected);
    console.log('current note: ' + current);


    var correct = (detected === current);

    console.log('match? ' + ( detected === current ) );

    this.noteCanvas.setActiveNoteAsPlayed( correct );
};
Controller.prototype.onPredicted = function(e, a){
    console.log('@PitchNoteController onPredicted event',a);
    var score = a && a.score;
    //var current = this.currentNote && this.currentNote.noteStr || null;

    var correct = (score > 0.8);

    console.log('match? ' + correct );

    this.noteCanvas.setActiveNoteAsPlayed( correct );
};

Controller.prototype.onActiveNoteChanged = function(e, note){
    //console.log('controller @onActiveNoteChanged', note);
    this.currentNote = note;
    this.normalizer.setPredicted(note ? note.noteStr : null);
    // if(note){
    //     setTimeout(function(){
    //         this.pitchDetector.detector.start();
    //     }.bind(this), 40);
    // }else{
    //     this.pitchDetector.detector.stop();
    // }
};

Controller.prototype.setUpListeners = function(){
    console.log('@setUpListeners');
    //this.pitchDetector.events.on('onDetect', this.onDetect.bind(this) );
    this.normalizer.events.on('onPredicted', this.onPredicted.bind(this) );

    this.noteCanvas.events.on('onActiveNoteChanged', this.onActiveNoteChanged.bind(this) );

    document.addEventListener('keydown', function(event) {
        console.log('keydown ', event);
        if(event.keyCode === 32){ //SPACE
            this.noteCanvas.setActiveNoteAsPlayed();
        }
    }.bind(this), false);
};

module.exports = Controller;
