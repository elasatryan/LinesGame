/**
 * Created by ElenA on 3/11/2016.
 */

(function () {
    $.extend($.fn, {
        show: function() {
            return this.removeClass('jq-hide').addClass('jq-show');
        },
        hide: function() {
            return this.removeClass('jq-show').addClass('jq-hide');
        }
    })
})();