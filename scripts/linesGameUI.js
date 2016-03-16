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
            var that = this;
            that.dialog = new Dialog({
                templateUrl: 'templates/settings.html',
                commands: [{action: 'new-game', text: 'Apply'}],
                header: {title: 'Settings', closeButton: true},
                destroyOnClose: false,
                container: that
            });
            var linesGame,
                selectedElement,
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
            /*
            *Input validations
            */
            that.find('.size, .balls-count, .removing-count').on('input', function () {
                var input = $(this);
                input.parent().find('.toast').remove();
                if(+input.val()<+input.attr('min') || +input.val()>+input.attr('max') || !Number.isInteger(+input.val())){
                    new Toast({text:'Invalid value',container:input.parent()});
                }
            });

            that.find('.score').tooltip({text: 'Game score'});
            that.addClass(themes[Math.randomInt(themes.length)]);

            that.dialog.on('new-game', function () {
                linesGame = initializeGame(that, board);
                that.toggleClass('jq-show');
                that.dialog.close();

                score.text(linesGame.getScore());
            });

            that.find('.close').click(function () {
                that.toggleClass('jq-show');
                that.dialog.close();
            });
            that.find('.menu').tooltip({text: 'Settings'}).click(function () {
                var isOpen = that.toggleClass('jq-show').is('.jq-show');

                that.dialog[isOpen ? 'open' : 'close']();
            }).click();

            that.find('.undo').click(function () {
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

    function initializeGame(gameElement, board) {
        var size = gameElement.find('.size'),
            ballsCount = gameElement.find('.balls-count'),
            repeat = gameElement.find('.repeat'),
            removingCount = gameElement.find('.removing-count');

        var linesGame = new LinesGame(initOption(size, ballsCount, repeat, removingCount));
        var options = linesGame.options;

        updateOptionsView(size, ballsCount, removingCount, options);

        drawBoard(board, options.size);

        drawTrace(board, linesGame.history.getLastTrace());

        gameElement.find('.undo, .redo').disable();

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