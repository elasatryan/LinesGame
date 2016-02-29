$.extend(Math, {
    //this function will return random number from range 0 to (size-1)
    randomInt: function (size) {
        return Math.floor(Math.random() * size);
    }
});

// as in aqurejs
$.extend(JSON, {
    clone: function (json) {
        return JSON.parse(JSON.stringify(json));
    }
});

var proto = Array.prototype;
$.extend(Array, {
    reverse: function(arr) {
        return proto.reverse.call(arr);
    },
    clone: function(arr) {
        return proto.slice(arr);
    }
});