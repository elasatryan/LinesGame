(function () {
    'use strict';

    // var staticForEach = Array.prototype.forEach.call;

    function GameStep(score, addend, subtrahend) {
        var that = this;

        that.score = +score || 0;
        that.addend = addend || [];
        that.subtrahend = subtrahend || [];
    }

    $.extend(GameStep.prototype, {
        addToAddend: function () {
            var that = this;

            that.subtrahend = addToCollection(that.addend, that.subtrahend, arguments);

            return that;
        },
        addToSubtrahend: function () {
            var that = this;

            that.addend = addToCollection(that.subtrahend, that.addend, arguments);

            return that;
        },
        reverse: function () {
            var that = this;

            if (that._reverse) {
                return that._reverse;
            }

            that._reverse = new GameStep(that.score, that.subtrahend, that.addend);
            that._reverse._reverse = that;

            return that._reverse;
        }
    });

    window.GameStep = GameStep;

    function removeRepeatedBall(collection, ball) {
        return collection.filter(function (item) {
            return !ball.point.equals(item.point);
        });
    }

    function addToCollection(a, b, balls) {
        Array.forEach(balls, function (item) {
            b = removeRepeatedBall(b, item);
            a.push(item);
        });
        return b;
    }
})();