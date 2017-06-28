/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// add utm paramters on blog tiles for internal searc or header search

var slug = function (str) {
    var $slug = '';
    var trimmed = $.trim(str);
    $slug = trimmed.replace(/[^a-z0-9-]/gi, '-').
            replace(/-+/g, '-').
            replace(/^-|-$/g, '');
    return $slug.toLowerCase();
}
var activeTab = null;
function populateResponce(posttype, jsonResponce) {

    if (jsonResponce.trending)
    {
        $("#blogmobfull-populate").html(jsonResponce.response);
        $("#blogmobfull-populate").append(jsonResponce.paginator);
        $("html, body").animate({scrollTop: 0}, 1000);
    } else {
        var container = $('#blog-' + posttype + '-block-wrapper .masonry-container');
        container.find("p.no-relative-post").remove();
        $.each(container.children('.item.blogcards'), function () {
            container.masonry().masonry('remove', this)
                    .masonry('layout')
        });
        var htmlAppended = jsonResponce.response;
        var paginatorBlock = jsonResponce.paginator;
        $(htmlAppended).each(function (index, value) {
            var elemData = $(value);
            container.append(elemData).masonry().masonry('appended', elemData);
        })

        $('#blog-' + posttype + '-block-wrapper .blog-' + posttype + '-paginator').remove();
        $('#blog-' + posttype + '-block-wrapper').append(paginatorBlock);
        if ($(document).scrollTop() > $(".main-post-wrapper").offset().top)
            $("html,body").animate({
                scrollTop: $(".left-panel-wrapper").offset().top
            }, 1000);
    }
//    var $container = ;
    $('.masonry-container:visible').masonry({
        columnWidth: '.item',
        itemSelector: '.item'
    });
    initLazyImages();
}

function do_ajax_logout() {
    var data = {
        action: 'filter_logout', // function to execute
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
    };
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: data,
//        async: false,
        type: 'POST',
        error: function () {
            $('#ajax-loader').hide();
        },
        success: function (response) {
            $('#ajax-loader').hide();
            window.location = "";
        }
    });
}


function sendAjaxRequest(pageNo, postType, trending, updatePushState) {
    updatePushState = typeof updatePushState == 'undefined' ? true : updatePushState;
    var catSlug = $('input#categoryinputbox').val();
    var searchVar = $('input.searchinputbox[name=s]').val();
    var authorVar = $('input#authorinputbox').val();
    var tagsVar = $('.tagfilterblog#main-tag-filter-wrapper').is(':visible') ?
            $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug') : '';
    var dataPost = {
        action: 'filter_posts', // function to execute
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
        posttype: postType, // selected tag
        searchVar: searchVar,
        category: catSlug,
        tagfilter: tagsVar,
        authorfilter: authorVar,
        pageno: pageNo,
        orderby: {
            blogorder: $('.posts-order.orderby-selected').data('orderby'),
            videoorder: $('.videos-order.orderby-selected').data('orderby'),
            intervieworder: $('.interview-order.orderby-selected').data('orderby')
        }
    };
    if (typeof trending != 'undefined' && trending) {
        dataPost.trending = 'gettrending';
    }
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: dataPost,
        type: 'POST',
        success: function (response) {
            var jsonResponce = $.parseJSON(response);
            if (typeof jsonResponce == 'object') {
                populateResponce(postType, jsonResponce);
                if (dataPost.searchVar != "") {
                    add_utm("internal");
                }
            }

        }
    });
    if (updatePushState)
        ajaxPushState(dataPost, 'sendAjaxRequest', true);
}
function do_subscribe_process(emailid) {


    var data = {
        action: 'subscribe_process', // function to execute
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
        email: emailid // wp_nonce
    };
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: data,
//        async: false,
        type: 'POST',
        success: function (response) {
            if (response.status == 200) {
                return true;
            }
        }
    });
//sendAjaxRequest(data, postType);
}
/**
 * main search and filter function 
 * @author himanshu
 * @returns {undefined}
 */
function searchAjaxRequest(async, updatePushState, changeTab) {
    updatePushState = typeof updatePushState == 'undefined' ? true : updatePushState;
    var pageno = 1;
    var catSlug = $('input#categoryinputbox').val();
    var searchVar = $('input.searchinputbox[name=s]').val();
    var authorVar = $('input#authorinputbox').val();
    var tagsVar = $('.tagfilterblog#main-tag-filter-wrapper').is(':visible') ?
            $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug') : '';
    if (typeof async == 'undefined')
        var async = true;
    var dataPost = {
        action: 'filter_posts', // function to execute
        searchpost: 'searchpost',
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
        category: catSlug, // selected tag
        searchVar: searchVar,
        tagfilter: tagsVar,
        authorfilter: authorVar,
        orderby: {
            blogorder: $('.posts-order.orderby-selected').data('orderby'),
            videoorder: $('.videos-order.orderby-selected').data('orderby'),
            intervieworder: $('.interview-order.orderby-selected').data('orderby')
        },
        pageno: pageno
    };
    if (searchVar.length > 0) {
        $('.autosearchload_top').show();
        $('.search-button-top').hide();
    }
    if (typeof changeTab != 'undefined') {
        $('.nav-tabs a[href="#homeall"]').tab('show');
    }
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: dataPost,
        type: 'POST',
        async: async,
        success: function (response) {
            var searchResponce = $.parseJSON(response);
            if (typeof searchResponce == 'object') {

                if (searchVar.length > 0) {
                    $('.autosearchload_top').hide();
                    $('.search-button-top').show();
                }

                $.each(searchResponce.searchData, function (postType, jsonResponce) {

                    populateResponce(postType, jsonResponce);
                });
                if ($('input.searchinputbox[name=s]') != "") {
                    add_utm("internal");
                }
            }
        }
    });
    if (updatePushState) {
        dataPost.posttype = $('.blog-post-type-tabs').is(':visible') ? $('.blog-post-type-tabs li.active a').data('post_type') : 'all';
        ajaxPushState(dataPost, 'searchAjaxRequest', true);
    }
}

function updateLastWatchQue() {
    var data = {
        action: 'update_recent_videos', // function to execute
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
        pageId: post_vars.postID,
        pageType: post_vars.post_type,
    };
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: data,
        type: 'POST',
        success: function (response) {
        }
    });
}

function add_utm(search_type) {

    $(".thumbnailblog").find(' a.custom-link-attr').each(function () {


        var search_term = (search_type == "header") ? "blog-header-search-box" : "blog-internal-search-box";
        var input_text = slug($('input.searchinputbox[name=s]').val());
        var new_url = $(this).attr('href');
        if (new_url.indexOf("?") === -1) {
            new_url = new_url + '?utm_source=blog&utm_medium=' + search_term + '&utm_campaign=' + input_text
        } else {
            new_url = new_url + '&utm_source=blog&utm_medium=' + search_term + '&utm_campaign = ' + input_text
        }
        if (!(input_text == '' || search_term == ''))
            $(this).attr('href', new_url);
    });
    return true;
}

function addutmParamsToElements() {
    var source = "blog";
    var medium = "button";
    var url = $(location).attr('href');
    var campaign = "";
    // add the utm paramters
    parts = url.split('/'),
            campaign = parts.pop() == '' ? parts[parts.length - 1] : parts.pop();
    $('.blogcontentsec').find('.maxbutton').each(function () {
        var url = $(this).attr('href');
        var text = $(this).find("span").text();
        var text_slug = slug(text);
        if (typeof url != 'undefined' && url.indexOf("utm_source") == -1)
            if (url.indexOf("?") === -1) {
                $(this).attr('href', url + '?utm_source=' + source + '&utm_medium=' + medium + '&utm_campaign=' + campaign + "-" + text_slug);
            } else {
                $(this).attr('href', url + '&utm_source=' + source + '&utm_medium=' + medium + '&utm_campaign=' + campaign + "-" + text_slug);
            }
    });
    var searchVar = $('input.searchinputbox[name=s]').val();
    var maxChar = 110;
    if (typeof searchVar != "undefined" && searchVar != "") {
        var trimmedText = (searchVar.length <= maxChar) ? searchVar : searchVar.substring(0, maxChar - 1) + "...";
        // var trimmedText = $.trim(searchVar).substring(0, maxChar).split(" ").slice(0, -1).join(" ") + "...";
        //trimmedText = (searchVar.length <= maxChar) ? searchVar : trimmedText;

        $('.tagfilterblog#main-search-filter-wrapper #search-tag-name').html(trimmedText);
    }
    var url = $(location).attr('href');
    var url_query = url.substring(0, url.indexOf('?'));
    var courses_href = $("#navbar a").attr("href");
    var new_href = courses_href + '?utm_source=blog&utm_medium=courses&utm_campaign=all-courses';
    $('.left-menu .side-menu-blog a').each(function () {
        var hrefUrl = $(this).attr('href');
        if (hrefUrl.indexOf("utm_source") == -1) {

            hrefUrl = hrefUrl + "?utm_source=blog&utm_medium=left-menu&utm_campaign=" + $(this).attr('data-currpage');
            $(this).attr('href', hrefUrl);
        }
    });
    if (url_query != "") {
        add_utm("header");
    }

// utm paramters for related post
    var utm_source = "";
    var utm_medium = "";
    var post_type = $(".blog-sidepanel .detailpagesidebar").attr('data-post_type');
    var parent_post = $(".blog-sidepanel .detailpagesidebar").attr('data-post_name');
    $("ul.related-blogs").find('article.custom-related-post a').each(function () {


        if (post_type == "post") {
            utm_source = "blog";
            utm_medium = "right-related-blogs";
        } else if (post_type == "webinars") {
            utm_source = "videos";
            utm_medium = "right-related-videos";
        } else if (post_type == "interview-questions") {
            utm_source = "interview-questions";
            utm_medium = "right-related-interview-questions";
        }

        var new_url = $(this).attr("href") + '?utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_campaign=' + parent_post;
        $(this).attr("href", new_url);
    });
    $(".widget_edu-related-blog-carousel").find('a.related-blog-link').each(function () {


        if (post_type == "post") {
            utm_source = "blog";
            utm_medium = "bottom-related-blog-blogs";
        } else if (post_type == "webinars") {
            utm_source = "videos";
            utm_medium = "bottom-related-blog-videos";
        } else if (post_type == "interview-questions") {
            utm_source = "interview-questions";
            utm_medium = "bottom-related-blog-interview-questions";
        }

        var new_url = $(this).attr("href") + '?utm_source=' + utm_source + '&utm_medium=' + utm_medium + '&utm_campaign=' + parent_post;
        $(this).attr("href", new_url);
    });
}
function do_ajax_countupdate() {
    if (typeof afp_vars == 'object' && afp_vars.single == 1) {

        var data = {
            action: 'update_views', // function to execute
            afp_nonce: afp_vars.afp_nonce, // wp_nonce
            post: afp_vars.postID, // wp_nonce
        };
        $.ajax({
            url: afp_vars.afp_ajax_url,
            data: data,
            type: 'POST',
            success: function (response) {
                if (typeof response == 'object' && typeof response.view_count != 'undefined') {
                    var viewCount = response.view_count;
                    $('.details-page-views-count').html(viewCount);
                }
            }
        });
    }
}
function initiateOwlCarouselWatchItAgain(selectorElement) {
    if (typeof selectorElement == 'object')
        selectorElement.owlCarousel({
            loop: true,
            margin: 10,
            responsiveClass: true,
            responsive: {
                0: {
                    items: 2,
                    loop: false,
                    nav: true,
                    navText: [
                        "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                        "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                    ]
                },
                600: {
                    items: 3,
                    loop: false,
                    nav: true,
                    navText: [
                        "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                        "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                    ],
                },
                1000: {
                    items: 5,
                    nav: true,
                    navText: [
                        "<i class='icon-Left_Arrow_Related_posts_videos'></i>",
                        "<i class='icon-Right_Arrow_Related_posts_videos'></i>"
                    ],
                    loop: false,
                    margin: 20
                }
            }
        });
}
function do_login_update(reload) {
    var data = {
        action: 'logmein', // function to execute
        afp_nonce: afp_vars.afp_nonce, // wp_nonce
    };
    $.ajax({
        url: afp_vars.afp_ajax_url,
        data: data,
        type: 'POST',
        success: function (response) {
            $('.loggedin-usernav-wrapper,.loggedout-usernav-wrapper').not('.hide').addClass('hide');
            if (response.status = 200 && response.msg == 'loggedin') {
                $('.loggedin-usernav-wrapper').removeClass('hide');
                if (typeof response.userdata == 'object' && response.userdata.customerStatus) {
                    $('.logged-in-customer').removeClass('hide').html('<a href="/communities?utm_source=blog&utm_medium=courses&utm_term=communities">Community</a>');
                }
                if (typeof response.userdata == 'object' && response.userdata.imageName) {
                    $('.user-image-icon').attr('src', response.userdata.imageName);
                }
                if (typeof response.userdata == 'object') {
                    if (!response.userdata.subscribed) {
                        $('.custom-subscribe-form-wrapper.hide').removeClass('hide');
                    } else {
                        $('.show-after-success.hide').removeClass('hide');
                    }
                }
                if (typeof reload != 'undefined') {
                    location.reload();
                }
            } else {
                $('.loggedout-usernav-wrapper').removeClass('hide');
                $('.custom-subscribe-form-wrapper.hide').removeClass('hide');
            }
        }
    });
}
function update_videohistory() {
    if (typeof afp_vars == 'object' && afp_vars.single == 1) {


        if ($('.continue-watch-wrapper,.watch-again-content-wrapper').length > 0) {

            var continuewatch = $('.continue-watch-wrapper');
            var watchagain = $('.watch-again-content-wrapper');
            var data = {
                action: 'videohistory', // function to execute
                afp_nonce: afp_vars.afp_nonce, // wp_nonce
                post: afp_vars.postID, // wp_nonce
                continuewatch: continuewatch.length,
                watchagain: watchagain.length
            };
            if (watchagain.length > 0) {

                var watchagainParams = {
                    listing: watchagain.attr('data-listing'),
                    hidefirst: watchagain.attr('data-hidefirst'),
                    striptitle: watchagain.attr('data-striptitle'),
                };
                data = $.extend(data, watchagainParams);
            }
            $.ajax({
                url: afp_vars.afp_ajax_url,
                data: data,
                type: 'POST',
                success: function (response) {
                    if (typeof response == 'object' && response.status == 200 && response.msg == 'video-history') {
                        if (typeof response.continueWatch == 'string' && typeof continuewatch != 'undefined' && (response.continueWatch).length > 0) {
                            continuewatch.children('.content-for-continue-watch').html(response.continueWatch);
                            continuewatch.removeClass('hide');
                        }
                        if (typeof response.watchItAgain == 'string' && typeof watchagain != 'undefined' && (response.watchItAgain).length > 0) {
                            var watchItAgainData = response.watchItAgain;
                            watchItAgainData = '<div class="owl-carousel carousel-custom carousel-watch-again-carousel" id="watch-again-carousel">' + watchItAgainData + '</div>';
                            watchagain.children('.Continue-watch-carousel').html(watchItAgainData);
                            watchagain.removeClass('hide');

                            initiateOwlCarouselWatchItAgain($('.watch-again-content-wrapper .carousel-watch-again-carousel'));
                        }
                    }
                }
            });
        }
    }
}

(function ($) {
    activeTab = $(".mainsearchpan .navheadmob li.active a").data('post_type');
    $('input.searchinputbox[name=s]').data('post-type', activeTab);
    $(document).ready(function ($) {
        if ($('#categoryinputbox').val() == '') {
            $('.dropdown.categories-filter-dropdown ul li:first-child').hide();
            $('.dropdown.categories-filter-dropdown ul li:nth-child(2)').hide();
        }
        $("#signin-logout,#signin-logoutresp").on('click', function (e) {
            e.preventDefault();
            $('#ajax-loader').show();
            do_ajax_logout();
            return false;
        });
        $('.main-post-wrapper,.trending-block-wrapper').on('click', '.paginator-wrapper .ajax-pagination li.page-class a.page-link', function (event) {
// Prevent default action - opening tag page
            var trending = false;
            if ($(this).closest('.trending-block-wrapper').attr('Class')) {
                trending = true;
                return true;
            }
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
// Get tag slug from title attirbute
            var pageno = $(this).attr('data-page');
            var posttype = $(this).closest('.paginator-wrapper').attr('data-post-type');
            $('.masonry-container:visible').attr('data-page', pageno);
            if (posttype == 'videos')
                posttype = 'webinars';
            sendAjaxRequest(pageno, posttype, trending);
            return false;
        });
        $(".categories-filter-dropdown").on('click', '.dropdown-menu li a', function () {

            var catSlug = $(this).data('slug');
            var catName = $(this).text();
            $('input#categoryinputbox').val(catSlug);
            var updateElem = $('.dropdown.categories-filter-dropdown .btn:first-child');
            updateElem.data('slug', catSlug);
            updateElem.html('<i class="fa fa-bars"></i> ' + catName);
            $('.cat-level-breadcrum-title').text(catName);
            //            console.log(catSlug);
            if (catName == 'Select Category' || catSlug == '') {
                $('.cat-level-breadcrum').addClass('hide');
                $('.dropdown.categories-filter-dropdown ul li:first-child').hide();
                $('.dropdown.categories-filter-dropdown ul li:nth-child(2)').hide();
            } else {
                $('.cat-level-breadcrum').removeClass('hide');
                $('.dropdown.categories-filter-dropdown ul li:first-child').show();
                $('.dropdown.categories-filter-dropdown ul li:nth-child(2)').show();
            }
            $(".categories-filter-dropdown.open").removeClass('open');
            searchAjaxRequest(false);
            return false;
        });
        $(".edureka-blog-header").on('submit', 'form.main-search,form.form-element-mobile', function (e) {
            e.preventDefault();
            var maxChar = 110;
            var searchVar = $('input.searchinputbox[name=s]').val();
            var searchOldVar = $('input.searchinputbox[name=s]').attr('data-value');
            var trimmedText = (searchVar.length <= maxChar) ? searchVar : searchVar.substring(0, maxChar - 1) + "...";
            //var trimmedText = $.trim(searchVar).substring(0, maxChar).split(" ").slice(0, -1).join(" ") + "...";
            //trimmedText = (searchVar.length <= maxChar) ? searchVar : trimmedText;

            $('.tagfilterblog#main-search-filter-wrapper #search-tag-name').html(trimmedText);
            if (searchVar.length > 0) {
                $('.tagfilterblog#main-search-filter-wrapper,#filter-search').removeClass('hide');
            } else {
                $('.tagfilterblog#main-search-filter-wrapper,#filter-search').addClass('hide');
            }
            if ((searchVar == '' && searchOldVar == searchVar) || (searchOldVar == searchVar)) {
                return false;
            }
            if ($('body').hasClass('single')) {
                var hreflocation = '/blog/all/?s=' + searchVar;
                location.href = hreflocation;
                return false;
            }
            searchAjaxRequest(true, true, true);
            $('#mobsearch').collapse('hide');
            $('input.searchinputbox[name=s]').attr('data-value', searchVar);
            return false;
        });
        $(".breadcrumb-section").on('click', '.reset-filters', function () {
            if ($('.tagfilterblog#main-tag-filter-wrapper').length == 0) {
                return true;
            }
            var catSlug = $('input#categoryinputbox').val('');
            var searchVar = $('input.searchinputbox[name=s]').val('');
            var authorVar = $('input#authorinputbox').val('');
            $('.cat-level-breadcrum-title').html('');
            $('.filter-element-block,.cat-level-breadcrum').addClass('hide');
            $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug', '');
            var updateElem = $(".dropdown.categories-filter-dropdown .btn:first-child");
            updateElem.data('slug', '').val('<i class="fa fa-bars"></i> Select Category')
                    .html('<i class="fa fa-bars"></i> Select Category');
            searchAjaxRequest();
            return false;
        });
        $(".blogmobfull.mobfullnew").on('click', '.tagcross.remove-filter', function () {
            if ($(this).hasClass('tag-filter-remove')) {
                $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug', '');
                $('#main-tag-filter-wrapper').addClass('hide');
            } else if ($(this).hasClass('author-filter-remove')) {
                $('input#authorinputbox').val('');
                $('#main-author-filter-wrapper').addClass('hide');
            }

            searchAjaxRequest();
            return false;
        });
        $('.orderby-elem').on('click', function (event) {
            if (event.preventDefault) {
                event.preventDefault();
            } else {
                event.returnValue = false;
            }
            if ($(this).hasClass('filcol')) {
                $(this).closest('.breadblogmob').find('.orderby-elem').addClass('filcol');
                $(this).closest('.breadblogmob').find('.orderby-elem').removeClass('orderby-selected');
                $(this).removeClass('filcol');
                $(this).addClass("orderby-selected");
                var pageno = 1;
                var posttype = $(this).closest('.breadblogmob').attr('data-post-type');
                var trending = false;
                var updatePushState = true;
                if ($(this).closest('.trending-block-wrapper').attr('Class')) {
                    trending = true;
                    updatePushState = false;
                }
                if (posttype == 'videos')
                    posttype = 'webinars';
                sendAjaxRequest(pageno, posttype, trending, updatePushState);
            }
            return false;
        });
        $("#main-search-filter-wrapper").on('click', '.closetag', function () {

            var searchVar = '';
            $('.tagfilterblog#main-search-filter-wrapper #search-tag-name').html(searchVar);
            $('.tagfilterblog#main-search-filter-wrapper').addClass('hide');
            var tagsVar = $('.tagfilterblog#main-tag-filter-wrapper').is(':visible') ?
                    $('#main-tag-filter-wrapper.tagfilterblog .tag-blog-button-for-selected-tags').data('tag-slug') : '';
            $('.tagfilterblog#main-search-filter-wrapper').addClass('hide');
            $('input.searchinputbox[name=s], input.search_inp.search_inp_mob').val(searchVar);
            $('.tagfilterblog#main-search-filter-wrapper #search-tag-name').html(searchVar);
//            var updateElem = $(".dropdown.categories-filter-dropdown .btn:first-child");
//            updateElem.data('slug', '')
//                    .val('<i class="fa fa-bars"></i> Select Category')
//                    .html('<i class="fa fa-bars"></i> Select Category');
            var pageno = 1;
            var data = {
                action: 'filter_posts', // function to execute
                afp_nonce: afp_vars.afp_nonce, // wp_nonce
                searchpost: 'searchpost',
                searchVar: searchVar,
                tagfilter: tagsVar,
                pageno: pageno
            };
            searchAjaxRequest(data);
            // remove utm paramters from posts title
            $(".thumbnailblog").find('article h2.pintabheadingblog a').each(function () {

                $(this).attr('href', $(this).attr('href').split('?')[0]);
            });
            return false;
        });
        $('.tagsshow,.tagshide').on('click', 'button.tagbtn', function () {
            var selectedPost = $(this);
            var searchVar = '';
            var tagsVar = $(this).data('tag-slug');
            var tagText = $(this).text();
            if ($(this).next('.timesblog').is(':visible')) {
//              removetags code
                var data = {
                    action: 'filter_posts', // function to execute
                    afp_nonce: afp_vars.afp_nonce, // wp_nonce
                    tag: tagsVar,
                    tagname: tagText,
                    requesttype: 'remove'
                };
                $.ajax({
                    url: afp_vars.afp_ajax_url,
                    data: data,
                    type: 'POST',
                    success: function (response) {
                        selectedPost.closest('li').remove();
                    }
                });
                return false;
            }

            if ($('.tagfilterblog#main-tag-filter-wrapper').length == 0) {
                if (confirm('this will take you away from the page')) {
                    var hrefText = '/blog/tag/' + tagsVar;
                    window.location = hrefText;
                    return false;
                } else
                    return false;
            }

            $('.tagfilterblog#main-tag-filter-wrapper').removeClass('hide');
            $('#main-follow-button-for-tags').data('tag-slug', tagsVar);
            $('#main-follow-button-for-tags').data('tag-name', tagText);
            $('#main-follow-button-for-tags').addClass('followingbtn tagbtnactive').html('Following');
            $('#tag-name-placeholder').html(tagText);
            var updateElem = $(".dropdown.categories-filter-dropdown .btn:first-child");
            updateElem.data('slug', '').val('<i class="fa fa-bars"></i> Select Category')
                    .html('<i class="fa fa-bars"></i> Select Category');
            var pageno = 1;
            var data = {
                action: 'filter_posts', // function to execute
                afp_nonce: afp_vars.afp_nonce, // wp_nonce
                searchpost: 'searchpost',
                searchVar: searchVar,
                tagfilter: tagsVar,
                pageno: pageno
            };
            searchAjaxRequest(data);
            return false;
        })

        $('.my-followed-tags-wrapper').on('click', '.timesblog', function () {
            $(this).prev('button.tagbtn').trigger('click');
            return false;
        });
        $('.blogmobfull,.blog-sidepanel').on('click', '.recommend-this-post', function () {
            var selectedPost = $(this);
            var likeDislike = 'add';
            if (selectedPost.children('i').hasClass('fa-thumbs-up')) {
                likeDislike = 'remove';
            }
            var data = {
                action: 'filter_posts', // function to execute
                afp_nonce: afp_vars.afp_nonce, // wp_nonce
                postid: $(this).data('postid'),
                requesttype: likeDislike,
                recommend: selectedPost.hasClass('active') ? 'remove' : 'recommend'
            };
            $.ajax({
                url: afp_vars.afp_ajax_url,
                data: data,
                type: 'POST',
                success: function (response) {
                    if (selectedPost.children('i').hasClass('fa-thumbs-o-up')) {
                        selectedPost.children('i').addClass('fa-thumbs-up').removeClass('fa-thumbs-o-up').next('.tooltiptext').text('Remove recommendation for post');
                    } else {
                        selectedPost.children('i').addClass('fa-thumbs-o-up').removeClass('fa-thumbs-up').next('.tooltiptext').text('Recommend to read this post');
                    }
                    //alert(response);
                }
            });
        });
        $('.blogmobfull,.blog-sidepanel').on('click', '.follow-this-tag', function () {
            var selectedPost = $(this);
            var selectedTag = $(this).data('tag-slug');
            var selectedTagName = $(this).data('tag-name');
            var likeDislike = 'add';
            if (selectedPost.hasClass('tagbtnactive')) {
                likeDislike = 'remove';
            }
            var data = {
                action: 'filter_posts', // function to execute
                afp_nonce: afp_vars.afp_nonce, // wp_nonce
                tag: selectedTag,
                tagname: selectedTagName,
                requesttype: likeDislike
            };
            $.ajax({
                url: afp_vars.afp_ajax_url,
                data: data,
                type: 'POST',
                success: function (response) {
                    if (selectedPost.hasClass('tagbtnactive')) {
                        selectedPost.removeClass('tagbtnactive');
                        selectedPost.next('span.tooltiptext').html('Follow');
                    } else {
                        selectedPost.addClass('tagbtnactive');
                        selectedPost.next('span.tooltiptext').html('Unfollow');
                    }
                    //alert(response);
                }
            });
        });
        $(".searchicobmobnav").click(function () {
            $(".mobileslideblognav").toggle();
        });
        addutmParamsToElements();
        do_ajax_countupdate();
        do_login_update();
        update_videohistory();
    });
})(jQuery);
