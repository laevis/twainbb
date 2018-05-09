$(document).ready(function() {
    $(document).on('click', '[data-trigger="[modal/open]"]', function() {
        $('.tOverlay').fadeIn('fast');
        $('[data-trigger="'+$(this).attr('data-trigger-target')+'"').fadeIn('fast');
    });

    $(document).on('click', '[data-trigger="[modal/close]"]', function() {
        $(this).parent().fadeOut('fast');
        $('.tOverlay').fadeOut('fast');
    });

    $(document).on('click', '.live .trigger', function() {
        $(this).toggleClass("trigger_active");
        $('#tooltip').hide();

        if($(".sideslide").is(":visible")) {
            $(".container").animate({width: '100%'});
            $(".wrap").animate({width: '70%'});
        } else {
            $(".container").css("float", "right");
            $(".container").animate({width: '80%'}, 350);
            $(".wrap").animate({width: '100%'});
        }

        $(".sideslide").animate({width:'toggle'},350);
    });
});
