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
                return;
            }
            that.undone.push(that.pop());

            return that;
        },
        redo: function () {
            var that = this,
                item = that.undone.pop();
            item && that.push(item);
        },
        addStep: function (step) {
            var that = this;
            if (!step) {
                throw new Error('Invalid argument');
            }
            that.undone.length = 0;
            that.push(step);
        },
        getLastStep: function () {
            var that = this;
            return that[that.length - 1];
        }
    });
    window.GameHistory = GameHistory;
})();