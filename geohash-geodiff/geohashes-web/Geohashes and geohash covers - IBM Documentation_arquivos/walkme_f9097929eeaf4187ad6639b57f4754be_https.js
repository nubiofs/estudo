﻿/*!
 * WalkMe
 * http://www.walkme.com/
 *
 * Copyright 2012, WalkMe ltd
 */
function WalkmeSnippet(){window._walkmeInternals=window._walkmeInternals||{},function(e){try{if(e.timing){e.timing.perf={};for(var n=0;n<e.timing.list.length;n++)e.timing.perf[e.timing.list[n].name]=me()-(Date.now()-e.timing.list[n].time)}}catch(e){}}(window._walkmeInternals),we("snippetStartInit",{mark:!0});var e,i,a,r,n,o,l,s,u=this,t=!1,d="40",c=0,w={publish:0,preview:1},m=w.publish,f="0",g="f9097929eeaf4187ad6639b57f4754be",p=".br",k=".js",v=/^https:\/\/(.*)\.(walkme|walkmedev|walkmeqa)\.com($|\/)/,_="wm-brotli-disabled";function b(e){s.snippetLog.push(e)}function h(){window["walkme_custom_settings_data"]?(b("lso"),S(walkme_custom_settings_data)):(b("lsp"),we("settingsFileStartLoad",{mark:!0}),ie(o,null,s.isSelfHosted,"fixedCallback",S))}function S(e){if(we("settingsFileEndLoad",{mark:!0,measureName:"SettingsFile",startMark:"settingsFileStartLoad"}),!x()&&window.document.dontLoadTriangle)return window["walkme_snippet_blocked"]=!0,s.blocked=!0,void(s.continueLoad=function(){y(e)});b("cls"),y(e)}function y(n){i=T(n),window.walkme&&window.walkme.prepCdnFormat&&(n.PublicPath=window.walkme.prepCdnFormat(n.PublicPath),Object.keys(n.Components||{}).forEach(function(e){n.Components[e]=window.walkme.prepCdnFormat(n.Components[e])}));var e=window.walkme_settings_callback||window.walkme&&window.walkme.walkme_settings_callback||window._walkmeConfig&&window._walkmeConfig.walkme_settings_callback;e&&e(i);var t=de("walkme_is_enabled_override");if(void 0!==t){if("0"===t)return}else if(!n.IsEnabled)return;!function(e){try{if(E(i.LibFile)){var n=i.LibFile.replace(k,p+k),t=i.PublicPath.replace(/.$/,p+"/");i.LibFile=e.LibFile=n,i.PublicPath=e.PublicPath=t}var r=i.DataFiles[0].url;E(r)&&function(e){return e<Date.now()-1e3*60*5}(e.PublishDate)&&(i.DataFiles[0].url=r.replace(k,p+k))}catch(e){}}(n),function(e){if(window.walkme_custom_jquery)window.mtjQuery=walkme_custom_jquery,I();else{var n=A("walkmeCustomjQueryUrl");if(0!=n&&(e=n),s.localjQueryUrlPath){var t=e.lastIndexOf("/"),r=e.substring(t+1);e=s.localjQueryUrlPath+r}ie(e,I)}}(n.jQueryFile),function(e){if(!function(){var e=document.createElement("link").relList;return!!(e&&e.supports&&e.supports("preload"))}()||A("wm_skipPreload"))return b("spls");b("pls"),W(P(e)),W(M(e)),W(e.WalkMeConfigFile);try{var n=function(e){var n=A("wm-lang"),t=e[0].url;if(n&&function(e,n){for(var t=0;t<n.length;t++)if(n[t].shortName==e)return!0;return!1}(n,e[0].languages)){var r=le(t)?".br":"",i=oe(t);return t.substring(0,t.length-i.length-r.length-1)+"_"+n+r+"."+i}return t}(e.DataFiles),t=function(e){return/json($|\?)/.test(oe(e))}(n);window.Worker&&"true"===A("wm-worker-enabled")?(window._walkmeInternals.wmWorker||(function(){var e="self.map=new Map();self.callbackMap=new Map();self.window=self;self.onmessage="+function(e){if(!e||!e.data)return;if(Array.isArray(e.data))for(var n=0;n<e.data.length;n++)fe(e.data[n]);else fe(e.data)}.toString()+"; "+fe.toString()+pe.toString()+ge.toString();ie(null,null,!1,null,null,"wm-worker",e,"javascript/worker")}(),ie(null,null,!1,null,null,"wm-blob","var blob=new Blob([document.querySelector('#wm-worker').textContent],{type:'text/javascript'});window._walkmeInternals.wmWorker=new Worker(window.URL.createObjectURL(blob));")),function(e,n){_walkmeInternals.wmWorker&&_walkmeInternals.wmWorker.postMessage({action:n?"loadJson":"loadJsDataFile",message:{url:e,callbackName:"appendDataPackage",callbackVar:"_makeTutorial"},channel:"dataFileLoader"})}(n,t)):t||W(n)}catch(e){}b("prc"),U(e.PlayerApiServer),function(e){var n=e.Storage;return!!n&&1===n["ss"]}(e)&&U(e.PlayerServer);!function(){var e=A("wm.preload-fonts");if(!e)return;for(var n=JSON.parse(e),t=0;t<n.length;t++)W(n[t])}()}(n)}function E(e){var n,t=window._walkmeConfig&&window._walkmeConfig.hashData;return A("wm-enable-brotli")&&v.test(e)&&e.indexOf(p)<0&&("Chrome"===(n=R()).browser&&50<=n.version||"Edge"===n.browser&&15<=n.version||"Firefox"===n.browser&&44<=n.version||"Safari"===n.browser&&11<=n.version||"Opera"===n.browser&&38<=n.version)&&!x()&&!t&&!s.isSelfHosted&&function(){var e=A(_);if(parseInt(e)!==i.PublishDate)return j(_),!0;return!1}()}function I(){if(we("jQueryScriptLoaded",{mark:!0,measureName:"jQueryLoaded",startMark:"settingsFileEndLoad"}),null==window["mtjQuery"])return;if(t)return;if(t=!0,window.walkme_custom_jquery||mtjQuery.noConflict(),"true"===A("wm-wait-win-load")){function e(){we("jQueryWindowLoadEvent",{measureName:"jQueryWindowLoad",startMark:"jQueryScriptLoaded"}),L(i)}b("wwl"),mtjQuery(document).ready(function(){we("jQueryDocumentReadyEvent",{measureName:"jQueryDocumentReady",startMark:"jQueryScriptLoaded"})}),"complete"===document.readyState?e():window.addEventListener("load",e)}else i.WaitDocumentReady?(b("wdr"),mtjQuery(document).ready(function(){we("jQueryDocumentReadyEvent",{measureName:"jQueryDocumentReady",startMark:"jQueryScriptLoaded"}),L(i)})):(b("ndr"),L(i))}function L(e){we("jQueryDocumentReady"),"true"===A("wm-load-cd-snippet")&&function(){var e=function(e){if(!e)return e;if("string"==typeof e)return e;var n=e[J];return n[R().string]||n[R().browser]||n["*"]}(u.getSettingsFile().Storage),n=~["crossdomain","crossdomain_ls","crossdomain_ck","dap","proxy"].indexOf(e);if(n&&"Safari"===R().browser&&function(){var e=/iPad Simulator|iPhone Simulator|iPod Simulator|iPad|iPhone|iPod/.test(navigator.platform),n=-1<navigator.userAgent.indexOf("Mac")&&"ontouchend"in document;return e||n}())return;"proxy"===e?(we("initProxyHiddenIframeStart",{mark:!0,level:1}),function(e){var n="walkme-proxy-iframe";(r=document.getElementById(n))?e():r=re("about:blank",n,!1,e,null,null,!0)}(function(){try{we("initProxyHiddenIframeDone",{mark:!0,level:1,measureName:"initProxyIframe",startMark:"initProxyHiddenIframeStart"});var e=mtjQuery(r).contents(),n=r.contentWindow||r.window;ee(e.find("body")[0]),we("initIframeMessageSenderStart",{mark:!0,level:1}),function(e,n,t){if(n.document.getElementById("wm-hidden-iframe-script"))return;var r=ne(Z(),"wm-hidden-iframe-script",n);window._walkmeInternals.hiddenIframeCallback=t,e.find("head")[0].appendChild(r)}(e,n,function(){we("initIframeMessageSenderDone",{level:1,measureName:"injectMessageSender",startMark:"initIframeMessageSenderStart"}),window._walkmeInternals.hiddenIframeCallbackCalled=!0})}catch(e){}})):n&&ee()}();try{(t=P(n=e))&&""!=t?(we("preLibStartLoad",{mark:!0}),window["walkme_pre_lib_loaded"]=function(){window["walkme_pre_lib_loaded"]=function(){try{console.log("walkme_pre_lib_loaded was called twice.")}catch(e){}},D(n)},ie(t)):D(n)}catch(e){}var n,t}function C(e){try{var n=de("wm_load_test_"+g+"_"+f),t=parseInt(n);if(t)return we("startLoadingTest"),_walkmeInternals.loadingTestDone=function(){we("endLoadingTest"),_walkmeInternals.loadingTestDone=void 0,e&&e()},void setTimeout(_walkmeInternals.loadingTestDone,1e3*t)}catch(e){}e&&e()}function M(e){var n;s.localLibUrl&&(n=s.localLibUrl);var t=A("walkmeCustomeLibUrl");if(0!=t)return t;return n||e.LibFile}function P(e){return A("wm-prelibjs")||e.PreLibJsFile}function D(e){we("libStartLoad",{mark:!0,measureName:"Prelib",startMark:"preLibStartLoad"}),ie(M(e))}function O(){return x()?"wmPreviewSnippet":"wmSnippet"}function x(){return m==w.preview}function F(){this.recorderServer="###RECORDER_SERVER_NAME###",this.cdnServerName="https://cdn.walkme.com",this.storage="proxy",this.userGuids=["f9097929eeaf4187ad6639b57f4754be"],window.walkme_custom_cdn_server&&(this.cdnServerName=walkme_custom_cdn_server),window.walkme_custom_app_server&&(this.recorderServer=walkme_custom_app_server),window.walkme_custom_data_url?this.triangleUrl=walkme_custom_data_url:this.triangleUrl=this.cdnServerName+"###SPECIAL_TRIANGLE_FILE###",window.walkme_custom_datafile_url?this.datafilesArray=walkme_custom_datafile_url:this.datafilesArray="###SPECIAL_DATA_FILE###",window.walkme_custom_widget_url?this.widgetUrl=walkme_custom_widget_url:this.widgetUrl="###SPECIAL_WIDGET_FILE###"}function T(e){if(null==l)return e;return function e(n,t){{if("string"==typeof n)return t(n);if("[object Array]"===Object.prototype.toString.call(n)){for(var r=0;r<n.length;r++)n[r]=e(n[r],t);return n}if("object"==typeof n){for(var r in n)Object.hasOwnProperty.call(n,r)&&(n[r]=e(n[r],t));return n}}return n}(e,function(e){return e.replace("###AUTO_DETECT###",l)})}function A(e){try{var n=window.localStorage.getItem(e);if(null!=n)return n}catch(e){}return!1}function j(e){try{window.localStorage.removeItem(e)}catch(e){}}function N(e){return new RegExp(e,"i").test(navigator.userAgent||navigator.vendor||window.opera)}function R(){if(n)return n;var e={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser",this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version",this.OS=this.searchString(this.dataOS)||"an unknown OS"},searchString:function(e){for(var n=0;n<e.length;n++){var t=e[n].string,r=e[n].prop;if(this.versionSearchString=e[n].versionSearch||e[n].identity,t){if(-1!=t.indexOf(e[n].subString))return e[n].identity}else if(r)return e[n].identity}},searchVersion:function(e){var n=e.indexOf(this.versionSearchString);if(-1==n)return;return parseFloat(e.substring(n+this.versionSearchString.length+1))},dataBrowser:[{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera",versionSearch:"Version"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Trident",identity:"Explorer",versionSearch:" rv"},{string:navigator.userAgent,subString:"Edge",identity:"Edge"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};return e.init(),n={version:e.version,browser:e.browser,string:e.browser+" "+e.version,OS:e.OS}}function W(e){H(e,"preload","script")}function U(e){H(e,"preconnect")}function Q(){j("wm-enable-brotli"),function(e,n){try{window.localStorage.setItem(e,n)}catch(e){}}(_,i.PublishDate),i.LibFile=se(i.LibFile),i.PublicPath=se(i.PublicPath),i.DataFiles[0].url=se(i.DataFiles[0].url)}function V(e){if(e&&e.srcElement){var n=e.srcElement.src||e.srcElement.href;if(le(n)){Q();var t=se(n);"LINK"===e.srcElement.tagName?W(t):ie(t)}}}function H(e,n,t){if(!e)return;try{var r=document.createElement("link");r.href=e,window&&window.walkme&&window.walkme.prepCdnFormat&&(r.href=window.walkme.prepCdnFormat(r.href)),te(r,e),r.onerror=V,r.rel=n,t&&(r.as=t),r.id="wm_link"+c++,ae().appendChild(r)}catch(e){}}function B(){return u.getSettingsFile().PublicPath}var G="resources/CD/",$="CDhiddenIframe",q="cdHiddenIframeScript.js",J="st",z="cm";function K(e){if(window&&window.walkme&&window.walkme.prepCdnFormat)return window.walkme.prepCdnFormat(e);return e}var X,Y=function(){var e=function(e,n){var t=u.getSettingsFile().Storage;if(!t||void 0===t[e])return n;return t[e]}(z,!0)?".compress":"";return K(B()+G+$+e+".html")},Z=function(){return K(B()+G+q)};function ee(e){var n="walkme-hidden-iframe",t=(e?e.ownerDocument:document).getElementById(n);if(!t){we("initHiddenIframeStart",{mark:!0,level:1}),window._walkmeInternals.hiddenIframeSnippetLoad=!0;t=re(Y(),n,!1,function(){we("initHiddenIframeDone",{mark:!0,level:1,measureName:"initHiddenIframe",startMark:"initHiddenIframeStart"}),window._walkmeInternals.hiddenIframeLoaded=!0,window._walkmeInternals.hiddenIframeLoadCallback&&window._walkmeInternals.hiddenIframeLoadCallback()},null,e,!0)}}function ne(e,n,t){var r=(t||window).document.createElement("script");return r.setAttribute("id",n||"mt_script_"+(Date.now()+Math.random()).toString().replace(/(^.{7})|(\.)/g,"")),r.setAttribute("async","true"),r.setAttribute("class","walkme-to-remove"),e&&r.setAttribute("src",e),te(r,e),r}function te(e,n){window._walkmeExtension&&window._walkmeExtension.nonceValue&&e.setAttribute("nonce",window._walkmeExtension.nonceValue);var t=window._walkmeConfig&&window._walkmeConfig.hashData;if(!n||!t||!t.Files)return;var r=n.indexOf("?"),i=-1!==r?n.substring(0,r):n;t.Files[i]&&(e.setAttribute("crossorigin",""),e.setAttribute("integrity",t.Files[i]))}function re(e,n,t,r,i,a,o,l){a=a||document.body;var s=document.createElement("iframe");try{a.appendChild(s)}catch(e){s=a.ownerDocument.createElement("iframe"),a.appendChild(s)}if(s.id=n,o||(s.className="walkme-to-remove"),t||(s.style.cssText="display:none;visibility:hidden;"),l)for(var u in l)l.hasOwnProperty(u)&&s.setAttribute(u,l[u]);return s.addEventListener("load",function e(n){s.removeEventListener&&s.removeEventListener("load",e),r&&r(n)},!1),s.src=e,s}function ie(e,n,t,r,i,a,o,l){window._walkmeConfig=window._walkmeConfig||{},t&&e&&!0!==window._walkmeConfig.disableWMTS&&(e+=(-1==e.indexOf("?")?"?":"&")+"_wmts="+(new Date).getTime());var s=ne(e,a);window&&window.walkme&&window.walkme.prepCdnFormat&&(s.src=window.walkme.prepCdnFormat(s.src)),l&&(s.type=l),o&&(s.text=o),n&&(s.onload=n,s.onreadystatechange=n),s.onerror=V,function(n,t){if(n&&t){var r=window[n];window[n]=function(e){window[n]=r,t(e)}}}(r,i),ae().appendChild(s)}function ae(){return e=e||document.getElementsByTagName("head")[0]}function oe(e){return e.split(".").pop()}function le(e){return e&&0<e.indexOf(".br")}function se(e){return e&&e.replace(".br","")}function ue(e){return e.replace(/^\s+|\s+$/g,"")}function de(e,n){var t=n?A(e):function(e){var n,t,r,i=document.cookie.split(";");for(n=0;n<i.length;n++)if(t=i[n].substr(0,i[n].indexOf("=")),r=i[n].substr(i[n].indexOf("=")+1),(t=t.replace(/^\s+|\s+$/g,""))==e)return r;return!1}(e);if(!1!==t)return t;var r=window[e]||window.walkme&&window.walkme[e]||window._walkmeConfig&&window._walkmeConfig[e];if(null!=r)return r;return}function ce(e){if(void 0===X&&(X=A("wmAddPerfMeasures")),X)return!e||e<=X;return!1}function we(e,n){try{var t,r,i=me(),a=Date.now();if(r=_walkmeInternals.timing?a-(t=_walkmeInternals.timing).list[t.list.length-1].time:((t=_walkmeInternals.timing={}).map={},t.perf={},t.list=[],t.delta=[],0),t.perf[e])return;if(n&&n.level&&!ce(n.level))return;t.map[e]=a,t.perf[e]=i,t.list.push({name:e,time:a}),t.delta.push({name:e,delta:r}),function(e,n){if(!n||!ce(n.level))return;var t="wm-",r=t+e;if(n.mark&&performance.mark(r),n.measureName){var i=n.startMark&&t+n.startMark,a=n.endMark&&t+n.endMark;performance.measure(t+n.measureName,i,a)}}(e,n)}catch(e){}}function me(){if(window.performance&&window.performance.now)return parseInt(window.performance.now())}function fe(e){if(!e.action)return;var n={getData:function(e,n){var t=e.url;if(!t||!n)return;self.map.has(t)?(postMessage({channel:n,message:self.map.get(t)}),self.map.delete(t)):e.isJson?pe(t,function(e){postMessage({channel:n,message:e})}):ge(e.url,e.callbackName,e.callbackVar,function(e){postMessage({channel:n,message:e})})},loadJson:function(n){if(!n.url)return;pe(n.url,function(e){self.map.set(n.url,e)})},loadScriptWithCallback:function(n){if(!n.url)return;ge(n.url,n.callbackName,n.callbackVar,function(e){self.map.set(n.url,e)})},loadJsDataFile:function(n){if(!n.url)return;self.window.wmSnippet={},self.window.wmSnippet.getServerSettings=function(){return!0},ge(n.url,n.callbackName,n.callbackVar,function(e){self.map.set(n.url,e)})}}[e.action];try{n&&n(e.message,e.channel)}catch(e){}}function ge(t,e,n,r){if(self.callbackMap.has(t))return void self.callbackMap.set(t,r);self.callbackMap.set(t,r),n?self[n]=self:n="window",self[n][e]=function(e){var n=self.callbackMap.get(t);n&&n(e),self.callbackMap.delete(t)},importScripts(t)}function pe(n,e){if(self.callbackMap.has(n))return void self.callbackMap.set(n,e);self.callbackMap.set(n,e);var t=new XMLHttpRequest;t.responseType="json",t.onreadystatechange=function(){if(4===t.readyState&&200===t.status){var e=self.callbackMap.get(n);e&&e(t.response),self.callbackMap.delete(n)}},t.open("GET",n,!0),t.send(null)}function ke(e,n){try{b(e),console.log(n)}catch(e){}}if(this.getSnippetVersion=function(){return d},this.getSettingsFile=function(){return i},this.getServerSettings=function(){return a},this.fixAutoDetectPaths=T,!_walkmeInternals.__tti&&"PerformanceObserver"in window){var ve=[];if("PerformanceResourceTiming"in window&&ve.push("resource"),"PerformancePaintTiming"in window&&ve.push("paint"),"PerformanceLongTaskTiming"in window&&ve.push("longtask"),"LargestContentfulPaint"in window&&ve.push("largest-contentful-paint"),0<ve.length){var _e=_walkmeInternals.__tti={e:[]};_e.o=new PerformanceObserver(function(e){_e.e=_e.e.concat(e.getEntries())}),_e.o.observe({entryTypes:ve})}}setTimeout(function(){if(window._walkmeConfig=window._walkmeConfig||{},(s=_walkmeInternals).snippetLog=[],s.addTimeStamp=we,window.doNotLoadWalkMe)return b("dlw"),void(s.removeWalkMeReason="doNotLoadWalkMe variable on the window");if(_walkmeInternals.loadingTestDone)return void ke("ltt","WalkMe Loading Test is already running - aborting snippet");var e;b("ish"),s.isSelfHosted="false"=="true",b("ssm"),"###IS_PREVIEW_MODE###"=="true"&&(m=w.preview),a=new F,b("lsu");var n=false==1||false&&N("android|blackberry|iemobile|ip(ad|hone|od)|phone|symbian|windows (ce|phone)");if(n?(b("lsm"),e="###GET_MOBILE_SETTINGS_URL###",_walkmeConfig.platform=3):(b("lsw"),e="https://cdn.walkme.com/users/f9097929eeaf4187ad6639b57f4754be/settings.txt"),-1<a.cdnServerName.indexOf("###AUTO_DETECT###")&&(b("lad"),l=function(e,n){for(var t=document.getElementsByTagName("script"),r="###MOBILE_WEB_USER_GUID###",i=0;i<t.length;i++){var a=t[i].src;if(a&&0<a.indexOf("walkme_")){if(e){i=a.indexOf(e);var o=ue(a.substr(0,i));b("dst")}else{i=a.indexOf("walkme_"),o=ue(a.substr(0,i-1));b("dso")}return n&&s.isSelfHosted&&(o=o.split(g).join(r),b("dsm")),o}}return""}(a.cdnServerName.replace("###AUTO_DETECT###",""),n),a=T(a)),e=function(e){var n=de("walkme_segmented_settings_"+g+"_"+f,!0);if(n)return b("seg"),n;return e}(e),o=function(e){var n="walkme_custom_user_settings_",t=de(n+"url",!0),r=de(n+"guid",!0),i=de(n+"env",!0),a=function(){var e=A("walkMe_wm-settings-cache-bust");if(e){var n=/{"val":"(true|false)","exp":(\d+)}/.exec(e);if(n&&"true"==n[1]&&(new Date).getTime()<parseInt(n[2]))return!0}return window.walkme&&window.walkme.walkme_settings_cache_bust||window._walkmeConfig.walkme_settings_cache_bust||!1}();t&&(e=t);r&&(e=e.replace(/(users\/)([^\/]*)(\/)/,"$1"+r+"$3"));!i&&""!==i||(i&&(i+="/"),e=e.replace(/(users\/[^\/]*\/)(.*)(sett)/,"$1"+i+"$3"));e=T(e),s.settingsUrl=e,b(a?"cb":"ncb"),a&&(e+="?forceUpdate="+(new Date).getTime());return e}(e),a=a,b("cli"),_walkmeConfig.smartLoad){if(top!=window&&!function(){try{if(parent.location.href)return!1}catch(e){}return!0}()&&function(){try{var e=window;do{if((e=e.parent.window)._walkmeConfig)return!0}while(e!=top)}catch(e){}return!1}())return}else if(1!=window["walkme_load_in_iframe"]&&top!=window)return;if(b("cuc"),!n&&!function(){if("1"===de("walkme_dont_check_browser")||x())return!0;var e=function(){var e=R();if("Chrome"==e.browser||"Firefox"==e.browser||"Safari"==e.browser&&"Windows"!=e.OS)return!0;if("Explorer"==e.browser&&7<=e.version)return!0;return ke("icb","WalkMe: Incompatible browser."),!1}(),n=!N("android.+mobile|blackberry|iemobile|ip(hone|od)|phone|symbian|windows (ce|phone)")&&!function(){var e,n=-1<navigator.userAgent.toLowerCase().indexOf("chrome")&&-1<navigator.vendor.toLowerCase().indexOf("google");e=void 0===window.devicePixelRatio||n?1:window.devicePixelRatio;var t=window.screen.width*e,r=window.screen.height*e,i=Math.max(t,r),a=Math.min(t,r);return i<800||a<600}();return e&&n}()){try{b("bns"),walkme_browser_not_supported()}catch(e){}return}b("exl");var t,r=window[O()],i=s.blocked;if(b("lsl"),t=O(),window[t]=u,b("ipm"),!x()&&(b("clt"),window.document.dontLoadTriangle))return b("bsl"),window["walkme_snippet_blocked"]=!0,s.blocked=!0,void(s.continueLoad=function(){C(h)});b("slb"),r&&!i&&ke("slt","WalkMe Snippet was loaded twice"),b("lss"),C(h),b("eok")},0)}new WalkmeSnippet;