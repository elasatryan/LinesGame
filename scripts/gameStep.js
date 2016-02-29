(function () {
    'use strict';

    var staticForEach = Array.prototype.forEach.call;

    function GameStep(action, ball) {
        var that = this;

        that.action = action;
        that.balls = Array.isArray(ball) ? ball : [ball];
    }

    $.extend(GameStep.prototype, {
        addBall: function (ball) {
            var that = this,
                balls = that.balls;

            balls.push.apply(balls, arguments);

            return that;
        },
        changeAction: function (action) {
            var that = this;

            that.action = action;

            return that;
        }
    });

    window.GameStep = GameStep;
})();