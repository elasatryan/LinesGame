(function () {
    'use strict';
    var colors = ['red', 'blue', 'green', 'yellow', 'pink', 'cyan', 'purple'],
        ballsSelector = colors.map(function (color) {
            return 'td.' + color;
        }).join();

    $.extend($.fn, {
        linesGame: function () {
            var that = this;
            var linesGame,
                selectedElement,
                size = that.find('.size'),
                ballsCount = that.find('.balls_count'),
                repeat = that.find('.repeat'),
                removingCount = that.find('.removing_count'),
                score = that.find('.score'),
                board = that.find('.dashboard').on('click', ballsSelector, function () {
                    var element = $(this);

                    if (element.hasClass('selected')) {
                        return;
                    }

                    element.addClass('selected');
                    selectedElement && selectedElement.removeClass('selected');
                    selectedElement = element;
                }).on('click', 'td:not([class])', function () {
                    var element = $(this);

                    if (!selectedElement) {
                        return;
                    }

                    linesGame.moveBall(selectedElement.data('point'), element.data('point'));
                    selectedElement.removeClass('selected');
                    selectedElement = null;

                    drawStep(board, linesGame.history.getLastStep());
                    score.text(linesGame.getScore());

                    if (linesGame.gameOver()) {
                        that.addClass('game_over');
                    }

                    checkGameFields(linesGame, board);
                });

            that.find('.new_game').click(function () {
                initializeGame(board, size, ballsCount, repeat, removingCount);

                that.removeClass('game_over open_settings');
            });
            that.find('.menu_button').click(function () {
                that.toggleClass('open_settings');
            });

            that.find('.undo').click(function () {
                drawStep(board, linesGame.undo());
                score.text(linesGame.getScore());
                checkGameFields(linesGame, board);
            });
            that.find('.redo').click(function () {
                drawStep(board,  linesGame.redo());
                score.text(linesGame.getScore());
                checkGameFields(linesGame, board);
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

    function drawStep(board, step) {
        if (!step) {
            return;
        }
        step.addend.forEach(function (item) {
            board.find(getPointSelector(item.point)).addClass(colors[item.color - 1]);
        });

        step.subtrahend.forEach(function (item) {
            board.find(getPointSelector(item.point)).removeAttr('class');
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

        drawStep(board, linesGame.history.getLastStep());

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

    function checkGameFields(game, el) {
        game.dashboard.forEach(function(item, ind) {
            item.forEach(function(val, i) {
                var c = el.find(getPointSelector(new Point(ind, i))).attr('class');
                var step = game.history.getLastStep();

                val && !c && console.log(ind, i, colors[val - 1], c, JSON.clone(step));
            });
        });
    }
})();