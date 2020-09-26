!(function ($) {
    "use strict";

    let scrolltoOffset = $('#header').outerHeight() - 1;
    $(document).on('click', '.nav-menu a, .mobile-nav a, .scrollto, .cta-btn', function (e) {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            let target = $(this.hash);
            if (target.length) {
                e.preventDefault();
                let scrollto = target.offset().top - scrolltoOffset;

                if ($(this).attr("href") == '#header') {
                    scrollto = 0;
                }

                $('html, body').animate({
                    scrollTop: scrollto
                }, 1500, 'easeInOutExpo');

                if ($(this).parents('.nav-menu, .mobile-nav').length) {
                    $('.nav-menu .active, .mobile-nav .active').removeClass('active');
                    $(this).closest('li').addClass('active');
                }
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
                    $('.mobile-nav-overly').fadeOut();
                }
                return false;
            }
        }
    });

    $(document).ready(function () {
        if (window.location.hash) {
            let initialNav = window.location.hash;
            if ($(initialNav).length) {
                let scrollto = $(initialNav).offset().top - scrolltoOffset;
                $('html, body').animate({
                    scrollTop: scrollto
                }, 1500, 'easeInOutExpo');
            }
        }
    });

    if ($('.nav-menu').length) {
        let mobileNav = $('.nav-menu').clone().prop({
            class: 'mobile-nav d-lg-none'
        });
        $('body').append(mobileNav);
        $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu burger-menu-ico"></i></button>');
        $('body').append('<div class="mobile-nav-overly"></div>');

        $(document).on('click', '.mobile-nav-toggle', function (e) {
            $('body').toggleClass('mobile-nav-active');
            $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
            $('.mobile-nav-overly').toggle();
        });

        $(document).on('click', '.mobile-nav .drop-down > a', function (e) {
            e.preventDefault();
            $(this).next().slideToggle(30000);
            $(this).parent().toggleClass('active');
        });

        $(document).click(function (e) {
            let container = $(".mobile-nav, .mobile-nav-toggle");
            if (!container.is(e.target) && container.has(e.target).length === 0) {
                if ($('body').hasClass('mobile-nav-active')) {
                    $('body').removeClass('mobile-nav-active');
                    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
                    $('.mobile-nav-overly').fadeOut();
                }
            }
        });
    } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
        $(".mobile-nav, .mobile-nav-toggle").hide();
    }

    let navSection = $('section');
    let mainNav = $('.nav-menu, #mobile-nav');
    $(window).on('scroll', function () {
        let currentPos = $(this).scrollTop() + 200;

        navSection.each(function () {
            let top = $(this).offset().top,
                bottom = top + $(this).outerHeight();
            if (currentPos >= top && currentPos <= bottom) {
                if (currentPos <= bottom) {
                    mainNav.find('li').removeClass('active');
                }
                mainNav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
            }
            if (currentPos < 300) {
                $(".nav-menu ul:first li:first").addClass('active');
            }
        });
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('#header').addClass('header-scrolled');
            $('.burger-menu-ico').addClass('header-scrolled');
        } else {
            $('#header').removeClass('header-scrolled');
            $('.burger-menu-ico').removeClass('header-scrolled');
        }
    });

    if ($(window).scrollTop() > 100) {
        $('#header').addClass('header-scrolled');
    }

    $("#heroCarousel").on('slid.bs.carousel', function (e) {
        $(this).find('h2').addClass('animate__animated animate__fadeInDown');
        $(this).find('p, .btn-get-started').addClass('animate__animated animate__fadeInUp');
    });

    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
        if ($(this).scrollTop() > 200 ) {
            $('.btn-whatsapp').fadeIn('slow');
        }else{
            $('.btn-whatsapp').fadeOut('slow');
        }
    });

    $('.back-to-top').click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 1500, 'easeInOutExpo');
        return false;
    });

    $(window).on('load', function () {
        let preloader = $('#preloader');
        if (preloader.length) {
            preloader.delay(100).fadeOut('slow', function () {
                $(this).remove();
            });
        }

        let portfolioIsotope = $('.portfolio-container').isotope({
            itemSelector: '.portfolio-item'
        });

        $('#portfolio-filters li').on('click', function () {
            $("#portfolio-filters li").removeClass('filter-active');
            $(this).addClass('filter-active');

            portfolioIsotope.isotope({
                filter: $(this).data('filter')
            });
            aos_init();
        });

        let pricingIsotope = $('.pricing-container').isotope({
            itemSelector: '.pricing-item',
            layoutMode: 'fitRows'
        });

        $('#pricing-filters li').on('click', function () {
            $("#pricing-filters li").removeClass('filter-active');
            $(this).addClass('filter-active');

            pricingIsotope.isotope({
                filter: $(this).data('filter')
            });
            aos_init();
        });

        $(document).ready(function () {
            $('.venobox').venobox();

            if(window.location.href.indexOf('#terminos-y-condiciones') != -1) {
                $('#terms-and-conditions').modal('show');
            }
            if(window.location.href.indexOf('#aviso-de-privacidad') != -1) {
                $('#privacy').modal('show');
            }

            $('#ecommerce-pricing').click();

            $('.js-contact').click(function(){
                let interest = $(this).data('interest');
                let message = $(this).data('message');
                $('#subject').html(interest).val(interest);
                $('#message').html(message).val(message);
            });

            $('#name').on('input', function (){
                if (!/^[a-zA-Záéíóúüñ]*$/i.test(this.value)) {
                    this.value = this.value.replace(/[^a-zA-Z]*/ig, "");
                }
            });

            $('#telephone').on('input', function (){
                if (!/^[0-9]*$/i.test(this.value)) {
                    this.value = this.value.replace(/[^0-9]+/ig, "");
                }
            });

            $('#email').on('input', function (){
                if (!/^[a-zA-Z0-9_.+-@]*$/i.test(this.value)) {
                    this.value = this.value.replace(/[^a-zA-Z0-9_.+-@]*/ig, "");
                }
            });
        });
    });

    $(".testimonials-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2
            },
            900: {
                items: 3
            }
        }
    });

    $(".portfolio-details-carousel").owlCarousel({
        autoplay: true,
        dots: true,
        loop: true,
        items: 1
    });

    function aos_init() {
        AOS.init({
            duration: 250,
            easing: "ease-in-out",
            once: true,
            mirror: false
        });
    }

    $(window).on('load', function () {
        aos_init();
    });

})(jQuery);