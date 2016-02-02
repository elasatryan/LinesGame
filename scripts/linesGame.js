(function () {
    'use strict';
    var maxColorsCount = 7;

    function LinesGame(options) {
        var that = this;
        that.options = verifyOptions(options);
        var size = that.options.size;
        that.dashboard = new Matrix(size);
        that.freeCells = getInitialPool(size);
        that.history = new GameHistory();
        var step = new GameStep();
        addNewBalls(that, step);
        that.history.addStep(step);
    }

    $.extend(LinesGame.prototype, {
        moveBall: function (startPoint, endPoint) {
            var that = this;
            if (!that.dashboard.hasPath(startPoint, endPoint)) {
                return;
            }
            var previousScore = that.getScore(),
                step = new GameStep(),
                color = that.dashboard.getValue(startPoint);

            that.dashboard.setValue(endPoint, color);
            that.dashboard.setValue(startPoint, undefined);
            that.freeCells.replace(endPoint, startPoint);

            step.addToSubtrahend(new Ball(startPoint, color));

            var itemsToRemove = that.dashboard.remove(endPoint, that.options.removingCount);
            step.addToSubtrahend.apply(step, pointsToBalls(itemsToRemove, color));

            if (!itemsToRemove) {
                step.addToAddend(new Ball(endPoint, color));
            }

            that.freeCells.add.apply(that.freeCells, itemsToRemove);

            addNewBalls(that, step);

            that.history.addStep(step);
            modifyMatrixByStep(that.dashboard, step);
            step.score = previousScore + getScoreByStep(step);
        },
        gameOver: function () {
            var that = this;
            return 0 === that.freeCells.length;
        },
        getScore: function () {
            var that = this;
            return that.history.getScore();
        },
        undo: function () {
            var that = this,
                step = that.history.getLastStep();
            return that.history.undo() && step.reverse();
        },
        redo: function () {
            var that = this;
            return that.history.redo() && that.history.getLastStep();
        }
    });

    function getRandomColors(count, repeat) {
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

    function getInitialPool(size) {
        var pool = new Pool();
        for (var i = 0; i < size; i++) {
            for (var j = 0; j < size; j++) {
                pool.add(new Point(i, j));
            }
        }
        return pool;
    }

    function addNewBalls(linesGame, step) {
        var count = linesGame.options.ballsCount,
            newBalls = linesGame.freeCells.getRandomPoints(count),
            colors = getRandomColors(count, linesGame.options.repeat);
        newBalls.forEach(function (item, index) {
            var color = colors[index];
            linesGame.dashboard.setValue(item, color);
            var itemsToRemove = linesGame.dashboard.remove(item, linesGame.options.removingCount);
            linesGame.freeCells.add.apply(linesGame.freeCells, itemsToRemove);
            step.addToSubtrahend.apply(step, pointsToBalls(itemsToRemove, color));
            if (!itemsToRemove) {
                step.addToAddend(new Ball(item, color));
            }
        });
    }

    function pointsToBalls(pointArray, color) {
        return pointArray && pointArray.map(function (item) {
                return new Ball(item, color);
            });
    }

    function modifyMatrixByStep(matrix, step) {
        step.addend.forEach(function (item) {
            matrix.setValue(item.point, item.color);
        });
        step.subtrahend.forEach(function (item) {
            matrix.setValue(item.point, undefined);
        });
    }

    function getScoreByStep(step) {
        return step.subtrahend.length > 1 ? step.subtrahend.length : 0;
    }

    window.LinesGame = LinesGame;
})();