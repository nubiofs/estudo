!function(){"use strict";var a=window.document,b={STYLES:"https://c.disquscdn.com/next/embed/styles/lounge.c9fb5886900e696c8873ec5b4648f872.css",RTL_STYLES:"https://c.disquscdn.com/next/embed/styles/lounge_rtl.e6ae501bd3f97b07c72f2057db34ec5a.css","lounge/main":"https://c.disquscdn.com/next/embed/lounge.bundle.2d5add5824bdd553cbcfaa87bce7038b.js","discovery/main":"https://c.disquscdn.com/next/embed/discovery.bundle.dd74556cf657ab1e8f3235a63e5b93a7.js","remote/config":"https://disqus.com/next/config.js","common/vendor_extensions/highlight":"https://c.disquscdn.com/next/embed/highlight.6fbf348532f299e045c254c49c4dbedf.js"};window.require={baseUrl:"https://c.disquscdn.com/next/current/embed",paths:["lounge/main","discovery/main","remote/config","common/vendor_extensions/highlight"].reduce(function(a,c){return a[c]=b[c].slice(0,-3),a},{})};var c=a.createElement("script");c.onload=function(){require(["common/main"],function(a){a.init("lounge",b)})},c.src="https://c.disquscdn.com/next/embed/common.bundle.25f477667301252e7f88cc86f425074e.js",a.body.appendChild(c)}();