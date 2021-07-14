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

'use strict';jQuery().ready(function(){tdModalImage()});function tdModalImage(){jQuery('figure.wp-caption').each(function(){var caption_text=jQuery(this).children('figcaption').html();jQuery(this).children('a').data('caption',caption_text)});jQuery('.td-modal-image').each(function(){var $this=jQuery(this),$parent=$this.parent();$parent.addClass('td-modal-image');$this.removeClass('td-modal-image')});jQuery('article').magnificPopup({type:'image',delegate:".td-modal-image",gallery:{enabled:!0,tPrev:tdUtil.getBackendVar('td_magnific_popup_translation_tPrev'),tNext:tdUtil.getBackendVar('td_magnific_popup_translation_tNext'),tCounter:tdUtil.getBackendVar('td_magnific_popup_translation_tCounter')},ajax:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_ajax_tError')},image:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_image_tError'),titleSrc:function(item){var td_current_caption=jQuery(item.el).data('caption');if('undefined'!==typeof td_current_caption){return td_current_caption}else{return''}}},zoom:{enabled:!0,duration:300,opener:function(element){return element.find('img')}},callbacks:{change:function(item){window.tdModalImageLastEl=item.el;tdUtil.scrollIntoView(item.el)},beforeClose:function(){tdAffix.allow_scroll=!1;tdUtil.scrollIntoView(window.tdModalImageLastEl);var interval_td_affix_scroll=setInterval(function(){if(!tdIsScrollingAnimation){clearInterval(interval_td_affix_scroll);setTimeout(function(){tdAffix.allow_scroll=!0},100)}},100)}}});jQuery('.td-main-content-wrap').magnificPopup({type:'image',delegate:".td-modal-image",gallery:{enabled:!0,tPrev:tdUtil.getBackendVar('td_magnific_popup_translation_tPrev'),tNext:tdUtil.getBackendVar('td_magnific_popup_translation_tNext'),tCounter:tdUtil.getBackendVar('td_magnific_popup_translation_tCounter')},ajax:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_ajax_tError')},image:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_image_tError'),titleSrc:function(item){var td_current_caption=jQuery(item.el).data('caption');if('undefined'!==typeof td_current_caption){return td_current_caption}else{return''}}},zoom:{enabled:!0,duration:300,opener:function(element){return element.find('img')}},callbacks:{change:function(item){window.tdModalImageLastEl=item.el;tdUtil.scrollIntoView(item.el)},beforeClose:function(){tdAffix.allow_scroll=!1;tdUtil.scrollIntoView(window.tdModalImageLastEl);var interval_td_affix_scroll=setInterval(function(){if(!tdIsScrollingAnimation){clearInterval(interval_td_affix_scroll);setTimeout(function(){tdAffix.allow_scroll=!0},100)}},100)}}});if('undefined'===typeof jetpackCarouselStrings){jQuery('figure.gallery-item').each(function(){var caption_text=jQuery(this).children('figcaption').html();jQuery(this).find('a').data('caption',caption_text)});jQuery('.tiled-gallery').magnificPopup({type:'image',delegate:"a",gallery:{enabled:!0,tPrev:tdUtil.getBackendVar('td_magnific_popup_translation_tPrev'),tNext:tdUtil.getBackendVar('td_magnific_popup_translation_tNext'),tCounter:tdUtil.getBackendVar('td_magnific_popup_translation_tCounter')},ajax:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_ajax_tError')},image:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_image_tError'),titleSrc:function(item){var td_current_caption=jQuery(item.el).parent().find('.tiled-gallery-caption').text();if('undefined'!==typeof td_current_caption){return td_current_caption}else{return''}}},zoom:{enabled:!0,duration:300,opener:function(element){return element.find('img')}},callbacks:{change:function(item){window.tdModalImageLastEl=item.el;tdUtil.scrollIntoView(item.el)},beforeClose:function(){tdUtil.scrollIntoView(window.tdModalImageLastEl)}}});jQuery('.gallery').magnificPopup({type:'image',delegate:'.gallery-icon > a',gallery:{enabled:!0,tPrev:tdUtil.getBackendVar('td_magnific_popup_translation_tPrev'),tNext:tdUtil.getBackendVar('td_magnific_popup_translation_tNext'),tCounter:tdUtil.getBackendVar('td_magnific_popup_translation_tCounter')},ajax:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_ajax_tError')},image:{tError:tdUtil.getBackendVar('td_magnific_popup_translation_image_tError'),titleSrc:function(item){var td_current_caption=jQuery(item.el).data('caption');if('undefined'!==typeof td_current_caption){return td_current_caption}else{return''}}},zoom:{enabled:!0,duration:300,opener:function(element){return element.find('img')}},callbacks:{change:function(item){window.tdModalImageLastEl=item.el;tdUtil.scrollIntoView(item.el)},beforeClose:function(){tdUtil.scrollIntoView(window.tdModalImageLastEl)}}})}}

}
/*
     FILE ARCHIVED ON 10:24:52 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:03 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 40.532 (3)
  captures_list: 207.098
  RedisCDXSource: 128.708
  esindex: 0.014
  CDXLines.iter: 31.215 (3)
  PetaboxLoader3.resolve: 49.619
  exclusion.robots: 0.207
  PetaboxLoader3.datanode: 87.262 (4)
  exclusion.robots.policy: 0.192
  load_resource: 112.37
*/