$(document).ready(function(){
    // Smooth scroll to section
    $('nav a').on('click', function(e) {
        e.preventDefault();
        var target = $($(this).attr('href'));
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top
            }, 1000, function() {
                // Animation complete, show the corresponding section
                target.fadeIn();
            });

            // Trigger the image animation during the scroll
            animateImage();
        }
    });

    // Show the first section by default
    $('#home').fadeIn();

    // Show the corresponding section based on the URL hash
    var hash = window.location.hash;
    if (hash !== '') {
        $(hash).fadeIn();
    }

    // Handle page changes
    $('nav a').on('click', function() {
        var targetId = $(this).attr('href');
        $('.section').fadeOut();
        setTimeout(() => {
            $(targetId).fadeIn();
        }, 750);
    });

    function animateImage() {
        var $image = $('.animated-image');
        $image.css({ transform: 'scale(0) rotate(0deg)' });
        $image.animate({
            opacity: 1,
            scale: '1.5',
            rotate: '360deg'
        }, {
            step: function (now, fx) {
                if (fx.prop === 'rotate') {
                    $image.css('transform', 'scale(' + now + ') rotate(' + now + ')');
                } else {
                    $image.css(fx.prop, now);
                }
            },
            duration: 1000,
            complete: function() {
                $image.animate({
                    opacity: 0,
                    scale: '3',
                    rotate: '720deg'
                }, 500);
            }
        });
    }
});
