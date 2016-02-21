(function () {
    'use strict';

    function GameTrace(score) {
        var that = this;

        that.score = +score || 0;
    }
    GameTrace.prototype = [];

    $.extend(GameTrace.prototype, {
        addStep: function (step) {
            var that = this;
            that.push.apply(that, arguments);

            return that;
        },
        reverse: function (actionMap) {
            var that = this;

            if(that._reverse) {
                return that._reverse;
            }

            var reverse = new GameTrace(that.score);
            reverse.addStep.apply(reverse, that.slice().reverse().map(function(step) {
                var action = step.action,
                    newAction = $.isFunction(actionMap) ? actionMap(action) : actionMap[action];

                return new GameStep(newAction, step.balls);
            }));
            reverse._reverse = that;

            return that._reverse = reverse;
        }
    });

    window.GameTrace = GameTrace;
})();