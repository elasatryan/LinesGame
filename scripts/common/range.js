(function () {
    'use strict';
    function Range(start, end) {
        var that = this;
        that.start = start;
        that.end = end;
    }

    $.extend(Range.prototype, {
        forEach: function (callback, context) {
            var that = this,
                start = that.start;
            for (var i = start; i < that.end; i++) {
                callback.call(context, i, i - start, that);
            }
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
    })
})();