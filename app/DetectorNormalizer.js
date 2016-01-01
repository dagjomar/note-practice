var debounce = window.JD.debounce;

//Usage intent:
//instead of external app listeing to the pitchDetector onDetect event,
// this plugin is used instead, which has the same event
// However, this needs an input for 'predicted' value to operate
// so use the functions setPredicted('B4'); to set a new predicted value
// also setPredicted(null) will cause the onDetect event to not fire, but wait for a new predicted value

var Normalizer = function(pitchDetector){
    this.pitchDetector = pitchDetector;

    this.setUpListeners();

    this.noteBuffer = [];

    this.events = $({});

    this.predictedVal = null;
};

Normalizer.prototype.setPredicted = function(val){
    this.clearBuffer();
    this.predictedVal = val;
};


Normalizer.prototype.onDetect = function(e, stats, pitchDetector){
    //console.log('controller @onDetect',stats, pitchDetector);
    if(this.predictedVal === null){
        return;
    }
    var detected = pitchDetector.getNoteString();
    this.noteBuffer.push(detected);
    this.update();
};

Normalizer.prototype.update = debounce(function(){
        var score = this.scoreBuffer(this.noteBuffer, this.predictedVal);
    console.log('@update, score is: ' + score);
        this.events.trigger('onPredicted', {score: score, predicted: this.predictedVal});
        this.printBuffer();
        this.clearBuffer();
}, 100, false);

//Return the element with maximum count or array if even steven
function maxEl(array){
    var keys = {};
     //["D5", "B4", "B4", "B4", "B4", "B3", "B4", "B3", "B4"]
     $.each(array, function(i, key){
        if(keys[key] !== undefined){
            keys[key].count = keys[key].count + 1;
        }else{
            keys[key] = {count: 1, val: key};
        }
     });

     var max = 0;
     $.each(keys, function(i, key){
        if (key.count > max){
            max = key.count;
        }
     });


     var maxes = [];
     $.each(keys, function(i, key){
        if (key.count === max){
            maxes.push(key);
        }
     });

     //console.log('done maxEl stuff. got final maxes: ', maxes);
     return maxes;

}

Normalizer.prototype.scoreBuffer = function(buffer, predicted){
    function comp(compare, predicted){
        return predicted === compare ? 1 : 0;
    }

     //["D5", "B4", "B4", "B4", "B4", "B3", "B4", "B3", "B4"]
    var maxes = maxEl(buffer);
    //console.log('maxEl: ', maxes);


    //The mode one should be scored high if there are more than 5 items
    //When items < 5, maxes won't necessarily be any help
    //When items < 5, checking directly agains predicted might be the only help, but still not completely certain.



    if(maxes.length === 1){

        maxes[0].score = (predicted === maxes[0].val ? 1 : 0);

        return maxes[0].score;
    }

    if(maxes.length === 2){

        if( comp(maxes[1].val, predicted)){
            maxes[1].score = 0.8;
            return maxes[1].score;
        }else if( comp(maxes[0].val, predicted) ){
            maxes[0].score = 0.5;
            return maxes[0].score;
        }else{
            return 0;
        }

    }
    if(maxes.length === 3){ //IE [wrong, right, right]
        if( comp(maxes[2].val, predicted) && comp(maxes[1].val, predicted) ){
            return 0.8;
        }

        if( comp(maxes[2].val, predicted)){
            maxes[2].score = 0.8;
            return maxes[2].score;
        }else if( comp(maxes[1].val, predicted) ){
            maxes[1].score = 0.5;
            return maxes[1].score;
        }else{
            return 0;
        }

    }

    if(buffer.length > 7 && maxes.length === 1 && comp(maxes[0].val, predicted) ){
        maxes[0].score = 0.95;
        return maxes[0].score;
    }else if(maxes.length > 7 && maxes.length > 1){
        return 0.84;
    }

    console.log('got this far, return undefined', buffer, maxes);

};

Normalizer.prototype.printBuffer = function(){
    console.log('buffer:', this.noteBuffer);
};

Normalizer.prototype.clearBuffer = function(){
    this.noteBuffer = [];
};

Normalizer.prototype.setUpListeners = function(){
    console.log('@setUpListeners');
    this.pitchDetector.events.on('onDetect', this.onDetect.bind(this) );
};

module.exports = Normalizer;
