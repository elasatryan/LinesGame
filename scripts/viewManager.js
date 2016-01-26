$(function () {
    'use strict';
    var linesGame,
        selectedElement,
        colors = ["red", "blue", "green", "yellow", "pink", "cyan", "purple"],
        ballsSelector = colors.map(function (color) {
            return "td." + color;
        }).join(),
        score = $('#score'),
        board = $(".dashboard").on('click', ballsSelector, function () {
            var element = $(this);

            if (element.hasClass("selected")) {
                return;
            }

            element.addClass("selected");
            selectedElement && selectedElement.removeClass("selected");
            selectedElement = element;
        }).on('click', 'td:not([class])', function () {
            var element = $(this);
            if (!selectedElement) {
                return;
            }
            linesGame.moveBall(selectedElement.data('point'), element.data('point'));
            selectedElement = undefined;
            drawBoard(linesGame.options.size);
        });


    $("#newGame").click(initializeGame);

    function drawBoard(size) {
        board.empty();
        if (!linesGame.gameOver()) {
            for (var i = 0; i < size; i++) {
                var tr = $("<tr>");
                for (var j = 0; j < size; j++) {
                    var color = linesGame.dashboard[i][j];
                    $("<td>").addClass(colors[color - 1])
                        .data('point', new Point(i, j))
                        .appendTo(tr);
                }
                board.append(tr);
            }
            score.empty().text('Score:' + linesGame.score).appendTo($('body'));
        }
        else {
            $('<p>').text('Game Over').appendTo(score);
        }
    }

    function initializeGame() {
        linesGame = new LinesGame(initOption());
        updateOptionsView(linesGame.options);
        drawBoard(linesGame.options.size);
    }

    function initOption() {
        return {
            size: +$("#size").val(),
            ballsCount: +$("#ballsCount").val(),
            repeat: $("#repeat").is(":checked"),
            removingCount: +$("#removingCount").val()
        };
    }

    function updateOptionsView(options) {
        $("#size").val(options.size);
        $("#ballsCount").val(options.ballsCount);
        $("#removingCount").val(options.removingCount);
    }
});