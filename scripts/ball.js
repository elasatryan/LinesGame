(function () {
    'use strict';

    function Ball(point, value) {
        var that = this;
        that.point = point;
        that.color = value;
    }

    window.Ball = Ball;
})();