(function () {
    'use strict';
    var colors = ['red', 'blue', 'green', 'yellow', 'pink', 'cyan', 'purple'],
        themes = ['red', 'pink', 'purple', 'deep-purple', 'indigo', 'blue', 'light-blue', 'cyan', 'teal', 'green', 'light-green', 'lime', 'yellow', 'amber', 'orange', 'deep-orange', 'brown', 'grey', 'blue-grey'],
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
            var that = this,
                linesGame,
                selectedElement,
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
                    that.find('.undo').enable();

                    linesGame.moveBall(selectedElement.data('point'), element.data('point'));
                    selectedElement.removeClass('selected');
                    selectedElement = null;

                    drawTrace(board, linesGame.history.getLastTrace());
                    score.text(linesGame.getScore());

                    that.find('.redo')[linesGame.history.undone.length ? 'enable' : 'disable']();

                    if (linesGame.gameOver()) {
                        that.addClass('game-over');
                    }
                });
            /*TODO*/
            size.on('input', function () {
                var input = size;
                if(input.val()<input.attr('min') || input.val()>input.attr('max')){
                    new Toast({text:'Invalid value',container:input.parent()});
                }
            });

            that.find('.score').tooltip({text: 'Game score'});
            that.addClass(themes[Math.randomInt(themes.length)]);

            that.find('.new-game').click(function () {

                linesGame = initializeGame(that, board, size, ballsCount, repeat, removingCount);
                that.removeClass('game-over open');
            });
            that.find('.menu').tooltip({text: 'Settings'}).click(function () {
                that.toggleClass('open');
            });
            that.find('.undo').tooltip({text: 'Undo'}).click(function () {
                drawTrace(board, linesGame.undo());
                score.text(linesGame.getScore());
                that.find('.undo')[linesGame.history.length > 1 ? 'enable' : 'disable']();
                that.find('.redo')[linesGame.history.undone.length ? 'enable' : 'disable']();
            });
            that.find('.redo').tooltip({text: 'Redo'}).click(function () {
                drawTrace(board, linesGame.redo());
                score.text(linesGame.getScore());
                that.find('.undo')[linesGame.history.length > 1 ? 'enable' : 'disable']();
                that.find('.redo')[linesGame.history.undone.length ? 'enable' : 'disable']();
            });
            that.find('.delete').tooltip({text: 'Remove Game'}).click(function () {
                that.remove();
            });

            linesGame = initializeGame(that, board, size, ballsCount, repeat, removingCount);
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

    function initializeGame(element, board, size, ballsCount, repeat, removingCount) {
        var linesGame = new LinesGame(initOption(size, ballsCount, repeat, removingCount));
        var options = linesGame.options;

        updateOptionsView(size, ballsCount, removingCount, options);

        drawBoard(board, options.size);

        drawTrace(board, linesGame.history.getLastTrace());

        element.find('.undo, .redo').disable();

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