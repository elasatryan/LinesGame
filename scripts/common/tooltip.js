(function ($) {
    'use strict';
    var defaultOptions = {
        text: '',
    };
    function getOptionsFromElement(element) {
        var that = this;
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

                that.hover(function () {
                    $(this).data('tipText', titleContent).removeAttr('title');
                    $('<div class="tooltip"></div>')
                        .text(titleContent)
                        .appendTo('body')
                }, function () {
                    $('.tooltip').fadeOut(function () {
                        $(this).remove();
                    })
                });

                that.mousemove(function (e) {
                    var mousex = that.offset().top + 35;
                    var mousey =  that.offset().left + 25;
                    $('.tooltip').css({top: mousex, left: mousey})
                });

        });
    };
})(jQuery);