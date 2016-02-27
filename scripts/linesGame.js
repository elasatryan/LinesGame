(function () {
    'use strict';
    var maxColorsCount = 7;

    function LinesGame(options) {
        var that = this;
        that.options = verifyOptions(options);

        var size = that.options.size;

        that.dashboard = new Matrix(size);
        console.log(that.dashboard);
        that.freeCells = getInitialPool(size);
        that.history = new GameHistory();

        addNewBalls(that, that.history.addStep(new GameStep()).getLastStep());
    }

    $.extend(LinesGame.prototype, {
        moveBall: function (startPoint, endPoint) {
            var that = this,
                dashboard = that.dashboard;

            if (!dashboard.hasPath(startPoint, endPoint)) {
                return;
            }

            var previousScore = that.getScore(),
                color = dashboard.getValue(startPoint);

            that.history.addStep(new GameStep(previousScore));

            removeBallFromGame(that, new Ball(startPoint, color));
            addBallToGame(that, new Ball(endPoint, color));
            addNewBalls(that);
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

            return that.history.undo() && modifyGameByStep(that, step.reverse());
        },
        redo: function () {
            var that = this;
            return that.history.redo() && modifyGameByStep(that, that.history.getLastStep());
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

    function addNewBalls(linesGame) {
        var options = linesGame.options,
            newBalls = linesGame.freeCells.getRandomPoints(options.ballsCount),
            colors = getRandomColors(newBalls.length, options.repeat);

        newBalls.forEach(function (item, index) {
            addBallToGame(linesGame, new Ball(item, colors[index]));
        });
    }

    function addBallToGame(linesGame, ball) {
        var dashboard = linesGame.dashboard,
            freeCells = linesGame.freeCells,
            step = linesGame.history.getLastStep(),
            point = ball.point,
            color = ball.color,
            removingCount = linesGame.options.removingCount;

        freeCells.remove(point);
        dashboard.setValue(point, color);

        var removeCandidates = pointsToBalls(dashboard.removeCandidates(point, removingCount), color);

        if (removeCandidates) {
            removeBallFromGame(linesGame, ball, false);
            removeCandidates.forEach(function (item) {
                removeBallFromGame(linesGame, item);
            });

            step.score += removeCandidates.length + 1;
        } else {
            step.addToAddend(ball);
        }

        return !!removeCandidates;
    }

    function removeBallFromGame(linesGame, ball, addToStep) {
        var point = ball.point,
            step = linesGame.history.getLastStep();

        linesGame.dashboard.setValue(point, undefined);
        linesGame.freeCells.add(point);

        (false !== addToStep) && step.addToSubtrahend(ball);
    }

    function pointsToBalls(pointArray, color) {
        return pointArray && pointArray.map(function (item) {
                return new Ball(item, color);
            });
    }

    function modifyGameByStep(linesGame, step) {
        var dashboard = linesGame.dashboard,
            freeCells = linesGame.freeCells;

        step.addend.forEach(function (item) {
            dashboard.setValue(item.point, item.color);
            freeCells.remove(item.point);
        });
        step.subtrahend.forEach(function (item) {
            dashboard.setValue(item.point, undefined);
            freeCells.add(item.point);
        });

        return step;
    }

    window.LinesGame = LinesGame;
})();