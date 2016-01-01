var MockDetector = function(){

    this.events = $({});
    this.on = false;

    this.curNoteStr = null;
};

MockDetector.prototype.fakeTrigger = function(str){
    this.curNoteStr = str;
    //console.log('@fakeTrigger', {}, this);
    this.events.trigger('onDetect', [{},this]);
};

MockDetector.prototype.fakeTriggers = function(bufferArray, interval){
    this.on = true;
    var run = bufferArray.length -1;
    var intId = setInterval(function(){
        if(run < 0){
            this.on = false;
            clearInterval(intId);
            return;
        }
        if(this.on){
            this.fakeTrigger(bufferArray[run]);
            run -= 1;
        }
    }.bind(this), interval || 50);
};



MockDetector.prototype.getNoteString = function(){
    return this.curNoteStr || null;
};

module.exports = MockDetector;