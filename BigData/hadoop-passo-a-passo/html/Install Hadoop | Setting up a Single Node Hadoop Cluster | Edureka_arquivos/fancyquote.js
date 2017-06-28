/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function debounce(fn, duration) {
    var timer;
    return function (e) {
        clearTimeout(timer);
        timer = setTimeout(fn, duration);
    }
}
function initiateFbQuoteShare(elementText, url, hasTags) {
    FB.ui({
        method: 'share',
        href: (typeof url != 'undefined' ? url : 'https:/www.edureka.co/blog'),
        hashtag: (typeof hasTags !== 'undefined' ? hasTags : 'edureka'),
        quote: elementText,
        mobile_iframe: true
    }, function (response) {});
}
function validateEmailPost(formElement, currElem) {
    var textElem = formElement.find('input[name=name]');
    var textName = textElem.val();
    var emailElem = formElement.find('input[name=emails]');
    var emailVal = emailElem.val();
    var textNameString = textName.trim();
    if (typeof currElem == 'undefined' || (currElem.length > 0 && currElem.attr('name') == textElem.attr('name'))) {
        if (textNameString.length > 0 && /^[A-Za-z ]+$/.test(textNameString)) {
            textElem.parent().removeClass('error');
            textElem.next().hide( );
        } else {
            if (!(typeof currElem != 'undefined' && textNameString == '') && !(/^[A-Za-z ]+$/.test(textNameString))) {
                textElem.parent().addClass('error');
                textElem.next().show();
            }
        }
    }
    var inputString = emailVal.trim();
    if (typeof currElem == 'undefined' || (currElem.length > 0 && currElem.attr('name') == emailElem.attr('name'))) {
        if (inputString.length > 0) {

            var splitInput = inputString.split(',');
            var pattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;
            var match = true;
            for (i = 0; i < splitInput.length; i++) {
                if (!splitInput[i].match(pattern)) {
                    match = false;
                }
            }
            if (match == false) {
                emailElem.parent().addClass('error');
                emailElem.next().show();
            } else {
                emailElem.parent().removeClass('error');
                emailElem.next().hide();
            }
        } else {
            if (!(typeof currElem != 'undefined' && inputString.length == 0) && inputString.length == 0) {
                emailElem.parent().addClass('error');
                emailElem.next().show();
            }
        }
    }
    return match;
}
$(document).ready(function () {
    $('#emailpostpop').on('hidden.bs.modal', function () { // do something… 
        $('.Mailpost-thankyou').hide();
        $('.Mailpost').show();
        $('#emailpostpop').find('input.required[type="text"]').val('');
        $('#emailpostpop .input-name,#emailpostpop .input-email').removeClass('error');
        $('#emailpostpop .error-name,#emailpostpop .error-email').hide();
    });
    $('.email-me-the-post').off('keyup', 'input');
    $('.email-me-the-post').on('keyup', 'input', function () {
        validateEmailPost($(this).closest('form'), $(this));
    });
    $('.email-me-the-post input.input-name').on('keyup', debounce(function (e) {
        var nameElemt = $('.email-me-the-post input.input-name');
        validateEmailPost(nameElemt.closest('form'), nameElemt);
        return false;
    }, 800));
    $('.email-me-the-post input.input-name').on('keyup', debounce(function (e) {
        var emailElemt = $('.email-me-the-post input.input-email');
        validateEmailPost(emailElemt.closest('form'), emailElemt);
        return false;
    }, 800));
    $('.blogcontentsec').on('click', '.quoteshare-custom', function () {
        var elementClickedTarget = $(this).closest('.fancyshareicons');
        var shareUrl = elementClickedTarget.attr('data-url');
        var shareText = elementClickedTarget.attr('data-text');
        var shareHashTag = elementClickedTarget.attr('data-hashtags');
        if (shareUrl.length > 1 && shareText.length > 0) {
            if ($(this).hasClass('facebook')) {
                initiateFbQuoteShare(shareText, shareUrl, shareHashTag);
            } else if ($(this).hasClass('linkedin')) {
                shareContent(shareText, shareUrl);
            }
        }
        return false;
    });

    $('.email-me-the-post').on('submit', function (e) {
        e.preventDefault();
        var valid = validateEmailPost($(this));
        if (valid) {
            var email = $("#Email_i").val();
            var first_name = $("#first_name_i").val();
            var dataPost = {
                action: 'email_post', // function to execute
                afp_nonce: postasmail.afp_nonce, // wp_nonce
            };
            var unindexed_array = $(this).serializeArray();
            $.map(unindexed_array, function (n, i) {
                dataPost[n['name']] = n['value'];
            });

            $.ajax({
                type: "POST",
                url: postasmail.afp_ajax_url,
                data: dataPost,
                error: function (e) {
                    alert("error");
                    return false;
                },
                success: function (resonse) {

                    $('.Mailpost').hide();
                    $('.Mailpost-thankyou').show();
                    setTimeout(function () {
                        $('#emailpostpop').modal('hide')
                    }, 5000);
                }
            });
        }
    });

    if ($('.widget_edu-about-course,.widget_edu-course-feature').length > 0) {
        if ($('.widget_edu-related-blogs,.widget_edu-course-feature').find('.async-content').length >= 1) {
            var CourseGroup = $('.course-content-wrapper').first().attr('data-course-id');
            if (typeof CourseGroup != 'undefined') {

                $.ajax({
                    type: "POST",
                    url: '/wp/courses/courses_details/' + CourseGroup,
                    error: function (e) {
                        return false;
                    },
                    success: function (response) {

                        if (response.status == 200) {
                            var details = response.data.details;
                            var postslug = $('.maincontainer.detailpagesidebar').attr('data-post_name');
                            if (typeof details == 'object' && typeof details.image_path != 'undefined') {
                                $('.small-info.async-content').html(details.description_text);
                                var courseLink = details.course_url + '?utm_source=blog&utm_medium=courses&utm_campaign=' + postslug;
                                $('.clp-info-detail.async-content').html('<img src="' + details.image_path + '"><span class="blog-clp-title">' + details.display_title + '</span>' +
                                        '<div class="info-clp"> ' + details.description_text + '</div><div class="clp-target-view">' +
                                        '<a href="' + courseLink + '"><button>VIEW DETAILS</button></a>' +
                                        '<small>Click to see more details</small></div>');

                                $('.widget_edu-course-feature a.view-detail-course.async-content').attr('href', courseLink);
                                $('.widget_edu-about-course').show();

                            }
                            var features = response.data.features;
                            if (typeof features == 'object') {
                                var featureBlock = '', featureList = '';
                                $(features).each(function (index, feature) {
                                    if (index < 4) {
                                        featureBlock += '<div class="col-lg-6 col-md-6 col-xs-6 col-sm-6 Features "><div class="Features' + (index + 1) + '" >' +
                                                '<div class="title">' + feature.section_title + '</div>' +
                                                '<div class="flot-panel-ico"><i class="fa  ' + feature.icon + '"  aria-hidden="true"></i></div>' +
                                                '</div></div>';
                                    } else {
                                        featureList += '<li><span class="flot-panel-ico"><i class="fa  ' + feature.icon + '"  aria-hidden="true"></i></span>'
                                                + ' <span class="title">' + feature.section_title + '</span></li>';
                                    }
                                });
                                if (featureList != '')
                                    $('.widget_edu-course-feature .feature-list.async-content ul').html(featureList);
                                if (featureBlock != '') {
                                    $('.widget_edu-course-feature .feature-block.async-content').html(featureBlock);
                                    $('.widget_edu-course-feature').show();
                                }


                            }
                        }

                    }
                });
            }
        }
    }

});