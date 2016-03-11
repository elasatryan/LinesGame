/**
 * Created by Artur Babayan on 3/7/2016.
 */
(function () {
    'use strict';
    var defaultOptions = {
        text: '',
        /*time: 0*/
        container: '',
        class:''
    };

    function Toast(options) {
        var that = this;
        that.options = options = $.extend({}, defaultOptions, options);
        var container = this.options.container || 'body';


        that.element = $('<div class="toast"></div>').text(that.options.text).appendTo(container).css({
            left: options.left,
            top: options.top
        });
        /*options.time && setTimeout(function () {
         el.remove();//todo
         }, options.time);*/
    }

    window.Toast = Toast;
})();
