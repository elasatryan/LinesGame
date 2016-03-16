(function ($) {
    'use strict';
    var defaultOptions = {
        text: ''
    };

    function getOptionsFromElement(element) {
        return {
            text: element.attr('title')
        };
    }

    $.fn.tooltip = function (options) {
        var that = this,
            settings = $.extend({}, defaultOptions, getOptionsFromElement(that), options);

        return this.each(function () {
            var that = $(this);

            var titleContent = settings.text || that.attr('title');

            var toast = new Toast({
                text:titleContent,
                container:that.parent()
            });
            toast.element.addClass('tooltip').hide();

            that.hover(function () {
                $(this).data('tipText', titleContent).removeAttr('title');
                toast.element.show();
            }, function () {
                $('.tooltip').fadeOut(function () {
                    $(this).hide();
                })
            });
        });
    };
})(jQuery);