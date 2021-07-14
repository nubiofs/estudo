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

jQuery(function(){if(typeof FB!="undefined"){FB.Event.subscribe('edge.create',function(href,widget){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'facebook','socialAction':'like','opt_target':href,'opt_pagePath':window.location.href})});FB.Event.subscribe('edge.remove',function(href,widget){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'facebook','socialAction':'unlike','opt_target':href,'opt_pagePath':window.location.href})});FB.Event.subscribe('comment.create',function(href,commentID){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'facebook','socialAction':'comment','opt_target':href,'opt_pagePath':window.location.href})});FB.Event.subscribe('comment.remove',function(href,commentID){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'facebook','socialAction':'uncomment','opt_target':href,'opt_pagePath':window.location.href})});FB.Event.subscribe('message.send',function(response){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'facebook','socialAction':'send','opt_target':response,'opt_pagePath':window.location.href})})}
if(typeof window.twttr=="undefined"){window.twttr=(function(d,s,id){var t,js,fjs=d.getElementsByTagName(s)[0];if(d.getElementById(id))return;js=d.createElement(s);js.id=id;js.src="http://web.archive.org/web/20210115102331/https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);return window.twttr||(t={_e:[],ready:function(f){t._e.push(f)}})}(document,"script","twitter-wjs"))}
if(typeof window.twttr!="undefined"){window.twttr.ready(function(twttr){twttr.events.bind('tweet',function(intent_event){if(intent_event){var label=intent_event.data.tweet_id;if(typeof label!='undefined'&&label){if(label=='label'){label=window.location.href}}else{label=window.location.href}
window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'twitter','socialAction':'tweet','opt_target':label,'opt_pagePath':window.location.href})}});window.twttr.events.bind('follow',function(intent_event){if(intent_event){var label=intent_event.data.user_id+" ("+intent_event.data.screen_name+")";window[gtm4wp_datalayer_name].push({'event':'gtm4wp.socialAction','network':'twitter','socialAction':'follow','opt_target':label,'opt_pagePath':window.location.href})}})})}})

}
/*
     FILE ARCHIVED ON 10:23:31 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:00 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  LoadShardBlock: 59.92 (3)
  captures_list: 104.507
  RedisCDXSource: 7.941
  esindex: 0.014
  CDXLines.iter: 30.877 (3)
  PetaboxLoader3.resolve: 61.147
  exclusion.robots: 0.208
  PetaboxLoader3.datanode: 67.547 (4)
  exclusion.robots.policy: 0.192
  load_resource: 103.422
*/