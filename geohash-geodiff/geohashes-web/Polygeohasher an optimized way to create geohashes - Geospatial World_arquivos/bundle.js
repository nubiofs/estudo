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

!function(t){var n={};function e(i){if(n[i])return n[i].exports;var o=n[i]={i:i,l:!1,exports:{}};return t[i].call(o.exports,o,o.exports,e),o.l=!0,o.exports}e.m=t,e.c=n,e.d=function(t,n,i){e.o(t,n)||Object.defineProperty(t,n,{enumerable:!0,get:i})},e.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},e.t=function(t,n){if(1&n&&(t=e(t)),8&n)return t;if(4&n&&"object"==typeof t&&t&&t.__esModule)return t;var i=Object.create(null);if(e.r(i),Object.defineProperty(i,"default",{enumerable:!0,value:t}),2&n&&"string"!=typeof t)for(var o in t)e.d(i,o,function(n){return t[n]}.bind(null,o));return i},e.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,"a",n),n},e.o=function(t,n){return Object.prototype.hasOwnProperty.call(t,n)},e.p="",e(e.s=179)}({179:function(t,n,e){"use strict";e.r(n);e(180);const i=window.wlSettings;!function(){if("undefined"==typeof fetch)return;if(void 0!==i.jsonld_enabled&&"1"!==i.jsonld_enabled)return;if(void 0===i.postId&&void 0===i.isHome)return;const t=(n=i).jsonld_url+(void 0!==n.isHome?0:n.postId);var n;fetch(t).then((function(t){return t.text()})).then((function(t){const n=document.createElement("script");n.type="application/ld+json",n.innerText=t,document.head.appendChild(n)}))}()},180:function(t,n){!function(){function t(t,n,e,i,o,r){if("undefined"==typeof wordliftAnalyticsConfigData)return!1;t("send","event","WordLift","Mentions",i,1,{[n]:o,[e]:r,nonInteraction:!0})}function n(t,n,e,i,o,r){if("undefined"==typeof wordliftAnalyticsConfigData)return!1;t("event","Mentions",{event_category:"WordLift",event_label:i,value:1,[n]:o,[e]:r,non_interaction:!0})}function e(t,n,e,i,o,r){if("undefined"==typeof wordliftAnalyticsConfigData)return!1;t.push({event:"Mentions",wl_event_action:"Mentions",wl_event_category:"WordLift",wl_event_label:i,wl_event_value:1,wl_event_uri:o,wl_index_uri:n.replace(/^\D+/g,""),wl_event_type:r,wl_index_type:e.replace(/^\D+/g,""),non_interaction:!0})}document.addEventListener("DOMContentLoaded",(function(i){if("undefined"!=typeof wordliftAnalyticsEntityData){var o=new Promise((function(t,n){return t(function(){var t=!1;window.gtag?(t=window.gtag).__wl_type="gtag":window.dataLayer?(t=window.dataLayer).__wl_type="gtm":window.ga?(t=window.ga).__wl_type="ga":window.__gaTracker&&((t=window.__gaTracker).__wl_type="ga");return t}())}));o.then(i=>function(i){return new Promise((function(o,r){if(void 0===i||"undefined"==typeof wordliftAnalyticsConfigData)return r();var a="dimension"+wordliftAnalyticsConfigData.entity_uri_dimension,f="dimension"+wordliftAnalyticsConfigData.entity_type_dimension,l=[];for(var d in wordliftAnalyticsEntityData)wordliftAnalyticsEntityData.hasOwnProperty(d)&&l.push(wordliftAnalyticsEntityData[d]);var u=l.length;if("ga"===i.__wl_type)for(var c=0;c<u;c++)t(i,a,f,l[c].label,l[c].uri,l[c].type);else if("gtag"===i.__wl_type)for(c=0;c<u;c++)n(i,a,f,l[c].label,l[c].uri,l[c].type);else if("gtm"===i.__wl_type)for(c=0;c<u;c++)e(i,a,f,l[c].label,l[c].uri,l[c].type);return o(!0)}))}(i))}}))}()}});

}
/*
     FILE ARCHIVED ON 00:49:16 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:03 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  cdx.remote: 0.115
  LoadShardBlock: 114.146 (3)
  exclusion.robots: 0.203
  exclusion.robots.policy: 0.189
  captures_list: 164.701
  esindex: 0.016
  CDXLines.iter: 26.892 (3)
  load_resource: 740.93 (2)
  PetaboxLoader3.datanode: 714.743 (5)
  PetaboxLoader3.resolve: 115.399 (3)
*/