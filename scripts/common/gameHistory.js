(function () {
    'use strict';
    function GameHistory() {
        var that = this;
        that.undone = [];
    }

    GameHistory.prototype = [];
    $.extend(GameHistory.prototype, {
        undo: function () {
            var that = this;
            if (1 === that.length) {
                return null;
            }
            that.undone.push(that.pop());

            return that;
        },
        redo: function () {
            var that = this,
                item = that.undone.pop();
            return item && that.push(item) && that;
        },
        addTrace: function (trace) {
            var that = this;
            if (!(trace instanceof GameTrace)) {
                throw new Error('Invalid argument');
            }
            that.undone.length = 0;
            that.push(trace);

            return that;
        },
        getLastTrace: function () {
            var that = this;
            return that[that.length - 1];
        },
        getScore: function () {
            var that = this;
            return that.getLastTrace().score;
        }
    });
    window.GameHistory = GameHistory;
})();