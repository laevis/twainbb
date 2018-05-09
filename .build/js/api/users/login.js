$(document).on('submit', '[data-trigger="[form/login]"]', function(e) {
    e.preventDefault();

    var form = $(this);

    var obj = {
        username: form.find('[name="lUsername"]').val(),
        password: form.find('[name="lPassword"]').val(),
    };

    var site = fermata.json(document.location.origin);

    site.api.v1.users.post(obj, function(err, res) {
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
        }

        if(res.success) {
            alertify.success(res.result);
            $('[data-trigger="[modal/login]"]').fadeOut();
            $('.tOverlay').fadeOut();
            obj = {};
            $('[data-trigger="[modal/login]"]').find('input').val('');
            location.reload();
        }
    });
});
