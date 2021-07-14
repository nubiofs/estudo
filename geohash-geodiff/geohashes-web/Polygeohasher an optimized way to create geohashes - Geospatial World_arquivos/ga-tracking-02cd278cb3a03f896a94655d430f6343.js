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

(function($){"use strict";var HOST='http://web.archive.org/web/20210115102508/https://www.google-analytics.com';var BATCH_PATH='/batch';var COLLECT_PATH='/collect';var CLICK_TIMEOUT=1000;var CLICK_TIMER=null;var clickReqObj=null;var getQS=function(URL){var l=document.createElement("a");l.href=URL;var QS=l.search;if(QS.length){QS=QS.substr(1);QS=QS.split('&');if(QS.length){var results={};for(var i in QS){var exp=QS[i].split('=');results[exp[0]]=exp[1]}
return results}else{return[]}
return QS}else{return[]}};var appendQS=function(URL,QS){for(var i in QS){if(-1!==URL.indexOf('?')){URL+='&'+i+'='+QS[i]}else{URL+='?'+i+'='+QS[i]}}
return URL}
function abortAndRedirect(url){if(null!==CLICK_TIMER){clearTimeout(CLICK_TIMER);CLICK_TIMER=null}
if(null!==clickReqObj){clickReqObj.abort();clickReqObj==null}
window.location=url}
var advadsTracker=function(name,blogId,UID){this.name=name;this.blogId=blogId
this.cid=!1;this.UID=UID;this.analyticsObject=null;var that=this;this.normalTrackingDone=!1;this.analyticsObject=('string'==typeof(GoogleAnalyticsObject)&&'function'==typeof(window[GoogleAnalyticsObject]))?window[GoogleAnalyticsObject]:!1;if(!1===this.analyticsObject){(function(i,s,o,g,r,a,m){i.GoogleAnalyticsObject=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','http://web.archive.org/web/20210115102508/https://www.google-analytics.com/analytics.js','_advads_ga');_advads_ga('create',this.UID,'auto',this.name);if(advads_gatracking_anonym){_advads_ga('set','anonymizeIp',!0)}
_advads_ga(function(){var tracker=_advads_ga.getByName(that.name);that.readyCB(tracker)})}else{window[GoogleAnalyticsObject]('create',this.UID,'auto',this.name);if(advads_gatracking_anonym){window[GoogleAnalyticsObject]('set','anonymizeIp',!0)}
window[GoogleAnalyticsObject](function(){var tracker=window[GoogleAnalyticsObject].getByName(that.name);that.readyCB(tracker)})}
return this}
advadsTracker.prototype={contructor:advadsTracker,hasCid:function(){return(this.cid&&''!==this.cid)},readyCB:function(tracker){var that=this;this.cid=tracker.get('clientId');$(document).on('advadsGADeferedTrack',function(args){that.trackImpressions(!1)});$(document).on('advadsGADelayedTrack',function(){that.trackImpressions(!0)});this.trackImpressions()},trackImpressions:function(delayed){if('undefined'==typeof delayed){delayed=!1}
var trackedAds=[];if(!this.normalTrackingDone&&advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advads_tracking_ads,this.blogId))){trackedAds=trackedAds.concat(advads_tracking_ads[this.blogId])}
if('frontend'==advads_tracking_methods[this.blogId]){trackedAds=[]}
if(delayed){if('undefined'!=typeof advadsGATracking.delayedAds&&advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advadsGATracking.delayedAds,this.blogId))){trackedAds=trackedAds.concat(advadsGATracking.delayedAds[this.blogId]);advadsGATracking.delayedAds[this.blogId]=[]}}else{if('undefined'!=typeof advadsGATracking.deferedAds&&advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advadsGATracking.deferedAds,this.blogId))){trackedAds=trackedAds.concat(advadsGATracking.deferedAds[this.blogId]);advadsGATracking.deferedAds[this.blogId]=[]}}
if(typeof advads!=='undefined'&&typeof advads.privacy.is_ad_decoded!=='undefined'){trackedAds=trackedAds.filter(advads.privacy.is_ad_decoded)}
if(!trackedAds.length){return}
if(!this.hasCid()){console.log(' Advads Tracking >> no clientID. aborting ...');return}
var trackBaseData={v:1,tid:this.UID,cid:this.cid,t:'event',ni:1,ec:'Advanced Ads',ea:advadsGALocale.Impressions,dl:document.location.origin+document.location.pathname,dp:document.location.pathname,};var payload="";for(var i in trackedAds){if(undefined!==advads_gatracking_allads[this.blogId][trackedAds[i]]){var adInfo={el:'['+trackedAds[i]+'] '+advads_gatracking_allads[this.blogId][trackedAds[i]].title,};var adParam=$.extend({},trackBaseData,adInfo);payload+=$.param(adParam)+"\n"}}
if(payload.length){$.post(HOST+BATCH_PATH,payload)}
if(!this.normalTrackingDone)this.normalTrackingDone=!0},trackClick:function(id,serverSide,ev,el){if(!this.hasCid()){console.log(' Advads Tracking >> no clientID. aborting ...');return}
if(undefined===serverSide)serverSide=!0;var trackData={v:1,tid:this.UID,cid:this.cid,t:'event',ni:1,ec:'Advanced Ads',ea:advadsGALocale.Clicks,el:'['+id+'] '+advads_gatracking_allads[this.blogId][id].title,dl:document.location.origin+document.location.pathname,dp:document.location.pathname,};var payload=$.param(trackData);var url=advads_gatracking_allads[this.blogId][id].target
if('undefined'!=typeof advadsGATracking.postContext){url=url.replace('[CAT_SLUG]',advadsGATracking.postContext.cats);url=url.replace('[POST_ID]',advadsGATracking.postContext.postID);url=url.replace('[POST_SLUG]',advadsGATracking.postContext.postSlug)}
url=url.replace('[AD_ID]',id);var pageQS=getQS(document.location.href);var linkQS=getQS($(el).attr('href'));url=appendQS(url,linkQS);if('undefined'!=typeof advads_gatracking_transmitpageqs&&'undefined'!=typeof advads_gatracking_transmitpageqs[this.blogId]){if(!0===advads_gatracking_transmitpageqs[this.blogId][id]){url=appendQS(url,pageQS)}}
if(serverSide){url=$(el).attr('href')}
var newTab=($(el).attr('target'))?!0:!1;if(newTab){$.post(HOST+COLLECT_PATH,payload);if(!serverSide){$(el).attr('href',url)}}else{ev.preventDefault();if(null===CLICK_TIMER&&null===clickReqObj){CLICK_TIMER=setTimeout(function(){abortAndRedirect(url,newTab)},CLICK_TIMEOUT);clickReqObj=$.post(HOST+COLLECT_PATH,payload,function(){clearTimeout(CLICK_TIMER);CLICK_TIMER=null;clickReqObj=null;abortAndRedirect(url)})}}},}
$(function(){for(var bid in advads_tracking_methods){var bid=parseInt(bid);if(isNaN(bid)){continue}
if(advads_tracking_utils('blogUseGA',bid)){var gaTracker=function(){var tracker=new advadsTracker('advadsTracker_'+bid,bid,advads_gatracking_uids[bid]);(function(_bid,_tracker){var base=advads_tracking_linkbases[_bid];var baseSelector='a[href^="'+advads_tracking_linkbases[_bid]+'"]';if(-1==base.indexOf('://')){baseSelector='a[href*="'+base+'="]'}
$(document).on('click',baseSelector+'[data-bid="'+_bid+'"]',function(ev){var id=0;if(-1==base.indexOf('://')){var regex=new RegExp(base+'=(\\d+)');var link=$(this).attr('href');var M=link.match(regex);if(M&&'undefined'!=typeof M[1]){id=M[1];id=parseInt(id)}}else{id=$(this).attr('href').split(advads_tracking_linkbases[_bid]);id=parseInt(id[1])}
if('undefined'!=typeof advads_gatracking_allads[_bid][id]&&advads_gatracking_allads[_bid][id].target){var serverSide=!0;if('ga'==advads_tracking_methods[_bid]){serverSide=!1}
_tracker.trackClick(id,serverSide,ev,this)}})})(bid,tracker)}
if(typeof advads!=='undefined'&&advads.privacy.get_state()==='unknown'){document.addEventListener('advanced_ads_privacy',function(event){if(event.detail.state==='not_needed'||event.detail.state==='accepted'){gaTracker()}});return}
gaTracker()}}})})(jQuery)

}
/*
     FILE ARCHIVED ON 10:25:08 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:04 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  exclusion.robots: 0.205
  RedisCDXSource: 9.135
  esindex: 0.035
  captures_list: 214.729
  exclusion.robots.policy: 0.181
  load_resource: 139.154
  CDXLines.iter: 29.569 (3)
  LoadShardBlock: 170.243 (3)
  PetaboxLoader3.datanode: 129.463 (4)
  PetaboxLoader3.resolve: 114.949
*/