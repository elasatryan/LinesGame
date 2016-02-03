(function () {
    'use strict';
    function GameStep(addend, subtrahend, score) {
        var that = this;
        that.addend = addend || [];
        that.subtrahend = subtrahend || [];
        that.score = +score || 0;
    }

    $.extend(GameStep.prototype, {
        addToAddend: function (item) {
            var that = this;
            that.addend.push.apply(that.addend, arguments);
        },
        addToSubtrahend: function (item) {
            var that = this;
            that.subtrahend.push.apply(that.subtrahend, arguments);
        },
        reverse: function () {
            var that = this;
            return new GameStep(that.subtrahend, that.addend);
        }
    });
    window.GameStep = GameStep;
})();