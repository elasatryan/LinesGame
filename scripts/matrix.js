(function () {
    'use strict';
    function Matrix(size) {
        var that = this;

        Array.call(that, size);
        that.size = size;

        for (var i = 0; i < that.size; i++) {
            that[i] = new Array(size);
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

                if ([left, right, top, bottom].some(function (item) {
                        return item.equals(endPoint);
                    })) {
                    return true;
                }
                if (clone.hasPoint(left) && !clone.getValue(left)) {
                    queue.push(left);
                    clone.setValue(left, -1);
                }
                if (clone.hasPoint(right) && !clone.getValue(right)) {
                    queue.push(right);
                    clone.setValue(right, -1);
                }
                if (clone.hasPoint(top) && !clone.getValue(top)) {
                    queue.push(top);
                    clone.setValue(top, -1);
                }
                if (clone.hasPoint(bottom) && !clone.getValue(bottom)) {
                    queue.push(bottom);
                    clone.setValue(bottom, -1);
                }
            }
            return false;
        },
        clone: function () {
            var that = this;

            var clone = new Matrix(that.size);
            for (var i = 0; i < that.size; i++) {
                for (var j = 0; j < that.size; j++) {
                    clone[i][j] = that[i][j];
                }
            }
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
        remove: function (point, removeCount) {
            var that = this,
                queue = [];
            queue.push.apply(queue, horizontalRemovals(that, point, removeCount));
            queue.push.apply(queue, verticalRemovals(that, point, removeCount));
            queue.push.apply(queue, mainDiagonalRemovals(that, point, removeCount));
            queue.push.apply(queue, secondaryDiagonalRemovals(that, point, removeCount));
            queue.forEach(function (item) {
                that.setValue(item, undefined);
            });
            return queue.length*10;
        }
    });

    window.Matrix = Matrix;

    function horizontalRemovals(matrix, point, removeCount) {
        var val = matrix.getValue(point),
            leftPoint = point.left(),
            rightPoint = point.right(),
            queue = [point];

        while (matrix.hasPoint(leftPoint) && matrix.getValue(leftPoint) == val) {
            queue.unshift(leftPoint);
            leftPoint = leftPoint.left();
        }
        while (matrix.hasPoint(rightPoint) && matrix.getValue(rightPoint) == val) {
            queue.push(rightPoint);
            rightPoint = rightPoint.right();
        }
        return queue.length >= removeCount ? queue : null;
    }

    function verticalRemovals(matrix, point, removeCount) {
        var val = matrix.getValue(point),
            topPoint = point.top(),
            bottomPoint = point.bottom(),
            queue = [point];

        while (matrix.hasPoint(topPoint) && matrix.getValue(topPoint) === val) {
            queue.unshift(topPoint);
            topPoint = topPoint.top();
        }
        while (matrix.hasPoint(bottomPoint) && matrix.getValue(bottomPoint) === val) {
            queue.push(bottomPoint);
            bottomPoint = bottomPoint.bottom();
        }
        return queue.length >= removeCount ? queue : null;
    }

    function mainDiagonalRemovals(matrix, point, removeCount) {
        var val = matrix.getValue(point),
            topLeftPoint = point.topLeft(),
            bottomRightPoint = point.bottomRight(),
            queue = [point];

        while (matrix.hasPoint(topLeftPoint) && matrix.getValue(topLeftPoint) === val) {
            queue.unshift(topLeftPoint);
            topLeftPoint = topLeftPoint.topLeft();
        }
        while (matrix.hasPoint(bottomRightPoint) && matrix.getValue(bottomRightPoint) === val) {
            queue.push(bottomRightPoint);
            bottomRightPoint = bottomRightPoint.bottomRight();
        }
        return queue.length >= removeCount ? queue : null;
    }

    function secondaryDiagonalRemovals(matrix, point, removeCount) {
        var val = matrix.getValue(point),
            topRightPoint = point.topRight(),
            bottomLeftPoint = point.bottomLeft(),
            queue = [point];

        while (matrix.hasPoint(topRightPoint) && matrix.getValue(topRightPoint) === val) {
            queue.unshift(topRightPoint);
            topRightPoint = topRightPoint.topRight();
        }
        while (matrix.hasPoint(bottomLeftPoint) && matrix.getValue(bottomLeftPoint) === val) {
            queue.push(bottomLeftPoint);
            bottomLeftPoint = bottomLeftPoint.bottomLeft();
        }
        return queue.length >= removeCount ? queue : null;
    }
})();