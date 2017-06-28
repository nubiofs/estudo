var updateRequest = false;
var lastRequest = '';
var playVideo = false;
function isScrolledIntoView(elem, parent)
{
    var docViewTop = $(parent).offset().top;
    var docViewBottom = docViewTop + $(parent).height();
    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height() + 30;
    return !(elemTop > docViewBottom || elemBottom > docViewBottom);
}


function isEmail(email) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(email);
}

(function ($) {
    var $container = $('.masonry-container');
    $container.imagesLoaded(function () {
        $container.masonry({
            columnWidth: '.item',
            itemSelector: '.item'
        });
    });
    //Reinitialize masonry inside each panel after the relative tab link is clicked - 
    $('a[data-toggle=tab]').each(function () {
        var $this = $(this);
        $this.on('shown.bs.tab', function () {
            $container.masonry({
                columnWidth: '.item',
                itemSelector: '.item'
            });
            $container.imagesLoaded(function () {//                load images later ;

            });
        }); //end shown
    }); //end each
    $(window).load(function () {

        $(".dropdown-menu-scrollbar, .bfh-selectbox ul").mCustomScrollbar({
            theme: "minimal-dark",
            mouseWheel: {preventDefault: true}, callbacks: {
                onInit: function () {
                    if (typeof $('.side-menu-blog .dropdown-menu-scrollbar') != 'undefined' && $('.side-menu-blog .dropdown-menu-scrollbar').length > 0) {

                        var elem = 'a.active-link';
                        var parentelem = '.side-menu-blog .dropdown-menu-scrollbar';
                        if (!isScrolledIntoView(elem, parentelem)) {
                            var toppos = $(elem).offset().top - $(parentelem).offset().top;
                            $(parentelem).mCustomScrollbar("scrollTo", toppos);
                        }
                    }
                    if (typeof $('.video-playlist-box .dropdown-menu-scrollbar') != 'undefined' && $('.video-playlist-box .dropdown-menu-scrollbar').length > 0) {

                        var elem = 'li.active';
                        var parentelem = '.video-playlist-box .dropdown-menu-scrollbar';
                        if ($('li.active').not(':first-child').length > 0) {
                            var toppos = $(elem).offset().top - $(parentelem).offset().top;
                            $(parentelem).mCustomScrollbar("scrollTo", toppos);
                        }

                    }
                }
            }
        });

    });

})(jQuery);
var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July',
    'August', 'September', 'October', 'November', 'December'];
var tomorrow = new Date();
tomorrow.setTime(tomorrow.getTime() + (1000 * 3600 * 24));
//document.getElementById("spanDate").innerHTML = months[tomorrow.getMonth()] + " " + tomorrow.getDate()+ ", " + tomorrow.getFullYear();
function initLazyImages() {
    var imgDefer = document.getElementsByTagName('img');
    for (var i = 0; i < imgDefer.length; i++) {
        if (imgDefer[i].getAttribute('data-src')) {
            imgDefer[i].setAttribute('src', imgDefer[i].getAttribute('data-src'));
        }
    }
}
function breadcrumUpdate(post_type) {
    if (post_type == 'all') {
        $('.post-type-breadcrum,.chevron-level-1').addClass('hide');
        $(".filterblog,.filtervideo,.filterinterview").hide();
    } else if (post_type == 'blogs' || post_type == '' || post_type == 'post') {
        $('.post-type-breadcrum').data('post-type', 'post').html('Blogs').attr('href', '/blog');
        $('.post-type-breadcrum,.chevron-level-1').removeClass('hide');
        $(".filterblog").show();
        $(".filtervideo").hide();
        $(".filterinterview").hide();
    } else if (post_type == 'webinars') {
        $('.post-type-breadcrum').data('post-type', 'webinars').html('Videos').attr('href', '/blog/videos');
        $(".post-type-breadcrum,.chevron-level-1").removeClass('hide');
        $(".filterblog").hide();
        $(".filtervideo").show();
        $(".filterinterview").hide();
    } else if (post_type == 'interview-questions') {
        $('.post-type-breadcrum').data('post-type', 'interview-questions').html('Interview Questions').attr('href', '/blog/interview-questions');
        $(".post-type-breadcrum,.chevron-level-1").removeClass('hide');
        $(".filterblog").hide();
        $(".filtervideo").hide();
        $(".filterinterview").show();
    }
}
window.onload = initLazyImages;

var currentActive = 1;
if (typeof NProgress == 'object') {
//show hide top right bar spinner
    NProgress.configure({showSpinner: false});
    NProgress.start();
}

function positionFooter() {
    var mFoo = $("#footer_v2");
    if ((($(document.body).height() + mFoo.outerHeight()) < $(window).height() && mFoo.css("position") == "fixed") || ($(document.body).height() < $(window).height() && mFoo.css("position") != "fixed")) {
        mFoo.css({position: "fixed", bottom: "0px"});
    } else {
        mFoo.css({position: "static"});
    }
}
function ajaxPushState(dataVars, methodRequest, requestFlag) {
    var trending = false;
    if (typeof dataVars.trending != 'undefined' && dataVars.trending == 'gettrending')
        trending = true;

    if (typeof dataVars !== 'object') {
        var catSlug = $('input#categoryinputbox').val();
        var searchVar = $('input.searchinputbox[name=s]').val();

        var authorVar = $('input#authorinputbox').val();
        var authorVarName = authorVar != '' ? $('#author-name-placeholder').text() : '';

        var tagsVar = $('.tagfilterblog#main-tag-filter-wrapper').is(':visible') ?
                $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug') : '';
        var tagsVarName = $('.tagfilterblog#main-tag-filter-wrapper').is(':visible') ?
                $('#tag-name-placeholder').text() : '';
        var posttype = $('.blog-post-type-tabs').is(':visible') ? $('.blog-post-type-tabs li.active a').data('post_type') : 'all';

        var dataVars = {
            action: 'filter_posts', // function to execute
            afp_nonce: afp_vars.afp_nonce, // wp_nonce
            posttype: posttype, // selected tag
            searchVar: searchVar,
            category: catSlug,
            tagfilter: tagsVar,
            tagfiltername: tagsVarName,
            authorfilter: authorVar,
            authorfiltername: authorVarName,
            pageno: $('.blog-' + posttype + '-paginator .page-item.page-class.active:visible a').data('page'),
            orderby: {
                blogorder: $('.posts-order.orderby-selected').data('orderby'),
                videoorder: $('.videos-order.orderby-selected').data('orderby'),
                intervieworder: $('.interview-order.orderby-selected').data('orderby')
            }
        };

    }

    var pageurl = '/blog';
//    console.log(pageurl);
    if (trending)
        pageurl += '/trending';
    if (typeof dataVars.posttype != 'undefined' && (dataVars.posttype == 'webinars')) {
        pageurl += '/videos';
    } else if (typeof dataVars.posttype != 'undefined' && (dataVars.posttype != 'post' && dataVars.posttype != 'blogs' && dataVars.posttype != '')) {
        pageurl += '/' + dataVars.posttype;
    }
    if (typeof dataVars.category != 'undefined' && dataVars.category != '') {
        pageurl += '/category/' + dataVars.category;
    } else if (typeof dataVars.tagfilter != 'undefined' && dataVars.tagfilter != '') {
        if (methodRequest !== 'changeTab' || dataVars.posttype == 'blogs') {
            pageurl = '/blog';
            pageurl += '/tag/' + dataVars.tagfilter;
        }
    } else if (typeof dataVars.authorfilter != 'undefined' && dataVars.authorfilter != '') {
        pageurl += '/author/' + dataVars.authorfilter;
    }
    if (typeof dataVars.pageno != 'undefined' && dataVars.pageno > 1) {
        pageurl += '/page/' + dataVars.pageno;
    }
    if (typeof dataVars.searchVar != 'undefined' && dataVars.searchVar != '') {
        pageurl += '?s=' + dataVars.searchVar;
    }
//    console.log(pageurl);
    if (pageurl != window.location.href) {
        updateRequest = requestFlag;
        lastRequest = methodRequest;
        window.history.pushState({
            'method': methodRequest,
            'dataVariables': dataVars,
            'updateRequest': requestFlag}, '', pageurl);
    }

}
function initPopState(fnVars) {
    if (fnVars == null || typeof fnVars == 'undefined') {
        window.location.reload();
        return false;
    }
    if (typeof fnVars.dataVariables !== 'undefined') {
        var dataVars = fnVars.dataVariables;
        var posttype = dataVars.posttype;
        var categoryfilter = dataVars.category;
        var authorfilter = dataVars.authorfilter;
        var tagfilter = dataVars.tagfilter;
        var searchVar = dataVars.searchVar;
        var pageno = dataVars.pageno;
//console.log(pageno);
        breadcrumUpdate(posttype);

        if (categoryfilter != '') {
            $('input#categoryinputbox').val(categoryfilter);
            var catName = $('.dropdown.categories-filter-dropdown:visible li [data-slug="' + categoryfilter + '"]').text();
            var updateElem = $('.dropdown.categories-filter-dropdown .btn:first-child');
            updateElem.data('slug', categoryfilter);
            updateElem.html('<i class="fa fa-bars"></i> ' + catName + '');
            $('.cat-level-breadcrum').removeClass('hide');
            $('.cat-level-breadcrum-title').text(catName);
            $('.dropdown.categories-filter-dropdown ul li:first-child').show();
            $('.dropdown.categories-filter-dropdown ul li:nth-child(2)').show();

        } else {
            $('.cat-level-breadcrum').addClass('hide');
            $('.cat-level-breadcrum-title').text('');
            var updateElem = $('.dropdown.categories-filter-dropdown .btn:first-child');
            updateElem.data('slug', '');
            updateElem.html('<i class="fa fa-bars"></i> Select Category');

            $('.dropdown.categories-filter-dropdown ul li:first-child').hide();
            $('.dropdown.categories-filter-dropdown ul li:nth-child(2)').hide();
        }
        if (searchVar != '') {
            $('input.searchinputbox[name=s]').val(searchVar);
            $('#main-search-filter-wrapper').removeClass('hide');
            $('#search-tag-name').text(searchVar);
        } else {
            $('input.searchinputbox[name=s]').val('');
            $('#main-search-filter-wrapper').addClass('hide');
            $('#search-tag-name').text('');
        }
        if (authorfilter != '') {
            var authorName = dataVars.authorfiltername;
            $('input#authorinputbox').val(authorfilter);
            $('#main-author-filter-wrapper').removeClass('hide');
            $('#author-name-placeholder').text(authorName);
        } else {
            $('input#authorinputbox').val('');
            $('#main-author-filter-wrapper').addClass('hide');
            $('#author-name-placeholder').text('');
        }
        if (tagfilter != '') {
            var tagName = dataVars.tagfiltername;
            $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug', tagfilter);
            $('#main-tag-filter-wrapper').removeClass('hide');
            $('#tag-name-placeholder').text(tagName);
        } else {
            $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug', tagfilter);
            $('#main-tag-filter-wrapper').addClass('hide');
            $('#tag-name-placeholder').text('');
        }
        switch (fnVars.method) {
            case "sendAjaxRequest":
                sendAjaxRequest(pageno, posttype, false, false);
                break;
            case "searchAjaxRequest":
                searchAjaxRequest(true, false);
                break;
            case "changeTab":
                if (updateRequest) {
                    if (lastRequest == 'sendAjaxRequest') {
                        sendAjaxRequest(pageno, posttype, false, false);
                    } else if (lastRequest == 'searchAjaxRequest') {
                        searchAjaxRequest();
                    }
                } else {
                    $('.navhead.navheadmob .content-tab[data-post_type="' + posttype + '"]').tab('show');
                }

                break;
        }
    }
    updateRequest = fnVars.updateRequest;
}
$(document).ready(function () {

    $('.blogmaincontainer').off('click', '.related-blog .pager a');
    $('.blogmaincontainer').on('click', '.related-blog .pager a', function (e) {
        e.preventDefault();
        var selectedIndex = $('.side-menu-blog a.active-link').closest('li');
        var hrefLocation = '';
        if ($(this).hasClass('show-next-in-series')) {
            if (selectedIndex.hasClass('first-level')) {
                var targetWrapper = $('.side-menu-blog a.active-link').next('div.panel-collapse').find('li:first-child a');
                if (targetWrapper.length == 0)
                    targetWrapper = selectedIndex.next('li.first-level').children('a:first-child');
                hrefLocation = targetWrapper.attr('href');
            } else if (selectedIndex.is(':last-child')) {
                hrefLocation = selectedIndex.closest('li.first-level').next('li.first-level').children('a:first-child').attr('href');
            } else {
                hrefLocation = selectedIndex.next().children(':first-child').attr('href');
            }
        } else if ($(this).hasClass('show-prev-in-series')) {
            if (selectedIndex.hasClass('first-level')) {
                var targetWrapper = selectedIndex.prev('li.first-level').children('div.panel-collapse li:last-child a');
                if (targetWrapper.length == 0)
                    targetWrapper = selectedIndex.prev('li.first-level').children('a:first-child');
                hrefLocation = targetWrapper.attr('href');
            } else if (selectedIndex.is(':first-child')) {
                hrefLocation = selectedIndex.closest('div.panel-collapse').prev('a').attr('href');
            } else {
                hrefLocation = selectedIndex.prev('li').children('a:first-child').attr('href');
            }
        }
        if (typeof hrefLocation != 'undefined' && hrefLocation.length > 0)
            location.href = hrefLocation;
        return false;
    });
    $('.blogdescription').on('click', ".AddtoBookmark a", function (e) {
        e.preventDefault(); // this will prevent the anchor tag from going the user off to the link
        var bookmarkUrl = $(this).data('url');
        var bookmarkTitle = $(this).data('title');


        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            alert("This function is not available in Google Chrome. Click the star symbol at the end of the address-bar or hit Ctrl-D (Command+D for Macs) to create a bookmark.");
        } else if (window.sidebar && window.sidebar.addPanel) {
            // Firefox <=22
            window.sidebar.addPanel(bookmarkTitle, bookmarkURL, '');
        } else if ((window.sidebar && /Firefox/i.test(navigator.userAgent)) || (window.opera && window.print)) {
            // Firefox 23+ and Opera <=14
            $(this).attr({
                href: bookmarkUrl,
                title: bookmarkTitle,
                rel: 'sidebar'
            }).off(e);
            return true;
        } else if (window.external && ('AddFavorite' in window.external)) {
            // IE Favorites
            window.external.AddFavorite(bookmarkUrl, bookmarkTitle);
        } else { // for other browsers which does not support
            alert('Your browser does not support this bookmark action');
            return false;
        }
    });
    $('.mainsecblog').on('click', 'a.read-more', function () {
        $(this).closest('.custom-excerpts').next().removeClass('hide');
        $(this).closest('.custom-excerpts').hide().remove();
    });


    window.addEventListener("popstate", function (e) {
        // URL location
        var location = document.location;
        // state
        var state = e.state;

        if (state === null && (location.href).indexOf('#') !== false) {
//            alert('sadsadsa');
        } else {
//            console.log('test');
            initPopState(state);
        }

    });
    $(document).ajaxStart(function () {
        NProgress.done();
        NProgress.start();
    });
    $(document).ajaxError(function () {
        NProgress.done();
    });
    $(document).ajaxStop(function () {
        NProgress.done();
    });
    NProgress.done();

    positionFooter();

    $("#blogview-all").on('click', function () {
        $(".timesblog").toggle();
        $(".view-all-toggle").toggleClass('editprefrence');
        if ($.trim($(this).text()) === 'Edit Preferences') {
            $(this).text('Done');
        } else {
            $(this).text('Edit Preferences');
        }
    });

    $('.bookblog i').on('click', function () {
        if ($(this).hasClass('fa-bookmark-o')) {
            $(this).addClass('fa-bookmark').removeClass('fa-bookmark-o');
        } else {
            $(this).addClass('fa-bookmark-o').removeClass('fa-bookmark');
        }
    });

    $(".blogmobfull,.blog-sidepanel").on('hover', ".fa-bookmark-o", function () {
        $(this).addClass("fabookmark");
    }, function () {
        $(this).removeClass("fabookmark");
    });
    $(".blogmobfull,.blog-sidepanel").on('hover', '.fa-thumbs-o-up', function () {
        $(this).addClass("fathumbs");
    }, function () {
        $(this).removeClass("fathumbs");
    });
    $('.blogmobfull,.blog-sidepanel').on('click', '.page-class', function () {
        if (!$(this).hasClass('pager-next') && !$(this).hasClass('pager-prev')) {
            $('.page-class').removeClass('active');
            $(this).addClass('active');
            currentActive = parseInt($(this).children().html());
        }
    });
    $('.blogmobfull,.blog-sidepanel').on('click', '.pager-next', function () {
        currentActive = $('.active.page-item.page-class').text();
        currentActive += 1;
        $('.page-class-' + currentActive).trigger('click');
    });
    $('.blogmobfull,.blog-sidepanel').on('click', '.pager-prev', function () {
        currentActive = $('.active.page-item.page-class').text();
        currentActive -= 1;
        $('.page-class-' + currentActive).trigger('click');
    });
    $('#toggle-trending-view').on('click', function () {
        if ($('#toggle-trending-view > a').html() == 'View all') {
            $('#toggle-trending-view > a').html('View less');
            $('.trending-show').addClass('show-all');
        } else {
            $('#toggle-trending-view > a').html('View all');
            $('.trending-show').removeClass('show-all');
        }
    });
    $('.followbtn').on('click', function () {
        if ($('.followbtn').html() == 'Follow') {
            $('.followbtn').html('Following');
            $(this).addClass('followingbtn');
        } else {
            $('.followbtn').html('Follow');
            $(this).removeClass('followingbtn');
        }

    });
    $('#toggle-tags-view').on('click', function () {
        if ($('#toggle-tags-view > a').html() == 'View all') {
            $('#toggle-tags-view > a').html('View less');
            $('ul.my-followed-tag-wrapper li').removeClass('view-all-toggle');
        } else {
            $('#toggle-tags-view > a').html('View all');
            $('ul.my-followed-tag-wrapper li').addClass('view-all-toggle');
        }
    });
    $('#featposts').on('click', function () {
        if ($('#featposts > a').html() == 'View all') {
            $('#featposts > a').html('View less');
            $('.featblog .featshow').addClass('show-all');
        } else {
            $('#featposts > a').html('View all');
            $('.featblog .featshow').removeClass('show-all');
        }
    });
    var activeTab = null;
    $('.blog-post-type-tabs a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //show selected tab / active
        var clickedelem = $(e.target);
        var posttype = clickedelem.data('post_type');

        breadcrumUpdate(posttype);
        ajaxPushState(false, 'changeTab', false);
    });

    $(window).scroll(positionFooter);
    $(window).resize(positionFooter);
    $(window).load(positionFooter);

    $(".dropTrigger").on('click', function (e) {

        $(this).fadeOut();
        $(".dropQuery").animate({
            bottom: "0"
        }, 100);
    });
    $(".closeQuery").on('click', function (e) {
        $(".dropQuery").animate({
            bottom: "-350"
        }, 100);
        $(".dropTrigger").fadeIn();
    });
    $(".call-us").on('click', function (e) {
        $(".call-us-xs").animate({
            bottom: "0"
        }, 100);
    });
    $(".close-call").on('click', function (e) {
        $(".call-us-xs").animate({
            bottom: "-150"
        }, 100);
    });
    $(".video-login-wrapper").on('click', function (e) {
        playVideo = true;
    });
    $(".signin").on('click', function (e) {
        playVideo = false;
    });

    /* Subscribe validation by vaibhav*/
    $(".Subscribeinput [name=subscription-mail]").on('keyup', function (event) {
        var keycode = (event.keyCode ? event.keyCode : event.which);
//        console.log(keycode);
        if (keycode !== 13) {
            $('.errormessage').hide();
        }
    })
    $('#subscribe-form').on('submit', function (e) {


        e.preventDefault();
        $(".errormessage,.alreadysubscribed,.successmessage").hide();

        var email = $(".Subscribeinput [name=subscription-mail]").val();
        var error = 0;
        if (email == '') {
            $('.errormessage').text('Please enter email ID');
            $('.errormessage').show();
            $(".Subscribeinput [name=subscription-mail]").focus();
            error = 1;
            return false;
        }

        if (!isEmail(email)) {
            $('.errormessage').text('Please enter valid email Id');
            $('.errormessage').show();
            $(".Subscribeinput [name=subscription-mail]").focus();
            error = 1;
            return false;
        }
        if (error == 0) {
            $("#subscribe-button").attr("disabled", true);
            $("#loader").show();

            var email = $(".Subscribeinput [name=subscription-mail]").val();
            $(".Subscribeinput [name=subscription-mail]").val("");

            var mydata = {"email": email};
            $.ajax({
                type: "POST",
                url: "/users/no_password_blog_registration?utm_source=blog&utm_campaign=blog_subscriber&utm_medium=blog_subscriber",
                data: mydata,
                dataType: "json",
                error: function (e) {
                    $("#loader").hide();
                    $(".errormessage").show();
                    $("#subscribe-button").attr("disabled", false);
                },
                success: function (response) {
                    //console.log(response.statuscode);
                    if (response.statuscode == "1" && response.status == "lead")
                    {
                        $(".successmessage").show();
                        $(".show-after-success").removeClass('hide');

                        $("#loader").hide();
                        $("#loader,#subscribe-button").hide();
                        $(".show-after-success").show();
                        $(".subscribesec-box").slideUp(function () {
                            $(".subscribesec-success").slideDown();
                        });
                        var hideform = false;
                        if ($("#is_user_loggedin").val() == 1) {
                            $("#loader").hide();
                            hideform = true;
                        }
                        setTimeout(function () {
                            $("#subscribe-form").hide(function () {
                                $("#subscribe-form").remove();
                            });
                        }, 5000);
                        do_subscribe_process(email);
                    } else if (response.statuscode == "1" && response.status == null)
                    {
                        $("#loader,#subscribe-button").hide();
                        $(".alreadysubscribed").show();
                        $(".show-after-success").removeClass('hide');
                        $(".subscribesec-box").slideUp(function () {
                            $(".subscribesec-success").slideDown();
                        });
                        var hideform = false;
                        if ($("#is_user_loggedin").val() == 1) {
                            $("#loader").hide();
                            hideform = true;
                        }
                        setTimeout(function () {
                            $("#subscribe-form").hide(function () {
                                $("#subscribe-form").remove();
                            });
                        }, 5000);
                        do_subscribe_process(email);
                    } else {
                        $("#loader").hide();
                        $(".errormessage").show();
                        $(".subscribe-process").show();
                        $("#subscribe-button").attr("disabled", false);
                    }

                }

            });

        }
        return false;
    });

    /* Subscribe validation by vaibhav */
    $('.nav-stacked').affix({
        offset: {top: 20, bottom: ($('footer').outerHeight(true)) + 62
        }});
    var $body = $(document.body);
    var navHeight = $('.navbar').outerHeight(true) + 10;
    $body.scrollspy({
        target: '#blog-sidepanel', offset: navHeight
    });
    $('.relatedblogssec').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            if (target.length) {
                $('html,body').animate({
                    scrollTop: target.offset().top - 50}, 1000);
                return false;
            }
        }
    });

    $('.navbar-toggle').on('click', function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');

    });
    $('span[data-toggle="collapse"]').on('click', function () {
        var clickTarget = $(this);
        var dataTarget = $(this).attr('data-target');
        $(this).toggleClass('active');
        $(this).closest('li').toggleClass('active');

        $('.side-menu ul li.first-level').not(clickTarget.closest('li')).removeClass("active");
        $('span[data-toggle="collapse"]').not(clickTarget).removeClass("active");
        $('.collapse').not('#' + dataTarget).collapse("hide");

    });

    $(window).scroll(function () {
        var hT = $('#footer_v2').offset().top - 400,
                hH = $('#footer_v2').outerHeight(),
                wH = $(window).height(),
                wS = $(this).scrollTop();
//    console.log((hT-wH) , wS);
        if (wS > (hT + hH - wH)) {
            $('.left-menu-row').addClass("floatside-nav");
        } else {
            $('.left-menu-row').removeClass("floatside-nav");
        }
    });
    $('.navbar-tog-open-close').on('click', function (e) {
        $('.left-menu').toggleClass("left-menu-collopenpressed"); //you can list several class names 
        e.preventDefault();
    });
    $('.sub-news-letter').on('click', function (e) {
        if (!$('.subscribesec').is(':visible')) {
            $('.subscribesec-box').show();
            $('.subscribesec-success').hide();
            $(".successmessage,.alreadysubscribed,.errormessage").hide();

        }
        // $('.subscribesec').slideToggle("slow");
    });

    $('.search_inp_mob[name="s"]').on('keyup', function () {
        $('input.searchinputbox[name=s]').val($(this).val());
    });
    $('.search_inp_mob[name="s"]').on('keyup', '.search_ico', function () {
        $('input.searchinputbox[name=s]').val($(this).val());
    });
    $('.edureka-blog-header').on('click', '.search-button-top', function (e) {
        e.preventDefault();
        $('.main-search').submit();
        return false;

    });

    $(".mob-list-show").on("click", function (e) {
        $('.video-playlist-box').toggleClass("expanded");
        $('.playlist-box-list').slideToggle();
    });
    $('#tabowl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1.8,
                loop: false,
                nav: false
            },
            360: {
                items: 2.1,
                loop: false,
                nav: false
            },
            600: {
                items: 3.8,
                loop: false,
                nav: false
            },
            1000: {
                items: 5.5,
                nav: false,
                loop: false,
                margin: 20
            }
        }

    });
    
    $('.owl-carousel').owlCarousel({
        margin: 10,
        loop: false,
        rewindNav: false,
        touchDrag: false,
        pullDrag: false,
        freeDrag: false,
        responsiveClass: true,
        responsive: {
            0: {
                items: 1,
                nav: true,
                navText: [
                    "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                    "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                ]
            },
            360: {
                items: 2,
                nav: true,
                navText: [
                    "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                    "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                ]
            },
            600: {
                items: 3,
                nav: true,
                navText: [
                    "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                    "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                ]
            },
            1000: {
                items: 5,
                nav: false
            }
        }
    });
})