'use strict';

function isValidEmailAddress(emailAddress) {
    return !!emailAddress.match(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

function isValidPassword(password) {
    return !!password.match("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$");
}

function validate(input, name) {
    var form = $('[trigger="[form/register]"]');
    var phrases = [
        'Username', // 0
        'Username can not be longer than 15 characters or contain special characters (punctation and underscore is allowed)', // 1
        'Display name',
        'Display name can not be longer than 25 characters.',
        'E-mail',
        'E-mail is not a valid e-mail.',
        'Password',
        'Password must be 8 characters or more and have at least one uppercase and lowercase letter, one digit and one special character.',
        'Passwords identical',
        'The passwords you entered are not identical to one another.'
    ];

    switch(name) {
        case 'rUsername':
            if(input.length < 1 || input.length > 15 || /^[a-zA-Z0-9_.]*$/.test(input) == false) {
                if(!$('.rUsernameError').length) {
                    $('.registerForm button').prop('disabled', true);
                    form.find('[name="rUsername"]').css('border', '2px solid #eb4d4b').before('<div class="validatorInvalid rUsernameError"><i class="fa fa-times"></i>'+phrases[0]+' <div class="info">'+phrases[1]+'</div></div>');
                }
            } else {
                $('.registerForm button').prop('disabled', false);
                form.find('[name="rUsername"]').css('border', 'none');
                $('.rUsernameError').remove();
            }

            break;

        case 'rDisplayname':
            if(input.length < 1 || input.length > 25) {
                if(!$('.rDisplaynameError').length) {
                    $('.registerForm button').prop('disabled', true);
                    form.find('[name="rDisplayname"]').css('border', '2px solid #eb4d4b').before('<div class="validatorInvalid rDisplaynameError"><i class="fa fa-times"></i>'+phrases[2]+' <div class="info">'+phrases[3]+'</div></div>');
                }
            } else {
                $('.registerForm button').prop('disabled', false);
                form.find('[name="rDisplayname"]').css('border', 'none');
                $('.rDisplaynameError').remove();
            }

            break;

        case 'rPassword':
            if(!isValidPassword(input)) {
                if(!$('.rPasswordError').length) {
                    $('.registerForm button').prop('disabled', true);
                    form.find('[name="rPassword"]').css('border', '2px solid #eb4d4b').before('<div class="validatorInvalid rPasswordError"><i class="fa fa-times"></i>'+phrases[6]+' <div class="info">'+phrases[7]+'</div></div>');
                }
            } else {
                $('.registerForm button').prop('disabled', false);
                form.find('[name="rPassword"]').css('border', 'none');
                $('.rPasswordError').remove();
            }

            break;

        case 'rRepeatPassword':
            if($('.registerForm input[name="rPassword"]').val() != input) {
                if(!$('.rPasswordRepeatError').length) {
                    $('.registerForm button').prop('disabled', true);
                    form.find('[name="rRepeatPassword"]').css('border', '2px solid #eb4d4b').before('<div class="validatorInvalid rPasswordRepeatError"><i class="fa fa-times"></i>'+phrases[8]+' <div class="info">'+phrases[9]+'</div></div>');
                }
            } else {
                $('.registerForm button').prop('disabled', false);
                form.find('[name="rRepeatPassword"]').css('border', 'none');
                $('.rPasswordRepeatError').remove();
            }

            break;

        case 'rEmail':
            if(input.length < 1 || !isValidEmailAddress(input)) {
                if(!$('.rEmailError').length) {
                    $('.registerForm button').prop('disabled', true);
                    form.find('[name="rEmail"]').css('border', '2px solid #eb4d4b').before('<div class="validatorInvalid rEmailError"><i class="fa fa-times"></i>'+phrases[4]+' <div class="info">'+phrases[5]+'</div></div>');
                }
            } else {
                $('.registerForm button').prop('disabled', false);
                form.find('[name="rEmail"]').css('border', 'none');
                $('.rEmailError').remove();
            }
            break;
    }
}

$(document).on('submit', '[trigger="[modal/register]"]', function(e) {
    e.preventDefault();

    var form = $(this);

    var obj = {
        username: form.find('[name="rUsername"]').val(),
        displayname: form.find('[name="rDisplayname"]').val(),
        password: form.find('[name="rPassword"]').val(),
        email: form.find('[name="rEmail"]').val()
    };

    var site = fermata.json(document.location.origin);

    site.api.v1.users.put(obj, function(err, res) {
        if(!res.success) {
            if(res.result[0].message) {
                for(var i = 0; i <= res.result.length; i++) {
                    alertify.error(res.result[i].message);
                }
            }

            alertify.error(res.result);
        }

        if(res.success) alertify.success(res.result);
    });
});
