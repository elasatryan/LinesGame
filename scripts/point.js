(function () {
    'use strict';

    function Point(row, column) {
        var that = this;
        that.row = +row || 0;
        that.column = +column || 0;
    }

    $.extend(Point.prototype, {
        left: function () {
            var that = this;
            return new Point(that.row, that.column - 1);
        },
        right: function () {
            var that = this;
            return new Point(that.row, that.column + 1);
        },
        top: function () {
            var that = this;
            return new Point(that.row - 1, that.column);
        },
        bottom: function () {
            var that = this;
            return new Point(that.row + 1, that.column);
        },
        topLeft: function () {
            var that = this;
            return new Point(that.row - 1, that.column - 1);
        },
        bottomLeft: function () {
            var that = this;
            return new Point(that.row + 1, that.column - 1);
        },
        topRight: function () {
            var that = this;
            return new Point(that.row - 1, that.column + 1);
        },
        bottomRight: function () {
            var that = this;
            return new Point(that.row + 1, that.column + 1);
        },
        equals: function (p) {
            var that = this;

            return that.row === p.row && that.column === p.column;
        }
    });

    window.Point = Point;
})();