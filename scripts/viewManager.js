/**
 * Created by Hakob on 04/02/2016.
 */

$(function () {
    var gamesFeed = $('.games_feed');

    $('.generate_game').one('click', function () {
        $.ajax({
            url: 'templates/lines_game.html'
        }).success(function (template) {
            $(template).appendTo(gamesFeed).linesGame();
        });
    });
});