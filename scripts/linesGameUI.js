(function () {
    'use strict';
    var colors = ['red', 'blue', 'green', 'yellow', 'pink', 'cyan', 'purple'],
        themes = ['red', 'pink', 'teal'],
        gameActions = {
            add: function (element, colorName) {
                element.addClass(colorName);
            },
            remove: function (element) {
                element.removeAttr('class');
            }
        };

    $.extend($.fn, {
        linesGame: function () {
            var that = this;
            var linesGame,
                selectedElement,
                f = that.find('.score').tooltip({text: 'sd'}),
                size = that.find('.size'),
                ballsCount = that.find('.balls-count'),
                repeat = that.find('.repeat'),
                removingCount = that.find('.removing-count'),
                score = that.find('.score'),
                board = that.find('.dashboard').on('click', '.ball', function () {
                    var element = $(this);

                    if (element.hasClass('selected')) {
                        return;
                    }

                    element.addClass('selected');
                    selectedElement && selectedElement.removeClass('selected');
                    selectedElement = element;
                }).on('click', 'td:not(.ball)', function () {
                    var element = $(this);

                    if (!selectedElement) {
                        return;
                    }

                    linesGame.moveBall(selectedElement.data('point'), element.data('point'));
                    selectedElement.removeClass('selected');
                    selectedElement = null;

                    drawTrace(board, linesGame.history.getLastTrace());
                    score.text(linesGame.getScore());

                    if (linesGame.gameOver()) {
                        that.addClass('game-over');
                    }
                });

            that.addClass(themes[Math.randomInt(themes.length)]);

            that.find('.new-game').click(function () {
                linesGame = initializeGame(board, size, ballsCount, repeat, removingCount);

                that.removeClass('game-over open');
            });
            that.find('.menu').click(function () {
                that.toggleClass('open');
            });

            that.find('.undo').click(function () {
                drawTrace(board, linesGame.undo());
                score.text(linesGame.getScore());
            });
            that.find('.redo').click(function () {
                drawTrace(board, linesGame.redo());
                score.text(linesGame.getScore());
            });
            that.find('.delete').click(function () {
                that.remove();
            });

            linesGame = initializeGame(board, size, ballsCount, repeat, removingCount);
        }
    });

    function drawBoard(board, size) {
        board.empty();

        for (var i = 0; i < size; i++) {
            var tr = $('<tr>');

            for (var j = 0; j < size; j++) {
                $('<td>').appendTo(tr)
                    .data('point', new Point(i, j));
            }
            board.append(tr);
        }
    }

    function drawTrace(board, trace) {
        if (!trace) {
            return;
        }

        // todo optimize
        trace.forEach(function (step) {
            step.balls.forEach(function (ball) {
                var colorName = colors[ball.color - 1],
                    action = gameActions[step.action];

                action(board.find(getPointSelector(ball.point)), 'ball ' + colorName);
            });
        });
    }

    function getPointSelector(point) {
        return 'tr:nth-child(' + (point.row + 1) + ') td:nth-child(' + (point.column + 1) + ')';
    }

    function initializeGame(board, size, ballsCount, repeat, removingCount) {
        var linesGame = new LinesGame(initOption(size, ballsCount, repeat, removingCount));
        var options = linesGame.options;

        updateOptionsView(size, ballsCount, removingCount, options);
        drawBoard(board, options.size);

        drawTrace(board, linesGame.history.getLastTrace());

        return linesGame;
    }

    function initOption(size, ballsCount, repeat, removingCount) {
        return {
            size: +size.val(),
            ballsCount: +ballsCount.val(),
            repeat: repeat.is(':checked'),
            removingCount: +removingCount.val()
        };
    }

    function updateOptionsView(size, ballsCount, removingCount, options) {
        size.val(options.size);
        ballsCount.val(options.ballsCount);
        removingCount.val(options.removingCount);
    }
})();