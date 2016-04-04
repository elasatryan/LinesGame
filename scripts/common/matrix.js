(function () {
    'use strict';
    var linesToCheck = [
        // horizontal
        {
            next: function (point) {
                return point.right();
            },
            prev: function (point) {
                return point.left();
            }
        },
        // vertical
        {
            next: function (point) {
                return point.bottom();
            },
            prev: function (point) {
                return point.top();
            }
        },
        // mainDiagonal
        {
            next: function (point) {
                return point.bottomRight();
            },
            prev: function (point) {
                return point.topLeft();
            }
        },
        // secondaryDiagonal
        {
            next: function (point) {
                return point.topRight();
            },
            prev: function (point) {
                return point.bottomLeft();
            }
        }
    ];

    function Matrix(size) {
        var that = this;

        that.size = size;
    }

    Matrix.prototype = [];

    Object.defineProperties(Matrix.prototype, {
        size: {
            get: function () {
                return this.length;
            },
            set: function (size) {
                var that = this;

                that.length = 0;

                that.push.apply(that, new NumberRange(0, size).map(function () {
                    return new Array(size);
                }));
            }
        }
    });

    $.extend(Matrix.prototype, {
        findPath: function (startPoint, endPoint) {
            var queue = [{
                    current: startPoint,
                    previous: null
                }],
                current,
                clone = this.clone();

            while (queue.length) {
                current = queue.shift().current;

                var some = [current.top(), current.right(), current.left(), current.bottom()].some(function (point) {
                    if (point.equals(endPoint)) {
                        return true;
                    }

                    if (clone.hasPoint(point) && null === clone.getValue(point)) {
                        queue.push({
                            current: point,
                            previous: current
                        });
                        clone.setValue(point, -1);
                    }
                });

                if (some) {
                    return destinationToPath({
                        current: endPoint,
                        previous: current
                    });
                }
            }
            return false;
        },
        clone: function () {
            var that = this;

            // todo change to don't clear `clone`
            var clone = new Matrix(that.size);
            clone.length = 0;
            clone.push.apply(clone, JSON.clone(that));

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
            linesToCheck.forEach(function (line) {
                queue.push.apply(queue, removeCandidates(that, point, removeCount, line.next, line.prev));
            });

            return queue.length ? queue : null;
        }
    });

    window.Matrix = Matrix;

    function removeCandidates(matrix, point, removeCount, getNext, getPrev) {
        var val = matrix.getValue(point),
            prev = getPrev(point),
            next = getNext(point),
            queue = [];

        // todo: make it to be more effective
        while (matrix.hasPoint(prev) && matrix.getValue(prev) === val) {
            queue.unshift(prev);
            prev = getPrev(prev);
        }
        while (matrix.hasPoint(next) && matrix.getValue(next) === val) {
            queue.push(next);
            next = getNext(next);
        }
        return queue.length + 1 >= removeCount ? queue : null;
    }

    function destinationToPath(destination) {
        var queue = [],
            current = destination.current;

        while (current.previous) {
            queue.push(current.current);
            current = current.previous;
        }

        return queue;
    }
})();