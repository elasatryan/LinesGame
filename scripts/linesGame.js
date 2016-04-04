(function () {
    'use strict';
    var maxColorsCount = 7;
    var gameActions = {
        add: 'add',
        remove: 'remove'
    };
    var reverseMap = {
        add: 'remove',
        remove: 'add'
    };

    function LinesGame(options) {
        var that = this;
        that.options = verifyOptions(options);

        var size = that.options.size;

        that.dashboard = new Matrix(size);
        that.freeCells = getInitialPool(size);
        that.history = new GameHistory();

        addNewBalls(that, that.history.addTrace(new GameTrace()).getLastTrace());
    }

    $.extend(LinesGame.prototype, {
        moveBall: function (startPoint, endPoint) {
            var that = this,
                dashboard = that.dashboard;

            if (!dashboard.findPath(startPoint, endPoint)) {
                return;
            }

            var previousScore = that.getScore(),
                color = dashboard.getValue(startPoint);

            that.history.addTrace(new GameTrace(previousScore));

            removeBallFromGame(that, new Ball(startPoint, color), true);
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
                trace = that.history.getLastTrace();

            return that.history.undo() && modifyGameByTrace(that, trace.reverse(reverseMap));
        },
        redo: function () {
            var that = this;
            return that.history.redo() && modifyGameByTrace(that,  that.history.getLastTrace());
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
        if(!Number.isInteger(size) || !Number.isInteger(ballsCount) || !Number.isInteger(removingCount)){
            throw new Error('LinesGame argument is invalid!');
        }
        if (size < 5 || size > 10) {
            options.size = 9;
            throw new Error('LinesGame argument is invalid!');
        }
        if (ballsCount < 3 || ballsCount > 7) {
            options.ballsCount = 3;
            throw new Error('LinesGame argument is invalid!');
        }
        if (removingCount < 3 || removingCount > 5) {
            options.removingCount = 3;
            throw new Error('LinesGame argument is invalid!');
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
            trace = linesGame.history.getLastTrace(),
            point = ball.point,
            color = ball.color,
            removingCount = linesGame.options.removingCount;

        freeCells.remove(point);
        dashboard.setValue(point, color);

        var removeCandidates = pointsToBalls(dashboard.removeCandidates(point, removingCount), color);

        if (removeCandidates) {
            removeBallFromGame(linesGame, ball);

            //removeCandidates.push(ball);
            removeCandidates.forEach(function (item) {
                removeBallFromGame(linesGame, item);
            });

            trace.addStep(new GameStep(gameActions.remove, removeCandidates));

            trace.score += removeCandidates.length + 1;
        } else {
            trace.addStep(new GameStep(gameActions.add, ball));
        }

        return !!removeCandidates;
    }

    // the default value of addToTrace is false
    function removeBallFromGame(linesGame, ball, addToTrace) {
        var point = ball.point,
            trace = linesGame.history.getLastTrace();

        linesGame.dashboard.setValue(point, undefined);
        linesGame.freeCells.add(point);

        addToTrace && trace.addStep(new GameStep(gameActions.remove, ball));
    }

    function pointsToBalls(pointArray, color) {
        return pointArray && pointArray.map(function (item) {
                return new Ball(item, color);
            });
    }

    function modifyGameByTrace(linesGame, trace) {
        var dashboard = linesGame.dashboard,
            freeCells = linesGame.freeCells;

        trace.forEach(function (step) {
            var isAdd = step.action === gameActions.add;
            step.balls.forEach(function(ball) {

                dashboard.setValue(ball.point, isAdd ? ball.color : undefined);
                isAdd ? freeCells.remove(ball.point) : freeCells.add(ball.point);
            });
        });

        return trace;
    }

    window.LinesGame = LinesGame;
})();