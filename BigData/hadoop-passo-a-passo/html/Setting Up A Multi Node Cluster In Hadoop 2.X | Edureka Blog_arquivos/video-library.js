/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
function getVideoLibraryContent(page) {
    var videoCatElement = $('ul.video-library-tabs li.active a');
    var videoCatTarget = videoCatElement.attr('href');
    var videoCatTargetElement = $(videoCatElement);
    var videoCatSlug = videoCatElement.attr('data-slug');
    var videoSearchText = $('#srch-term').val();
    var totalPages = videoCatElement.attr('data-total-pages');
    var currentPage = videoCatElement.attr('data-current-page');
    $('.video-lib-nav.video-next,.video-lib-nav.video-prev').addClass('disabled');

    videoCatElement.attr('data-search', videoSearchText);
    videoCatElement.attr('data-page', (typeof page == 'undefined' ? 1 : page));

    if ((videoSearchText.trim()).length > 0) {

        $('form.video-library-search-form .search-tag-show').removeClass('hide');
        $('form.video-library-search-form .search-tag-show .searchtext-dinam').text(videoSearchText);
        $('form.video-library-search-form .input-group').addClass('hide');
        $('ul.video-library-tabs li.video-cat-tab').addClass('hide');
    } else {
        $('form.video-library-search-form .search-tag-show').addClass('hide');
        $('form.video-library-search-form .search-tag-show .searchtext-dinam').text('');
        $('form.video-library-search-form .input-group').removeClass('hide');
        $('ul.video-library-tabs li.video-cat-tab').removeClass('hide');
    }

    var dataPost = {
        action: 'filter_videos', // function to execute
        afp_nonce: videolib.afp_nonce, // wp_nonce
        searchVar: videoSearchText,
        category: videoCatSlug,
        paged: (typeof page == 'undefined' ? 1 : page)
    };
    $.ajax({
        url: videolib.afp_ajax_url,
        data: dataPost,
        type: 'POST',
        success: function (response) {
            if (response.status == 200) {
                var videoContent = '';
                if (typeof response.articles == 'string') {
                    videoContent = response.articles;
                } else {
                    $.each(response.articles, function (key, article) {
                        videoContent += article;
                    });
                }
                if (videoContent.length > 0) {
                    $(videoCatTarget).html('<section class="col-md-12 col-lg-12 col-sm-12 col-xs-12 no-padding">' + videoContent + '</section>')
                }
                if (typeof response.paginator == 'object') {
                    var currentPage = response.paginator.currrent_page;
                    var totalPages = response.paginator.total_pages;
                    $('.videocollections .current-video-page').text(currentPage);
                    $('.videocollections .total-video-pages').text(totalPages);
                    $('.video-library-tabs li.active a').attr('data-current-page', currentPage);
                    $('.video-library-tabs li.active a').attr('data-total-pages', totalPages);

                    if (currentPage < totalPages) {
                        $('.video-lib-nav.video-next').removeClass('disabled');
                    }
                    if (currentPage > 1) {
                        $('.video-lib-nav.video-prev').removeClass('disabled');
                    }
                    $('.videocollections .pagenumber-wrappper').show();
                } else {
                    $('.videocollections .pagenumber-wrappper').hide();
                }
            }
        }
    });
}


$(document).ready(function () {
    $('.video-library-search-form').on('click', '.clear-text-art', function () {

        $('#srch-term').val('');
        getVideoLibraryContent();

    });

    if ($('ul.video-library-tabs').length > 0) {
        getVideoLibraryContent();
    }
    $('ul.video-library-tabs').on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
//show selected tab / active
        var tabElement = $(e.target);
//        console.log(tabElement);
        var targetContent = tabElement.attr('href');
        var page = tabElement.attr('data-page');
        var searchVar = tabElement.attr('data-search');
        var currentPage = $('.video-library-tabs li.active a').attr('data-current-page');
        var totalPages = $('.video-library-tabs li.active a').attr('data-total-pages');
        $('.videocollections .current-video-page').text(currentPage);
        $('.videocollections .total-video-pages').text(totalPages);
        $('.video-lib-nav.video-next,.video-lib-nav.video-prev').addClass('disabled');

        if ($(targetContent).text() == '' || searchVar != $('#srch-term').val())
            getVideoLibraryContent();
        else {
            if (currentPage < totalPages) {
                $('.video-lib-nav.video-next').removeClass('disabled');
            }
            if (currentPage > 1) {
                $('.video-lib-nav.video-prev').removeClass('disabled');
            }
            if (totalPages >= 1)
                $('.videocollections .pagenumber-wrappper').show();
            else
                $('.videocollections .pagenumber-wrappper').hide();

        }

    });
    $('.collection-videos').on('click', '.video-cat-tab-resp a', function (e) {
        e.preventDefault();

//show selected tab / active
        var clickedElement = $(this);
//        console.log(tabElement);
        var targetSlug = clickedElement.attr('data-slug');
        $('.video-library-tabs .video-cat-tab a[data-slug=' + targetSlug + ']').tab('show');
        return false;

    });
    $('.videocollections').on('click', '.video-lib-nav', function (e) {
//show selected tab / active
        e.preventDefault();
        if ($(this).hasClass('disabled')) {
            return false;
        }

        var videoCatElement = $('ul.video-library-tabs li.active a');
        var totalPages = videoCatElement.attr('data-total-pages');
        var currentPage = videoCatElement.attr('data-current-page');
        if ($(this).hasClass('video-next')) {
            currentPage++;
            if (currentPage <= totalPages) {
                videoCatElement.attr('data-current-page', currentPage);
                getVideoLibraryContent(currentPage);
            }
        } else if ($(this).hasClass('video-prev')) {
            currentPage--;
            if (currentPage >= 1) {
                videoCatElement.attr('data-current-page', currentPage);
                getVideoLibraryContent(currentPage);
            }
        }
        return false;
    });
    $('.videocollections').on('submit', 'form.navbar-form', function (e) {
        e.preventDefault();

        getVideoLibraryContent();
        return false;
    });

});

