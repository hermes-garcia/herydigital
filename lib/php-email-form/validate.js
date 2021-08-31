!(function ($) {
    "use strict";

    $('form.php-email-form').submit(function (e) {
        e.preventDefault();
        let form = $(this).find('.form-group'),
            formError = false,
            emailExp = /^[^\s()<>@,;:\/]+@\w[\w\.-]+\.[a-z]{2,}$/i;

        form.children('input').each(function () {
            let input = $(this),
                rule = input.attr('data-rule');

            if (rule !== undefined) {
                let inputError = false,
                    pos = rule.indexOf(':', 0);
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length);
                    rule = rule.substr(0, pos);
                } else {
                    rule = rule.substr(pos + 1, rule.length);
                }

                switch (rule) {
                    case 'required':
                        if (input.val() === '') {
                            formError = inputError = true;
                        }
                        break;

                    case 'minlen':
                        if (input.val().length < parseInt(exp)) {
                            formError = inputError = true;
                        }
                        break;

                    case 'email':
                        if (!emailExp.test(input.val())) {
                            formError = inputError = true;
                        }
                        break;

                    case 'checked':
                        if (!input.is(':checked')) {
                            formError = inputError = true;
                        }
                        break;

                    case 'regexp':
                        exp = new RegExp(exp);
                        if (!exp.test(input.val())) {
                            formError = inputError = true;
                        }
                        break;
                }
                input.next('.validate').html((inputError ? (input.attr('data-msg') !== undefined ? input.attr('data-msg') : 'wrong Input') : '')).show('blind');
            }
        });

        form.children('textarea').each(function () {
            let input = $(this),
                rule = input.attr('data-rule');

            if (rule !== undefined) {
                let inputError = false,
                    pos = rule.indexOf(':', 0);
                if (pos >= 0) {
                    var exp = rule.substr(pos + 1, rule.length);
                    rule = rule.substr(0, pos);
                } else {
                    rule = rule.substr(pos + 1, rule.length);
                }

                switch (rule) {
                    case 'required':
                        if (input.val() === '') {
                            formError = inputError = true;
                        }
                        break;

                    case 'minlen':
                        if (input.val().length < parseInt(exp)) {
                            formError = inputError = true;
                        }
                        break;
                }
                input.next('.validate').html((inputError ? (input.attr('data-msg') != undefined ? input.attr('data-msg') : 'wrong Input') : '')).show('blind');
            }
        });

        if (formError) return false;
        let thisForm = $(this),
            action = $(this).attr('action');

        if (!action) action = 'form/contact.php';

        thisForm.find('.sent-message').slideUp();
        thisForm.find('.error-message').slideUp();
        thisForm.find('.loading').slideDown();

        if ($(this).data('recaptcha-site-key')) {
            let recaptcha_site_key = $(this).data('recaptcha-site-key');
            grecaptcha.ready(function () {
                grecaptcha.execute(recaptcha_site_key, {action: 'php_email_form_submit'}).then(function (token) {
                    submitPhpForm(thisForm, action, thisForm.serialize() + '&recaptcha-response=' + token);
                });
            });
        } else {
            submitPhpForm(thisForm, action, thisForm.serialize());
        }

        return false;
    });

    function submitPhpForm(form, action, data) {
        $.ajax({
            type: "POST",
            url: action,
            data: data,
            timeout: 40000
        }).done(function (msg) {
            if (msg == 'OK') {
                form.find('.loading').slideUp();
                form.find('.sent-message').slideDown();
                form.find("input:not(input[type=submit]), textarea").val('');
            } else {
                form.find('.loading').slideUp();
                if (!msg) {
                    msg = 'Falló el envío del mensaje: ' + action + '<br>';
                }
                form.find('.error-message').slideDown().html(msg);
            }
        }).fail(function (data) {
            let error_msg = "Falló el envío del mensaje!<br>";
            if (data.statusText || data.status) {
                error_msg += 'Status:';
                if (data.statusText) {
                    error_msg += ' ' + data.statusText;
                }
                if (data.status) {
                    error_msg += ' ' + data.status;
                }
                error_msg += '<br>';
            }
            if (data.responseText) {
                error_msg += data.responseText;
            }
            form.find('.loading').slideUp();
            form.find('.error-message').slideDown().html(error_msg);
        });
    }

})(jQuery);
