function Pool() {
}
Pool.prototype = [];
$.extend(Pool.prototype, {
    replace: function (replacePoint, replaceWith) {
        var that = this;
        that.some(function (item, index) {
            if (item.equals(replacePoint)) {
                that.splice(index, 1, replaceWith);
                return true;
            }
        });
    },
    add: function (point) {
        var that = this;
        if (!point) {
            return
        }
        if (!that.some(function (item) {
                return point.equals(item);
            })) {
            that.push(point);
        }
    },
    remove: function (point) {
        var that = this;
        that.some(function (item, index) {
            if (item.equals(point)) {
                that.takePoint(index);
                return true;
            }
        });
    },
    takePoint: function (index) {
        var that = this;
        return that.splice(index, 1)[0];
    },
    getRandomPoints: function (pointsCount) {
        var queue = [],
            that = this;
        for (var i = 0; i < pointsCount && that.length; i++) {
            queue.push(that.takePoint(Math.randomInt(that.length)));
        }
        return queue;
    }
});