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