(function () {
    'use strict';
    var maxColorsCount = 7;

    function LinesGame(options) {
        var that = this;
        that.options = verifyOptions(options);
        that.dashboard = new Matrix(that.options.size);
        that.freeCells = new Pool();
        for (var i = 0; i < that.options.size; i++) {
            for (var j = 0; j < that.options.size; j++) {
                that.freeCells.add(new Point(i, j));
            }
        }
        that.addNewBalls();
    }

    $.extend(LinesGame.prototype, {
        moveBall: function (startPoint, endPoint) {
            var that = this;
            if (that.dashboard.hasPath(startPoint, endPoint)) {
                that.dashboard.setValue(endPoint, that.dashboard.getValue(startPoint));
                that.dashboard.setValue(startPoint, undefined);
                that.freeCells.replace(startPoint, endPoint);
            }
        },
        addNewBalls: function () {
            var that = this,
                count = that.options.ballsCount,
                newBalls = that.freeCells.getRandomPoints(count),
                colors = getColors(count, that.options.repeat);
            newBalls.forEach(function (item, index) {
                that.dashboard.setValue(item, colors[index]);
            });
        },
        removeBalls: function () {
            //TODO
        }
    });

    //this function returns random colors queue
    function getColors(count, repeat) {
        var queue = [];
        while (queue.length < count) {
            var color = Math.randomInt(maxColorsCount) + 1;
            if (repeat || queue.indexOf(color) < 0) {
                queue.push(color);
            }
        }
        return queue;
    }
    function verifyOptions(options) {
        var size = options.size,
            ballsCount = options.ballsCount,
            removingCount = options.removingCount;
        if (size < 5 || size > 10) {
            options.size = 9;
        }
        if (ballsCount < 3 || ballsCount > 7) {
            options.ballsCount = 3;
        }
        if (removingCount < 3 || removingCount > 5) {
            options.removingCount = 3;
        }
        return options;
    }

    window.LinesGame = LinesGame;
})();