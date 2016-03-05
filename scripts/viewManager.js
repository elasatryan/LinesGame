/**
 * Created by Hakob on 04/02/2016.
 */

$(function () {
    var gamesFeed = $('.games-feed');

    $('.generate-game').on('click', function () {
        $.ajax({
            url: 'templates/linesGame.html'
        }).success(function (template) {
            $(template).prependTo(gamesFeed).linesGame();
        });
    });
});