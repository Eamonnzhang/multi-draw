(function ($) {
    "use strict";

    $.fn.tkFormControlMaterial = function(){
        this
            .blur(function () {
                if (this.val())
                    this.addClass('used');
                else
                    this.removeClass('used');
            })
            .after('<span class="ma-form-highlight"></span><span class="ma-form-bar"></span>');
    };

    $('.form-control-material .form-control').each(function () {
        $(this).tkFormControlMaterial();
    });

    $(document).on('show.bs.dropdown', function (e) {

        if (Modernizr.touch && $(window).width() < 768) return true;

        var dd = $(e.relatedTarget).next('.dropdown-menu');
        var ddHeight = dd.outerHeight();
        dd.css({
            height: 0,
            display: 'block',
            overflow: 'hidden'
        });
        dd.velocity({opacity: 1}, {duration: 650, queue: false, easing: 'easeOutQuad'});
        dd.velocity({
            height: ddHeight,
            top: dd.data('top') || 0
        }, {
            duration: 650,
            queue: false,
            easing: 'easeOutCubic',
            complete: function () {
                dd.css({overflow: 'visible'});
            }
        });
    });

    $(document).on('hide.bs.dropdown', function (e) {

        if (Modernizr.touch && $(window).width() < 768) return true;

        var dd = $(e.relatedTarget).next('.dropdown-menu');
        dd.velocity({
            opacity: 0,
            top: '100%'
        }, {
            duration: 650, queue: false, easing: 'easeOutQuad', complete: function () {
                dd.css({
                    display: 'none',
                    height: 'auto'
                });
            }
        });
    });

})(jQuery);

(function ($) {
    "use strict";

    var ripple = function (e) {

        var el, ink, d, x, y;

        el = $(this);

        el.addClass('ripple');

        if (el.parents('.sidebar-skin-white').length) {
            el.addClass('ripple-dark-fade');
        }

        if (el.parents('.sidebar-skin-dark').length) {
            el.addClass('ripple-light-fade');
        }

        if (el.is('.btn-white')) {
            el.addClass('ripple-dark-fade');
        }

        if (el.attr('href') && ! el.data('toggle')) {
            e.preventDefault();
            if (el.closest('.dropdown-menu').length) {
                e.stopPropagation();
            }
            setTimeout(function () {
                document.location = el.attr('href');
            }, 400);
        }

        // create .ink element if it doesn't exist
        if (el.find(".ink").length === 0)
            el.prepend("<span class='ink'></span>");

        ink = el.find(".ink");
        // in case of quick double clicks stop the previous animation
        ink.removeClass("animate");

        // set size of .ink
        if (! ink.height() && ! ink.width()) {
            // use el's width or height whichever is larger for the diameter to make a circle which can cover the entire element.
            d = Math.max(el.outerWidth(), el.outerHeight());
            ink.css({height: d, width: d});
        }

        // get click coordinates
        // logic = click coordinates relative to page - el's position relative to page - half of self height/width to make it controllable from the center;
        x = e.pageX - el.offset().left - ink.width() / 2;
        y = e.pageY - el.offset().top - ink.height() / 2;

        // set the position and add class .animate
        ink.css({top: y + 'px', left: x + 'px'}).addClass("animate");

    };

    var listGroupMenu = $('.list-group-menu > .list-group-item > a'),
        button = $('.btn'),
        navbarNav = $('.navbar-nav > li > a'),
        dropdownMenu = $('.dropdown-menu > li > a'),
        sidebarMenu = $('.sidebar-menu > li > a');

    var addRipple = $()
        .add(listGroupMenu)
        .add(button)
        .add(navbarNav)
        .add(dropdownMenu)
        .add(sidebarMenu);

    if (addRipple.length) {
        addRipple.click(ripple);
    }

})(jQuery);