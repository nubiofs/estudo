/* Do not modify this file directly. It is compiled from other files. */
/* globals IntersectionObserver, jQuery */
var jetpackLazyImagesModule=function(t){var e,n,o,i,r={rootMargin:"200px 0px",threshold:.01},s=0;function h(){if(e=document.querySelectorAll("img.jetpack-lazy-image:not(.jetpack-lazy-image--handled)"),s=e.length,n&&n.disconnect(),"IntersectionObserver"in window)for(n=new IntersectionObserver(a,r),i=0;i<e.length;i++)(o=e[i]).getAttribute("data-lazy-loaded")||n.observe(o);else!function(t){var e;for(e=0;e<t.length;e++){var n=t[e];c(n)}}(e)}function a(t){var e;for(0===s&&n.disconnect(),e=0;e<t.length;e++){var o=t[e];o.intersectionRatio>0&&(s--,n.unobserve(o.target),c(o.target))}}function c(e){var n,o,i,r=t(e);r.length&&(n=r.attr("data-lazy-srcset"),o=r.attr("data-lazy-sizes"),(i=r.clone()).removeAttr("data-lazy-srcset"),i.removeAttr("data-lazy-sizes"),i.removeAttr("data-lazy-src"),i.addClass("jetpack-lazy-image--handled"),i.attr("data-lazy-loaded",1),n?i.attr("srcset",n):i.removeAttr("srcset"),o&&i.attr("sizes",o),r.replaceWith(i),i.trigger("jetpack-lazy-loaded-image"))}t(document).ready(function(){h(),t("body").bind("post-load",h),t("body").bind("jetpack-lazy-images-load",h)})};
/**
 * The following is an Intersection observer polyfill which is licensed under
 * the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE and can be found at:
 * https://github.com/w3c/IntersectionObserver/tree/master/polyfill
 */
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
/**
 * The following is an Intersection observer polyfill which is licensed under
 * the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE and can be found at:
 * https://github.com/w3c/IntersectionObserver/tree/master/polyfill
 */
/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the W3C SOFTWARE AND DOCUMENT NOTICE AND LICENSE.
 *
 *  https://www.w3.org/Consortium/Legal/2015/copyright-software-and-document
 *
 */
!function(t,e){"use strict";if("IntersectionObserver"in t&&"IntersectionObserverEntry"in t&&"intersectionRatio"in t.IntersectionObserverEntry.prototype)"isIntersecting"in t.IntersectionObserverEntry.prototype||Object.defineProperty(t.IntersectionObserverEntry.prototype,"isIntersecting",{get:function(){return this.intersectionRatio>0}});else{var n=[];i.prototype.THROTTLE_TIMEOUT=100,i.prototype.POLL_INTERVAL=null,i.prototype.USE_MUTATION_OBSERVER=!0,i.prototype.observe=function(t){if(!this._observationTargets.some(function(e){return e.element==t})){if(!t||1!=t.nodeType)throw new Error("target must be an Element");this._registerInstance(),this._observationTargets.push({element:t,entry:null}),this._monitorIntersections(),this._checkForIntersections()}},i.prototype.unobserve=function(t){this._observationTargets=this._observationTargets.filter(function(e){return e.element!=t}),this._observationTargets.length||(this._unmonitorIntersections(),this._unregisterInstance())},i.prototype.disconnect=function(){this._observationTargets=[],this._unmonitorIntersections(),this._unregisterInstance()},i.prototype.takeRecords=function(){var t=this._queuedEntries.slice();return this._queuedEntries=[],t},i.prototype._initThresholds=function(t){var e=t||[0];return Array.isArray(e)||(e=[e]),e.sort().filter(function(t,e,n){if("number"!=typeof t||isNaN(t)||t<0||t>1)throw new Error("threshold must be a number between 0 and 1 inclusively");return t!==n[e-1]})},i.prototype._parseRootMargin=function(t){var e=(t||"0px").split(/\s+/).map(function(t){var e=/^(-?\d*\.?\d+)(px|%)$/.exec(t);if(!e)throw new Error("rootMargin must be specified in pixels or percent");return{value:parseFloat(e[1]),unit:e[2]}});return e[1]=e[1]||e[0],e[2]=e[2]||e[0],e[3]=e[3]||e[1],e},i.prototype._monitorIntersections=function(){this._monitoringIntersections||(this._monitoringIntersections=!0,this.POLL_INTERVAL?this._monitoringInterval=setInterval(this._checkForIntersections,this.POLL_INTERVAL):(r(t,"resize",this._checkForIntersections,!0),r(e,"scroll",this._checkForIntersections,!0),this.USE_MUTATION_OBSERVER&&"MutationObserver"in t&&(this._domObserver=new MutationObserver(this._checkForIntersections),this._domObserver.observe(e,{attributes:!0,childList:!0,characterData:!0,subtree:!0}))))},i.prototype._unmonitorIntersections=function(){this._monitoringIntersections&&(this._monitoringIntersections=!1,clearInterval(this._monitoringInterval),this._monitoringInterval=null,s(t,"resize",this._checkForIntersections,!0),s(e,"scroll",this._checkForIntersections,!0),this._domObserver&&(this._domObserver.disconnect(),this._domObserver=null))},i.prototype._checkForIntersections=function(){var e=this._rootIsInDom(),n=e?this._getRootRect():{top:0,bottom:0,left:0,right:0,width:0,height:0};this._observationTargets.forEach(function(i){var r=i.element,s=h(r),a=this._rootContainsTarget(r),c=i.entry,u=e&&a&&this._computeTargetAndRootIntersection(r,n),l=i.entry=new o({time:t.performance&&performance.now&&performance.now(),target:r,boundingClientRect:s,rootBounds:n,intersectionRect:u});c?e&&a?this._hasCrossedThreshold(c,l)&&this._queuedEntries.push(l):c&&c.isIntersecting&&this._queuedEntries.push(l):this._queuedEntries.push(l)},this),this._queuedEntries.length&&this._callback(this.takeRecords(),this)},i.prototype._computeTargetAndRootIntersection=function(n,o){if("none"!=t.getComputedStyle(n).display){for(var i,r,s,a,u,l,d,p,g=h(n),f=c(n),v=!1;!v;){var m=null,_=1==f.nodeType?t.getComputedStyle(f):{};if("none"==_.display)return;if(f==this.root||f==e?(v=!0,m=o):f!=e.body&&f!=e.documentElement&&"visible"!=_.overflow&&(m=h(f)),m&&(i=m,r=g,s=void 0,a=void 0,u=void 0,l=void 0,d=void 0,p=void 0,s=Math.max(i.top,r.top),a=Math.min(i.bottom,r.bottom),u=Math.max(i.left,r.left),l=Math.min(i.right,r.right),p=a-s,!(g=(d=l-u)>=0&&p>=0&&{top:s,bottom:a,left:u,right:l,width:d,height:p})))break;f=c(f)}return g}},i.prototype._getRootRect=function(){var t;if(this.root)t=h(this.root);else{var n=e.documentElement,o=e.body;t={top:0,left:0,right:n.clientWidth||o.clientWidth,width:n.clientWidth||o.clientWidth,bottom:n.clientHeight||o.clientHeight,height:n.clientHeight||o.clientHeight}}return this._expandRectByRootMargin(t)},i.prototype._expandRectByRootMargin=function(t){var e=this._rootMarginValues.map(function(e,n){return"px"==e.unit?e.value:e.value*(n%2?t.width:t.height)/100}),n={top:t.top-e[0],right:t.right+e[1],bottom:t.bottom+e[2],left:t.left-e[3]};return n.width=n.right-n.left,n.height=n.bottom-n.top,n},i.prototype._hasCrossedThreshold=function(t,e){var n=t&&t.isIntersecting?t.intersectionRatio||0:-1,o=e.isIntersecting?e.intersectionRatio||0:-1;if(n!==o)for(var i=0;i<this.thresholds.length;i++){var r=this.thresholds[i];if(r==n||r==o||r<n!=r<o)return!0}},i.prototype._rootIsInDom=function(){return!this.root||a(e,this.root)},i.prototype._rootContainsTarget=function(t){return a(this.root||e,t)},i.prototype._registerInstance=function(){n.indexOf(this)<0&&n.push(this)},i.prototype._unregisterInstance=function(){var t=n.indexOf(this);-1!=t&&n.splice(t,1)},t.IntersectionObserver=i,t.IntersectionObserverEntry=o}function o(t){this.time=t.time,this.target=t.target,this.rootBounds=t.rootBounds,this.boundingClientRect=t.boundingClientRect,this.intersectionRect=t.intersectionRect||{top:0,bottom:0,left:0,right:0,width:0,height:0},this.isIntersecting=!!t.intersectionRect;var e=this.boundingClientRect,n=e.width*e.height,o=this.intersectionRect,i=o.width*o.height;this.intersectionRatio=n?i/n:this.isIntersecting?1:0}function i(t,e){var n,o,i,r=e||{};if("function"!=typeof t)throw new Error("callback must be a function");if(r.root&&1!=r.root.nodeType)throw new Error("root must be an Element");this._checkForIntersections=(n=this._checkForIntersections.bind(this),o=this.THROTTLE_TIMEOUT,i=null,function(){i||(i=setTimeout(function(){n(),i=null},o))}),this._callback=t,this._observationTargets=[],this._queuedEntries=[],this._rootMarginValues=this._parseRootMargin(r.rootMargin),this.thresholds=this._initThresholds(r.threshold),this.root=r.root||null,this.rootMargin=this._rootMarginValues.map(function(t){return t.value+t.unit}).join(" ")}function r(t,e,n,o){"function"==typeof t.addEventListener?t.addEventListener(e,n,o||!1):"function"==typeof t.attachEvent&&t.attachEvent("on"+e,n)}function s(t,e,n,o){"function"==typeof t.removeEventListener?t.removeEventListener(e,n,o||!1):"function"==typeof t.detatchEvent&&t.detatchEvent("on"+e,n)}function h(t){var e;try{e=t.getBoundingClientRect()}catch(t){}return e?(e.width&&e.height||(e={top:e.top,right:e.right,bottom:e.bottom,left:e.left,width:e.right-e.left,height:e.bottom-e.top}),e):{top:0,bottom:0,left:0,right:0,width:0,height:0}}function a(t,e){for(var n=e;n;){if(n==t)return!0;n=c(n)}return!1}function c(t){var e=t.parentNode;return e&&11==e.nodeType&&e.host?e.host:e}}(window,document),jetpackLazyImagesModule(jQuery);