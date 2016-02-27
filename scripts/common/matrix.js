(function () {
    'use strict';
    function Matrix(size) {
        var that = this;

        that.size = size;

        for (var i = 0; i < size; i++) {
            that.push(new Array(size));
        }
    }

    Matrix.prototype = [];
    $.extend(Matrix.prototype, {
        hasPath: function (startPoint, endPoint) {
            var queue = [startPoint],
                current,
                clone = this.clone();

            while (queue.length) {
                current = queue.shift();

                var left = current.left(),
                    right = current.right(),
                    top = current.top(),
                    bottom = current.bottom();

                var some = [left, right, top, bottom].some(function (item) {
                    if (item.equals(endPoint)) {
                        return true;
                    }

                    markIfFree(clone, item) && queue.push(item);
                });

                if (some) {
                    return true;
                }
            }
            return false;
        },
        clone: function () {
            var that = this,
                clone = new Matrix();

            clone.push.apply(clone, JSON.clone(that));
            clone.size = that.size;

            return clone;
        },
        getValue: function (point) {
            var that = this;
            if (that.hasPoint(point)) {
                return that[point.row][point.column];
            }
        },
        setValue: function (point, val) {
            var that = this;
            if (that.hasPoint(point)) {
                that[point.row][point.column] = val;
            }
        },
        hasPoint: function (point) {
            var that = this;
            return point.row >= 0 && point.row < that.size && point.column >= 0 && point.column < that.size;
        },
        removeCandidates: function (point, removeCount) {
            var that = this,
                queue = [];
            queue.push.apply(queue, removalCandidates(that, point, removeCount));
            return queue.length ? queue : null;
        }
    });

    window.Matrix = Matrix;

    function removalCandidates(matrix, point, removeCount) {
        var val = matrix.getValue(point),
            queue = [];

        [['top', 'bottom'], ['left', 'right'], ['bottomLeft', 'topRight'], ['bottomRight', 'topLeft']].forEach(
            function (item) {
                var removePoints = [],
                    next = point[item[1]],
                    previous = point[item[0]];

                while (matrix.hasPoint(next) && matrix.getValue(next) === val) {
                    removePoints.push(next);
                    next = next[item[1]]();
                }

                while (matrix.hasPoint(previous) && matrix.getValue(previous) === val) {
                    removePoints.unshift(previous);
                    previous = previous[item[0]]();
                }
                if (removePoints.length + 1 >= removeCount) {
                    queue.push.apply(queue, removePoints);
                }
            });
        return queue.length ? queue : null;
    }

    function markIfFree(matrix, point) {
        if (matrix.hasPoint(point) && !matrix.getValue(point)) {
            matrix.setValue(point, -1);
            return true;
        }
        return false;
    }
})();