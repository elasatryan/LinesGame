(function () {
    'use strict';

    var staticForEach = Array.prototype.forEach.call;

    function GameStep(score, addend, subtrahend) {
        var that = this;

        that.score = +score || 0;
        that.addend = addend || [];
        that.subtrahend = subtrahend || [];
    }

    $.extend(GameStep.prototype, {
        addToAddend: function (item) {
            var that = this;

            if(1 === arguments.length) {
                removeRepeatedBall(that.subtrahend, item);
                that.addend.push(item);

                return that;
            }

            staticForEach(arguments, function(item) {
                that.addToAddend(item);
            });

            return that;
        },
        addToSubtrahend: function (item) {
            var that = this;

            if(1 === arguments.length) {
                removeRepeatedBall(that.addend, item);
                that.subtrahend.push(item);

                return that;
            }

            staticForEach(arguments, function(item) {
                that.addToSubtrahend(item);
            });

            return that;
        },
        reverse: function () {
            var that = this;

            if(that._reverse) {
                return that._reverse;
            }

            that._reverse = new GameStep(that.score, that.subtrahend, that.addend);
            that._reverse._reverse = that;

            return that._reverse;
        }
    });

    window.GameStep = GameStep;

    function removeRepeatedBall(collection, ball) {
        return collection.some(function(item, index) {
            if(ball.point.equals(item.point)) {
                collection.splice(index, 1);
                return true;
            }
        });
    }
})();