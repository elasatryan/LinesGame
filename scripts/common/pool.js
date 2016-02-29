function Pool() {
}
Pool.prototype = [];
$.extend(Pool.prototype, {
    add: function (point) {
        var that = this;
        that.push.apply(that, arguments);
    },
    remove: function (point) {
        var that = this;
        that.some(function (item, index) {
            if (item.equals(point)) {
                that.takePoint(index);
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