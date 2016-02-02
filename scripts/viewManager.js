$(function () {
    'use strict';
    var linesGame,
        selectedElement,
        colors = ['red', 'blue', 'green', 'yellow', 'pink', 'cyan', 'purple'],
        ballsSelector = colors.map(function (color) {
            return 'td.' + color;
        }).join(),
        size = $('#size'),
        ballsCount = $('#ballsCount'),
        repeat = $('#repeat'),
        removingCount = $('#removingCount'),
        board = $('.dashboard').on('click', ballsSelector, function () {
            var element = $(this);

            if (element.hasClass('selected')) {
                return;
            }
            // todo: GAMEOVER case;

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

            drawStep(linesGame.history.getLastStep(), linesGame.getScore());
        });

    $('#newGame').click(function () {
        initializeGame();
        $('.settings').hide();
        $('.settingsBar').toggleClass('open');
    });
    $('.generateGame').one('click', function () {
        $('.game').show();
        initializeGame();
    });
    $('.settingsBar').click(function () {
        $('.settingsBar').toggleClass('open');
        $('.settings').toggle();
    });

    $('.undo').click(function () {
        drawStep(linesGame.undo(), linesGame.getScore());
    });
    $('.redo').click(function () {
        drawStep(linesGame.redo(), linesGame.getScore());
    });

    function drawBoard(size) {
        board.empty();
        for (var i = 0; i < size; i++) {
            var tr = $('<tr>');
            for (var j = 0; j < size; j++) {
                var color = linesGame.dashboard[i][j];
                $('<td>').addClass(colors[color - 1])
                    .data('point', new Point(i, j))
                    .appendTo(tr);
            }
            board.append(tr);
        }
    }

    function drawStep(step, score) {
        if (!step) {
            return;
        }
        step.addend.forEach(function (item) {
            $(getPointSelector(item.point)).addClass(colors[item.color - 1]);
        });

        step.subtrahend.forEach(function (item) {
            $(getPointSelector(item.point)).removeAttr('class');
        });
        $('.score').text(score);
    }

    function getPointSelector(point) {
        return 'tr:nth-child(' + (point.row + 1) + ') td:nth-child(' + (point.column + 1) + ')';
    }

    function initializeGame() {
        linesGame = new LinesGame(initOption());
        updateOptionsView(linesGame.options);
        drawBoard(linesGame.options.size);
    }

    function initOption() {
        return {
            size: +size.val(),
            ballsCount: +ballsCount.val(),
            repeat: repeat.is(':checked'),
            removingCount: +removingCount.val()
        };
    }

    function updateOptionsView(options) {
        size.val(options.size);
        ballsCount.val(options.ballsCount);
        removingCount.val(options.removingCount);
    }
});