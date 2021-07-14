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

if("undefined"==typeof console){window.console={log:function(){}}}
jQuery(function($){var debugMode=gtm4wp_scrollerscript_debugmode;var callBackTime=gtm4wp_scrollerscript_callbacktime;var readerLocation=gtm4wp_scrollerscript_readerlocation;var timer=0;var scroller=!1;var endContent=!1;var didComplete=!1;var startTime=new Date();var beginning=startTime.getTime();var totalTime=0;if(!debugMode){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.articleLoaded'})}else{console.log('Article loaded')}
function trackLocation(){bottom=$(window).height()+$(window).scrollTop();height=$(document).height();if(bottom>readerLocation&&!scroller){currentTime=new Date();scrollStart=currentTime.getTime();timeToScroll=Math.round((scrollStart-beginning)/1000);if(!debugMode){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.startReading','timeToScroll':timeToScroll})}else{console.log('Started reading '+timeToScroll)}
scroller=!0}
if(bottom>=$('#'+gtm4wp_scrollerscript_contentelementid).scrollTop()+$('#'+gtm4wp_scrollerscript_contentelementid).innerHeight()&&!endContent){currentTime=new Date();contentScrollEnd=currentTime.getTime();timeToContentEnd=Math.round((contentScrollEnd-scrollStart)/1000);if(!debugMode){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.contentBottom','timeToScroll':timeToContentEnd})}else{console.log('End content section '+timeToContentEnd)}
endContent=!0}
if(bottom>=height&&!didComplete){currentTime=new Date();end=currentTime.getTime();totalTime=Math.round((end-scrollStart)/1000);if(!debugMode){if(totalTime<gtm4wp_scrollerscript_scannertime){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.readerType','readerType':'scanner'})}else{window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.readerType','readerType':'reader'})}
window[gtm4wp_datalayer_name].push({'event':'gtm4wp.reading.pagebottom','timeToScroll':totalTime})}else{if(totalTime<gtm4wp_scrollerscript_scannertime){console.log('The visitor seems to be a "scanner"')}else{console.log('The visitor seems to be a "reader"')}
console.log('Bottom of page '+totalTime)}
didComplete=!0}}
$(window).scroll(function(){if(timer){clearTimeout(timer)}
timer=setTimeout(trackLocation,callBackTime)})})

}
/*
     FILE ARCHIVED ON 10:23:48 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:01 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 107.236
  exclusion.robots: 0.087
  exclusion.robots.policy: 0.08
  RedisCDXSource: 1.534
  esindex: 0.008
  LoadShardBlock: 82.267 (3)
  PetaboxLoader3.datanode: 171.147 (4)
  CDXLines.iter: 20.929 (3)
  load_resource: 160.436
  PetaboxLoader3.resolve: 42.377
*/