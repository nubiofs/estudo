$(document).ready(function () {
    $('#signupForm').on('click', 'button[type=submit]', function (e) {
        e.preventDefault();
        $('.has-error').addClass('highlighterror');
        $('.has-success').removeClass('highlighterror');
        $("#signup_error_message").css("display", "block");
        $("#signup_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter a valid input.");
        $('#mobileredclass').css("display", "block");
        $('#mobilegreenclass').css("display", "none");
        var validatorCheck = $(this).closest('form').data('bootstrapValidator');
        validatorCheck.validate();
        if (!validatorCheck.isValid()) {
            setTimeout(function () {
                $('#mobileredclass').css("display", "block");
            }, 300);
        }
        return false;
    });
    $('#signinForm').on('click', 'button[type=submit]', function (e) {
        e.preventDefault();
        $('.has-error').addClass('highlighterror');
        $('.has-success').removeClass('highlighterror');
        $("#signin_error_message").css("display", "block");
        $("#signin_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter a valid input.");

        var validatorCheck = $(this).closest('form').data('bootstrapValidator');
        validatorCheck.validate();
        if (!validatorCheck.isValid()) {
            setTimeout(function () {
                $('#mobileredclass').css("display", "block");
            }, 300);
        }
        return false;
    });
    if (typeof $('#signupForm').bootstrapValidator !== 'undefined') {
        $('#signupForm').bootstrapValidator({
            err: {
                container: function ($field, validator) {

                    if (validator.isValid()) {
                        $('.has-feedback').removeClass("has-error");
                    } else {
                        $('.has-feedback').addClass("has-error");
                    }
                }
            },
            feedbackIcons: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'data[User][name]': {
                    validators: {
                        notEmpty: {
                            message: 'Name is required.'
                        },
                        regexp: {
                            regexp: '^[a-zA-Z][a-zA-Z\\s]+$',
                            message: 'Name is required.'
                        }
                    }
                },
                'data[User][email]': {
                    validators: {
                        notEmpty: {
                            message: 'Email is required'
                        },
                        regexp: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]{2,4}$',
                            message: 'The value is not a valid email address'
                        }
                    }
                },
                'data[User][password]': {
                    validators: {
                        notEmpty: {
                            message: 'Password is required'
                        },
                        stringLength: {
                            min: 8,
                            message: 'Password should be atleast 8 character'
                        }

                    }
                },
                'data[User][mobile]': {
                    validators: {
                        notEmpty: {
                            message: 'Mobile Number is required',
                        },
                        regexp: {
                            regexp: '^[0-9-+]+$',
                            message: 'The value is not a valid mobile number'
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            // Prevent form submission
            e.preventDefault();
            var $form = $(e.target),
                    validator = $form.data('bootstrapValidator'),
                    submitButton = validator.getSubmitButton();
            if (validator.isValid()) {
                $("#signup_error_message, #mobileredclass").css("display", "none");
                $('#ajax-loader').show();
                var category_data = $("#category_desc").val();
                var sub_category_data = $("#sub_category_desc").val();
                var blog_name = $("#blog_name").val();
                $.ajax({
                    url: '/users/signup?utm_source=blog&utm_campaign=blog_signup&utm_medium=blog_signup',
                    data: $('#signupForm').serialize() + "&category=" + category_data + "&blog_name=" + blog_name + "&sub_category=" + sub_category_data,
                    type: 'POST',
                    dataType: 'json',
                    error: function (e) {
                        $('#ajax-loader').hide();
                    },
                    success: function (data) {
                        $('#ajax-loader').hide();

                        if (data.status == "success" || data.status == "my-courses" || data.status == "lead") {

                            if (playVideo) {
                                var href = window.location.href;
                                var inputs = '';
                                inputs += '<input type="hidden" name="playme" value="true" />';
                                $("body").append('<form action="' + href + '" method="post" id="poster">' + inputs + '</form>');
                                $("#poster").submit();

                            } else
                                do_login_update(true);

                        } else {
                            $(".newsignclik").show();
                            $("#signup_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + data.msg);
                            $("#signup_error_message").css("display", "block");
                            $('#mobilegreenclass').css("display", "none");
                            $('#mobileredclass').css("display", "block");
                        }
                    }

                });
            }

            return false;
            // Do whatever you want here ...
        }).on('error.field.bv', function (e, data) {

            $('.defdisablesignup').prop('disabled', false).removeClass('disabled');

        }).on('success.field.bv', function (e, data) {

            $('.has-success').removeClass('highlighterror').removeClass('has-error');
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                $('.defdisablesignup').prop('disabled', false).removeClass('disabled');
                $('#mobileredclass').css("display", "none");
            }

        });

    }



    if (typeof $('#signinForm').bootstrapValidator !== 'undefined') {

        $('#signinForm').bootstrapValidator({
            err: {
                container: function ($field, validator) {

                    if (validator.isValid()) {
                        $('.has-feedback').removeClass("has-error");
                    } else {
                        $('.has-feedback').addClass("has-error");
                    }

                }
            },
            feedbackIcons: {
                valid: 'fa fa-check',
                invalid: 'fa fa-close',
                validating: 'glyphicon glyphicon-refresh'
            },
            fields: {
                'data[User][email]': {
                    validators: {
                        notEmpty: {
                            message: 'Email is required'
                        },
                        regexp: {
                            regexp: '^[^@\\s]+@([^@\\s]+\\.)+[^@\\s]{2,4}$',
                            message: 'The value is not a valid email address'
                        }
                    }
                },
                'data[User][password]': {
                    validators: {
                        notEmpty: {
                            message: 'Password is required'
                        },
                        stringLength: {
                            min: 8,
                            message: 'Password should be atleast 8 character'
                        }
                    }
                }
            }
        }).on('success.form.bv', function (e) {
            // Prevent form submission

            e.preventDefault();
            var $form = $(e.target),
                    validator = $form.data('bootstrapValidator'),
                    submitButton = validator.getSubmitButton();

            if (validator.isValid()) {
                $("#signin_error_message, #mobileredclass").css("display", "none");
                $('#ajax-loader').show();
                $('.defdisablesignin').removeClass('disabled');

                $.ajax({
                    url: '/users/signin',
                    data: $('#signinForm').serialize(),
                    type: 'POST',
                    dataType: 'json',
                    error: function () {
                        $('#ajax-loader').hide();
                    },
                    success: function (data) {
                        $('.defdisablesignin').removeClass('disabled');

//                    $('#ajax-loader').hide();
                        if (data.status == "success" || data.status == "my-courses" || data.status == "lead") {
                            if (playVideo) {
                                var href = window.location.href;
                                var inputs = '';
                                inputs += '<input type="hidden" name="playme" value="true" />';
                                $("body").append('<form action="' + href + '" method="post" id="poster">' + inputs + '</form>');
                                $("#poster").submit();

                            } else {
                                do_login_update(true);
                            }
                        } else {
                            $(".newsignclik").show();
                            $("#signin_error_message").css("display", "block");
                            $("#signin_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + data.msg);
                            $('#mobilegreenclass').css("display", "none");
                            $('#mobileredclass').css("display", "block");
                        }
                    }
                });
            }
            return false;
            // Do whatever you want here ...
        }).on('error.field.bv', function (e, data) {

            $('.defdisablesignin').prop('disabled', false).removeClass('disabled');

        }).on('success.field.bv', function (e, data) {
            $('.has-success').removeClass('highlighterror').removeClass('has-error');
            if (data.fv.getInvalidFields().length > 0) {    // There is invalid field
                $('.defdisablesignin').prop('disabled', false).removeClass('disabled');
                $('#mobileredclass').css("display", "none");
            }

        });

    }

//    var myTag = $('.feattitle').text();
//    if (myTag.length > 30) {
//        var truncated = myTag.trim().substring(0, 30) + "…";
//        $('.feattitle').text(truncated);
//    }

    $('.has-error,.has-feedback').removeClass("has-error");

    var user_status = null;

    $('.onclicktab, .md-overlay').on('click', function (e) {
        $('#mobilegreenclass,#mobileredclass,#signin_error_message,#signup_error_message').css("display", "none");
        $('#inputName,#pwd').val("");
        $('.defdisablesignin').prop('disabled', true);
        $('.has-error,.highlighterror').removeClass("highlighterror");
        $('#pwd, #pwd3').attr("type", "password");
        $('#eye, #eye3').html("show");
        $('#pwd2, #otpfield').removeClass('highlighterror');

    });

    //  Handle the autofill for browsers where the jQuery event is not trigerred automatically.

    $("#signinForm , #resetcode, #signupForm").on('click', function (e) {
        $('#mobileredclass').css("display", "none");
        $('#mobilegreenclass').css("display", "none");
    });

    if (user_status != null) { //contains fields that show whether the user already exists in the database
        if (user_status['status'] == "failed") {
            $("#signin-modal").addClass('md-show');
            $(".newsignclik").show();
            $("#signin_error_message").css("display", "block");
            $('#inputName,#pwd,#pwd3,#mobnum, #signupemail,#signupname').val("");
            $("#signin_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + "The reset password link has expired");
            $('#mobilegreenclass').css("display", "none");
            $('#mobileredclass').css("display", "block");
        } else {
            $("#signin-modal").addClass('md-show');
            $(".newsignclik").hide();
            $(".forgetpassnew").show();
            $("#prefilledemail, #emailfield").val(user_status['email']);
            $("#verificationfield").val(user_status['verification_code']);
            $("#messages, #mobilegreenmsg").html("Please enter the new password");
            $('#mobilegreenclass').css("display", "block");
            $(".verifycheck").hide();
            resetpass();
        }
    }
    redirectflag = $("#redirectflag").val();
    if (redirectflag == 1) {
        $(".newsignclik").show();
        $("#signin_signup_cancel").hide();
        $('.signin.md-trigger.top-signin').trigger('click');
    } else if (redirectflag == 2) {
//          $("#signin-modal").addClass('md-show');
        $("#signin_signup_cancel").hide();
        $("#LogIn").removeClass("active in");
        $("#SignUp").addClass("active in");
        $(".Signinspace").removeClass("active");
        $(".SignUpspace").addClass("active");
        $('.signin.md-trigger.top-signin').trigger('click');
    }

    var flag_reset = true;
    $("#Forgotnew , #resendcode").on('click', function (e) {
        $('#otpfield, #verificationfield, #pwd2').val("");
        var email = $('#inputName').val();
        if (isEmail(email)) {

            $('#ajax-loader').show();
            e.preventDefault();

            $.ajax({
                url: '/users/process_forgot_password',
                data: $('#signinForm').serialize(),
                type: 'POST',
                dataType: "json",
                error: function () {
                    $('#ajax-loader').hide();
                },
                success: function (data) {
                    $('#ajax-loader').hide();
                    if (data.status == "success") {
                        $(".newsignclik").hide();
                        $(".forgetpassnew").show();
                        $(".verifycheck").show();
                        $('#otpfield').removeClass('highlighterror');
                        $('#pwd2').removeClass('highlighterror');
                        $("#prefilledemail, #emailfield").val(data.email);
                        $("#messages").addClass("greenalertnew");
                        $("#messages").removeClass("redalertnew");
                        $("#messages, #mobilegreenmsg").html('<i class="fa fa-check-circle"></i> ' + data.msg);
                        $('#mobileredclass').css("display", "none");
                        $('#mobilegreenclass').css("display", "block");
                        if (flag_reset == true) {
                            flag_reset = false;
                            resetpass();
                        }
                    } else {
                        $(".newsignclik").show();
                        $("#signin_error_message").css("display", "block");
                        $("#signin_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + data.msg);
                        $('#mobilegreenclass').css("display", "none");
                        $('#mobileredclass').css("display", "block");
                    }
//                
                }

            });
        } else {
            $("#signin_error_message, #mobileredclass").css("display", "block");
            $("#signin_error_message").removeClass("greenalertnew");
            $("#signin_error_message").addClass("redalertnew");
            $("#signin_error_message, #mobileredmsg").html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter your email id to reset password");
        }
    });
    if (typeof document.getElementById("eye") !== "undefined" && document.getElementById("eye") != null) {
        document.getElementById("eye").addEventListener("click", function (e) {
            var pwd = document.getElementById("pwd");
            if (pwd.getAttribute("type") == "password" && $('#pwd').val() != '') {
                pwd.setAttribute("type", "text");
                $('#eye').html("hide");
            } else {
                pwd.setAttribute("type", "password");
                $('#eye').html("show");
            }
        });
    }
    if (typeof document.getElementById("eye2") !== "undefined" && document.getElementById("eye2") != null) {
        document.getElementById("eye2").addEventListener("click", function (e) {
            var pwd = document.getElementById("pwd2");
            if (pwd.getAttribute("type") == "password" && $('#pwd2').val() != '') {
                pwd.setAttribute("type", "text");
                $('#eye2').html("hide");
            } else {
                pwd.setAttribute("type", "password");
                $('#eye2').html("show");
            }
        });
    }
    if (typeof document.getElementById("eye3") !== "undefined" && document.getElementById("eye3") != null) {
        document.getElementById("eye3").addEventListener("click", function (e) {
            var pwd = document.getElementById("pwd3");
            if (pwd.getAttribute("type") == "password" && $('#pwd3').val() != '') {
                pwd.setAttribute("type", "text");
                $('#eye3').html("hide");
            } else {
                pwd.setAttribute("type", "password");
                $('#eye3').html("show");
            }
        });
    }

});


function isEmail(email) {

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

function resetpass() {
    $("#passresetbutton").on('click', function (e) {
        //$('#ajax-loader').show();
        e.preventDefault();
        //$(".forgetpassnew").hide();
        new_pass = $.trim($('#pwd2').val());
        if ((new_pass != '' && new_pass.toString().length >= 8) && ($('#otpfield').val() != '' || $("#verificationfield").val() != '')) {
            $('#ajax-loader').show();
            e.preventDefault();

            $.ajax({
                url: '/lms_users/recover_password',
                data: $('#resetcode').serialize(),
                type: 'POST',
                dataType: "json",
                error: function () {
                    $('#ajax-loader').hide();
                },
                success: function (data) {
                    $('#ajax-loader').hide();
                    if (data.status == "success") {
                        $(".newsignclik").show();
                        $(".forgetpassnew").hide();
                        $("#signin_error_message").css("display", "block");
                        $("#signin_error_message").removeClass("redalertnew");
                        $("#signin_error_message").addClass("greenalertnew");
                        $("#signin_error_message, #mobilegreenmsg").html('<i class="fa fa-check-circle"></i> ' + data.msg);
                        $('#mobilegreenclass').css("display", "block");
                        $('#inputName,#signupname,#pwd,#pwd3,#mobnum, #signupemail,#emailfield').val("");
                        $('.defdisable').prop('disabled', true);

                    } else {
                        $('#otpfield').addClass('highlighterror');
                        $('#pwd2').removeClass('highlighterror');
                        $(".forgetpassnew").show();
                        $("#messages").removeClass("greenalertnew");
                        $("#messages").addClass("redalertnew");
                        $('#messages, #mobileredmsg').html('<i class="fa fa-exclamation-triangle"></i> ' + data.msg);
                        $('#mobilegreenclass').css("display", "none");
                        $('#mobileredclass').css("display", "block");
                    }

                }


            });
        } else {
            $(".newsignclik").hide();
            $(".forgetpassnew").show();
            $("#messages").removeClass("greenalertnew");
            $("#messages").addClass("redalertnew");
            $('#mobilegreenclass').css("display", "none");
            $('#mobileredclass').css("display", "block");
            if ($('#otpfield').val() == '' && new_pass.toString().length > 8) {
                $('#otpfield').addClass('highlighterror');
                $('#pwd2').removeClass('highlighterror');
                $('#otpfield').focus();
                $('#messages, #mobileredmsg').html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter the OTP.");
            } else if (new_pass.toString().length < 8 && $('#otpfield').val() != '') {
                $('#otpfield').removeClass('highlighterror');
                $('#pwd2').addClass('highlighterror');
                $('#pwd2').focus();
                $('#messages, #mobileredmsg').html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter 8 digit password.");
            } else {
                $('#otpfield, #pwd2').addClass('highlighterror');
                if ($("#verificationfield").val() != '') {
                    $('#pwd2').focus();
                    $('#messages, #mobileredmsg').html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter 8 digit password.");
                } else {
                    $('#otpfield').focus();
                    $('#messages, #mobileredmsg').html('<i class="fa fa-exclamation-triangle"></i> ' + "Please enter a valid input.");
                }

            }
            return false;
        }
    });

}

function checkdisable() {
    var firstTime = true;
    if (firstTime) {
        var autofillemail = $('.signinvalid').val();
        if (autofillemail != "") {
            if ($('.signinvalid').val() != "" && $('.defdisablesignin').prop('disabled') && firstTime) {

                firstTime = false;
                $('.defdisablesignin').prop('disabled', false);
            }
        }
    }
}
function formSubmit(myfield, flag) {
    if (typeof flag === 'undefined') {
        flag = true;
    }
    var actionUrl;
    var searchKeyword = $('#' + myfield).val();
    if (searchKeyword == '') {
        $('#' + myfield).focus();
        return false;
//        if (!flag) {
//            $(".ajax_loader_gif_enroll").show();
//            actionUrl = '/all-courses';
//            //                console.log(actionUrl);
//          //  window.location.href = actionUrl + "?utm_source=Blog&utm_medium=Blog Header Search Box&utm_campaign=" + searchKeyword;
//            //                 return true;
//        } else {
//            //                 return false;
//            actionUrl = '/all-courses' + "?utm_source=Blog&utm_medium=Blog Header Search Box&utm_campaign=" + searchKeyword;
//        }


    } else {
        //  alert("fdf");
        actionUrl = '/search/' + cleankeyword(searchKeyword) + "?utm_source=Blog&utm_medium=Blog Header Search Box&utm_campaign=" + searchKeyword;
        window.location.href = actionUrl;
        return false;
    }
    $(".ajax_loader_gif_enroll").show();
    window.location.href = actionUrl;
}
function cleankeyword(str) {
    //return str.replace('&amp;', '').replace(/%\D/g, '%25').replace(/[^a-zA-Z0-9@$!&%()-\/_| '-]/g, '').toLowerCase().replace(/[\/_| ]+/g, '+');
    str = str.replace(/\\/g, '').replace(/\//g, '');
    r = encodeURIComponent(str);
    r = r.replace(/\%20/g, '+').replace(/\%/g, '%25');
    return r;
}
function isEmail(email) {

    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}
function submitenter(myfield, e) {
    var searchKeyword = $('#' + myfield).val();
//    console.log(searchKeyword);
    if ((e.which == 13) && (searchKeyword != '')) {
//        alert("1");
        var type = '';
        var actionUrl = webURL + 'search/' + cleankeyword(searchKeyword);
        if (typeof window._fbq == 'object') {
            window._fbq.push(["track", "Search", {}]);
        }
        return false;
    }
}
$(function () {
//    
    $('#cb_searchbox').off("DOMSubtreeModified");
    $('#cb_searchbox').on("DOMSubtreeModified", function () {
        $('.typeahead-list li a').not('.updated').each(function () {
            var hrefdata = $(this).addClass('updated').attr('href');
            hrefdata += "?utm_source=Blog&utm_medium=Blog Header Search Box&utm_campaign=" + $('input.search_inp:visible').val();
            $(this).attr('href', hrefdata);


        })
    });
});
