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

var gtm4wp_youtube_percentage_tracking=10;var gtm4wp_youtube_percentage_tracking_timeouts={};var gtm4wp_youtube_percentage_tracking_marks={};if(typeof onYouTubeIframeAPIReady==="undefined"){window.onYouTubeIframeAPIReady=function(){window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaApiReady','mediaType':'youtube'});jQuery("iframe[src^='http://web.archive.org/web/20210115102336/https://www.youtube.com/embed']").each(function(){var gtm4wp_jqthis=jQuery(this);var playerID=gtm4wp_jqthis.attr("id");if((playerID===undefined)||(playerID==="")){var _gtm4wp_temp=gtm4wp_jqthis.attr("src").split("?");var _gtm4wp_temp2=_gtm4wp_temp[0].split("/");playerID="youtubeplayer_"+_gtm4wp_temp2[_gtm4wp_temp2.length-1];gtm4wp_jqthis.attr("id",playerID)}
var gtm4wp_yturl=gtm4wp_jqthis.attr("src");if(gtm4wp_yturl.indexOf("enablejsapi=1")==-1){if(gtm4wp_yturl.indexOf("?")==-1){gtm4wp_yturl+="?"}
gtm4wp_yturl+="&enablejsapi=1&origin="+document.location.protocol+"//"+document.location.hostname;gtm4wp_jqthis.attr("src",gtm4wp_yturl)}
player=new YT.Player(playerID,{events:{'onReady':gtm4wp_onYouTubePlayerReady,'onStateChange':gtm4wp_onYouTubePlayerStateChange,'onPlaybackQualityChange':gtm4wp_onYouTubePlaybackQualityChange,'onPlaybackRateChange':gtm4wp_onYouTubePlaybackRateChange,'onError':gtm4wp_onYouTubeError,'onApiChange':gtm4wp_onYouTubeApiChange}})})};var tag=document.createElement('script');tag.src="//web.archive.org/web/20210115102336/https://www.youtube.com/iframe_api";var firstScriptTag=document.getElementsByTagName('script')[0];firstScriptTag.parentNode.insertBefore(tag,firstScriptTag)}else{var gtm4wp_err=new Error("Another code is already utilizing YouTube API, GTM4WP plugin can not load YouTube tracking!");throw gtm4wp_err}
function gtm4wp_onYouTubePlayerReady(event){var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerReady','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime()})}
function gtm4wp_onYouTubePlayerStateChange(event){var playerState="unknown";switch(event.data){case-1:playerState="unstarted";break;case YT.PlayerState.ENDED:playerState="ended";break;case YT.PlayerState.PLAYING:playerState="play";break;case YT.PlayerState.PAUSED:playerState="pause";break;case YT.PlayerState.BUFFERING:playerState="buffering";break;case YT.PlayerState.CUED:playerState="cued";break}
var videoId=event.target.getVideoData().video_id;if((YT.PlayerState.PLAYING==event.data)&&(gtm4wp_youtube_percentage_tracking>0)){gtm4wp_youtube_percentage_tracking_timeouts[videoId]=setInterval(function(){gtm4wp_onYouTubePercentageChange(event)},1000)}else{if(gtm4wp_youtube_percentage_tracking_timeouts[videoId]){clearInterval(gtm4wp_youtube_percentage_tracking_timeouts[videoId])}}
var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerStateChange','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaPlayerState':playerState,'mediaCurrentTime':event.target.getCurrentTime()})}
function gtm4wp_onYouTubePlaybackQualityChange(event){var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerEvent','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime(),'mediaPlayerEvent':'quality-change','mediaPlayerEventParam':event.data})}
function gtm4wp_onYouTubePlaybackRateChange(event){var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerEvent','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime(),'mediaPlayerEvent':'ratechange','mediaPlayerEventParam':event.data})}
function gtm4wp_onYouTubeError(event){var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerEvent','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime(),'mediaPlayerEvent':'error','mediaPlayerEventParam':event.data})}
function gtm4wp_onYouTubeApiChange(event){var videodata=event.target.getVideoData();window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlayerEvent','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime(),'mediaPlayerEvent':'api-change','mediaPlayerEventParam':event.data})}
function gtm4wp_onYouTubePercentageChange(event){var videoId=event.target.getVideoData().video_id;var videoCurrentTime=event.target.getCurrentTime();var videoDuration=event.target.getDuration();var videoPercentage=Math.floor(videoCurrentTime/videoDuration*100);if(typeof gtm4wp_youtube_percentage_tracking_marks[videoId]=="undefined"){gtm4wp_youtube_percentage_tracking_marks[videoId]=[]}
var videodata=event.target.getVideoData();for(var i=0;i<100;i+=gtm4wp_youtube_percentage_tracking){if((videoPercentage>i)&&(gtm4wp_youtube_percentage_tracking_marks[videoId].indexOf(i)==-1)){gtm4wp_youtube_percentage_tracking_marks[videoId].push(i);window[gtm4wp_datalayer_name].push({'event':'gtm4wp.mediaPlaybackPercentage','mediaType':'youtube','mediaData':{'id':videodata.video_id,'author':videodata.author,'title':videodata.title,'url':event.target.getVideoUrl(),'duration':event.target.getDuration()},'mediaCurrentTime':event.target.getCurrentTime(),'mediaPercentage':i})}}}

}
/*
     FILE ARCHIVED ON 10:23:36 Jan 15, 2021 AND RETRIEVED FROM THE
     INTERNET ARCHIVE ON 18:53:01 Jul 12, 2021.
     JAVASCRIPT APPENDED BY WAYBACK MACHINE, COPYRIGHT INTERNET ARCHIVE.

     ALL OTHER CONTENT MAY ALSO BE PROTECTED BY COPYRIGHT (17 U.S.C.
     SECTION 108(a)(3)).
*/
/*
playback timings (ms):
  captures_list: 262.019
  exclusion.robots: 0.126
  exclusion.robots.policy: 0.116
  RedisCDXSource: 3.028
  esindex: 0.009
  LoadShardBlock: 230.865 (3)
  PetaboxLoader3.datanode: 228.147 (4)
  CDXLines.iter: 25.102 (3)
  load_resource: 68.518
  PetaboxLoader3.resolve: 25.266
*/