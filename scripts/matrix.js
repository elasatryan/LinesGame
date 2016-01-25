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
    }
});