var debounce = window.JD.debounce;

var imgResources = {};

imgResources.clefG = new Image(); // Create new img element
imgResources.clefG.src = '/resources/images/clefG.png'; // Set source path

imgResources.noteSymbol = new Image(); // Create new img element
imgResources.noteSymbol.src = '/resources/images/noteSymbol.png'; // Set source path

imgResources.noteSymbolActive = new Image(); // Create new img element
imgResources.noteSymbolActive.src = '/resources/images/noteSymbolActive.png'; // Set source path

imgResources.noteSymbolRed = new Image(); // Create new img element
imgResources.noteSymbolRed.src = '/resources/images/noteSymbolRed.png'; // Set source path

imgResources.noteSymbolBlue = new Image(); // Create new img element
imgResources.noteSymbolBlue.src = '/resources/images/noteSymbolBlue.png'; // Set source path

imgResources.noteSymbolGreen = new Image(); // Create new img element
imgResources.noteSymbolGreen.src = '/resources/images/noteSymbolGreen.png'; // Set source path

var noteCollections = {
    'default': ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5'],
    'onlyB': ['B4']
};

var canvas = function(parent){
    this.canvas = null;
    this.context = null;
    this.bufferCanvas = null;
    this.bufferCanvasCtx = null;
    this.noteArray = [];
    this.noteTimer = null;
    this.maxNotes = 3; // Here you may set max flackes to be created
    this.notesOffsetX = 300; //increased offsed when playing
    this.showNoteName = true;
    this.speed = 2; //2 vas very good for starting off, even with note names, but after 10 minutes, turned off note names, then after another 5 minutes, want higher speed.
    //3 was challenging enough for a while. Sometimes jumped out after doing an error.
    // But wanted to try faster still...testing 4... 4 was just too fast right now. Testing 3.5 that was a bit better

    this.noteDistance = 100;
    this.noteLineheight = 10;

    this.lastRender = Date.now();

    this.$parent = $(parent);

    this.activeNote = null;

    this.events = $({});
};

var randomNoteCollectionNote = function(collection) {
    var min = 0;
    var max = collection.length - 1;

    /**
     * http://stackoverflow.com/questions/1527803/generating-random-numbers-in-javascript-in-a-specific-range
     * Returns a random integer between min (inclusive) and max (inclusive)
     * Using Math.round() will give you a non-uniform distribution!
     */
    var rand = Math.floor(Math.random() * (max - min + 1)) + min;
    return collection[rand];
};

var midiNumberingFunc = function(noteStr){
    var str = noteStr;
    var note = str.substring(0, 1);
    var noteNum = str.substring(1,2);

    var strMap = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
    var letterIndex = strMap.indexOf(note);

    var startInt = 12; //Start of MIDI numbering

    var sum = startInt + (12 * noteNum) + letterIndex;
    return sum;
};
var sheetNumberingFunc = function(noteStr, sheetRef){
    //sheetRef can be "G4" or "F3"
    var str = noteStr;
    var note = str.substring(0, 1);
    var noteNum = str.substring(1,2);

    var strMap = ['C','D','E','F','G','A','B'];
    var letterIndex = strMap.indexOf(note);

    var ref = false;
    if(sheetRef){
        ref = sheetRef;
    }

    var startInt = 0;
    if(ref){
        startInt = -sheetNumberingFunc(ref);
    }

    var sum = startInt + (7 * noteNum) + letterIndex;
    return sum;
};

var NoteSymbol = function(str) {
    if(!str){
        throw new Error("No note string given");
    }
    this.id = Date.now();
    this.noteStr = str;
    this.midiNum = midiNumberingFunc(this.noteStr);
    this.sharp = this.noteStr.substring(2,3) === '#';
    this.flat = this.noteStr.substring(2,3) === 'b';
    this.active = false;
    this.played = false;
    this.correct = null;
    //console.log(this);
};
NoteSymbol.prototype.toString = function() {
    return {'noteStr': this.noteStr, 'midiNum': this.midiNum, 'sharp': this.sharp, 'flat':this.flat};
};

var drawNoteLine = function(canvas, ctx, offset){
    // linear gradient from start to end of line
    var left = offset.x;
    var top = offset.y;
    var width = canvas.width;

    var grad= ctx.createLinearGradient(left, top, left + width, top);
    grad.addColorStop(0, "#FAFAFA");
    grad.addColorStop(0.2, "#FAFAFA");
    grad.addColorStop(0.25, "#909090");
    grad.addColorStop(0.75, "#909090");
    grad.addColorStop(0.8, "#FAFAFA");
    grad.addColorStop(1, "#FAFAFA");

    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left + width, top);

    ctx.stroke();
};
var drawNoteLines = function(canvas, ctx, offset, lineHeight){
    // linear gradient from start to end of line
    var left = offset.x;
    var top = offset.y;
    //var width = canvas.width;

    for(var i = 0; i < 5; i++){
        top += lineHeight;
        drawNoteLine(canvas, ctx, {x: left, y: top});
    }
};

var drawNoteSymbol = function(note, canvas, ctx, offset){
    var left = offset.x;
    var top = offset.y + 6;
    if(note.active && !note.played){
        ctx.drawImage(imgResources.noteSymbolBlue,left,top);
    }else if( note.played && note.correct === true ){
        ctx.drawImage(imgResources.noteSymbolGreen,left,top);
    }else if( note.played && note.correct === false){
        ctx.drawImage(imgResources.noteSymbolRed,left,top);
    }else{
        ctx.drawImage(imgResources.noteSymbol,left,top);
    }
};


// var drawPlayHeadLine = function(canvas, ctx, offset){
//     // linear gradient from start to end of line
//     var width = canvas.width;
//     var height = canvas.height;
//     var left = offset.x + width/2;
//     var top = offset.y;
//     var bottom = top+height;

//     var grad= ctx.createLinearGradient(left, top, left, bottom);
//     grad.addColorStop(0, "#FAFAFA");
//     grad.addColorStop(0.2, "#FAFAFA");
//     grad.addColorStop(0.25, "#909090");
//     grad.addColorStop(0.75, "#909090");
//     grad.addColorStop(0.8, "#FAFAFA");
//     grad.addColorStop(1, "#FAFAFA");

//     ctx.strokeStyle = grad;

//     ctx.beginPath();
//     ctx.moveTo(left, top);
//     ctx.lineTo(left, bottom);

//     ctx.stroke();
// };

var drawActiveNoteFields = function(canvas, ctx, offset){
    // linear gradient from start to end of line
    var width = canvas.width;
    var height = canvas.height;
    var left = offset.x;
    var top = offset.y;
    var bottom = top+height;
    //var centerX = offset.x + width/2;
    //var leftMin = centerX - 0.5*noteDistance;
    //var leftMax = centerX + 1.5*noteDistance;

    //var leftMin = centerX - 3*noteDistance;
    //var leftMax = centerX + 3*noteDistance;

    var leftMin = Math.floor( width * 0.3 );
    var leftMax = Math.floor( width - (width * 0.25) );
    // console.log('left: ' + left);
    // console.log('leftMin: ' + leftMin);

    var grad = ctx.createLinearGradient(left, top, left, bottom);
    grad.addColorStop(0, "#FAFAFA");
    grad.addColorStop(0.2, "#FAFAFA");
    grad.addColorStop(0.25, "#909090");
    grad.addColorStop(0.75, "#909090");
    grad.addColorStop(0.8, "#FAFAFA");
    grad.addColorStop(1, "#FAFAFA");

    ctx.strokeStyle = grad;

    ctx.beginPath();
    ctx.moveTo(leftMin, top);
    ctx.lineTo(leftMin, bottom);

    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(leftMax, top);
    ctx.lineTo(leftMax, bottom);

    ctx.stroke();
};

var drawNoteSymbolName = function(note, simple, canvas, ctx, offset){
    var left = offset.x + 8;
    var top = offset.y;

    ctx.font = "16px Roboto";
    ctx.textAlign = "center";
    ctx.fillStyle = "#8B8B8B";

    var str = simple ? note.noteStr.substring(0,2) : note.noteStr;

    ctx.fillText(str,left,top);
};

var imageFadingFunction = function (x, minX, maxX, reverse) {
    if(x >= minX && x <= maxX){
        if(reverse){
            return 1- ( (maxX - x)/( maxX - minX) );
        }else{
            return (maxX - x)/( maxX - minX);
        }
    }else{
        return 1;
    }
};
var drawNoteSymbols = function(canvas, ctx, offset, array, noteDistance, showName, lineHeight){

    for (var i = 0; i < array.length; i++) {
        var left = offset.x + i*noteDistance;
        var top = offset.y;

        //console.log('x: ' + left);
        var minX = Math.floor( canvas.width * 0.25 );
        var maxX = Math.floor( canvas.width - (canvas.width * 0.25) );

        if(left > minX && left < maxX ){
            //Draw

            if(left > minX && left < minX + 100){
                ctx.globalAlpha = imageFadingFunction( left, minX, minX + 100, true);
            }else if( left > (maxX - 100) && left < maxX ){
                ctx.globalAlpha = imageFadingFunction( left, maxX-100, maxX, false);
            }

            var sheetOffset = sheetNumberingFunc(array[i].noteStr, 'G4');
            top += -(sheetOffset*(lineHeight/2));

            drawNoteSymbol( array[i], canvas, ctx, {x: left, y: top});

            if(showName){
                drawNoteSymbolName( array[i], true, canvas, ctx, {x: left, y: offset.y + lineHeight * 5 + 60} );
            }

            ctx.globalAlpha = 1;
        }
    }
};

var drawClefG = function(canvas, ctx, offset){
    var left = canvas.width * 0.23 + offset.x + 0;
    ctx.drawImage(imgResources.clefG,left,offset.y-2);
};


canvas.prototype.init = function(){
    this.$canvas = $('<canvas style="margin:0px;" id="canvasRain">Canvas Not Supported</canvas>');
    this.$parent.append(this.$canvas);
    this.canvas = this.$canvas.get(0);
    this.context = this.canvas.getContext("2d");

    this.bufferCanvas = document.createElement("canvas");
    this.bufferCanvas.width = this.canvas.width = this.$parent.get(0).clientWidth;
    this.bufferCanvas.height = this.canvas.height = this.$parent.get(0).clientHeight;
    this.bufferCanvasCtx = this.bufferCanvas.getContext("2d");
    //bufferCanvasCtx.canvas.width = context.canvas.width;
    //bufferCanvasCtx.canvas.height = context.canvas.height;

    this.draw();

    window.requestAnimationFrame(this.animate.bind(this));

    $(window).resize(debounce(this.resize, 100).bind(this));
};
canvas.prototype.resize = function(){

    this.bufferCanvas.width = this.canvas.width = this.$parent.get(0).clientWidth;
    this.bufferCanvas.height = this.canvas.height = this.$parent.get(0).clientHeight;

};
canvas.prototype.animate = function() {
    var delta = Date.now() - this.lastRender;
    this.lastRender = Date.now();
    this.draw();
    this.update(delta);
    window.requestAnimationFrame(this.animate.bind(this));
};



canvas.prototype.addNote = function(a, collection){
    var newNote;
    if(typeof a === String){
        newNote = new NoteSymbol(a);
    }else{
        if(a && !collection){
            throw new Error('No collection given to addnote');
        }

        var selArray;
        if(collection){
            selArray = noteCollections[collection];
        }else{
            selArray = noteCollections['default'];
        }

        var randNoteStr = randomNoteCollectionNote(selArray);
        newNote = new NoteSymbol(randNoteStr);
    }


    this.noteArray[this.noteArray.length] = newNote;
};

canvas.prototype.draw = function() {
    this.context.save();
    this.blank();
    var refCoordinates = {x: 0, y: 100};


    drawNoteLines(this.bufferCanvas, this.bufferCanvasCtx, {x: refCoordinates.x, y:  refCoordinates.y}, this.noteLineheight );
    drawClefG(this.bufferCanvas, this.bufferCanvasCtx, {x: refCoordinates.x, y: refCoordinates.y});
    //drawPlayHeadLine(this.bufferCanvas, this.bufferCanvasCtx, {x: 0, y: -20});
    drawActiveNoteFields(this.bufferCanvas, this.bufferCanvasCtx, {x: refCoordinates.x, y: -20}, this.noteArray, this.noteDistance);
    drawNoteSymbols(this.bufferCanvas, this.bufferCanvasCtx, {x: refCoordinates.x + this.bufferCanvas.width  - this.notesOffsetX, y: refCoordinates.y}, this.noteArray, this.noteDistance, this.showNoteName, this.noteLineheight);


    this.context.drawImage(this.bufferCanvas, 0, 0, this.bufferCanvas.width, this.bufferCanvas.height);
    this.context.restore();
};

canvas.prototype.blank = function() {
    this.bufferCanvasCtx.fillStyle = "rgba(250 ,250,250,1)";
    this.bufferCanvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
};


canvas.prototype.setActiveNote = function(note){

    if(note){
        note.active = true;
    }else{
        note = null;
    }

    if( !(this.activeNote && note && this.activeNote.id === note.id) &&
        !(!this.activeNote && !note) )
    {
        //console.log('@setActiveNote changed from' , this.activeNote , ' to ' , note);
        this.events.trigger('onActiveNoteChanged', note);
    }

    this.activeNote = note;

};

canvas.prototype.setPlayedNote = function(note, correct){
    if(note){
        note.played = true;
        note.active = false;
        note.correct = correct === true ? true : false;
    }
};

canvas.prototype.getActiveNotes = function(){
    var active = [];
    for (var i = 0; i < this.noteArray.length; i++) {
        if(this.noteArray[i].active && !this.noteArray[i].played){
            active.push(this.noteArray[i]);
        }
    }

    return active;
};


canvas.prototype.setActiveNoteAsPlayed = function(correct){
    var active = this.getActiveNotes();

    if(active.length){
        this.setPlayedNote(active[0], correct);
        this.updateActiveNotes(this.bufferCanvas, this.bufferCanvasCtx, this.noteArray, this.noteDistance);
    }
};

canvas.prototype.updateActiveNotes = function(canvas, ctx, array, noteDistance){
    //Find which note is within 'active field' and update the property with this note
    //If note has a property of 'played' - it is not to become active anymore

    var width = canvas.width;
    //var centerX = width/2;
//    var leftMin = centerX - 0.5*noteDistance; //this.noteArray.length * this.noteDistance  - (2 * noteDistance);
//    var leftMax = centerX + 1.5*noteDistance; //this.noteArray.length * this.noteDistance;
//    var leftMin = centerX - 3*noteDistance; //this.noteArray.length * this.noteDistance  - (2 * noteDistance);
//    var leftMax = centerX + 3*noteDistance; //this.noteArray.length * this.noteDistance;

    var leftMin = Math.floor( width * 0.3 );
    var leftMax = Math.floor( width - (width * 0.25) );

    leftMin = this.convertCanvasXToNoteXOffset(leftMin);
    //console.log('after calc: leftMin: ' + leftMin);
    leftMax = this.convertCanvasXToNoteXOffset(leftMax);

    for (var i = 0; i < array.length; i++) {
        var left =  i*noteDistance;
        if(!array[i].played){
            if(left > leftMin && left < leftMax){
                if(array[i].active && !array[i].played){
                    return;
                }
                if(array[i].active === false){
                    this.setActiveNote(array[i]);
                    return;
                }
            }else{
                array[i].active = false;
            }
        }
    }

    //Do a check to see if we have any active notes at all
    var active = this.getActiveNotes();
    if(active.length === 0){
        this.setActiveNote(null);
    }
};

canvas.prototype.convertCanvasXToNoteXOffset = function(x) {
    //Goal here is to input x = 600, and get f.eks. output x = -13323
    // where the output x is calculated from

    var calculated = x - this.bufferCanvas.width + this.notesOffsetX;

    //console.log('@convertCanvasXToNoteX input '+ x +', calculated: ' + calculated);

    return calculated;
};

canvas.prototype.update = function(delta) {

    var calcDelta = (this.speed * delta) / 50;

    this.notesOffsetX += calcDelta;

    var leftMax = this.noteArray.length * this.noteDistance;
    //AHA - in here, we add notes in constant order, but the movement is not cosntant? Or? Hmm shouldnt matter perhaps?
    var shouldAdd = (leftMax + this.notesOffsetX ) >= this.noteDistance;

    if(shouldAdd){
        this.addNote(null, 'default');
    }
    this.updateActiveNotes( this.bufferCanvas, this.bufferCanvasCtx, this.noteArray, this.noteDistance );
};


module.exports = canvas;
