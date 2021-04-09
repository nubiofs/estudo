var header;
var lastScrollTop;
var topScrollLimit;
var topScrollOffset = 200;

function showHideHeader(header){

    var headerTop = header.offset().top;
    var headerHeight = header.innerHeight();
    var newScrollTop = $(window).scrollTop();
    var menuSalaTopo = $(".header-container");

    if(newScrollTop > lastScrollTop){ //descendo

        var tso = topScrollOffset;
        if(topScrollLimit == 0){
            tso = 50;
        }
        var newtop = topScrollLimit - newScrollTop;

        if(newtop <=  (headerHeight * -1)){
            header.css("top", (headerHeight * -1)+"px");
            topScrollLimit = newScrollTop - headerHeight;
        }else if(newtop < 0){
            header.css("top", newtop+"px");
        }
        //$(".nav-menu-devmedia").fadeOut("fast");
    }else if(newScrollTop < lastScrollTop){ //subindo
        var newtop = topScrollLimit - newScrollTop;
        if(newtop >= 0){
            header.css("top", "");
            topScrollLimit = newScrollTop;
        }else{
            header.css("top", newtop+"px");
        }
        //$(".nav-menu-devmedia").css("display","");
    }

    if(typeof updatePageElements == "function"){
        updatePageElements(headerHeight + header[0].offsetTop);
    }

    lastScrollTop = newScrollTop;

}

$(function(){

    header = $(".header-site-devmedia");
    lastScrollTop = topScrollLimit = $(window).scrollTop();

    // EVENTO SCROLL
    $(window).on("scroll", function(){
        showHideHeader(header);
    });

})