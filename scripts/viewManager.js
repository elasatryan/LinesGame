$(function () {
    'use strict';
    var colors = ["red", "blue", "green", "yellow", "pink", "cyan", "purple"],
        selectedElement,
        classes = colors.map(function (color) {
            return "td." + color;
        }).join(),
        board = $(".dashboard").on("click", classes, function () {
            var element = $(this);

            if (!element.hasClass("selected")) {
                element.addClass("selected");
                selectedElement && selectedElement.removeClass("selected");
                selectedElement = element;
            }
        });

    var linesGame;

    $("#newGame").click(initializeGame);

    function drawBoard(size) {
        board.empty();
        for (var i = 0; i < size; i++) {
            var tr = $("<tr>");
            for (var j = 0; j < size; j++) {
                var color = linesGame.dashboard[i][j];
                $("<td>").addClass(colors[color  - 1]).appendTo(tr);
            }
            board.append(tr);
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