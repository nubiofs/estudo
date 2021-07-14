var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");

!function(g){g.fn.twentytwenty=function(m){m=g.extend({default_offset_pct:.5,orientation:"horizontal",before_label:"Before",after_label:"After",no_overlay:!1,move_slider_on_hover:!1,move_with_handle_only:!0,click_to_move:!1},m);return this.each(function(){var e=m.default_offset_pct,s=g(this),r=m.orientation,t="vertical"===r?"down":"left",n="vertical"===r?"up":"right";s.wrap("<div class='twentytwenty-wrapper twentytwenty-"+r+"'></div>"),m.no_overlay||s.append("<div class='twentytwenty-overlay'></div>");var c=s.find("img:first"),d=s.find("img:last");s.append("<div class='twentytwenty-handle'></div>");var l=s.find(".twentytwenty-handle");l.append("<span class='twentytwenty-"+t+"-arrow'></span>"),l.append("<span class='twentytwenty-"+n+"-arrow'></span>"),s.addClass("twentytwenty-container"),c.addClass("twentytwenty-before"),d.addClass("twentytwenty-after");var i=s.find(".twentytwenty-overlay");i.append("<div class='twentytwenty-before-label'></div>"),i.append("<div class='twentytwenty-after-label'></div>");var a=function(t){var e,n,i,a,o=(e=t,n=c.width(),i=c.height(),{w:n+"px",h:i+"px",cw:e*n+"px",ch:e*i+"px"});l.css("vertical"===r?"top":"left","vertical"===r?o.ch:o.cw),a=o,"vertical"===r?(c.css("clip","rect(0,"+a.w+","+a.ch+",0)"),d.css("clip","rect("+a.ch+","+a.w+","+a.h+",0)")):(c.css("clip","rect(0,"+a.cw+","+a.h+",0)"),d.css("clip","rect(0,"+a.w+","+a.h+","+a.cw+")")),s.css("height",a.h)},o=function(t,e){var n,i,a;return n="vertical"===r?(e-v)/p:(t-w)/f,i=0,a=1,Math.max(i,Math.min(a,n))};g(window).on("resize.twentytwenty",function(t){a(e)});var w=0,v=0,f=0,p=0,y=function(t){(t.distX>t.distY&&t.distX<-t.distY||t.distX<t.distY&&t.distX>-t.distY)&&"vertical"!==r?t.preventDefault():(t.distX<t.distY&&t.distX<-t.distY||t.distX>t.distY&&t.distX>-t.distY)&&"vertical"===r&&t.preventDefault(),s.addClass("active"),w=s.offset().left,v=s.offset().top,f=c.width(),p=c.height()},h=function(t){s.hasClass("active")&&(e=o(t.pageX,t.pageY),a(e))},u=function(){s.removeClass("active")},_=m.move_with_handle_only?l:s;_.on("movestart",y),_.on("move",h),_.on("moveend",u),m.move_slider_on_hover&&(s.on("mouseenter",y),s.on("mousemove",h),s.on("mouseleave",u)),l.on("touchmove",function(t){t.preventDefault()}),s.find("img").on("mousedown",function(t){t.preventDefault()}),m.click_to_move&&s.on("click",function(t){w=s.offset().left,v=s.offset().top,f=c.width(),p=c.height(),e=o(t.pageX,t.pageY),a(e)}),g(window).trigger("resize.twentytwenty")})}}(jQuery)

}
/*
     FILE ARCHIVED ON 10:24:19 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:01 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  RedisCDXSource: 1.213
  LoadShardBlock: 94.282 (3)
  PetaboxLoader3.datanode: 71.197 (4)
  captures_list: 140.578
  CDXLines.iter: 37.394 (3)
  exclusion.robots.policy: 0.341
  exclusion.robots: 0.364
  esindex: 0.03
  PetaboxLoader3.resolve: 66.76 (2)
  load_resource: 69.732
*/