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
//adds all arguments to current Pool
    add: function (point) {
        this.push.apply(this, arguments);
    },
    getPoint: function (index) {
        var that = this;
        return that.splice(index, 1)[0];
    },
    getRandomPoints: function (pointsCount) {
        var queue = [],
            that = this;
        for (var i = 0; i < pointsCount && that.length; i++) {
            queue.push(that.getPoint(Math.randomInt(that.length)));
        }
        return queue;
    }
});