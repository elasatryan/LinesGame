(function () {
    'use strict';
    function GameStep(addend, subtrahend) {
        var that = this;
        that.addend = addend || [];
        that.subtrahend = subtrahend || [];
    }

    $.extend(GameStep.prototype, {
        addToAddend: function (item) {
            var that = this;
            that.addend.push.apply(that.addend, arguments);
        },
        addToSubtrahend: function (item) {
            var that = this;
            that.subtrahend.push.apply(that.subtrahend, arguments);
        }
    });
    window.GameStep = GameStep;
})();