$(document).on('submit', '[data-trigger="[form/register]"]', function(e) {
    e.preventDefault();

    var form = $(this);

    if(form.find('[name="rRepeatPassword"]').val() != form.find('[name="rPassword"]').val()) {
        alertify.error('Passwords do not match.');
        return;
    }

    var obj = {
        username: form.find('[name="rUsername"]').val(),
        displayname: form.find('[name="rDisplayname"]').val(),
        password: form.find('[name="rPassword"]').val(),
        email: form.find('[name="rEmail"]').val()
    };

    var site = fermata.json(document.location.origin);

    site.api.v1.users.put(obj, function(err, res) {
        if(!res.success) {
            var errors = [];
            var messageContent = '';

            if(res.result[0].message) {
                for(var i = 0; i < res.result.length; i++) {
                    errors.push(res.result[i].message);
                }

                $(errors).each(function(index, item) {
                    messageContent += '<li>'+item+'</li>';
                });

                alertify.error('<b>The following errors occurred:</b><br><ul>'+messageContent+'</ul>');
            }

            alertify.error(res.result);
        }

        if(res.success) {
            alertify.success(res.result);
            var loginObj = {
                username: form.find('[name="rUsername"]').val(),
                password: form.find('[name="rPassword"]').val(),
            }

            site.api.v1.users.post(loginObj, function(err, res) {
                var errors = [];

                if(!res.success) {
                    if(res.result[0].message) {
                        for(var i = 0; i <= res.result.length; i++) {
                            errors.push(res.result[i].message);
                        }
                    }

                    alertify.error(res.result);
                }

                if(res.success) {
                    alertify.success(res.result);
                    obj = {};
                    loginObj = {};
                    $('[data-trigger="[modal/register]"]').find('input').val('');
                    $('[data-trigger="[modal/register]"]').fadeOut();
                    $('.tOverlay').fadeOut();
                    setTimeout(function() {
                        location.reload();
                    }, 1000);
                }
            });
        }
    });
});
