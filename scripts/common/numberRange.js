(function () {
    'use strict';
    function NumberRange(start, end) {
        var that = this;
        that.start = start;
        that.end = end;
    }

    $.extend(NumberRange.prototype, {
        forEach: function (callback, context) {
            var that = this,
                start = that.start;
            for (var i = start; i < that.end; i++) {
                callback.call(context, i, i - start, that);
            }
        },
        map:  function (callback, context) {
            var that = this,
                start = that.start,
                result = [];

            for (var i = start; i < that.end; i++) {
                result.push(callback.call(context, i, i - start, that));
            }

            return result;
        },
        some: function (callback, context) {
            var that = this,
                start = that.start;
            for (var i = start; i < that.end; i++) {
                if(callback.call(context, i, i - start, that)) {
                    return true;
                }
            }

            return false;
        },
        every: function (callback, context) {
            var that = this,
                start = that.start;
            for (var i = start; i < that.end; i++) {
                if(!callback.call(context, i, i - start, that)) {
                    return false;
                }
            }

            return true;
        },
        reduce: function (callback, initial, context) {
            var that = this,
                start = that.start,
                startFrom = start;

            var prev = initial === undefined ? startFrom++ : initial;

            for (var i = startFrom; i < that.end; i++) {
                prev = callback.call(context, prev, i, i - start, that);
            }

            return prev;
        }
    });

    window.NumberRange = NumberRange;
})();