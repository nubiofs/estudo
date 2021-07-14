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

window.advadsGAAjaxAds={};window.advadsGAPassiveAds={};(function($){if(typeof advanced_ads_pro!=='undefined'){advanced_ads_pro.observers.add(function(event){if(event.event==='inject_passive_ads'){var server='all';if($.isArray(event.ad_ids)&&!event.ad_ids.length){event.ad_ids={}}
advadsGAPassiveAds=advads_tracking_utils('concat',advadsGAPassiveAds,event.ad_ids);var advads_ad_ids;if(advadsTracking.method==='frontend'){advads_ad_ids=advads_tracking_utils('concat',advads_tracking_ads,event.ad_ids);advads_tracking_ads=[]}else{advads_ad_ids=event.ad_ids;server='passive'}
if(typeof advads.privacy.is_ad_decoded!=='undefined'){for(var bid in advads_ad_ids){advads_ad_ids[bid]=advads_ad_ids[bid].filter(advads.privacy.is_ad_decoded)}}
if(advanced_ads_pro.busy&&typeof advanced_ads_pro.isBusy!=='undefined'){document.addEventListener('advanced_ads_pro.idle',function(){advads_track_ads(removeDelayedAdId(advads_ad_ids),server)},{once:!0})}else{advads_track_ads(removeDelayedAdId(advads_ad_ids),server)}}
if(event.event==='inject_ajax_ads'){if($.isArray(event.ad_ids)&&!event.ad_ids.length){event.ad_ids={}}
var is_tcf=(typeof advads!=='undefined'&&window.advads_options.privacy['consent-method']==='iab_tcf_20');for(var blogID in event.ad_ids){if(advads_tracking_utils('blogUseGA',blogID)||is_tcf){for(var i in event.ad_ids[blogID]){if($('[data-advadstrackid="'+event.ad_ids[blogID][i]+'"][data-advadstrackbid="'+blogID+'"]').length){var HTMLID=$('[data-advadstrackid="'+event.ad_ids[blogID][i]+'"][data-advadstrackbid="'+blogID+'"]').attr('id');if('undefined'!=typeof advads_items.showed&&-1!==advads_items.showed.indexOf(HTMLID)){continue}}else{if('undefined'==typeof advadsGAAjaxAds[blogID]){advadsGAAjaxAds[blogID]=[]}
advadsGAAjaxAds[blogID].push(event.ad_ids[blogID][i])}}}
server='analytics';var ad_ids=advadsGAAjaxAds;if(is_tcf&&advads_tracking_methods[blogID]==='frontend'){server='parallel';ad_ids=JSON.parse(JSON.stringify(advadsGAAjaxAds));advadsGAAjaxAds={}}
advads_track_ads(ad_ids,server)}}})}
function triggerTrack(ev){var bid=$(ev.target).attr('data-advadstrackbid');var id=parseInt($(ev.target).attr('data-advadstrackid'));if(!bid){if($(ev.target).find('[data-advadstrackbid]').length){var ads={};$(ev.target).find('[data-advadstrackbid]').each(function(){bid=$(this).attr('data-advadstrackbid');id=parseInt($(this).attr('data-advadstrackid'));if('undefined'==typeof ads[bid]){ads[bid]=[]}
ads[bid].push(id)});for(var bid in ads){if('ga'==advads_tracking_methods[bid]||advads_tracking_parallel[bid]){advads_gadelayed_track_event(ev)}else{$.post(advads_tracking_urls[bid],{action:advadsTracking.ajaxActionName,ads:ads[bid]},function(response){})}}}else{return}}else{if(advads_tracking_utils('blogUseGA',bid)){advads_gadelayed_track_event(ev)}else{$.post(advads_tracking_urls[bid],{action:advadsTracking.ajaxActionName,ads:[id]},function(response){})}}}
$(function(){if('undefined'!=typeof advanced_ads_layer_settings){$(document).on(advanced_ads_layer_settings.layer_class+'-trigger',function(ev){triggerTrack(ev)})}
if('undefined'!=typeof advanced_ads_sticky_check_position_fixed){$(document).on('advads-sticky-trigger',function(ev){triggerTrack(ev)})}})}(jQuery));function removeDelayedAdId(ids){jQuery('[data-advadstrackid]').each(function(){var id=parseInt(jQuery(this).attr('data-advadstrackid'));var bid=parseInt(jQuery(this).attr('data-advadstrackbid'));if(advads_tracking_utils('hasAd',ids)){if('undefined'!=typeof ids[bid]){var index=ids[bid].indexOf(id);if(index!==-1){ids[bid].splice(index,1)}}}});return ids}
jQuery(document).ready(function($){if(typeof advads_tracking_ads==='undefined'){return}
var localTracker=function(){window.advads_tracking_ads=removeDelayedAdId(advads_tracking_ads);if(typeof advanced_ads_pro!=='undefined'){return}
if(!advads_tracking_utils('hasAd',advads_tracking_ads)){return}
for(var bid in advads_tracking_ads){if(advads_tracking_methods[bid]==='frontend'){if(typeof advads!=='undefined'&&typeof advads.privacy.is_ad_decoded!=='undefined'){advads_tracking_ads[bid]=advads_tracking_ads[bid].filter(advads.privacy.is_ad_decoded)}
advads_track_ads(advads_tracking_ads);advads_tracking_ads={1:[]}}}};if(typeof advads!=='undefined'&&advads.privacy.get_state()==='unknown'){document.addEventListener('advanced_ads_privacy',function(event){if(event.detail.previousState==='unknown'){localTracker()}});return}
localTracker()});jQuery(document).on('advads_track_ads',function(e,ad_ids){advads_track_ads(ad_ids)});function advads_gadelayed_track_event(ev){var $el=jQuery(ev.target);var $vector=[];if($el.attr('data-advadstrackid')){$vector=$el}else{$vector=$el.find('[data-advadstrackid]')}
if($vector.length){var ids={};$vector.each(function(){var bid=parseInt(jQuery(this).attr('data-advadstrackbid'));if('undefined'==typeof ids[bid]){ids[bid]=[]}
ids[bid].push(parseInt(jQuery(this).attr('data-advadstrackid')))});if('undefined'==typeof advadsGATracking.delayedAds){advadsGATracking.delayedAds={}}
advadsGATracking.delayedAds=advads_tracking_utils('concat',advadsGATracking.delayedAds,ids);advads_track_ads(advadsGATracking.delayedAds,'delayed')}}
function advads_tracking_utils(){if(!arguments.hasOwnProperty(0))return;var fn=arguments[0];var args=Array.prototype.slice.call(arguments,1);var utils={hasAd:function(data){for(var i in data){if(jQuery.isArray(data[i])){if(data[i].length){return!0}}}
return!1},concat:function(){var result={};for(var i in args){for(var j in args[i]){if('undefined'==typeof result[j]){result[j]=args[i][j]}else{if('function'==typeof result[j].concat){result[j]=result[j].concat(args[i][j])}}}}
return result},blogUseGA:function(bid){if('ga'!=advads_tracking_methods[bid]&&!1===advads_tracking_parallel[bid]){return!1}
if(''==advads_gatracking_uids[bid]){return!1}
return!0},adsByBlog:function(ads,bid){var result={};if('undefined'!=typeof ads[bid]){result[bid]=ads[bid];return result}
return{}},};if('function'==typeof utils[fn]){return utils[fn].apply(null,args)}}
function advads_track_ads(advads_ad_ids,server){if(!advads_tracking_utils('hasAd',advads_ad_ids))return;if('undefined'==typeof server)server='all';for(var bid in advads_ad_ids){var data={ads:advads_ad_ids[bid],};if(advads_tracking_utils('blogUseGA',bid)){if('undefined'==typeof advadsGATracking){window.advadsGATracking={}}
if('undefined'==typeof advadsGATracking.deferedAds){window.advadsGATracking.deferedAds={}}
if('local'!=server){advadsGATracking.deferedAds=advads_tracking_utils('concat',advadsGATracking.deferedAds,advads_tracking_utils('adsByBlog',advads_ad_ids,bid));if('delayed'==server){jQuery(document).trigger('advadsGADelayedTrack');var passiveDelayed={};passiveDelayed[bid]=[];if(-1==['frontend','ga'].indexOf(advads_tracking_methods[bid])){if(advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advadsGAPassiveAds,bid))){for(var i in advads_ad_ids[bid]){if(-1!=advadsGAPassiveAds[bid].indexOf(advads_ad_ids[bid][i])){passiveDelayed[bid].push(advads_ad_ids[i])}}}
if(passiveDelayed[bid].length){for(var j in passiveDelayed[bid]){advadsGAPassiveAds[bid].splice(advadsGAPassiveAds[bid].indexOf(passiveDelayed[j]),1)}
jQuery.post(advads_tracking_urls[bid],{ads:passiveDelayed[bid],action:advadsTracking.ajaxActionName},function(response){})}}}else{if('passive'==server&&advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advads_ad_ids,bid))&&-1!=['onrequest','shutdown'].indexOf(advads_tracking_methods[bid])){data.action=advadsTracking.ajaxActionName;jQuery.post(advads_tracking_urls[bid],data,function(response){})}
jQuery(document).trigger('advadsGADeferedTrack')}}
if(advads_tracking_parallel[bid]&&'analytics'!=server&&advads_tracking_methods[bid]=='frontend'){if(server!=='parallel'&&advads_tracking_utils('hasAd',advads_tracking_utils('adsByBlog',advadsGAAjaxAds,bid))){var removed=[];for(var i in advadsGAAjaxAds[bid]){var index=data.ads.indexOf(advadsGAAjaxAds[bid][i]);if(-1!=index){data.ads.splice(index,1);removed.push(advadsGAAjaxAds[bid][i])}}
if(removed.length){for(var j in removed){index=advadsGAAjaxAds[bid].indexOf(removed[j]);advadsGAAjaxAds[bid].splice(index,1)}}}
if(data.ads.length){data.action=advadsTracking.ajaxActionName;jQuery.post(advads_tracking_urls[bid],data,function(response){})}}}else{if('analytics'!=server){jQuery.post(advads_tracking_urls[bid],{ads:data.ads,action:advadsTracking.ajaxActionName},function(response){})}}}}

}
/*
     FILE ARCHIVED ON 10:24:59 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:04 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 221.338
  exclusion.robots: 0.117
  exclusion.robots.policy: 0.109
  RedisCDXSource: 2.217
  esindex: 0.008
  LoadShardBlock: 193.345 (3)
  PetaboxLoader3.datanode: 177.576 (4)
  CDXLines.iter: 22.695 (3)
  load_resource: 223.204
  PetaboxLoader3.resolve: 172.153
*/