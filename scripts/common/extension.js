(function () {
    'use strict';

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

    var ArrayProto = Array.prototype;
    $.extend(Array, {
        slice: function (arrayLike, start, end) {
            return ArrayProto.slice.call(arrayLike, start, end);
        }
    });

    ['forEach', 'some', 'every', 'filter'].forEach(function (name) {
        Array[name] = function (arrayLike) {
            return ArrayProto[name].apply(arrayLike, Array.slice(arguments, 1));
        }
    });

    $.extend($.fn, {
        disable: function () {
            return this.attr('disable', 'disable');
        },
        enable: function () {
            return this.removeAttr('disable');
        }
    })

})();