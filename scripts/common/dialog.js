/**
 * Created by Artur Babayan on 3/4/2016.
 */
(function () {
    'use strict';

    // from aqurejs
    var async = function(func) {
        setTimeout(func, 0);
    };

    var dialogTemplate = '<div class="dialog"><header><span class="title"></span><span class="icon close"></span></header><div class="dialog-content"></div><footer></footer></div>',
        namespace = '.dialog',
        defaultOptions = {
            template: null,
            templateUrl: null,
            commands: [
                {action: 'save', text: 'Save', attr: {'class': 'left'}},
                {action: 'cancel', text: 'Cancel'}
            ],
            header: {
                title: '',
                closeButton: true
            },
            destroyOnClose: false
        };


    function Dialog(options) {
        var that = this;

        that.element = $(dialogTemplate);
        that.options = $.extend({}, defaultOptions, options);
        addHeader(that);
        addFooter(that);
    }

    $.extend(Dialog.prototype, {
        on: function () {
            var that = this,
                element = that.element;
            arguments[0] += namespace;
            element.on.apply(element, arguments);
            return that;
        },
        one: function () {
            var that = this,
                element = that.element;
            arguments[0] += namespace;
            element.one.apply(element, arguments);
            return that;
        },
        off: function () {
            var that = this,
                element = that.element;
            arguments[0] += namespace;
            element.off.apply(element, arguments);
            return that;
        },
        trigger: function () {
            var that = this,
                element = that.element;
            arguments[0] += namespace;
            element.trigger.apply(element, arguments);
            return that;
        },
        open: function () {
            var that = this,
                options = that.options,
                template = options.template,
                templateUrl = options.templateUrl;

            var complete = function (template) {
                that.element.find('.dialog-content').append(template);
                that.trigger('set-content');
            };

            if (template) {
                async(function() {
                    complete(template);
                });
            }
            else {
                $.ajax({
                    url: templateUrl
                }).success(complete);
            }

            that.trigger('open');

            return that;

        },
        close: function () {
            var that = this,
                element = that.element,
                destroyOnClose = that.options.destroyOnClose;

            element[destroyOnClose ? 'remove' : 'hide']();

            that.trigger('close');
        }
    });

    window.Dialog = Dialog;

    function addHeader(dialog) {
        var header = dialog.options.header,
            element = dialog.element,
            title = header.title,
            closeButton = header.closeButton;

        if (closeButton || title) {
            element.find('.title').text(title);
            closeButton && element.find('.close').show().click(function () {
                dialog.trigger('close');
            });
        } else {
            element.find('header').hide();
        }
    }

    function addFooter(dialog) {
        var commands = dialog.options.commands,
            footer = dialog.element.find('footer');

        if (commands.length) {
            commands.forEach(function (item) {
                var attr = item.attr || {},
                    className = item.attr['class'];

                delete attr['class'];

                $('<button>').text(item.text).attr(attr).addClass(item.action).addClass(className).click(function () {
                    dialog.trigger(item.action);
                }).appendTo(footer);
            });
        }
        else {
            element.find('footer').hide();
        }
    }

})();