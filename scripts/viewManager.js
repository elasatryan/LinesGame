$(function () {
    var gamesFeed = $('.games_feed');

    $('.generate_game').on('click', function () {
        $.ajax({
            url: 'templates/linesGame.html'
        }).success(function (template) {
            $(template).appendTo(gamesFeed).linesGame();
        });
    });
});