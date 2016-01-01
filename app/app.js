var tmpl = require("templates/main");

var NoteCanvas = require('NoteCanvas/canvas');
var PitchDetect = require('PitchDetect/PitchDetect');
var PitchNoteController = require('./PitchNoteController');

var app = function(parent){
    var $tmpl = $(tmpl());
    $(parent).append($tmpl);
    this.noteCanvas = new NoteCanvas('.canvas-wrapper');
    this.pitchDetect = new PitchDetect('.pitch-detect-wrapper');
    this.noteCanvas.init();
    this.pitchDetect.init();
    this.pitchNoteController = new PitchNoteController(this.noteCanvas, this.pitchDetect);
};

module.exports = app;
