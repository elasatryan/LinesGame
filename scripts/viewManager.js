$(function () {
    'use strict';
    var colors = ["red", "blue", "green", "yellow", "pink", "cyan", "purple"];

    $("#newGame").click(function () {
        var linesGame = new LinesGame(initOption()),
            options = linesGame.options,
            size = options.size,
            board = $(".dashboard").empty();
        for (var i = 0; i < size; i++) {
            var tr = $("<tr>");
            for (var j = 0; j < size; j++) {
                var color = linesGame.dashboard[i][j];
                $("<td>").addClass(colors[color - 1]).appendTo(tr);
            }
            board.append(tr);
        }
    });
    function initOption() {
        return {
            size: $("#size").val(),
            ballsCount: $("#ballsCount").val(),
            repeat: $("#repeat").is(":checked"),
            removingCount: $("#removingCount").val()
        };
    }

    function updateOptionsView() {

    }
});