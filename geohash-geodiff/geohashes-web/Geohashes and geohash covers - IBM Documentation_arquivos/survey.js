/* Tue, 11 May 2021 13:34:40 GMT */

// (function(){
//     if(!window.jQuery){
//         var fileref=document.createElement('script')
//         fileref.setAttribute("type","text/javascript")
//         fileref.setAttribute("src", "https://resources.digital-cloud-prem.medallia.eu/wdceuprem/21160/onsite/embed.js");   
//         fileref.async = true;
//         document.head.appendChild(fileref);
//         setTimeout(function() {
//             console.log('no jquery popup');
//             KAMPYLE_ONSITE_SDK.showForm(2238);
//         },5000);
//     }
// })();

(function(){
    if(!window.jQuery && window.jQuery2){
        jQuery = jQuery2;
        window.nonJquery = true;
    }else if(!window.jQuery){
        window.nonJquery = true;
        var script = document.createElement('script');
        document.head.appendChild(script);
        script.type = 'text/javascript';
        script.src = "//ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js";
        script.async = true;
    }
})();



var myibm = myibm || {};

(function ($) {


    myibm.custnamespace = function () {
        var a = arguments,
            o = null,
            i, j, d;
        for (i = 0; i < a.length; i = i + 1) {
            d = a[i].split(".");
            o = window;
            for (j = 0; j < d.length; j = j + 1) {
                o[d[j]] = o[d[j]] || {};
                o = o[d[j]];
            }
        }
        return o;
    };
}(jQuery));
/*!
 * jQuery Cookie Plugin v1.4.1
 * https://github.com/carhartl/jquery-cookie
 * Copyright 2013 Klaus Hartl
 * Released under the MIT license
 */
(function (factory) {
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory); // AMD
	} else if (typeof exports === 'object') {
		factory(require('jquery')); // CommonJS
	} else {
		factory(jQuery); // Browser globals
	}
}(function ($) {
	var pluses = /\+/g;
	function encode(s) {
		return config.raw ? s : encodeURIComponent(s);}
	function decode(s) {
		return config.raw ? s : decodeURIComponent(s);}
	function stringifyCookieValue(value) {
		return encode(config.json ? JSON.stringify(value) : String(value));}
	function parseCookieValue(s) {
		if (s.indexOf('"') === 0) {
			s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\'); // This is a quoted cookie as according to RFC2068, unescape...
		}
		try {
			// Replace server-side written pluses with spaces.
			// If we can't decode the cookie, ignore it, it's unusable.
			// If we can't parse the cookie, ignore it, it's unusable.
			s = decodeURIComponent(s.replace(pluses, ' '));
			return config.json ? JSON.parse(s) : s;
		} catch(e) {}
	}
	function read(s, converter) {
		var value = config.raw ? s : parseCookieValue(s);
		return $.isFunction(converter) ? converter(value) : value;
	}
	var config = $.cookie = function (key, value, options) {
		// Write
		if (value !== undefined && !$.isFunction(value)) {
			options = $.extend({}, config.defaults, options);
			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setTime(+t + days * 864e+5);
			}
			return (document.cookie = [
				encode(key), '=', stringifyCookieValue(value),
				options.expires ? '; expires=' + options.expires : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}
		// Read
		var result = key ? undefined : {};
		// To prevent the for loop in the first place assign an empty array
		// in case there are no cookies at all. Also prevents odd result when
		// calling $.cookie().
		var cookies = document.cookie ? document.cookie.split('; ') : [];
		for (var i = 0, l = cookies.length; i < l; i++) {
			var parts = cookies[i].split('=');
			var name = decode(parts.shift());
			var cookie = parts.join('=');
			if (key && key === name) {
				result = read(cookie, value); // If second argument (value) is a function it's a converter...
				break;
			}
			// Prevent storing a cookie that we couldn't decode.
			if (!key && (cookie = read(cookie)) !== undefined) {
				result[name] = cookie;
			}
		}
		return result;
	};
	config.defaults = {};
	$.removeCookie = function (key, options) {
		if ($.cookie(key) === undefined) {
			return false;
		}
		// Must not alter options, thus extending a fresh object...
		$.cookie(key, '', $.extend({}, options, { expires: -1 }));
		return !$.cookie(key);
	};
}));
(function ($) {
    myibm.custnamespace( 'custom.ibm.debug' );
        var me = custom.ibm.debug = function () {},
            debugMessages = [];
        me.add = function (func, contents, usePrefix) {
            debugMessages.push({
                "func": func,
                "contents": contents,
                "usePrefix": usePrefix
            });
        }
        output = function (func, contents, usePrefix) {
            if (usePrefix !== false) {
                window.console[func]("Survey: ", contents);
            } else {
                window.console[func](contents);
            }
        }

        

    me.show = function () {
        
        var i = 0;
        for (i; i < debugMessages.length; i++) {
            output(debugMessages[i].func, debugMessages[i].contents, debugMessages[i].usePrefix);
        }
    }
})(jQuery);
(function ($) {

    myibm.custnamespace( 'custom.ibm.surveryEventCoordinator' );
    custom.ibm.surveryEventCoordinator = function (obj, className, eventNames) {
        return new SurveryEventCoordinator(obj, className, eventNames);
    };

    function SurveryEventCoordinator(that, class_name, event_names) {
        var me = this,
            handlers = {},
            run_now = null,
            instance_name = null,
            i,
            len = event_names.length;

        for (i = 0; i < len; i++) {
            handlers[event_names[i].toLowerCase()] = new EventHandler(that, event_names[i].toLowerCase());
        }

        me.handlers = function () {
            return handlers;
        };

        /**
        	Internal utility. Used to merge pub/sub events into the object that owns the events we're setting up.

        	@method mergeWith
        	@param obj {Object} The event owning object to merge the pub/sub methods into.
        **/
        me.mergeWith = function (obj) {
            run_now = null;

            var merge_methods = [
                    "subscribe",
                    "unsubscribe",
                    "resumeSubscription",
                    "pauseSubscription",
                    "publish",
                    "handlers",
                    "stopPropagation"
                ],
                i,
                len = merge_methods.length,
                method;

            for (i = 0; i < len; i++) {
                method = merge_methods[i];
                if (typeof (that[method]) === "undefined") {
                    that[method] = me[method];
                } else {
                    window.console.warn("Cannot merge event handler method '" + method + "' for " + that.toString() + ".");
                }
            }

            that.instanceName = function (new_name) {
                if (arguments.length === 0) {
                    return instance_name;
                }

                instance_name = new_name;
            };

            that.toString = function () {
                if (instance_name) {
                    return ("[ {{class_name}}: {{instance_name}} ]")
                        .replace("{{class_name}}", class_name)
                        .replace("{{instance_name}}", instance_name);
                }

                return ("[ {{class_name}} ]").replace("{{class_name}}", class_name);
            };

            that.event_coordinator = me;
        };

        /**
        	Subscribe to the object's event and be notified when it happens (runs callback function.)

        	@method subscribe
        	@param event_name {String} The name of the owning object's event to subscribe to.  
        	@param owner {String} The name of your code/object that's subscribing. (Same name is used for unsubscribing.)
        	@param fn {Function} The function to call when the event happens.
        	@param [prepend] {Boolean} Set to true if you have multiple subscriptions to the same event and you want this one prepended to the event's callback array.
        	@return {Object} Returns your event coordinator object.
        	@example
        		IBMCore.common.module.masthead.subscribe("ready", "my name", myCallbackFunctionName);
        **/
        me.subscribe = subscribe;

        function subscribe(event_name, owner, fn, prepend) {
            run_now = null; // overwritten later

            if (typeof owner === "undefined") {
                window.console.warn("Cannot call on() with an undefined owner.");
                return me;
            }

            var handler = handlers[event_name.toLowerCase()];
            if (handler) {
                handler.add(owner, fn, prepend);
            } else {
                window.console.warn("on() - No event name found: " + event_name);
            }

            run_now = {
                fn: fn,
                owner: owner,
                event_name: event_name
            };

            return me;
        }

        /**
        	Unsubscribe from the object's event.

        	@method unsubscribe
        	@param event_name {String} The name of the event to unsubscribe to.
        	@param owner {String} The name of your code/object that's unsubscribing. (Same name is used for subscribing.)
        	@return {Object} Returns your event coordinator object.
        	@example
        		IBMCore.common.module.masthead.unsubscribe("ready", "my name");
        **/
        me.unsubscribe = unsubscribe;

        function unsubscribe(event_name, owner) {
            run_now = null;

            if (typeof event_name === "undefined") {
                window.console.warn("Cannot call unsubscribe() with an undefined event_name.");
                return me;
            }

            var handler = handlers[event_name.toLowerCase()];
            if (owner) {
                handler.remove(owner);
            } else {
                //window.console.warn("unsubscribe() - No event name found: " + event_name);
                handler.reset();
            }

            return me;
        }

        /**
        	Resume a paused subscription.

        	@method resumeSubscription
        	@param event_name {String} The name of the event to resume the subscription for.
        	@param owner {String} The name of your code/object that's resuming the subscription for (same name is used for subscribing.)
        	@return {Object} Returns your event coordinator object.
        	@example
        		IBMCore.common.module.masthead.resumeSubscription("ready", "my name");
        **/
        me.resumeSubscription = resumeSubscription;

        function resumeSubscription(event_name, owner) {
            run_now = null;

            if (typeof event_name === "undefined") {
                window.console.warn("Cannot call resumeSubscription() with an undefined event_name.");
                return me;
            }

            var handler = handlers[event_name.toLowerCase()];
            if (handler) {
                if (typeof owner !== "undefined") {
                    handler.resumeSubscription(owner);
                } else {
                    handler.resumeAllSubscriptions();
                }
            } else {
                window.console.warn("resumeSubscription() - No event name found: " + event_name);
            }

            return me;
        }

        /**
        	Temporarily pause a subscription.

        	@method pauseSubscription
        	@param event_name {String} The name of the event to pause the subscription for.
        	@param owner {String} The name of your code/object that's pausing the subscription for (same name is used for subscribing.)
        	@return {Object} Returns your event coordinator object.
        	@example
        		IBMCore.common.module.masthead.pauseSubscription("ready", "my name");
        **/
        me.pauseSubscription = pauseSubscription;

        function pauseSubscription(event_name, owner) {
            run_now = null;

            if (typeof event_name === "undefined") {
                window.console.warn("Cannot call pauseSubscription() with an undefined event_name.");
                return me;
            }

            var handler = handlers[event_name.toLowerCase()];
            if (handler) {
                if (typeof owner !== "undefined") {
                    handler.pauseSubscription(owner);
                } else {
                    handler.pauseAllSubscriptions();
                }
            } else {
                window.console.warn("pauseSubscription() - No event name found: " + event_name);
            }

            return me;
        }

        /**
        	Publish an event. Anyone subscribed to the named event will get their callback function run.

        	@method publish
        	@param event_name {String} The name of the event to publish.
        	@return {Object} Returns your event coordinator object.
        	@example
        		myEvents.publish("ready");
        **/
        me.publish = publish;

        function publish(event_name) {
            run_now = null;

            if (typeof event_name === "undefined") {
                window.console.warn("Cannot call publish() with an undefined event_name.");
                return me;
            }

            var handler = handlers[event_name.toLowerCase()],
                active_owners;

            if (handler) {
                active_owners = handler.activeOwners();
                if (active_owners.length > 0) {
                    //window.console.groupCollapsed(that.toString() + " publishing event \"" + event_name + "\" [" + active_owners.join(",") + "]");

                    switch (arguments.length) {
                        case 1:
                            handler.publish();
                            break;
                        case 2:
                            handler.publish(arguments[1]);
                            break;
                    }

                    //window.console.groupEnd();
                }
            } else {
                window.console.warn("publish() - No event name found: " + event_name);
            }

            return me;
        }

        /**
        	Stops event publishing propagation.

        	@method stopPropagation
        	@deprecated
        **/
        me.stopPropagation = stopPropagation;

        function stopPropagation() {
            stop_propagation = true;
        }

        /**
        	Internal utility. This is what actually runs the callback function.

        	@method runNow
        **/
        me.runNow = runNow;

        function runNow() {
            if (run_now) {
                //window.console.groupCollapsed("Publishing event '" + run_now.event_name + "' now for '" + run_now.owner + "' via runNow()");
               
                try {
                    switch (arguments.length) {
                        case 0:
                            run_now.fn.call(that);
                            break;
                        case 1:
                            run_now.fn.call(that, arguments[0]);
                            break;
                        case 2:
                            run_now.fn.call(that, arguments[0], arguments[1]);
                            break;
                    }
                } catch (er) {
                    window.console.warn("The [" + run_now.owner + "] subscription to the " + that + "[" + run_now.event_name + "] event failed with error:");
                    window.console.error(er);
                }

                //window.console.groupEnd();
            }
        }

        /**
        	Runs the named callback function if the event you're subscribing to has already happened. Use in conjunction with .subscribe() in cases where you're not sure if the event will happen before your code runs.

        	@method runAsap
        	@example 
        		// When translations (from service) are ready, call my custom function, or call immediately if already ready.
        		// Translations can be cached so we need to use runAsap() also.
        		IBMCore.common.translations.subscribe("dataReady", "footermenu", myCustomFunctionName).runAsap(myCustomFunctionName);
        **/
        me.runAsap = runAsap;

        function runAsap() {
            if (run_now) {
                var count = handlers[run_now.event_name.toLowerCase()].runCount(); // Everywhere else lowercases the event name.
                if (count > 0) {
                    //window.console.log("asap count for '"+run_now.owner+"' - '"+run_now.event_name+"': " + count + ". Running now.");
                    runNow();
                }
                // else {
                // 	window.console.log("Event '" + run_now.event_name + "' for '" + run_now.owner + "' will not runNow() because the event has not happened yet. But it has been bound, so will run as soon as the event occurs.");
                // }
            } else {
                window.console.warn("Event '" + run_now.event_name + "' for '" + run_now.owner + " has no function available to run.");
            }
        }

        me.mergeWith(that);
    }

    function EventHandler(that, name) {
        var me = this,
            run_count = 0,
            remove_count = 0,
            active_owners = {},
            events = [];

        // Returns an array of current active owners.
        me.activeOwners = activeOwners;

        function activeOwners() {
            var ns = [],
                key;

            for (key in active_owners) {
                if (active_owners[key]) {
                    ns.push(key);
                }
            }

            return ns;
        }

        me.events = events;

        // Returns the # of times an event has been run.
        me.runCount = function () {
            return run_count;
        };

        // Adds an owner to the active owner array if not there already then adds the callback to the event queue.
        me.add = add;

        function add(owner, fn, prepend) {
            if (typeof active_owners[owner] === "undefined") {
                active_owners[owner] = true;
            }

            events[prepend ? "unshift" : "push"]({
                owner: owner,
                fn: fn,
                runs: 0
            });
        }

        // Removes an event subscription for a named owner.
        me.remove = remove;

        function remove(owner) {
            var i = -1;
            while (++i < events.length) {
                if (events[i].owner === owner) {
                    events.splice(i, 1);
                    i--;
                    remove_count++;
                    //window.console.log("Removed " + that + " event '" + name + "' for owner " + owner);
                }
            }
        }

        // Resets all event props.
        me.reset = reset;

        function reset() {
            run_count = 0;
            active_owners = {};
            remove_count = events.length;
            events = [];
        }

        // Resume an event subscription for the named subscriber.
        me.resumeSubscription = resumeSubscription;

        function resumeSubscription(owner) {
            if (active_owners[owner]) {
                active_owners[owner] = true;
            } else {
                window.console.warn("Cannot resumeSubscription function with an unknown owner: " + name);
            }
            return me;
        }

        // Pauses an event subscription for the named subscriber.
        me.pauseSubscription = pauseSubscription;

        function pauseSubscription(owner) {
            if (active_owners[owner]) {
                active_owners[owner] = false;
            } else {
                window.console.warn("Cannot pauseSubscription function with an unknown owner: " + name);
            }
            return me;
        }

        // Resume an event subscription for the ALL subscribers.
        me.resumeAllSubscriptions = resumeAllSubscriptions;

        function resumeAllSubscriptions() {
            var key;
            for (key in active_owners) {
                active_owners[key] = true;
            }
            return me;
        }

        // Pauses an event subscription for ALL subscribers.
        me.pauseAllSubscriptions = pauseAllSubscriptions;

        function pauseAllSubscriptions() {
            var key;
            for (key in active_owners) {
                active_owners[key] = false;
            }
            return me;
        }

        // Publishes the actual event for the publisher and calls all active subscribers' callback functions.
        me.publish = publish;

        function publish() {
            stop_propagation = false;

            run_count++;

            remove_count = 0;

            var i,
                len = events.length,
                ev,
                owner,
                fn;

            for (i = 0; i < len; i++) {
                /*if (remove_count > 0)
                window.console.log("Running event at an offset remove_count: "+remove_count, "background-color:#f90;color:#fff;");*/

                ev = events[i - remove_count];

                if (typeof ev === "undefined") {
                    window.console.warn("Failed event on:");
                    window.console.warn(that);
                    throw "Cannot publish event: " + name;
                }

                owner = ev.owner;

                if (stop_propagation) {
                    IBM.common.util.debug.add("log", "Propagation stopped. " + owner + " will not publish this time.");
                } else if (!active_owners[ev.owner]) {
                    IBM.common.util.debug.add("log", "The [" + owner + "] subscription to the " + that + "[" + name + "] event is not active. (paused)");
                } else {
                    ev.runs++;

                    fn = ev.fn;

                    //window.console.groupCollapsed(owner);

                    try {
                        switch (arguments.length) {
                            case 0:
                                fn.call(that);
                                break;
                            case 1:
                                fn.call(that, arguments[0]);
                                break;
                            case 2:
                                fn.call(that, arguments[0], arguments[1]);
                                break;
                        }
                    } catch (er) {
                        window.console.warn("Event function[" + i + "] failed. Owner: " + owner);
                        window.console.error(er);
                    }

                    //window.console.groupEnd();

                }
            }
        }
    }

})(jQuery);
(function ($) {

    myibm.custnamespace( 'custom.ibm.surveryOverlay' );
    var surveyUtilFn = custom.ibm.surveryOverlay = function () {},
        maindiv, $surveyoverlayBackdrop, $doc = $(document);
    // creating the survery Overlay and adding css to the Overlay
   surveyUtilFn.createOverlay = function (data,status) {
        var _overlayHeight = window.innerWidth > 480  ? data.defaults.initial.invitation_height + "px" : "auto";

        //responsive code for initial  popup and css
                var _overlayWidth = data.defaults.initial.invitation_width + "px";
                var invitation_width = data.defaults.survey.invitation_width + "px";
                if (window.innerWidth > 770)
                {
                    if (status === 'pri'){
                        _overlayWidth = _overlayWidth;
                    }else {
                        _overlayWidth = invitation_width;
                    }
                }
                else
                {
                    _overlayWidth = "90%";
                }
                
        $("#survery-dialog").remove();
        maindiv = $("<div>").attr({
            id: "survery-dialog",
            role: "dialog",
            tabindex: "-1",
            "aria-labelledby": "survery-dialog-title",
            "aria-describedby": "survery-dilog-text"

        }).css({
            display: "none",
            position: "fixed",
            top: "46%",
            left: "50%",
            transform: "translate(-50%, -25%)",
            "z-index": 1000,
            transition: "opacity 400ms ease-in",
            background: "#FFF",
            width: _overlayWidth,
            height: 430,
            //width: data.defaults.initial.invitation_width + "px",
            //height: data.defaults.initial.invitation_height + "px",
            "text-align": "center",
            "margin-top": "-100px"
        }).html("<div id='customSuveryClose' data-action='hideme' class='ibm-right' style='cursor: pointer;padding-top:10px; padding-right: 10px;'>X</div>");



        
        maindiv.append(data.html,data.feedback).appendTo(document.body);
    };

//survery Overlay close on click apart from overlay
    surveyUtilFn.closeDialog = function () {
        $surveyoverlayBackdrop.hide();
        maindiv.hide();
        $doc.off('keydown', escapeDismiss);
        $surveyoverlayBackdrop.off('click', surveyUtilFn.closeDialog);

    }

    escapeDismiss = function (e) {
        if (e.keyCode == 27) {
            surveyUtilFn.closeDialog();
        }
    }

    
    surveyUtilFn.test= function(){
       // console.log("I am inside overlay");
        return true;
    }

    //surveryOverlay dismiss action on escape
    surveyUtilFn.showOverly = function () {

      
        $doc.on('keydown', escapeDismiss);
        maindiv.show();
        $surveyoverlayBackdrop.show();
        $surveyoverlayBackdrop.on('click', surveyUtilFn.closeDialog);


    }
//     var ifConsiAPurchage = jQuery('#cm-proactive-popup').is(':visible');
// if(!ifConsiAPurchage){
	
// }
    // survey overlay Background color
    $(function () {
        $surveyoverlayBackdrop = $('<div id="survey-overlay-backdrop" style="opacity: 0.5;background: #111;bottom: 0;left: 0;position: fixed;right: 0; top: 0; z-index: 900; display:none"></div>').appendTo(document.body);

        $surveyoverlayBackdrop.show = function () {
            $(this).css("display", "block");
        };

        $surveyoverlayBackdrop.hide = function () {
            $(this).css("display", "none");
        };


    });


    
})(jQuery);
//import { deflate } from "zlib";


(function ($) {
   
    myibm.custnamespace('custom.ibm.ibmSurvey');
    window.onunload = function init(config) { };
    window.addEventListener("beforeunload", function init(config) { });
    // If survery doe's not have any default values in JSON will fetch from below defaults
    surveyUtilFn = custom.ibm.ibmSurvey = function (options) {
        surveyUtilFn.demo = {};

        var defaults = {
            debug: [],
            global_minimum_wait: 30,
            interceptDisp: "pageLoad",
            surveyDisp: "immediate",
            anon: "true",
            anonData: {
                userName: "",
                userEmail: "",
                emailInfoLoaded: false
            },
            percent: 5,
            start: "",
            stop: "",
            presentDelay: 45,
            invitation: {
                title: "Tell IBM what you think",
                content: "Would you please take 1 minute to take this survey?",
                yes_label: "Yes",
                no_label: "No thanks"

            },
            survey: {
                type: "medallia",
                id: "web-exp",
                width: 700,
                height: 700,
                metaData: ""
            }
        },
            globalDefaultInterceptConfig = {
                survey: {
                    intercept: {
                        enabled: true,
                        percent: 5,
                        start: "Jul 27 2016",
                        stop: "Jul 27 2099",
                        invitation: {
                            title: "Tell IBM what you think",
                            content: "Would you please take a minute to send IBM your feedback?",
                            yes_label: "Yes",
                            no_label: "No Thanks"
                        },
                        survey: {
                            type: "medallia",
                            id: "web-exp",
                            width: 970,
                            height: 700
                        }
                    }
                }
            },
            invitation = null,
            invitationStatus = '',
            myEvents = custom.ibm.surveryEventCoordinator(surveyUtilFn, 'surveyccfintercept', [
                "exceptionDataLoaded"
            ]),
            now = new Date(), // days before ANY intercept can be seen again.
            settings = null,
            survey = null,
            surveyConfigs = {
                randNum: (Math.random() * 100),
                globalDefault: null,
                pageCustom: null,
                pageAlt: null
            },
            validationExceptions = [],
            watermarkImage = '<div style="background: url(https://1.www.s81c.com/common/v18/i/surveywatermark.png) no-repeat scroll 0px 0px transparent; height: 136px; width: 135px; z-index: 9999; top:0px; position: absolute;">&nbsp;</div>',
            url_whitelist_path = "//edge.webmaster.ibm.com/Survey/js/ccf-intercept-whitelist.js",
            translation_texts = null,
            currentUrlFlag = true,
            currentUrl = "",
            defaultSetiings = [];
            tmpCurrentUrl = ""

        // This function will be called when the survey loads
        surveyUtilFn.autoInit = function () {

            //  var jsElm = document.createElement("script");
            //  jsElm.type = "application/javascript";
            //  jsElm.src = "js/trustarc.js";
            //  document.body.appendChild(jsElm);
            globalAjaxSetting();

            // In this function we are calling the json data for Dev and Proud
            function globalAjaxSetting() {

                environmente = $.cookie("__forcev18env");

                temp = {
                    ajaxType: "script",
                    ajaxUrl: "https://tags.tiqcdn.com/dle/ibm/web/d_medallia_survey_configurations.js?callback=?",
                    ajaxTime: 5000,
                    name: "prod"
                }


                if (typeof environmente !== "undefined") {
                    temp.ajaxType = "json";
                   // Dev Link  
                   //temp.ajaxUrl="https://single-survey-system-dev.mybluemix.net/callbackmergedata";
                   temp.name = "preview";
                   
                   // Prod Link
                   temp.ajaxUrl = "https://single-survey-system-prod.mybluemix.net/callbackmergedata";
                    
                }

                $.ajax({
                    dataType: temp.ajaxType,
                    url: temp.ajaxUrl,
                    timeout: temp.ajaxTime,
                }).done(function (data) {
                    switch (temp.name) {
                        case "prod":
                            defaultSetiings = utag.globals.dle.enrichments['d_medallia_survey_configurations'];
                            break;
                        case "preview":
                            defaultSetiings = data;
                            break;

                    }

                    setDefaultSettings();
                    enableEmbedJSandSitefeedbackButton();
                    enableSitefeedbackButtonForMktPlace();

                });

               
            }
            // In this we are checking the matches for Hieracy and fetching the matched URL by using the below editDistance function
            function similarity(s1, s2) {
                var longer = s1;
                var shorter = s2;
                if (s1.length < s2.length) {
                    longer = s2;
                    shorter = s1;
                }
                var longerLength = longer.length;
                if (longerLength == 0) {
                    return 1.0;
                }
                return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
            }

            function editDistance(s1, s2) {
                s1 = s1.toLowerCase();
                s2 = s2.toLowerCase();

                var costs = [];
                for (var i = 0; i <= s1.length; i++) {
                    var lastValue = i;
                    for (var j = 0; j <= s2.length; j++) {
                        if (i == 0)
                            costs[j] = j;
                        else {
                            if (j > 0) {
                                var newValue = costs[j - 1];
                                if (s1.charAt(i - 1) != s2.charAt(j - 1))
                                    newValue = Math.min(Math.min(newValue, lastValue),
                                        costs[j]) + 1;
                                costs[j - 1] = lastValue;
                                lastValue = newValue;
                            }
                        }
                    }
                    if (i > 0)
                        costs[s2.length] = lastValue;
                }
                return costs[s2.length];
            }

            // we are setting the DefaultSettings
            function setDefaultSettings() {
                var configToUse = null,
                    entryNumber = 0,
                    interceptXlationsTimeout,
                    waitingForInterceptXlations,
                    matched = [],
                    first = 0;

                //var regex = /\/[A-Za-z]{2}\-[A-Za-z]{2}/g;
                //var regex = /\/\/[A-Za-z]{2}\-\/[A-Za-z]{2}/g;
                //var regex = /\/([\w]{2})-([\w]{2})\//g;
                var regex = /\/([\w]{2})-([\w]{2})\//g;
                var regex1 = /\/([\w]{2})-([\w]{2})\?/g;
                tempUrl = currentUrl = window.location.href.replace(/(^\w+:|^)\/\//, '')
                
                try {
                    allGeos = currentUrlFlag === true ? defaultSetiings.defaults.enablegeos : defaultSetiings.override[currentUrl].enablegeos === undefined ? defaultSetiings.defaults.enablegeos : defaultSetiings.override[currentUrl].enablegeos;
                    allGeos = allGeos === undefined ? true : allGeos;
                } catch (e) {
                    allGeos = true;
                }
                
                // code to remove # at the end of URL 
                //if (currentUrl.substring(currentUrl.length - 1) == "#") {
                //Code to remove # in anywhere in URL  start    
                    if (currentUrl.indexOf('#') > 0 ) { 
                    currentUrl = currentUrl.split('#')[0];
                } else {
                    currentUrl = currentUrl.substring(0, currentUrl.length);
                } // code to remove # at the end of URL end

                //Getting all Override URLs 
                overrideKeys = Object.keys(defaultSetiings.override);
               
                if (typeof defaultSetiings.override[currentUrl] === "undefined") {

                    if(currentUrl.match(regex)) {
                        currentUrl = allGeos ? currentUrl.replace(regex, "/") : currentUrl;
                    }else{
                        currentUrl = allGeos ? currentUrl.replace(regex1, "/?") : currentUrl.replace('?', '/?');
                    }
                    
                    overrideKeys.forEach(function (item) {

                        var patt = new RegExp("\\*");

                        if (patt.test(item)) {
                            if(item.match(regex)) {
                                myitem = allGeos ? item.replace(regex, "/") : item;
                            }else{
                                myitem = allGeos ? item.replace(regex1, "/?") : item.replace('?','/?');
                            }
                            
                            myitem = myitem.replace(/\?/g, "\\?").replace(/\//g, "\\\/").replace(/(\/\*)|(\*)/g, ".*");
                            if(tempUrl.indexOf('&mhq=') !== -1){
                                myitem = myitem.replace('\\','\\/');
                            }
                            newPatt = new RegExp(myitem);
                            
                           /* myitem = item.replace(/\?/g, "\\?").replace(/\//g, "\\\/").replace(/(\/\*)|(\*)/g, ".*");
                            newPatt = new RegExp(myitem.replace(regex, "/"));
                            */
                           
                            if (newPatt.test(currentUrl)) {
                                matched.push(item);
                            }
                        }
                    });
                    // getting the Matched URL
                    
                    /*matched.forEach(function (overideURL) {
                    
                        second = similarity(tempUrl, overideURL) * 100;
                        console.log("Url is matched");
                        console.log("overideURL-->", second,overideURL)
                        if (first < second) {
                            first = second;
                            currentUrl = overideURL;
                        }
                    });
                    */
                   var urlMap = [];
                   tmpCurrentUrl = currentUrl;
                    matched.forEach(function (overideURL) {
                        var urlStr = overideURL.replace('/*','').split('/');
                        var cnt = 0;
                        for (var i = 0; i < urlStr.length; i++) {
                            if(currentUrl.indexOf(urlStr[i]) !== -1){
                                cnt++;
                            }
                        }

                        if(cnt >= 2 || urlStr.length == 1 || (tempUrl.indexOf('mhq=') !== -1 && overideURL.indexOf('mhq=') !== -1)){
                            second = similarity(tempUrl, overideURL) * 100;
                            console.log("Url is matched");
                            console.log("overideURL-->", second,overideURL)
                            if(tempUrl.indexOf('mhq=') !== -1 && overideURL.indexOf('mhq=') !== -1){
                                tmpCurrentUrl = overideURL;
                            }
                            urlMap.push({"url":overideURL,"per":second});
                            if (first < second) {
                                first = second;
                                currentUrl = overideURL;
                            }
                        }
                    });
                    if(tmpCurrentUrl !== currentUrl && tmpCurrentUrl.indexOf('mhq=') !== -1){
                        currentUrl = tmpCurrentUrl;
                    }

                    urlMap.sort(function(a, b) {    
                        var prodSort = "per";
                        if (+a[prodSort] < +b[prodSort]) {    
                            return -1;    
                        } else if (+a[prodSort] > +b[prodSort]) {    
                            return 1;    
                        }    
                        return 0;    
                    });
                    var maxUrlLength = 2;
                    var prevPer = 0;
                    urlMap.forEach(function(item){
                        var urlStr = item.url.replace('/*','').split('/');
                        var cnt = 0;
                        for (var i = 0; i < urlStr.length; i++) {
                            if(tempUrl.indexOf(urlStr[i]) !== -1){
                                cnt++;
                            }
                        }
                        if(cnt === urlStr.length && maxUrlLength <= urlStr.length && +prevPer <= +item['per']){
                            var tmpRegex = /\/([\w]{2})-([\w]{2})\//g;
                            if(currentUrl.match(tmpRegex)) {
                                if(item.url.match(tmpRegex)){
                                    prevPer = item['per'];
                                    maxUrlLength = urlStr.length;
                                    console.log('matching url swaping..'+currentUrl+' : '+item.url);
                                    currentUrl = item.url;
                                }
                            }else{
                                prevPer = item['per'];
                                maxUrlLength = urlStr.length;
                                console.log('matching url swaping..'+currentUrl+' : '+item.url);
                                currentUrl = item.url;
                            }
                        }
                    });
                }

                
                // currentUrlFlag was set to True and comparing the conditions
                currentUrlFlag = typeof defaultSetiings.override[currentUrl] === "undefined" ? true : false;
                defaultSetiings.defaults.survey.global_percent = currentUrlFlag == true ? defaultSetiings.defaults.percent_intercept_rate : defaultSetiings.override[currentUrl].percent_intercept_rate;
                surveyConfigs.globalDefault = globalDefaultInterceptConfig.survey.intercept;
                surveyConfigs.pageCustom = defaultSetiings.defaults.survey.intercept;
                surveyConfigs.pageAlt = defaultSetiings.defaults.survey.intercept_alternate;

                surveyConfigs.globalDefault = setGlobalDefaultEntryPercent(surveyConfigs.globalDefault);
                surveyConfigs.globalDefault = setSurveyConfigFlags(surveyConfigs.globalDefault);
                surveyConfigs.pageCustom = setSurveyConfigFlags(surveyConfigs.pageCustom) || {};
                surveyConfigs.pageAlt = setSurveyConfigFlags(surveyConfigs.pageAlt) || {};
                survey_name = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : (defaultSetiings.override[currentUrl].survey.touchpoint) ? defaultSetiings.override[currentUrl].survey.touchpoint : defaultSetiings.defaults.survey.touchpoint;

		 if(tmpCurrentUrl == currentUrl && currentUrl.indexOf('&mhq=') == -1){
                        var tmpRegex = /\/([\w]{2})-([\w]{2})\//g;
                        var tmpurltest = window.location.href+'/';
                        if(tmpurltest.replace(/(^\w+:|^)\/\//, '').match(tmpRegex)) {
                            defaultSetiings.defaults.survey.touchpoint = 'client web';
                            survey_name = 'client web';
                        }
                    }
		    
                if (surveyConfigs.pageAlt.isActive) {
                    entryNumber = defaultSetiings.defaults.survey.entry_percent;
                } else if (surveyConfigs.pageCustom.isActive) {
                    entryNumber = surveyConfigs.pageCustom.percent;
                } else {
                    entryNumber = surveyConfigs.globalDefault.percent;
                }

                if (surveyConfigs.randNum > entryNumber) {
                    surveyUtilFn.demo.entryNumber = entryNumber;
                    surveyUtilFn.demo.randNum = surveyConfigs.randNum;
                    var percentValue, surveyIDTemp, triggerDelayTemp, referrerURLValue,allGeos;
                    // we are fetching percent_intercept_rate, triggerDelayTemp,preventCount from the Json
                    percentValue = currentUrlFlag === true ? defaultSetiings.defaults.percent_intercept_rate : defaultSetiings.override[currentUrl].percent_intercept_rate === undefined ? defaultSetiings.defaults.percent_intercept_rate : defaultSetiings.override[currentUrl].percent_intercept_rate;
                    //FOr UT30 URLs adding extra 30 % intercept rate.. As per req no need this condition disblaing on April 23rd 2021
                    /*try {
                        if(window.digitalData.page.category.ibm.ut30){
                            console.log('Current intercept rate is: ',percentValue);
                            percentValue = parseInt(percentValue) + 30;
                            console.log('Added extra 30 % intercept for UTL 30 URLs')
                            console.log('After adding 30 % extra intercept rate is: ',percentValue);
                        }
                    } catch (e) {
                        console.log('Getting error while setting custom intercept rate for UTL 30 URLs')
                     }
                    */
                    triggerDelayTemp = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;

                    preventCount = currentUrlFlag === true ? defaultSetiings.defaults.preventCount : defaultSetiings.override[currentUrl].preventCount === undefined ? defaultSetiings.defaults.preventCount : defaultSetiings.override[currentUrl].preventCount;
                     
                    surveyIDTemp = currentUrlFlag === true ? "Not Available ": (defaultSetiings.override[currentUrl].survey !== undefined && defaultSetiings.override[currentUrl].survey.id !== undefined) ? defaultSetiings.override[currentUrl].survey.id : "Not Available";

                    referrerURLValue = currentUrlFlag === true ? "Not Available" : defaultSetiings.override[currentUrl].referrerURL === undefined ? "Not Available":defaultSetiings.override[currentUrl].referrerURL;

                   
                    custom.ibm.debug.add("log","Survey: Medallia "+survey_name+" is enabled on this page.");
                    custom.ibm.debug.add("log","Intercept rate set to "+percentValue+"%.");
                    custom.ibm.debug.add("log","Current visitor percentage is "+Math.round(surveyConfigs.randNum)+"% - survey not presented.");
                    custom.ibm.debug.add("log","Delay on page is "+triggerDelayTemp+" seconds.");
                    custom.ibm.debug.add("log","Minimum number of page views is "+digitalData.page.session.engagement.scoreVisit+".");
                    custom.ibm.debug.add("log","Referral url is "+referrerURLValue+".");
                    //custom.ibm.debug.add("log", "Survey was all ready, but did not pass the " + entryNumber + "% barrier, Current percent is " + Math.round(surveyConfigs.randNum) + "% , Intercept rate is " + percentValue + " % , SurveyID is " + surveyIDTemp + " ,  Trigger delay is " + triggerDelayTemp + " , PreventCount  is " + preventCount + " , ReferralURL  is " + referrerURLValue + "");

                    return;
                }
                configToUse = setConfigToUse(surveyConfigs);

                if (configToUse) {
                    custom.ibm.debug.add("log", "Using survey config: " + survey_name);
                    var metricData = $.extend(true, {}, defaults, defaultSetiings.defaults.survey.intercept, (configToUse || {}));

                    if (metricData.survey.id !== "web-exp" || !surveyConfigs.globalDefault.percent || (surveyConfigs.globalDefault.percent && surveyConfigs.globalDefault.percent !== 5)) {
                        var evtData = {
                            ibmEV: "Survery survey tracker",
                            ibmEvAction: metricData.survey.type,
                            ibmEvGroup: metricData.survey.id,
                            ibmEvModule: metricData.percent, // % traffic setting of the specific survey config used.
                            ibmEvSection: entryNumber, // special # you first have to meet to get in.
                            ibmEvLinkTitle: surveyConfigs.globalDefault.percent, // global default setting.
                            ibmEvLinkTarget: metricData.presentDelay
                        };
                        window.ibmStats.event(evtData);
                    }


                    // we support 13 languages
                    //Here we are checking the 13 languages for given countries and fetching the data for particular language
                    var langcountry = '';
                    var lngcode = '';
                    try{
                        langcountry = IBMCore.common.meta.page.pageInfo.ibm.lc + IBMCore.common.meta.page.pageInfo.ibm.cc;
                        lngcode = IBMCore.common.meta.page.pageInfo.ibm.lc;
                    }catch (e){
                        langcountry = 'enus';
                        lngcode = 'en';
                    }
                    var langMap = [{"en":"enus"},{"de":"dede"},{"es":"esco"},{"fr":"frfr"},{"it":"itit"},{"pt":"ptbr"},{"ko":"kokr"},{"ja":"jajp"},{"ru":"ruru"},{"zh":"zhcn"},{"tr":"trtr"}];
                    if (langcountry === "eses" || langcountry === "zhtw" || langcountry === "frca") {
                        langcountry = langcountry;
                    }else{
                        langcountry = "enus";
                    langMap.forEach(function(item){
                        if(item[lngcode] !== undefined){
                            langcountry = item[lngcode];
                            return langcountry;
                        }
                    });
                    }
                    
                    /*if (langcountry === "enus" || langcountry === "trtr" || langcountry === "dede" || langcountry === "frca" || langcountry === "frfr" || langcountry === "itit" || langcountry === "ptbr" || langcountry === "kokr" || langcountry === "jajp" || langcountry === "eses" || langcountry === "ruru" || langcountry === "esco" || langcountry === "zhcn" || langcountry === "zhtw") {
                        langcountry = langcountry;
                    } 
                    // If there is any other language apart from 13 language then showing as "enus" as default
                    else {
                        langcountry = "enus";
                    }*/


                    // Set invitation to use translation text for locale set above.
                    //configToUse.invitation = translation_texts.invitation;

                    // To Reduce width on medium/small screens
                    if (window.innerWidth < 900) {
                        configToUse.survey.width = (window.innerWidth - 80);
                    }

                    $(function () {
                        init(configToUse);
                    });
                }


            }
            // On page load This function will be trigerred first
            function init(config) {
                settings = $.extend(true, defaults, defaultSetiings.defaults.survey.intercept, (config || {}));
                settings.survey.type = currentUrlFlag === true ? defaultSetiings.defaults.survey.type.toLowerCase() : typeof defaultSetiings.override[currentUrl].survey == "undefined" ? defaultSetiings.defaults.survey.type.toLowerCase() : typeof defaultSetiings.override[currentUrl].survey.type === "undefined" ? defaultSetiings.defaults.survey.type.toLowerCase() : (defaultSetiings.override[currentUrl].survey.type) ? defaultSetiings.override[currentUrl].survey.type.toLowerCase() : defaultSetiings.defaults.survey.type;
                if (settings.survey.type.toLowerCase() == 'medallia') {
                    settings.survey.id = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : (defaultSetiings.override[currentUrl].survey.touchpoint) ? defaultSetiings.override[currentUrl].survey.touchpoint : defaultSetiings.defaults.survey.touchpoint;
                }
                else {
                    settings.survey.id = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey.id === "undefined" ? defaultSetiings.defaults.survey.touchpoint : defaultSetiings.override[currentUrl].survey.id;
                }
                // settings.survey.id = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey.id === "undefined" ? defaultSetiings.defaults.survey.touchpoint: defaultSetiings.override[currentUrl].survey.id; //? defaultSetiings.override[currentUrl].survey.touchpoint : defaultSetiings.defaults.survey.touchpoint;

                settings.cookie_name = "ccf-" + settings.survey.type + "-" + settings.survey.id;
                settings.cookie_name_redhat = "ccf-redhat" + settings.survey.type + "-" + settings.survey.id;
                settings.start = currentUrlFlag === true ? settings.start : typeof defaultSetiings.override[currentUrl].start_date === "undefined" ? settings.start : defaultSetiings.override[currentUrl].start_date;
                settings.stop = currentUrlFlag === true ? settings.stop : typeof defaultSetiings.override[currentUrl].stop === "undefined" ? settings.stop : defaultSetiings.override[currentUrl].stop;

                trigger_delay_value = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : (defaultSetiings.override[currentUrl].trigger_delay) ? defaultSetiings.override[currentUrl].trigger_delay : defaultSetiings.defaults.trigger_delay;
                settings.presentDelay = trigger_delay_value * 1000;

                isEnableLink = currentUrlFlag === true ? defaultSetiings.defaults.enablelink : (defaultSetiings.override[currentUrl].enablelink) ? defaultSetiings.override[currentUrl].enablelink : defaultSetiings.defaults.enablelink;
                // setting prevent Count for Every URL
                settings.preventCount = currentUrlFlag === true ? defaultSetiings.defaults.preventCount : defaultSetiings.override[currentUrl].preventCount === "undefined" ? defaultSetiings.defaults.preventCount : defaultSetiings.override[currentUrl].preventCount;
                defineValidationExceptions();
                //getWhitelistExceptionData();

                myEvents.subscribe('exceptionDataLoaded', "surveyccfintercept", function () {


                     // Before showing the popup we are showing the data in the console
                     var tmpArray = ["ibm.com/support/","www.ibm.com/support/knowledgecenter/","ibm.com/support/fixedcentral","ibm.com/docs/"];
                     var isCustomSurevey = true;
                     for (var index = 0; index < tmpArray.length; index++) {
                         var obj = tmpArray[index];
                         if(window.location.href.indexOf(obj) != -1){
                             isCustomSurevey = makeSurveyURL();
                         } 
                     }

                    // Before showing the popup we are showing the data in the console
                    if (validateSettings() && isCustomSurevey) {

                        custom.ibm.debug.add("log", "Survey validations passed");
                        start_date_log = new Date(settings.start);
                        end_date_log = new Date(settings.stop);
                        
                        //This validation is for myIBM only
                       if (digitalData && digitalData.page && digitalData.page.pageInfo && digitalData.page.pageInfo.medallia && digitalData.page.pageInfo.medallia.customEventCheck ){
                            if(digitalData.page.pageInfo.medallia.customEventCheck == true) {
                                if (digitalData.page.pageInfo.medallia.cust_settings && 
                                    digitalData.page.pageInfo.medallia.cust_settings.triggerFired == true) {
                                    if (digitalData.page.pageInfo.medallia.cust_settings.enabled == true) {
                                        custom.ibm.debug.add("log", "Launching survey with delay " + trigger_delay_value + " seconds");
                                        custom.ibm.debug.add("log", "Start Date " + start_date_log);
                                        custom.ibm.debug.add("log", "End Date " + end_date_log);
                                        custom.ibm.debug.add("log", "PreventCount " + settings.preventCount);
                                        
                                        invitation = checkTouchPoints(settings.survey.type.toLowerCase(),settings.survey.id.toLowerCase(),isEnableLink);
                                        //bindInvitationEvents();
                                    }
                                }
                                else {
                                    //Trigger has not fired yet.
                                    jQuery(document).on("custom_mediallia_check_ready", function() {
                                    if(digitalData.page.pageInfo.medallia.cust_settings.enabled == true)
                                    custom.ibm.debug.add("log", "Launching survey with delay " + trigger_delay_value + " seconds");
                                    custom.ibm.debug.add("log", "Start Date " + start_date_log);
                                    custom.ibm.debug.add("log", "End Date " + end_date_log);
                                    custom.ibm.debug.add("log", "PreventCount " + settings.preventCount);
                                        
                                        invitation = checkTouchPoints(settings.survey.type.toLowerCase(),settings.survey.id.toLowerCase(),isEnableLink);
                                        //bindInvitationEvents();
                                    });
                                }
                            }
                        }else{
                            custom.ibm.debug.add("log", "Launching survey with delay " + trigger_delay_value + " seconds");
                            custom.ibm.debug.add("log", "Start Date " + start_date_log);
                            custom.ibm.debug.add("log", "End Date " + end_date_log);
                            custom.ibm.debug.add("log", "preventCount " + settings.preventCount);

                            
                            invitation = checkTouchPoints(settings.survey.type.toLowerCase(),settings.survey.id.toLowerCase(), isEnableLink);
                            //bindInvitationEvents();
                        }    
                    }
				// If not exit survey 
				if (settings.interceptDisp !== "pageExit" && settings.interceptDisp !== "siteExit") {
					// Making delay for showing invitation
					// Default is 3 seconds
					setTimeout(function() {
						// If there's no other overlay currently showing, show it.
                        // This is safety so that we don't open an overlay on top of another one some other JS is showing.
                        if(invitation == 'fromonly'){
                            console.log('');
                        }//else if (invitation != null && !IBMCore.common.widget.overlay.currentShowingOverlay() && !$('#cm-proactive-popup').is(':visible')) {
                        else if (invitation != null  && !$('#cm-proactive-popup').is(':visible')) {
                            invitation.runNow();
                            custom.ibm.surveryOverlay.showOverly();
                        }
                        // Displaying the message in console before showing the initial popup
						else {
                            window.console.log("v18: Intercept survey invitation did not show because another overlay was currently showing.");
                            var intervalCount = 0;
                            var myInterval = setInterval(function() {
                                intervalCount = intervalCount+1;
                                if (invitation != null && (!IBMCore.common.widget.overlay.currentShowingOverlay() && !$('#cm-proactive-popup').is(':visible') || intervalCount == 2)) {
                                    invitation.runNow();
                                    custom.ibm.surveryOverlay.showOverly();
                                    clearInterval(myInterval);
                                }
                            }, settings.presentDelay);
						}
					}, settings.presentDelay);
					// If exit survey
				} else {
					exitPageOplabTrigger();
				}
                        // setTimeout(function () {

                        //     invitation.runNow();
                        //     custom.ibm.surveryOverlay.showOverly();
                        // }, settings.presentDelay);
                    //}

                });
                myEvents.runNow();
            }

            function setGlobalDefaultEntryPercent(config) {
                var pageDefinedGlobPercent = defaultSetiings.defaults.survey.global_percent;

                if (pageDefinedGlobPercent >= 0) {
                    config.percent = Number(pageDefinedGlobPercent);
                }

                return config;
            }

            function setSurveyConfigFlags(config) {

                if (config) {
                    var cookieName = config.cookie_name = "ccf-" + config.survey.type + ":" + config.survey.id;

                    config.isActive = (isSurveyStarted(config.start) && !isSurveyExpired(config.stop) && config.enabled && config.percent !== 0);
                    config.seen = (typeof $.cookie(cookieName) !== "undefined");

                }

                return config;
            }

            // survey Start Date 
            function isSurveyStarted(startDate) {
                var pastStartDate = false,
                    now = new Date(),
                    start = new Date(startDate);

                if (now > start) {
                    pastStartDate = true;
                }

                return pastStartDate;
            }

          // survey End Date 
            function isSurveyExpired(endDate) {
                var isExpired = false,
                    now = new Date(),
                    end = new Date(endDate);
                if (now > end) {
                    isExpired = true;
                }

                return isExpired;
            }


            function setConfigToUse(configs) {
                var globDef = configs.globalDefault,
                    pageCustom = configs.pageCustom,
                    alt = configs.pageAlt,
                    useThisConfig;

                if (!alt.isActive && !pageCustom.isActive) {

                    if (!globDef.seen) {
                        useThisConfig = globDef;
                        return useThisConfig;
                    }
                    return useThisConfig;
                }


                if (!alt.isActive && pageCustom.isActive && !pageCustom.seen) {

                    useThisConfig = pageCustom;
                } else if (alt.isActive) {

                    if (alt.seen) {

                        if (pageCustom.isActive && !pageCustom.seen) {
                            useThisConfig = pageCustom;
                        } else if (!pageCustom.isActive && !globDef.seen) {
                            useThisConfig = globDef;
                        }
                    } else {

                        if (surveyConfigs.randNum < alt.percent || (pageCustom.isActive && pageCustom.seen) || (!pageCustom.isActive && globDef.seen)) {
                            useThisConfig = alt;
                        } else if (pageCustom.isActive && !pageCustom.seen) {
                            useThisConfig = pageCustom;
                        } else if (!pageCustom.isActive && !globDef.seen) {
                            useThisConfig = globDef;
                        }
                    }

                }

                return useThisConfig;
            }

            function defineValidationExceptions(exception_for) {

                validationExceptions = [];

                if (exception_for === "directFeedback") {
                    validationExceptions.push('direct_feedback');
                }

                if (settings.survey.type === "medallia") {

                    validationExceptions.push('end_date');
                    validationExceptions.push('no_60_day_limit');
                }
            }


            function getWhitelistExceptionData() {
                settings.exception = {};
                settings.exception.data = custom.ibm.whitelist();

                myEvents.publish('exceptionDataLoaded');


                //$.getScript(url_whitelist_path + "?callback=callback_whitelist");
            }
            // overlay Events on click 
            function bindInvitationEvents() {
                $overlay = $("#survery-dialog");
                $('[data-action]', $overlay).on('click', function () {
                    var $self = $(this),
                        action = $self.data('action'),
                        target;
                    switch (action) {
                        case "change-slide":
                            invitationStatus = "change-slide";
                            target = $self.data("slide-target");
                            $("div.dialog-inner", $overlay).css("display", "none");
                            $("div.dialog-inner[data-slide='" + target + "']", $overlay).css("display", "block");


                            break;

                        case "hideme":
                            invitationStatus = "opt-out";
                            custom.ibm.surveryOverlay.closeDialog()
                            break;
                        case "showme":
                            invitationStatus = "opt-in";

                            event = {
                                "ibmEV": "ol survey",
                                "ibmEvGroup": settings.survey.type,
                                "ibmEvModule": settings.survey.id,
                                "ibmEvAction": "intercept yes clicked"
                            };
                            window.ibmStats.event(event);
                            // metrics need to complite 

                            custom.ibm.surveryOverlay.closeDialog()


                            // Add special param so we know this survey was from an intercept and not
                            
                            if(settings.survey.url != undefined && settings.survey.url.indexOf('?') == -1){
                                settings.survey.url += "?inter=y";
                            }else{
                                settings.survey.url += "&inter=y";
                            }
                            survey = createSurvey();
                            custom.ibm.surveryOverlay.showOverly();
                            $("#customSuveryClose").remove();
                            setTimeout(function () {
                                $('#survery-dialog').css({ top: "40%", left: "50%", });
                            }, 2000);
                            

                            //KAMPYLE_ONSITE_SDK.showForm(11719);
                    }
                })

            }

            function checkTouchPoints(surveryType, touchPoint, isEnableLink){

                var invitation = null;
                console.log('survey type:'+surveryType+' # touchPoint:'+touchPoint);
                if(surveryType == 'medallia'){
                    switch(touchPoint){
                        case 'client web':
                                invitation = 'fromonly';
                                console.log('client web.... popup');
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                document.head.appendChild(fileref);
                               var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                               triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                                setTimeout(function() {
                                    kampyleEvents(261, touchPoint);
                                    console.log('Client Web.... popup, set-time');
                                    KAMPYLE_ONSITE_SDK.showForm(261);
                                    console.log("Client Web form displayed...");
                                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                    expires = new Date() + 30 * 24 * 3600;
                                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                     
                                    $.cookie(settings.cookie_name, cookie_value, {
                                    path: "/",
                                    domain: ".ibm.com",
                                    expires: allowedTtl
                                    });
                                },(1000 * triggerDelaytime));
                        break;
                        case 'web support nps':
                                invitation = 'fromonly';
                                console.log('web support nps.... popup');
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                document.head.appendChild(fileref);
                               var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                               triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                                setTimeout(function() {
                                    kampyleEvents(831, touchPoint);
                                    console.log('web support nps.... popup, set-time');
                                    KAMPYLE_ONSITE_SDK.showForm(831);
                                    console.log("web support nps form displayed...");
                                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                    expires = new Date() + 30 * 24 * 3600;
                                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                     
                                    $.cookie(settings.cookie_name, cookie_value, {
                                    path: "/",
                                    domain: ".ibm.com",
                                    expires: allowedTtl
                                    });
                                    $.cookie(settings.cookie_name_redhat, cookie_value, {
                                        path: "/",
                                        domain: ".redhat.com",
                                        expires: allowedTtl
                                        });
                                },(1000 * triggerDelaytime));
                        break;
                        case 'redhat marketplace':
                                invitation = 'fromonly';
                                console.log('Redhat Marketplace.... popup');
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                document.head.appendChild(fileref);
                               var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                               triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                                setTimeout(function() {
                                    kampyleEvents(706, touchPoint);
                                    console.log('Redhat Marketplace.... popup, set-time');
                                    KAMPYLE_ONSITE_SDK.showForm(709);
                                    console.log("Redhat Marketplace form displayed...");
                                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                    expires = new Date() + 30 * 24 * 3600;
                                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                     
                                    $.cookie(settings.cookie_name, cookie_value, {
                                    path: "/",
                                    domain: ".ibm.com",
                                    expires: allowedTtl
                                    });
                                    $.cookie(settings.cookie_name_redhat, cookie_value, {
                                        path: "/",
                                        domain: ".redhat.com",
                                        expires: allowedTtl
                                        });
                                },(1000 * triggerDelaytime));
                        break;
                        case 'search mot':
                                invitation = 'fromonly';
                                console.log('search mot.... popup');
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                document.head.appendChild(fileref);
                                var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                                triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                                setTimeout(function() {
                                    kampyleEvents(259, touchPoint);
                                    console.log('Search MOT.... popup, set-time');
                                    KAMPYLE_ONSITE_SDK.showForm(259);
                                    console.log("Search MOT form displayed...");
                                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                    expires = new Date() + 30 * 24 * 3600;
                                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                     $.cookie(settings.cookie_name, cookie_value, {
                                    path: "/",
                                    domain: ".ibm.com",
                                    expires: allowedTtl
                                    });
                                },(1000 * triggerDelaytime));
                        break;
                        case 'web-purchase':
                            invitation = 'fromonly';
                            console.log('Web-Purchase.... popup');
                            var fileref=document.createElement('script')
                            fileref.setAttribute("type","text/javascript")
                            fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                            fileref.async = true;
                            document.head.appendChild(fileref);
                            var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                            triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                            setTimeout(function() {
                                kampyleEvents(271, touchPoint);
                                console.log('Web-Purchase.... popup, set-time');
                                KAMPYLE_ONSITE_SDK.showForm(271);
                                console.log("Web-Purchase form displayed...");
                                var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                expires = new Date() + 30 * 24 * 3600;
                                 // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                 allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                 
                                 $.cookie(settings.cookie_name, cookie_value, {
                                path: "/",
                                domain: ".ibm.com",
                                expires: allowedTtl
                                });
                            },(1000 * triggerDelaytime));
                    break;
                    case 'non client nps branded':
                        invitation = 'fromonly';
                        console.log('non client nps .... popup');
                        var fileref=document.createElement('script')
                        fileref.setAttribute("type","text/javascript")
                        fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                        fileref.async = true;
                        document.head.appendChild(fileref);
                        var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                        triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                        setTimeout(function() {
                            kampyleEvents(297,touchPoint);
                            console.log('non client nps.... popup, set-time');
                            KAMPYLE_ONSITE_SDK.showForm(297);
                            console.log("non client nps form displayed...");
                            var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                            expires = new Date() + 30 * 24 * 3600;
                             // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                             allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                             document.cookie = settings.cookie_name+"="+cookie_value+";path=/;domain=.ibm.com;expires="+allowedTtl;

                        },(1000 * triggerDelaytime));
                break;
                case 'non client nps non branded':
                    invitation = 'fromonly';
                    console.log('non client nps .... popup');
                    var fileref=document.createElement('script')
                    fileref.setAttribute("type","text/javascript")
                    fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                    fileref.async = true;
                    document.head.appendChild(fileref);
                    var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                    triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                    setTimeout(function() {
                        kampyleEvents(324, touchPoint);
                        console.log('non client nps.... popup, set-time');
                        KAMPYLE_ONSITE_SDK.showForm(324);
                        console.log("non client nps form displayed...");
                        var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                        expires = new Date() + 30 * 24 * 3600;
                         // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                         allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                         document.cookie = settings.cookie_name+"="+cookie_value+";path=/;domain=.ibm.com;expires="+allowedTtl;

                    },(1000 * triggerDelaytime));
            break;
            case 'digital purchase':
                invitation = 'fromonly';
                console.log('digital purchase .... popup');
                var fileref=document.createElement('script')
                fileref.setAttribute("type","text/javascript")
                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                fileref.async = true;
                document.head.appendChild(fileref);
                var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                setTimeout(function() {
                    kampyleEvents(271, touchPoint);
                    console.log('digital purchase.... popup, set-time');
                    KAMPYLE_ONSITE_SDK.showForm(271);
                    console.log("digital purchase form displayed...");
                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                    expires = new Date() + 30 * 24 * 3600;
                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                     document.cookie = settings.cookie_name+"="+cookie_value+";path=/;domain=.ibm.com;expires="+allowedTtl;
                },(1000 * triggerDelaytime));
            break;

                        default :
                            console.log('no jquery.....',window.nonJquery);
                            console.log('deaflut switch case......');
                            if(window.nonJquery){
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript");
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                document.head.appendChild(fileref);
                                var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                                triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                                setTimeout(function() {
                                    //kampyleEvents();
                                    console.log('No Jquery popup');
                                    //KAMPYLE_ONSITE_SDK.showForm(12101);
                                },(1000 * triggerDelaytime));
                                if(isEnableLink){
                                    preSurveyCall();
                                   invitation = createSurvey();
                               }else{
                                invitation = createInvitation();
                            }
                   bindInvitationEvents();
                            }else{
                                if(isEnableLink){
                                    preSurveyCall();
                                    invitation = createSurvey();
                                }else{
                                    invitation = createInvitation();
                                }
                                bindInvitationEvents();
                            }
                            
                        break;
                    }
                }else {
                    console.log('no jquery.....',window.nonJquery);
                    console.log('non-medallia deaflut switch case......');
                    if(window.nonJquery){
                        var fileref=document.createElement('script')
                        fileref.setAttribute("type","text/javascript")
                        fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js"); 
                        fileref.async = true;
                        document.head.appendChild(fileref);
                        var triggerDelaytime = currentUrlFlag === true ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay === undefined ? defaultSetiings.defaults.trigger_delay : defaultSetiings.override[currentUrl].trigger_delay;
                        triggerDelaytime = isNaN(triggerDelaytime) ? 5 : triggerDelaytime;
                        setTimeout(function() {
                            kampyleEvents(261, touchPoint);
                            console.log('No jquery popup');
                            KAMPYLE_ONSITE_SDK.showForm(261);
                            console.log("Client Web form displayed...");
                                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                                    expires = new Date() + 30 * 24 * 3600;
                                     // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                                     allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                                     $.cookie(settings.cookie_name, cookie_value, {
                                    path: "/",
                                    domain: ".ibm.com",
                                    expires: allowedTtl
                                    });
                        },(1000 * triggerDelaytime));
                    }else{
                        if(isEnableLink){
                            preSurveyCall();
                            invitation = createSurvey();
                        }else{
                            invitation = createInvitation();
                        }
                        bindInvitationEvents();
                    }
                }
                return invitation;
            }

            // metadata to Medallia for GBT/UT/etc
            function validateSettings() {

                if (window.location.host.indexOf(".ibm.com") == -1 && window.location.host.indexOf(".redhat.com") == -1) {
                    window.console.warn("Survey: Intercept surveys are only enabled for *.ibm.com domains and *.redhat.com domains only.");
                    return false;
                }
                
                if (!settings.survey) {
                    window.console.warn("Survey: Intercept survey is not defined.");
                    return false;
                }
                
               
                var isIBMerValue = currentUrlFlag === true ? defaultSetiings.defaults.isibmer : defaultSetiings.override[currentUrl].isibmer === undefined ? defaultSetiings.defaults.isibmer : defaultSetiings.override[currentUrl].isibmer;
                //if (typeof window.digitalData.user.segment.isIBMer === undefined || ( window.digitalData.user.segment.isIBMer == 1 || isIBMerValue )) {  
                if (typeof window.digitalData.user.segment.isIBMer == undefined || (isIBMerValue && window.digitalData.user.segment.isIBMer == 1)) {
                    window.console.warn("Survey : isIBMer value is : ", window.digitalData.user.segment.isIBMer);
                    window.console.warn("Survey : isIBMer value  in SSA is : ", isIBMerValue);
                    return false;
                }else{
                    window.console.warn("Survey: isIBMer value is: ", window.digitalData.user.segment.isIBMer); 
                    window.console.warn("Survey: isIBMer value in SSA is : ", isIBMerValue);
                    
                }
                if(typeof(ibmCommonErrorpagesStatus) != "undefined" && ibmCommonErrorpagesStatus == 404)
                { 
                    console.log("This is Error Page..., We are not going to display the Survey!!")
                    return  false;
                }
                
                if (!settings.survey.type) {
                    window.console.warn("Survey: Intercept survey type is not defined.");
                    return false;
                }

                if (!settings.survey.id) {
                    window.console.warn("Survey: Intercept survey id is not defined.");
                    return false;
                }

                if (!settings.invitation) {
                    window.console.warn("Survey: Intercept survey invitation is not defined.");
                    return false;
                }

                if (isNaN(settings.percent)) {
                    window.console.warn("Survey: Intercept survey percentage is invalid.");
                    return false;
                }

                if (validationExceptions.indexOf("direct_feedback") < 0) {
                    if (!settings.percent) {
                        window.console.warn("Survey: Intercept survey percent is not defined.");
                        return false;
                    }


                    var has_local_barrier = (typeof $.cookie(settings.cookie_name) !== "undefined");
                    // has_local_barrier =false;
                    if (has_local_barrier && invitationStatus === "") {
                        custom.ibm.debug.add("log","Survey: Medallia survey previously displayed on this page for this visitor.");
                        //custom.ibm.debug.add("log", "This survey (" + settings.survey.type + ":" + settings.survey.id + ") has already been seen.");
                        return false;
                    }

                    var has_local_barrier_redhat = (typeof $.cookie(settings.cookie_name_redhat) !== "undefined");
                    // has_local_barrier =false;
                    if (has_local_barrier_redhat && invitationStatus === "") {
                        custom.ibm.debug.add("log","Survey: Medallia survey previously displayed on this page for this visitor.");
                        //custom.ibm.debug.add("log", "This survey (" + settings.survey.type + ":" + settings.survey.id + ") has already been seen.");
                        return false;
                    }
                    

                    if (!checkPreventCount()) {
                        //console.log("xyz");
                        return false;
                    }


                    if ((typeof (settings.referrerURL) !== "undefined" && settings.referrerURL.length > 0) && !checkReferrerStatus()) {
                        window.console.warn("Survey: Intercept survey referrer setting does not match referrer URL.");
                        return false;
                    }

                    if ((typeof (settings.excludeURL) !== "undefined" && settings.excludeURL.length > 0) && checkExcludeURLStatus()) {
                        return false;
                    }


                    if (!checkExitConfigurations()) {
                        return false;
                    }



                    if (!checkTimeFrames()) {
                        return false;
                    }


                    if (settings.survey.type.toLowerCase() === "custom-other") {
                        //if (checkCustomBExceptionStatus() === false) {
                          //  return false;
                       // }
                    }

                    var sessionEvetns = currentUrlFlag === true ? defaultSetiings.defaults.evets_within_session : (defaultSetiings.override[currentUrl].evets_within_session === undefined || defaultSetiings.override[currentUrl].evets_within_session === '') ? defaultSetiings.defaults.evets_within_session : defaultSetiings.override[currentUrl].evets_within_session;
                    if (sessionEvetns === undefined || sessionEvetns === '' || digitalData.page.session.engagement.events >= sessionEvetns) {
                        window.console.warn("Survey : Events counts in session : "+ digitalData.page.session.engagement.events);
                        window.console.warn("Survey : Events counts in session : from SSA "+sessionEvetns);
                    }else{
                        window.console.warn("Survey : Events counts in session: "+ digitalData.page.session.engagement.events);
                        window.console.warn("Survey : Events counts in session: from SSA "+sessionEvetns);
                        return false;
                    }
    
                    var pageEvetns = currentUrlFlag === true ? defaultSetiings.defaults.evets_within_page : (defaultSetiings.override[currentUrl].evets_within_page === undefined || defaultSetiings.override[currentUrl].evets_within_page === '') ? defaultSetiings.defaults.evets_within_page : defaultSetiings.override[currentUrl].evets_within_page;
                    if (pageEvetns === undefined || pageEvetns === '' || digitalData.page.session.engagement.eventsPage >= pageEvetns ) {
                        window.console.warn("Survey : Events counts in page : "+ digitalData.page.session.engagement.eventsPage);
                        window.console.warn("Survey : Events counts in page : from SSA "+pageEvetns);
                    }else{
                        window.console.warn("Survey : Events counts in page  : "+ digitalData.page.session.engagement.eventsPage);
                        window.console.warn("Survey : Events counts in page : from SSA "+pageEvetns);
                        return false;
                    }
    
                    var totalPageViews = currentUrlFlag === true ? defaultSetiings.defaults.number_of_pageviews : (defaultSetiings.override[currentUrl].number_of_pageviews === undefined || defaultSetiings.override[currentUrl].number_of_pageviews === '') ? defaultSetiings.defaults.number_of_pageviews : defaultSetiings.override[currentUrl].number_of_pageviews;
                    if (totalPageViews === undefined || totalPageViews === '' || digitalData.page.session.engagement.pages >= totalPageViews) {
                        window.console.warn("Survey : Events counts in total views : "+ digitalData.page.session.engagement.pages);
                        window.console.warn("Survey : Events counts in total views : from SSA "+totalPageViews);
                    }else{
                        window.console.warn("Survey : Events counts in total views : "+ digitalData.page.session.engagement.pages);
                        window.console.warn("Survey : Events counts in total views : from SSA "+totalPageViews);
                        return false;
                    }

                }
                return true;
            }

            function checkPreventCount() {
                var diffDays,
                    expires,
                    preventCount,
                    prevent_cookie_name,
                    prevent_cookie_value,
                    allowedTtl = 0;

                // prevent the intercept presentation until user has visited number of times. Item no: 7
                if (typeof settings.preventCount !== "undefined") {
                    // validating prevent value
                    if (!(!isNaN(parseFloat(settings.preventCount)) && isFinite(settings.preventCount))) {
                        window.console.warn("Survey: Intercept survey prevent count is invalid.");
                        return false;
                    }
                    preventCount = settings.preventCount;
                    prevent_cookie_name = "ccf-prevent-intercept-" + settings.survey.type + ":" + settings.survey.id;

                    if (typeof $.cookie(prevent_cookie_name) === "undefined") {
                        diffDays = Math.round(Math.abs((new Date().getTime() - new Date(settings.stop).getTime()) / (24 * 60 * 60 * 1000)));
                        expires = new Date() + diffDays * 24 * 3600;
                        // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;;
                        allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);


                        $.cookie(prevent_cookie_name, 1, {
                            path: "/",
                            domain: ".ibm.com",
                            expires: allowedTtl
                        });
                    }

                    prevent_cookie_value = $.cookie(prevent_cookie_name);

                    if (prevent_cookie_value < preventCount) {
                        prevent_cookie_value++;
                        diffDays = Math.round(Math.abs((new Date().getTime() - new Date(settings.stop).getTime()) / (24 * 60 * 60 * 1000)));
                        expires = new Date() + diffDays * 24 * 3600;

                        // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;;
                        allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);

                        $.cookie(prevent_cookie_name, prevent_cookie_value, {
                            path: "/",
                            domain: ".ibm.com",
                            expires: allowedTtl
                        });
                        return false;
                    }
                }
                return true;
            }

            function checkExitConfigurations() {

                if (settings.interceptDisp === "pageExit" && settings.surveyDisp !== "immediate") {
                    settings.surveyDisp = "immediate";
                    window.console.warn("Survey: Intercept survey display should be immediate or page exit");
                }
                if (settings.interceptDisp === "siteExit" && settings.surveyDisp !== "immediate") {
                    settings.surveyDisp = "immediate";
                    window.console.warn("Survey: Intercept survey display should be immediate");
                }
                if (settings.interceptDisp === "siteExit" || settings.surveyDisp === "siteExit") {
                    if (typeof (settings.exitURL) === "undefined" || settings.exitURL.length <= 0) {
                        window.console.warn("Survey: Intercept survey exit URL is empty.");
                        return false;
                    }


                }
                return true;
            }

            function checkTimeFrames() {

                var start = new Date(settings.start),
                    end = new Date(settings.stop),
                    delta = (end - start) / (1000 * 60 * 60 * 24),
                    min_delta = 10,
                    max_delta = 60;

                if (isNaN(start.getTime())) {
                    window.console.error("Survey: Invalid survey start date.");
                    return false;
                }

                if (isNaN(end.getTime()) && validationExceptions.indexOf('end_date') < 0) {
                    window.console.error("Survey: Invalid survey stop date.");
                    return false;
                }

                // overwrite the end date if survey is too short
                if (delta < min_delta) {
                    end = new Date(start.getTime() + (min_delta * 24 * 60 * 60 * 1000));
                    window.console.warn("Survey: Survey duration setting is too short. Minimum of " + min_delta + " days.\nOverwrote survey end to " + datestamp(end));
                }

                // overwrite the end date if survey is too long
                if (delta > max_delta && validationExceptions.indexOf('no_60_day_limit') < 0) {
                    end = new Date(start.getTime() + (max_delta * 24 * 60 * 60 * 1000));
                    window.console.warn("Survey: Survey duration setting is too long. Maximum of " + max_delta + " days.\nOverwrote survey end to " + datestamp(end));
                }

                if (now < start) {
                    custom.ibm.debug.add("log", "Survey is not yet within the active timeframe.");
                    return false;
                }

                if (now > end) {

                    /* if (!checkDurationExceptionStatus()) {
                         custom.ibm.debug.add("log", "Survey has passed the active timeframe.");
                         return false;
                     }
                     */
                    custom.ibm.debug.add("log", "Survey has passed the active timeframe. But duration exception granded.");
                    return true;
                }

                return true;
            }

            function checkDurationExceptionStatus() {

                var is_valid = false,
                    href = window.location.href,
                    i,
                    exception_data;

                for (i = 0; i < settings.exception.data.length; i++) {

                    exception_data = settings.exception.data[i];
                    if (exception_data['for'] === "duration") {

                        is_valid = checkExceptionStatus(exception_data, href);
                        if (is_valid) {
                            break;
                        }
                    }

                }

                return is_valid;
            }

            function checkExceptionStatus(exception_data, href) {

                var is_valid = false,
                    k,
                    exception_for;

                if (exception_data.type === "URL") {
                    if (typeof exception_data.value === "string" && url_check_equals(exception_data.value, href)) {
                        is_valid = true;
                        exception_for = exception_data['for'];

                    } else {
                        for (k = 0; k < exception_data.value.length; k++) {
                            if (url_check_equals(exception_data.value[k], href)) {
                                is_valid = true;
                                exception_for = exception_data['for'];
                                break;
                            }
                        }
                    }

                } else if (exception_data.type === "ID") {

                    if (typeof exception_data.value === "string" && url_check_equals(exception_data.value, href)) {
                        is_valid = (settings.survey.id === exception_data.value);
                        exception_for = exception_data['for'];

                    } else {
                        for (k = 0; k < exception_data.value.length; k++) {
                            if (url_check_equals(exception_data.value[k], href)) {
                                is_valid = (settings.survey.id === exception_data.value[k]);
                                exception_for = exception_data['for'];
                                break;
                            }
                        }
                    }
                }

                return is_valid;
            }

            function url_check_equals(regexUrl, url) {
                var is_valid = false,
                    check = new RegExp("^" + regexUrl + "$", "i"),
                    match = url.match(check);
                if (match && match.index === 0) {
                    is_valid = true;
                }
                return is_valid;
            }

            function makeSurveyURL() {

 //               metadata = currentUrlFlag == true ? getMetaData() : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? getMetaData() : typeof defaultSetiings.override[currentUrl].survey.metaData === "undefined" ? getMetaData() : getMetaData() + "&" + defaultSetiings.override[currentUrl].survey.metaData;
                metadata = currentUrlFlag == true ? getMetaData() : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? getMetaData() : typeof defaultSetiings.override[currentUrl].survey.metaData === "undefined" ? getMetaData() : getMetaData();
                var url = "",
                    //metadata = getMetaData(),
                    //surveryType = settings.survey.type.toLowerCase();
                    surveryType = currentUrlFlag == true ? settings.survey.type.toLowerCase() : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? settings.survey.type.toLowerCase() : typeof defaultSetiings.override[currentUrl].survey.type === "undefined" ? settings.survey.type.toLowerCase() : defaultSetiings.override[currentUrl].survey.type.toLowerCase();
                if (surveryType.toLowerCase() == 'medallia') {
                    settings.survey.id = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : (defaultSetiings.override[currentUrl].survey.touchpoint) ? defaultSetiings.override[currentUrl].survey.touchpoint : defaultSetiings.defaults.survey.touchpoint;
                }
                else {
                    settings.survey.id = currentUrlFlag === true ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.touchpoint : typeof defaultSetiings.override[currentUrl].survey.id === "undefined" ? defaultSetiings.defaults.survey.touchpoint : defaultSetiings.override[currentUrl].survey.id;
                }
                switch (surveryType) {
                    case "medallia":

                        /** As per instruction from Ben, all medallia survey id will be start with "ibm-" so, adding it dynamically to all medallia survey. It may required some rework. **/
                       
                        //For Flex Survey (Dev Environment)
                        console.log('metadata--->',metadata);
                        //metadata = metadata.length > 0 ? "?" + metadata : "";
                        //url = "https://survey.medallia.eu/ibm-" + settings.survey.id + metadata;
                        //url = "https://surveysbx.sbx.lon.medallia.eu/?ibm-web-exp&" + metadata;
                        //url = "https://surveysbx.sbx.lon.medallia.eu/?ibm-uat-web-supp-forum&"+metadata;
                      
                        //For Prod Survey
                        metadata = metadata.length > 0 ? "?" + metadata : "";
                        url = "https://survey.medallia.eu/ibm-" + settings.survey.id + metadata;

                          break;

                    case "qualtrics":

                        url = "https://ibmsurveys.qualtrics.com/SE/?SID=" + settings.survey.id;
                        break;

                    case "efm":
                        url = "https://ucdsurvey1.torolab.ibm.com/ss2/wsb.dll/s/" + settings.survey.id;
                        break;

                    case "verint":
                        url = "https://survey.vovici.com/se/" + settings.survey.id + "/?";
                        break;

                    case "userzoom":

                        url = "https://s.userzoom.com/m/" + settings.survey.id;
                        break;

                    case "sg":

                        url = "https://www.surveygizmo.com/" + settings.survey.id;
                        break;

                    case "custom-other":
                        url = "https://"  + settings.survey.id;
                        //url = settings.survey.url;
                        break;
                }

                if (url === null) {
                    window.console.warn("Survey: Intercept survey type is unknown: " + settings.survey.type);
                    return false;
                }

                // console.log(url);
                settings.survey.url = url;
                return true;
            }

            function getMetaData() {
                var parameters = [],
                    metadata = settings.survey.metaData,
                    supported_lang = ["en", "zh", "fr", "de", "it", "ja", "ko", "pt", "ru", "co", "es", "tr"],
                    supported_country = ["us", "cn", "fr", "de", "ca", "it", "br", "kr", "jp", "es", "ru", "co", "tr", "tw"],
                    lang,
                    variables,
                    variable,
                    m;
                if (settings.survey.type.toLowerCase() === "medallia") {
                    parameters.push("tstamp=" + getUTCDate());
                    try {
                        lang = IBMCore.common.meta.page.pageInfo.language.split("-");
                        //lang = window.digitalData.page.pageInfo.language.split("-");
                    } catch (e) {
                        // If meta data no set for the page, using en-US as default language
                        lang = "en-US".split("-");
                    }
                              
                    //country = typeof window.digitalData.page.pageInfo.ibm.cc === "undefined" ? window.digitalData.page.pageInfo.ibm.country : $.inArray(window.digitalData.page.pageInfo.ibm.cc, supported_country) == -1 ? "us" : window.digitalData.page.pageInfo.ibm.cc;

                    country = (typeof window.digitalData.page.pageInfo.ibm.country  === "undefined" || window.digitalData.page.pageInfo.ibm.country  == "WW") ? 'US' : window.digitalData.page.pageInfo.ibm.country;
                    
                    // Adding the new fields to metadata
                    if( typeof IBM_Meta !== "undefined"){
                        try {
                            parameters.push(prepareMeta("userid", IBM_Meta.ibmUserid, ""));
                        } catch (e) {}
                        try {
                            parameters.push(prepareMeta("userLastName", IBM_Meta.userLastName, ""));
                        } catch (e) {}
                        try {
                            parameters.push(prepareMeta("userFirstName", IBM_Meta.userFirstName, ""));
                        } catch (e) {}
                        try {
                            parameters.push(prepareMeta("countryCode", IBM_Meta.countryCode, ""));
                        } catch (e) {}
                    }

                    try {
                        parameters.push(prepareMeta("country", country.toUpperCase(), "US"));
                    } catch (e) {}

                    try {
                        // Medallia supports only 13 languages for world wide. So forcely adding 'en' for any of non supported language pages.
                        if (supported_lang.indexOf(lang[0].toLowerCase()) < 0) {
                            parameters.push(prepareMeta("lang", "en"));
                        } else {
                            if(country.toUpperCase() === 'CA' || country.toUpperCase() === 'TW' || country.toUpperCase() === 'CO'){
                                lang[0]  = lang[0]+'_'+country.toUpperCase();
                            }
                            parameters.push(prepareMeta("lang", lang[0]));
                        }
                    } catch (e) {

                    }
                     
                    

                    try {
                        //Getting User Country
                    if(IBMCore.common.util.user !== undefined){
                        usercountry = IBMCore.common.util.user.getInfo().country.toUpperCase();
                        console.log("UserCountry is:  "+ usercountry);
                        parameters.push(prepareMeta("usercountry", usercountry));
                    };
                    } catch (e) {
                        // If meta data no set for the page, using en-US as default language
                        usercountry =  window.digitalData.user.userInfo.registry_country_code.toUpperCase();
                        console.log("UserCountry is:  "+ usercountry);
                        parameters.push(prepareMeta("usercountry", usercountry));
                    }
                    

                    //Adding source origin
                        var source = "popup"
                        parameters.push(prepareMeta("source", source));
                        console.log("source is:  "+ source);

                    var tmpMetadata = '';
                    try{
                        if(typeof IBMCore.common.util.config != "undefined" && typeof IBMCore.common.util.config.get('survey.intercept.survey.metaData') != "undefined"){
                            tmpMetadata = IBMCore.common.util.config.get('survey.intercept.survey.metaData');
                        }
                    }
                    catch(e){

                    }
                        if ( tmpMetadata !== "") {
                            variables = tmpMetadata.split("&");
                            for (m = 0; m < variables.length; m++) {
                                variable = variables[m].split("=");
                                parameters.push(prepareMeta(variable[0], variable[1]));
                            }
                        }
                     else{
                        if(typeof defaultSetiings.override[currentUrl] !== "undefined"){
                            tmpMetadata =  typeof defaultSetiings.override[currentUrl].survey === "undefined" ? "" : typeof defaultSetiings.override[currentUrl].survey.metaData === "undefined" ? '' : defaultSetiings.override[currentUrl].survey.metaData;
                        }else{
                            tmpMetadata =  typeof defaultSetiings.override.survey === "undefined" ? "" : typeof defaultSetiings.override.survey.metaData === "undefined" ? '' : defaultSetiings.override.survey.metaData;
                        }
                        
                        if ( tmpMetadata !== "") {
                            variables = tmpMetadata.split("&");
                            for (m = 0; m < variables.length; m++) {
                                variable = variables[m].split("=");
                                parameters.push(prepareMeta(variable[0], variable[1]));
                            }
                        }
                    }
                    
                    
                    // Appending meta data from config paramters
                    if (typeof metadata !== "undefined" && metadata !== "") {
                        variables = metadata.split("&");
                        for (m = 0; m < variables.length; m++) {
                            variable = variables[m].split("=");
                            if(parameters.indexOf(variable[0]) < 0 )
                                parameters.push(prepareMeta(variable[0], variable[1]));
                        }
                    }else{
                        
                    }
                    tmpMetadata += metadata;
                    
                    if (tmpMetadata.indexOf('pgroup') < 0) {
                        try {
                            parameters.push(prepareMeta("pgroup", null, "default"));
                        } catch (e) { }
                    }
                    try {
                        if(tmpMetadata.indexOf("pparent") < 0){
                            parameters.push(prepareMeta("pparent", window.digitalData.page.pageInfo.ibm.owner));
                       }
                        
                    } catch (e) { }
                    try {
                        if(tmpMetadata.indexOf("pmain") < 0){
                            parameters.push(prepareMeta("pmain", window.digitalData.page.pageInfo.ibm.industry));
                        }
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("origin", window.digitalData.page.pageinfo.ibm.owningPortal));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("content", window.digitalData.page.pageInfo.ibm.subject));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("campaign", window.digitalData.page.category.primaryCategory));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("oid", window.digitalData.page.pageInfo.ibm.siteID));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("oname", window.digitalData.page.pageInfo.pageName));
                    } catch (e) { }
                   
                    // gbt code disabling.....
                    // try {
                    //     if (window.digitalData.page.category.ibm.globalBrandTableL10 !== undefined && window.digitalData.page.category.ibm.globalBrandTableL10.trim() !== '' && window.digitalData.page.category.ibm.gbt10 !== undefined){
                    //     parameters.push(prepareMeta("gbt10", window.digitalData.page.category.ibm.gbt10 + " - " + window.digitalData.page.category.ibm.globalBrandTableL10));
                    //     }
                    //     else{
                    //         parameters.push(prepareMeta("gbt10", window.digitalData.page.category.ibm.gbt10)); 
                    //     }
                    // } catch (e) { }
                    // try {
                    //     if (window.digitalData.page.category.ibm.globalBrandTableL17 !== undefined && window.digitalData.page.category.ibm.globalBrandTableL17.trim() !== '' && window.digitalData.page.category.ibm.gbt17 !== undefined){
                    //     parameters.push(prepareMeta("gbt17", window.digitalData.page.category.ibm.gbt17+ " - " + window.digitalData.page.category.ibm.globalBrandTableL17));
                    //     }else{
                    //         parameters.push(prepareMeta("gbt17", window.digitalData.page.category.ibm.gbt17)); 
                    //     }
                    // } catch (e) { }
                    // try {
                    //     if (window.digitalData.page.category.ibm.globalBrandTableL20 !== undefined && window.digitalData.page.category.ibm.globalBrandTableL20.trim() !== '' && window.digitalData.page.category.ibm.gbt20 !== undefined){
                    //         parameters.push(prepareMeta("gbt20", window.digitalData.page.category.ibm.gbt20+ " - " + window.digitalData.page.category.ibm.globalBrandTableL20));
                    //         }else{
                    //             parameters.push(prepareMeta("gbt20", window.digitalData.page.category.ibm.gbt20)); 
                    //         }
                    // } catch (e) { }
                    // try {
                    //     if (window.digitalData.page.category.ibm.globalBrandTableL30 !== undefined && window.digitalData.page.category.ibm.globalBrandTableL30.trim() !== ''&& window.digitalData.page.category.ibm.gbt30 !== undefined){
                    //         parameters.push(prepareMeta("gbt30", window.digitalData.page.category.ibm.gbt30+ " - " + window.digitalData.page.category.ibm.globalBrandTableL30));
                    //         }else{
                    //             parameters.push(prepareMeta("gbt30", window.digitalData.page.category.ibm.gbt30)); 
                    //         }
                    // } catch (e) { }
                    // try {
                    //     if (window.digitalData.page.category.ibm.globalBrandTableL40 !== undefined && window.digitalData.page.category.ibm.globalBrandTableL40.trim() !== '' && window.digitalData.page.category.ibm.gbt40 !== undefined){
                    //         parameters.push(prepareMeta("gbt40", window.digitalData.page.category.ibm.gbt40+ " - " + window.digitalData.page.category.ibm.globalBrandTableL40));
                    //         }else{
                    //             parameters.push(prepareMeta("gbt40", window.digitalData.page.category.ibm.gbt40)); 
                    //         }
                    // } catch (e) { }
                    try {
                        parameters.push(prepareMeta("ut10", window.digitalData.page.category.ibm.ut10));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("ut15", window.digitalData.page.category.ibm.ut15));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("ut17", window.digitalData.page.category.ibm.ut17));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("ut20", window.digitalData.page.category.ibm.ut20));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("ut30", window.digitalData.page.category.ibm.ut30));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("pageviewid", window.digitalData.page.session.uPageViewID));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("upid", window.digitalData.user.profile.auid));
                    } catch (e) { }
                    try {
                        parameters.push(prepareMeta("isibmer", window.digitalData.user.segment.isIBMer));
                    } catch (e) { }


                    // Filtering to remove all empty or "" data
                    parameters = parameters.filter(Boolean);

                    try {
                        parameters.push(prepareMeta("url", encodeURIComponent(window.location.href)));
                    } catch (e) { }

                }

                parameters = parameters.length > 0 ? parameters.join("&") : "";

                return parameters;
            }

            function getUTCDate() {

                var d1 = new Date();

                var utcDate = (d1.getUTCDate() < 10) ? "0" + d1.getUTCDate() : d1.getUTCDate(),
                    utcMonth = (d1.getUTCHours() < 10) ? "0" + (d1.getUTCMonth() + 1) : (d1.getUTCMonth() + 1),
                    utcHours = (d1.getUTCHours() < 10) ? "0" + (d1.getUTCHours()) : d1.getUTCHours(),
                    utcMinutes = (d1.getUTCMinutes() < 10) ? "0" + (d1.getUTCMinutes()) : d1.getUTCMinutes(),
                    utcSeconds = (d1.getUTCSeconds() < 10) ? "0" + (d1.getUTCSeconds()) : d1.getUTCSeconds();

                // As per Randy, date format is yyyy-mm-dd HH:mm:ss
                return d1.getUTCFullYear() + "-" + utcMonth + "-" + utcDate + " " + utcHours + ":" + utcMinutes + ":" + utcSeconds;
            }

            function prepareMeta(name, param, defaultValue) {
                var returnThis = name + "=" + param;

                defaultValue = defaultValue || null;

                if ($.trim(param) === "" || param === "REPLACE" || typeof param === "undefined" || param === null) {
                    if (defaultValue === null) {
                        returnThis = "";
                    } else {
                        returnThis = name + "=" + defaultValue;
                    }
                }
                return returnThis;
            }

            function createSurvey() {
                var firstTimePopup;
                var whyLinkPopup;
                var bindInvitationEvents;
                
                var html = "",
                    overlay,
                    template = '<div style="width:100%; height:515px; -webkit-overflow-scrolling:touch;"><iframe src="{{survey_url}}" width="{{survey_width}}" height="100%" frameborder="0"></iframe></div>';

                defaultSetiings.defaults.survey.invitation_width = invitation_width = currentUrlFlag == true ? defaultSetiings.defaults.survey.invitation_width : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.invitation_width : (defaultSetiings.override[currentUrl].survey.invitation_width) ? defaultSetiings.override[currentUrl].survey.invitation_width : defaultSetiings.defaults.survey.invitation_width;
                defaultSetiings.defaults.survey.invitation_height = invitation_height = currentUrlFlag == true ? defaultSetiings.defaults.survey.invitation_height : typeof defaultSetiings.override[currentUrl].survey === "undefined" ? defaultSetiings.defaults.survey.invitation_width : (defaultSetiings.override[currentUrl].survey.invitation_height) ? defaultSetiings.override[currentUrl].survey.invitation_height : defaultSetiings.defaults.survey.invitation_height;

                var invitation_width;
                var currentIframeFlag = false;
                if (window.innerWidth > 770)
                {
                   currentIframeFlag = false;
                    invitation_width = defaultSetiings.defaults.survey.invitation_width + "px";
                   
                }
                else
                {
                    currentIframeFlag = true;
                    invitation_width = "100%";
                    
                }

                html = template.replace('{{survey_width}}', (invitation_width))
                    .replace('{{survey_height}}', (invitation_height - 30))
                    .replace('{{survey_url}}', settings.survey.url);
                defaultSetiings.html = html;
                overlay = custom.ibm.surveryOverlay.createOverlay(defaultSetiings,'sec');
                var overlay = custom.ibm.surveryEventCoordinator("dataReady", "Overlay", ["hide", "show"]);
                overlay.subscribe('show', 'Overlay', function () {

                    event = {
                        "ibmEV": "ol survey",
                        "ibmEvGroup": settings.survey.type,
                        "ibmEvModule": settings.survey.id,
                        "ibmEvAction": "intercept shown"
                    };

                    
                    window.ibmStats.event(event);


                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}';
                        expires = new Date() + 30 * 24 * 3600;
                        // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? expires : new Date() + 3600 * 4;
                        allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);
                        $.cookie(settings.cookie_name, cookie_value, {
                        path: "/",
                        domain: ".ibm.com",
                        expires: allowedTtl
                    });
                });

                return overlay;
            }

            function preSurveyCall(){
                invitationStatus = "opt-in";
                event = {
                    "ibmEV": "ol survey",
                    "ibmEvGroup": settings.survey.type,
                    "ibmEvModule": settings.survey.id,
                    "ibmEvAction": "intercept yes clicked"
                };
                window.ibmStats.event(event); 
                // Add special param so we know this survey was from an intercept and not
                if(settings.survey.url != undefined && settings.survey.url.indexOf('?') == -1){
                    settings.survey.url += "?inter=y";
                }else{
                    settings.survey.url += "&inter=y";
                }
            }
            

            createInvitation = function () {

                var langMap = [{"en":"enus"},{"de":"dede"},{"es":"esco"},{"fr":"frfr"},{"it":"itit"},{"pt":"ptbr"},{"ko":"kokr"},{"ja":"jajp"},{"ru":"ruru"},{"zh":"zhcn"},{"tr":"trtr"}];
                
                var langcountry = '';
                var lngcode = '';
                try{
                    langcountry = IBMCore.common.meta.page.pageInfo.ibm.lc + IBMCore.common.meta.page.pageInfo.ibm.cc;
                    lngcode = IBMCore.common.meta.page.pageInfo.ibm.lc;
                }catch (e){
                    langcountry = 'enus';
                    lngcode = 'en';
                }

                if (langcountry === "eses" || langcountry === "zhtw" || langcountry === "frca") {
                    langcountry = langcountry;
                }else{
                    langcountry = "enus";
                    langMap.forEach(function(item){
                        if(item[lngcode] !== undefined){
                            langcountry = item[lngcode];
                            return langcountry;
                        }
                    });
                }


                /*if (langcountry === "enus" || langcountry === "trtr" || langcountry === "dede" || langcountry === "frca" || langcountry === "frfr" || langcountry === "itit" || langcountry === "ptbr" || langcountry === "kokr" || langcountry === "jajp" || langcountry === "eses" || langcountry === "ruru" || langcountry === "esco" || langcountry === "zhcn" || langcountry === "zhtw") {
                    langcountry = langcountry;
                }else {
                    langcountry = "enus";
                }
                */
                

                invitation_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_title === "undefined" ? defaultSetiings.defaults.invitation.invitation_title[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_title[langcountry];

                invitation_content = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_content === "undefined" ? defaultSetiings.defaults.invitation.invitation_content[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_content[langcountry];

                invitation_yes_label = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_yes_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_yes_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_yes_label === "undefined" ? defaultSetiings.defaults.invitation.invitation_yes_label[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_yes_label[langcountry];

                invitation_no_label = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_no_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_no_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_no_label === "undefined" ? defaultSetiings.defaults.invitation.invitation_no_label[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_no_label[langcountry];

                first_time_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.first_time_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.first_time_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.first_time_title === "undefined" ? defaultSetiings.defaults.invitation.first_time_title[langcountry] : defaultSetiings.override[currentUrl].invitation.first_time_title[langcountry];

                why_link_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.why_link_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.why_link_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.why_link_title === "undefined" ? defaultSetiings.defaults.invitation.why_link_title[langcountry] : defaultSetiings.override[currentUrl].invitation.why_link_title[langcountry];

                first_time_content = currentUrlFlag == true ? defaultSetiings.defaults.invitation.first_time_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.first_time_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.first_time_content === "undefined" ? defaultSetiings.defaults.invitation.first_time_content[langcountry] : defaultSetiings.override[currentUrl].invitation.first_time_content[langcountry];

                why_link_content = currentUrlFlag == true ? defaultSetiings.defaults.invitation.why_link_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.why_link_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.why_link_content === "undefined" ? defaultSetiings.defaults.invitation.why_link_content[langcountry] : defaultSetiings.override[currentUrl].invitation.why_link_content[langcountry];

                first_time_yes_label = currentUrlFlag == true ? defaultSetiings.defaults.invitation.first_time_yes_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.first_time_yes_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.first_time_yes_label === "undefined" ? defaultSetiings.defaults.invitation.first_time_yes_label[langcountry] : defaultSetiings.override[currentUrl].invitation.first_time_yes_label[langcountry];

                first_time_no_label = currentUrlFlag == true ? defaultSetiings.defaults.invitation.first_time_no_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.first_time_no_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.first_time_no_label === "undefined" ? defaultSetiings.defaults.invitation.first_time_no_label[langcountry] : defaultSetiings.override[currentUrl].invitation.first_time_no_label[langcountry];

                invitation_error_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_error_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_error_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_error_title === "undefined" ? defaultSetiings.defaults.invitation.invitation_error_title[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_error_title[langcountry];

                invitation_error_content = currentUrlFlag == true ? defaultSetiings.defaults.invitation.invitation_error_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.invitation_error_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.invitation_error_content === "undefined" ? defaultSetiings.defaults.invitation.invitation_error_content[langcountry] : defaultSetiings.override[currentUrl].invitation.invitation_error_content[langcountry];

                feedback_statement_label = currentUrlFlag == true ? defaultSetiings.defaults.invitation.feedback_statement_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.feedback_statement_label[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.feedback_statement_label === "undefined" ? defaultSetiings.defaults.invitation.feedback_statement_label[langcountry] : defaultSetiings.override[currentUrl].invitation.feedback_statement_label[langcountry];

                feedback_statement_content = currentUrlFlag == true ? defaultSetiings.defaults.invitation.feedback_statement_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.feedback_statement_content[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.feedback_statement_content === "undefined" ? defaultSetiings.defaults.invitation.feedback_statement_content[langcountry] : defaultSetiings.override[currentUrl].invitation.feedback_statement_content[langcountry];

                anonymous_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.anonymous_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.anonymous_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.anonymous_title === "undefined" ? defaultSetiings.defaults.invitation.anonymous_title[langcountry] : defaultSetiings.override[currentUrl].invitation.anonymous_title[langcountry];

                first_time_popup_title = currentUrlFlag == true ? defaultSetiings.defaults.invitation.first_time_popup_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation === "undefined" ? defaultSetiings.defaults.invitation.first_time_popup_title[langcountry] : typeof defaultSetiings.override[currentUrl].invitation.first_time_popup_title === "undefined" ? defaultSetiings.defaults.invitation.first_time_popup_title[langcountry] : defaultSetiings.override[currentUrl].invitation.first_time_popup_title[langcountry];
                
                var url = window.location.href;
                var template = '<div class="dialog-inner" data-slide="about" style="display: none;">' + getExceptionImage() + ' <div class="dialog-inner active ibm-padding-content" > <div class="ibm-center"> <h2 style="font-size:1.2rem"class="ibm-h2">{{title}}</h2> <p>{{content}}</p>' + (settings.anonData.emailInfoLoaded === false ? '<p>' + anonymous_title + '</p>' : '') + '<p class="ibm-btn-row ibm-padding-top-1"><a data-action="opt-in" class="ibm-btn-pri ibm-btn-teal-50" href="javascript:;">{{yesLabel}}</a><a data-action="opt-out" class="ibm-btn-sec ibm-btn-teal-50" href="javascript:;">{{noLabel}}</a></p></div></div><div data-slide="about" style="display: none;" class="dialog-inner ibm-padding-content"> <div class="ibm-title"> <h2 class="ibm-bold">' + feedback_statement_label + '</h2> </div><div style="" class="ibm-container ibm-alternate"> <div class="ibm-container-body"> <p style="font-size: 0.8rem !important;    margin-bottom: 30px;"> ' + feedback_statement_content + ' </p></div></div><div style="border-top: 1px solid #b9bfc7 !important;" class="ibm-rule"> <hr> </div><div class="ibm-buttons-row ibm-padding-top-1"> <a data-slide-target="main" data-action="change-slide" class="ibm-btn-pri ibm-btn-blue-50" href="javascript:;">' + "Back " + "to " + "Feedback" + '</a> </div></div></div>';
                html = template.replace('{{title}}', settings.invitation.title).replace('{{content}}', settings.invitation.content).replace('{{yesLabel}}', settings.invitation.yes_label).replace('{{noLabel}}', settings.invitation.no_label);

                innerDiv = $("<div>").attr("class", "dialog-inner").attr("data-slide", "main").css({ 'margin-bottom' : '30px' });
                imageIcon = $("<img>").attr({
                    "src": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAAHaX54IAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAACtdJREFUeNpiYBgFJABGZI5jxb7zQMqASmYb7u9wugBisCBZoIBkQSOFFtQD8Xl0T4As+Q/C1AoiZPOY6BEnLARc40CKYcA4OECyJSB9lCQkoiwBuoyRGsFFlzgZFBGPL0k3AoOzYWj4ZGhHPDAeBKhQpMyHFZLYSuH/RORqovVQJbipXahis+A9sRZQEvECNE0tpAYTC5n2bKC5TwYlAAigUUBR445quRe5SGHEYsECIH5Igfn+sEYizCIWGtQfDdCS/D1N6xOgYz8QleNJbdiR27jbT2lCImgJter3EdK4I5QxSQnOgfXJ0I54ahWQ6OZQ1LijR8OugB7trv5B1e6iS+qiSuoZOQAggEbBoG4/4io8aJ63iQOKwNLwAUkeGQI5LRHoqQV4PYLuCWpWwVQuyj4A3SZIVAE8mDyBxT0CQ6MmoVarbqBrK1JTw8iOkcGWd4ZVjIxmdgrsJHqGYjSPDNs8Qo3JEyo3Ue4PWKMRXzKkxB50cxlpXYPj8giZZi8AmpdIVn+E3q3YIZPZ0TyRSA1P0D1GkD1B7SKckU4eQOkuD8Z6aBSMAhwAIAA7V3DDMAgDS9QBmg3STdKROkGaDbpRukk7QkcolXggFOqI2GDKnZRXJMJhk7MdBwAAGsGW2i9ns2gqosEiSURr/TcWFVRZxF4jYzaSmAvPfaLIZOlyZMCN+k7T1eJSdlHvqYnVRfM+Cbt/UDLVhmOCSU/SAhlrAGMl4kgswgtsmnWtdveI819U40EERECkHmUf9wiiVGoA14IgwiIgchhrJuIn+JPmiYfJVxfcvAaaoaaqQs1l7a31stfAQYYSvx1j9+QesQ8/a1jhH5jDP8aiOvJdSXeiwlOIxMBtYQ0tHCzxV4kWjkUiiCwhiL4+PbgGNbW7lIYQpecczPyDNbJZJHzdSmSJuVzL16N31WG2+MEXAAC0gY8A7J3tUcQgEIaDcwVoB7ZgBWoHV4Id6HXgVWQJpgPtwCtFduZmdO5jIRAIbJ7nT/7czAXe7MLCsgAAAIARkoK0kut2hghm92YLQmyXzFl1iixBGsknt8DdpS2ESYJEWIVacGVt+P768I9tan+FdsQkc/stVe2VCyP1HS8eOtcWWEMLpdfE2COGjnbyWCuBmbpyPdLlZbihCxAEFDY1/iQ3F7WhccFhIbgsMO+yWs1xxkIAQRAEEARBgMAwgyLVXrEQXBaYdVkeuS92qUI9BwQ5j9RlM2vk+8dlIQgsI8gnXRec6t8qLnxMEqRUdfoViPEy/LtV9ITsvCxJkPuKCcBqD9wptehO2jXX3RAS+D4OEXUwQruObkIDmrOI1C3V40nzp8qvG5VO6hIaI0nW970KoiWwFeLBv+d37I+zd/F8A9/943VY4EbzqYJUsHJxobspAswuSEcDrSbGc854NCdu7WK0ds2JMy6EjHU/vYhhOlI/1l3vSgyzFhKY1h5q1QbDQv6mtdfE2LcshjkL6WUmpbExJMa2t/FiVYjrYgEUAAAAFuNXAPbO7iphIAijSY4NUIFYgh3EEuxAOsAK1ArQCsAOtAPsgA6gAyxB4lnUozL7lyy7w72PPMCyX2b2S7I7AwAAAAAAAAA5EfXixuzq6Nqh3TCVn6fEnm294AcRZCfEHBGsBBUH9d2K6boTHkzU7ES5HEQQc+Zhzhz74/NOv0aMvERxObDT7WrfMqVp0lcfla33DuP1hCf73NHkWBf6MwdbK/Gy+4FrLv5PJg5dI9a2ILBtJZUc1S1i/FknNrGb8myCHDoV9R57A6Qcqcz4LEaQg7mQORcjRTr6PA0SRCoYTyF+Jx6GSFkQzhJBFIAgCAIIgiAQSsoysaWzSmH3U50x1FDw7KpKUH6KlMUaAgiCIIAg2F4Pi0UlBSIEQQBBEAQQBEEAQQBBEAQQBEEgnlSvcI9WjLK052hECIIAgiAIIAguy89oMdUZCVJCVwJSFiAIggCCIAggSCG0vQoiWVWpeTt8cZcyQqgqJ90FyxfsY4wgh45wjU1RM/ifrZB5bmMEkR55zE0xTPgRGbEv4/oqYNatN29VgjN4ruucw/9qexxK67hmWJvduzzLGlX2En+tx6D6JLTMbVciaZp4rBuXxveNw1XYrSMTZdkltRiVaw/exvHLFlVguaEM8/z6CGI4R3Lj8aX3XQ5UYEfHidOUV1ptPJVemR9YaLOjA3AR0io8thh/V3p8FvqYIGUqMK5qyIoS3Vr7ZDJJWpdSaLqS7PvErJNHpzkRMWYOpqVCkDxs7iingTYnEB1riwvKqsJqrVwMsZFAjhuxtUeIZHOzvNGtFUeHaHNzPaagOUKke45sd1I2SqNDsrnvOe+k1BohUyFVjXIeeKMwOiSbu8x9/LUyMYqzudojRLK5RbxkqxVFR5E2V3OESDZ3VMqf0CTI5tDnJXUE0raoj6tfbesoHHDMnPXdtm7/nOqhAgAAAAAAAAAI5kOA9u73po0YjANwDjEA3SDdADZoNggTFCagfOu3JhMkTABMUCZoswnZoIzQc2ukCqkltX1/8D2PFPEpUXL2Lz6/4d4DAAAAAAAAAP7U+xUT8XLMi/ZxNeu3yR5v17593LSPu74vuWp6CsUqBkLnfkoo0kNx0IDEBv0boaCHsFx31Zqx6SgYbpTAEIo3lG0KBiO0Uf5uxWAEK8rikHtP9BaQgW7AAf+yLrFHaQqEI5xOXeRuuGa/KxR740rsUXMV51XOGUmYU5eDBSRz5Qgbq63pwAHzLMyxTeLTt6/dmbCTgGTcDuWhfcPnhp2EOfe1/bNMeWpqZ+acbmUpNyhcCwep4txZ9zRX01eQ15oTWzkY4UryLuVX+NQV5DThOfeGlkLue5qzvTaEfTKuvLW5dORYg4CAgICAgIDAOBzX8kEyftmng+EY8z2FrSAgICAgICAgIPAGHVf0WcI1yAtDOpqxEJAxif/KvDM3cYoFAgICAgICAgICAgICCAgICAgIdKWmKwpDt8fTCY7hXld8ATnE8w18pib0ql2Zyk6xQEBAQEBAQECgajVdUbibdXDfd6wggICAgICAgIDAxAJy4nAzlYCkdM776HBTyFVPczYtIIldDJeLz98ujC054hxa/ufTdnHO9nqKdZPwnNv2A94aZhLDEebObU9z9ZemwBtOXRUu21TfGXYOXDVSv1jv2nl2OUhA4psPFyl9yHiJp5jwbeoySHWBCAWdT3GvkVPcCadWWR3/m0IfaBM/EIfv45qBJt7jbBoVxfCFe537IkeFBju8kTPTftTfyvP2z4+JhOOsRDiKrSAvBmLV/vliSo5nBZnQLbLX7XFdlXzBpsNBydlYCUi5cQinvpvKD2dnBZ+mhwE6iSuKPUrPAal8b7iNK0anhZ0hNorzWJ0IP/bMBaSz45xbXRyTfft4aB83ffcAG90VeDFA8wkEZNfhMXxMPIbh2/h8yCCMrQmeS1QrklnGzf7NoEYCUk845jEcKbJ+bRYQxh6OsNdILeMWL40KCGMKR04Zd9HlXkhAGDocOWXc97rCC0jN4Ugt4z7FcPjHUAGpNhypZVyVKgGpOhg5ZVyVKgGpOhzzWXoZV6VKQKoOR9hrpJZxVaoEpOpw5JRxVaoEpOpwpJZxVaoEpPpwpJZxVaoEpPpwpJZxVaoEpPpwpF43rlIlIJMJyXPbm0Ov7VepEpBJBybsRW7/ctqlUiUgvFhdQnVrOVOpAgAAAAAAAAB69RMry7yijAw9KQAAAABJRU5ErkJggg==",
                    "width": 60,
                    "height": 60,
                    "id": "image-box"
                })
                heading = $("<h2>").attr({
                    "id": "survery-dialog-title",
                    "id": "image-text",
                    "class": "ibm-h2",
                    "margin": "0px 40px;"
                })
                
                .html(invitation_title);
                str = "<p style='font-size:.9rem;width:60%;margin:auto;'>" + invitation_content + "</p>";
                button = "<p style='padding: 20px;'><a style='background: #4178be;border: 1px solid #4178be;margin-bottom: 20px;color: #FFF;padding: 10px;min-width: 120px;font-size: 16px;line-height: 20px;padding: 11px 50px;cursor: pointer;' data-action='showme' data-attribute1='ok_survey_nps' data-attribute2='"+url+"' >" + invitation_yes_label + "</a> <a style='background: #FFF;border: 1px solid #4178be;color: #4178be;padding: 10px;min-width: 120px;font-size: 16px;line-height: 20px;padding: 11px 18px;margin: 0 20px 20px 10px;cursor: pointer;' data-action='hideme' data-attribute1='no_thanks_survey_nps' data-attribute2='"+url+"' >" + invitation_no_label + "</a></p>";
                lastpara = "<p style='text-align:center;padding:3%;'><a id='first_Title' href='#' style='color: #4178be; text-decoration: none;'>" + first_time_title + "</a></p><p style='color: #fff;position:absolute;bottom:0px;padding-bottom: 5px;width: 100%;padding-top: 5px;margin-top: 30px;background-color: #b9bfc7;'><a  data-slide-target='about' data-action='change-slide' href='#' style='color: #fff;text-decoration: none;'>" + feedback_statement_label + "</a></p>";

                // <a id='why_Link' href='#' style='color: #4178be; text-decoration: none; float: right; margin-right: 50px;'>" + why_link_title + "</a></p>";

                // first time  popup
                if (window.innerWidth > 770) {
                    str2 = "<h4 style='font-size: 1.5rem;width: 90%;height:70px;margin: auto;padding-bottom: 10px;font-weight:500;'></h4><p style='font-size:1.2rem;width:90%;margin:auto;margin-bottom: 30px !important;'>" + first_time_content + "</p>";
                }
                else {
                    str2 = "<p style='font-size:1.2rem;width:90%;margin:auto;margin-bottom: 30px !important;'>" + first_time_content + "</p>";
                }
                hr = "<div style='border-top: 1px solid #b9bfc7 !important;' class='ibm-rule'> <hr> </div>";
                button2 = "<p class='ibm-ind-link' style='padding: 12px;'><a style='background: #4178be;border: 1px solid #4178be;color: #FFF;padding: 10px;min-width: 120px;font-size: 1.0rem;line-height: 20px;margin-bottom:20px;padding: 11px 18px;cursor: pointer;' data-action='showme' id='click_Survey' data-attribute1='continue_with_survey_nps' data-attribute2='"+url+"'>" + first_time_yes_label + "</a> <a style='background: #FFF;border: 1px solid #4178be;color: #4178be;padding: 10px;min-width: 120px;font-size: 1.0rem;line-height: 20px;padding: 11px 18px;cursor: pointer;' data-action='hideme' id='click_Survey' data-attribute1='not_now_its_too_soon_survey_nps' data-attribute2='"+url+"'>" + first_time_no_label + "</a></p>";

                // why link popup
                str3 = "<h4 style='font-size: 1.5rem;width: 90%;margin: auto;padding-bottom: 10px;'>" + why_link_title + "</h4>" + "<p style='font-size:.9rem;width:90%;height:100px;margin:auto;'>" + why_link_content + "</p>";
                hr2 = "<div class='ibm-rule'> <hr> </div>";
                button3 = "<p style='padding: 20px;'><button style='background: #4178be;border: 1px solid #4178be;color: #FFF;padding: 10px;min-width: 120px;font-size: 1.2rem;line-height: 20px;padding: 11px 18px;cursor: pointer;' data-action='showme' id='click_Survey'>" + first_time_yes_label + "</button> <button style='background: #FFF;border: 1px solid #4178be;color: #4178be;padding: 10px;min-width: 120px;font-size: 1.2rem;line-height: 20px;padding: 11px 18px;margin: 0 20px 20px 10px;cursor: pointer;' data-action='hideme' id='click_Survey'>" + first_time_no_label + "</button></p>";

                // !!digitalData.user.segment[17950] --> returns true — means , is he new user?
                // !!digitalData.user.segment[18192] --> returns true — means , is he returningVisitor (repeated) ?
                if (!!digitalData.user.segment[17950]){
                    paragraph = $("<p>").attr("id", "survery-dilog-text").html(str2 + hr + button2);
                }else{
                    paragraph = $("<p>").attr("id", "survery-dilog-text").html(str + button + lastpara);
                }

                innerDiv.append(imageIcon, heading, paragraph);''

                defaultSetiings.html = innerDiv;
                defaultSetiings.feedback = html;

                firstTimePopup = function () {
                    document.getElementById("survery-dilog-text").innerHTML = str2 + hr + button2;
                    $('#image-text').hide();
                    $('#image-box').hide();
                    $('#survery-dilog-text').css("margin", "3%");
                    defaultSetiings.html = innerDiv;
                    defaultSetiings.feedback = html;
                };
                
                jQuery('body').on('click', '#first_Title', function () {
                    firstTimePopup();
                });


                jQuery('body').click('#click_Survey', function () {
                    // TODO: need to check
                    //checkTouchPoints(settings.survey.type.toLowerCase(),settings.survey.id.toLowerCase());
                    bindInvitationEvents();  
                });


                custom.ibm.surveryOverlay.createOverlay(defaultSetiings,'pri')

                var overlay = custom.ibm.surveryEventCoordinator("dataReady", "Overlay", ["hide", "show"]);

                overlay.subscribe('hide', 'Overlay', function () {
                    var cookie_value = '{"date": ' + new Date().getTime() + ',"type": "' + settings.survey.type + '","id": "' + settings.survey.id + '"}',
                        global_expires = new Date() + settings.global_minimum_wait * 24 * 3600,
                        // allowedTtl = truste.cma.callApi("getConsentDecision", "ibm.com").consentDecision > 1 ? global_expires : new Date() + 3600 * 4;
                        allowedTtl = isNaN(defaultSetiings.defaults.global_barrier_days) ? defaultSetiings.defaults.global_barrier_days : parseInt(defaultSetiings.defaults.global_barrier_days);

                        $.cookie(settings.cookie_name, cookie_value, {
                        path: "/",
                        domain: ".ibm.com",
                        expires: allowedTtl
                    });
                });

                return overlay;
                // custom.ibm.surveryOverlay.showOverly(defaultSetiings)
            }

            function getExceptionImage() {
                var html = "";

                // set watermark - Add a limit to the percent parameter 
                // if (settings.percent > 25 && !checkPercentageExceptionStatus() && validationExceptions.indexOf("footer_feedback") < 0) {
                if (settings.percent > 25 && validationExceptions.indexOf("footer_feedback") < 0) {
                    html = watermarkImage;
                }
                return html;
            }


            function checkPercentageExceptionStatus() {

                var is_valid = false,
                    href = window.location.href,
                    i,
                    exception_data;

                for (i = 0; i < settings.exception.data.length; i++) {

                    exception_data = settings.exception.data[i];

                    if (exception_data['for'] === "percentage") {
                        if (typeof exception_data.limit !== "undefined" && exception_data.limit >= parseInt(settings.percent, 10)) {
                            is_valid = checkExceptionStatus(exception_data, href);
                            if (is_valid) {
                                break;
                            }
                        }
                    }
                }

                return is_valid;
            }

            function datestamp(timestamp) {
                var a,
                    y,
                    h,
                    m,
                    mm,
                    d,
                    dd,
                    ret = '',
                    then,
                    now;

                if (timestamp === null) {
                    return null;
                }

                then = new Date(timestamp);
                now = new Date();

                // If it's the same day, skip the date
                if (!(now.getFullYear() === then.getFullYear() && now.getMonth() === then.getMonth() && now.getDate() === then.getDate())) {
                    // date
                    y = then.getFullYear();
                    m = then.getMonth() + 1;
                    mm = (m < 10 ? '0' : '') + m;
                    d = then.getDate();
                    dd = (d < 10 ? '0' : '') + d;

                    ret += mm + "/" + dd + "/" + y + ' ';
                }

                // time
                h = then.getHours();
                m = then.getMinutes();
                mm = (m < 10 ? '0' : '') + m;

                a = (h > 12) ? 'pm' : 'am';
                h = ((h + 11) % 12) + 1;

                ret += h + ":" + mm + a;

                return ret;
            }

        function enableEmbedJSandSitefeedbackButton(){
        // event librety and button handuler
        if(tmpCurrentUrl == currentUrl && currentUrl.indexOf('&mhq=') == -1){
            console.log('No matching url found for this:',window.location.href.replace(/(^\w+:|^)\/\//, ''));
            console.log('Current url--> ',window.location.href.replace(/(^\w+:|^)\/\//, ''));
        }else{
            console.log('Current url--> ',window.location.href.replace(/(^\w+:|^)\/\//, ''));
            console.log('Matched url--> ',currentUrl);
        }
               //window.location.href.replace(/(^\w+:|^)\/\//, '');
                var tmpLibCurrentUrl = currentUrl;             
                try {
                    if(defaultSetiings.override[tmpLibCurrentUrl] !== undefined && defaultSetiings.override[tmpLibCurrentUrl].siteFeedbackLink)
                    {
                        var fileref=document.createElement('script')
                        fileref.setAttribute("type","text/javascript")
                        fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js")    
                        fileref.async = true;
                       
                        document.head.appendChild(fileref);
                        var kamsurveyId = defaultSetiings.siteFeedbackformid;
                        if(defaultSetiings.override[tmpLibCurrentUrl].siteFeedbackformid !== undefined)
                        {
                            kamsurveyId = defaultSetiings.override[tmpLibCurrentUrl].siteFeedbackformid;
                        }
                        /*
                        var button = document.createElement('button');
                        button.setAttribute('value', 'Site feedback');
                        button.setAttribute('id', 'Site-feedback-btn-id');
                        button.setAttribute('onclick', 'KAMPYLE_ONSITE_SDK.showForm('+kamsurveyId+')');
                        button.setAttribute('form', 'myform');
                        document.body.appendChild(button);
                        $("#Site-feedback-btn-id").mouseover(function(){
                            $("#Site-feedback-btn-id").css({"background-color": "#e5e5e5","color":"#0f62fe","cursor": "pointer;"});
                          });
                        $("#Site-feedback-btn-id").mouseout(function(){
                            $("#Site-feedback-btn-id").css({"background-color":"#ffffff", "color":"#0f62fe"});
                         });
                         $("#Site-feedback-btn-id").focus(function(){
                            $("#Site-feedback-btn-id").css({"background-color":"#ffffff", "color":"#0f62fe","border":"2px solid #0f62fe;color:#0f62fe"});
                         });
                         $("#Site-feedback-btn-id").focusout(function(){
                            $("#Site-feedback-btn-id").css({"background-color":"#ffffff", "color":"#0f62fe","border":"1px solid #0f62fe;color:#0f62fe"});
                         });
                         $("#Site-feedback-btn-id").click(function(){
                            try {
                                window.CM_APP.fireEvent('CLOSE_WINDOW');
                                $('#KampyleAnimationContainer').show();
                                } catch (e) {}
                         });
                        */

                       var button = document.createElement('button');
                       button.setAttribute('value', getFeedBackText());
                       button.setAttribute('id', 'Site-feedback-btn-id');
                       //button.setAttribute('onclick', 'KAMPYLE_ONSITE_SDK.showForm('+kamsurveyId+')');
                       button.setAttribute('onmouseover', 'onmouseoverFeedback(this)');
                       button.setAttribute('onmouseout', 'onmouseoutFeedback(this)');
                       button.setAttribute('onfocus', 'onfocusFeedback(this)');
                       button.setAttribute('onfocusout', 'onfocusoutFeedback(this)');
                       button.setAttribute('onclick', 'onclickFeedback('+kamsurveyId+')');
                       
                       button.setAttribute('form', 'myform');
                       document.body.appendChild(button);
                        
                        if (window.innerWidth > 770)
                            {
                                button.setAttribute("style", "position: fixed;cursor: pointer;font-weight: 400;font-size: 12px;line-height: 26px;outline: 0;text-align: center;height: 32px; margin: 0!important;padding: 0px 16px;right: 0;top: 272px;bottom: auto;z-index: 800;-webkit-transform: rotate(-90deg);transform: rotate(-90deg);-webkit-transform-origin: 100% 100%;transform-origin: 100% 100%;background-color: #ffffff; border:1px solid #0f62fe;color:#0f62fe");
                            }else{
                                button.setAttribute("style", "position: fixed;cursor: pointer;font-weight: 400;font-size: 12px;line-height: 26px;outline: 0;text-align: center;height: 32px; margin: 0!important;padding: 0px 16px;right: 0;top: 272px;bottom: auto;z-index: 800;-webkit-transform: rotate(-90deg);transform: rotate(-90deg);-webkit-transform-origin: 100% 100%;transform-origin: 100% 100%;background-color: #ffffff; border:1px solid #0f62fe;color:#0f62fe");
                                //horizontal sitefeed back button 
                                //button.setAttribute("style", "position: fixed;cursor: pointer;font-weight: 300;font-size: 16px;line-height: 26px;color:#0f62fe;border: 1px solid #0f62fe;outline: 0;text-align: center;height: 48px; margin: 0!important;padding: 11px 18px;right: 0;top: 88%;bottom: auto;width: auto;z-index: 800;-webkit-transform: rotate(-90deg);transform: rotate(-0deg);-webkit-transform-origin: 100% 100%;transform-origin: 100% 100%;background-color: #ffffff;");
                            }
                        button.innerHTML = getFeedBackText();//'Site feedback';
                        console.log('Survey: Medallia Site Feedback button enabled on this page.');
                        setTimeout(function() {
                            //kampyleEvents();
                        },5000);
                    }else if(!window.nonJquery && defaultSetiings.override[tmpLibCurrentUrl] !== undefined && defaultSetiings.override[tmpLibCurrentUrl].enable_embed_js){
                        var fileref=document.createElement('script')
                        fileref.setAttribute("type","text/javascript")
                        fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                        fileref.async = true;
                        console.log("embedjs -->", fileref);
                        document.head.appendChild(fileref);
                        console.log('Embed JS added....');
                        setTimeout(function() {
                            //kampyleEvents();
                        },5000);
                    }
                    else if(window.nonJquery && defaultSetiings.override[tmpLibCurrentUrl] !== undefined && defaultSetiings.override[tmpLibCurrentUrl].enable_embed_js){
                        var fileref=document.createElement('script')
                        fileref.setAttribute("type","text/javascript")
                        fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                        fileref.async = true;
                        console.log("embedjs -->", fileref);
                        document.head.appendChild(fileref);
                        console.log('Embed JS added....');
                        setTimeout(function() {
                            //kampyleEvents();
                        },5000);
                    }
            } catch (e) {    
                console.log('Embed JS is not loaded .... Custom message..');
            }
            }

            //Marketplace Sitefeedback button UI CSS.
            function enableSitefeedbackButtonForMktPlace(){
                // event librety and button handuler
                if(tmpCurrentUrl == currentUrl && currentUrl.indexOf('&mhq=') == -1){
                    console.log('No matching url found for this:',window.location.href.replace(/(^\w+:|^)\/\//, ''));
                    console.log('Current url--> ',window.location.href.replace(/(^\w+:|^)\/\//, ''));
                }else{
                    console.log('Current url--> ',window.location.href.replace(/(^\w+:|^)\/\//, ''));
                    console.log('Matched url--> ',currentUrl);
                }
                       //window.location.href.replace(/(^\w+:|^)\/\//, '');
                        var tmpLibCurrentUrl = currentUrl;             
                        try {
                            if(defaultSetiings.override[tmpLibCurrentUrl] !== undefined && tmpLibCurrentUrl.indexOf('marketplace.redhat.com') != -1)
                            {
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js")    
                                fileref.async = true;
                               
                                document.head.appendChild(fileref);
                                var kamsurveyId = 710;
                    
                               var button = document.createElement('button');
                               button.setAttribute('value', getFeedBackText());
                               button.setAttribute('id', 'Site-feedback-btn-id');
                               button.setAttribute('onmouseover', 'onmouseoverFeedbackforMarketPlace(this)');
                               button.setAttribute('onmouseout', 'onmouseoutFeedbackforMarketPlace(this)');
                               //button.setAttribute('onfocus', 'onfocusFeedbackforMarketPlace(this)');
                               //button.setAttribute('onfocusout', 'onfocusoutFeedbackforMarketPlace(this)');
                               button.setAttribute('onclick', 'onclickFeedback('+kamsurveyId+')');
                               
                               button.setAttribute('form', 'myform');
                               document.body.appendChild(button);
                                var bottomnHgt  = window.innerHeight/2;
                                if (window.innerWidth > 770)
                                    {
                                        button.setAttribute("style", "position: fixed;cursor: pointer;font-weight: 300;font-size: 16px;line-height: 25px;outline: 0;text-align: center;height: 28px; margin: 0!important;padding: 0px 12px;right: 0;top: auto;bottom: "+bottomnHgt+"px;z-index: 800;-webkit-transform: rotate(-90deg);transform: rotate(-90deg);-webkit-transform-origin: 100% 100%;transform-origin: 100% 100%;background-color: #0066CC; border:0px solid #0f62fe;color:#FFFFFF;border-radius: 3px 3px 0px 0px;width: 142px;");
                                    }else{
                                        button.setAttribute("style", "position: fixed;cursor: pointer;font-weight: 300;font-size: 16px;line-height: 26px;outline: 0;text-align: center;height: 32px; margin: 0!important;padding: 0px 12px;right: 0;top: 150px;bottom: auto;z-index: 800;-webkit-transform: rotate(-90deg);transform: rotate(-90deg);-webkit-transform-origin: 100% 100%;transform-origin: 100% 100%;background-color: #ffffff; border:1px solid #0f62fe;color:#0f62fe;border-radius: 3px 3px 0px 0px;");
                                        }
                                button.innerHTML = getFeedBackText();//'Site feedback';
                                console.log('Survey: Medallia Site Feedback button enabled on this page.');
                                setTimeout(function() {
                                    //kampyleEvents();
                                },5000);
                            }else if(!window.nonJquery && defaultSetiings.override[tmpLibCurrentUrl] !== undefined && defaultSetiings.override[tmpLibCurrentUrl].enable_embed_js){
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                console.log("embedjs -->", fileref);
                                document.head.appendChild(fileref);
                                console.log('Embed JS added....');
                                setTimeout(function() {
                                    //kampyleEvents();
                                },5000);
                            }
                            else if(window.nonJquery && defaultSetiings.override[tmpLibCurrentUrl] !== undefined && defaultSetiings.override[tmpLibCurrentUrl].enable_embed_js){
                                var fileref=document.createElement('script')
                                fileref.setAttribute("type","text/javascript")
                                fileref.setAttribute("src", "https://resources.digital-cloud-ibm.medallia.eu/wdceuibm/2398/onsite/embed.js");
                                fileref.async = true;
                                console.log("embedjs -->", fileref);
                                document.head.appendChild(fileref);
                                console.log('Embed JS added....');
                                setTimeout(function() {
                                    //kampyleEvents();
                                },5000);
                            }
                    } catch (e) {    
                        console.log('Embed JS is not loaded .... Custom message..');
                    }
                    }
        


            //For Site feedback button text change, based on language.
            function getFeedBackText(){
                var langObj = {"enus":"Site feedback","arae":"ملاحظات وتعليقات بشأن الموقع","zhcn":"站点反馈","zhtw":"網站使用意見","frca":"Votre avis sur le site","frfr":"Avis sur le site","dede":"Feedback zur Website","esco":"Comentarios acerca del sitio","itit":"Feedback sul sito","ptbr":"","kokr":"","jajp":"サイトに関するフィードバック","kokr":"사이트 피드백","ptbr":"Feedback sobre o site","eses":"Opinión sobre el sitio","trtr":"Site Geri Bildirimi"};//{"enus":"Site feedback","dede":"Ihre Meinung","esco":"","frfr":"","itit":"","ptbr":"","kokr":"","jajp":"","jajp":"","ruru":"","zhtw":"網站反饋","zhcn":"","eses":"Site feedback-eses"};
                var localLang = "enus";
                try{
                    localLang = IBMCore.common.meta.page.pageInfo.language ? IBMCore.common.meta.page.pageInfo.language.replace('-','') : "enus";
                }catch(e){
                    try{
                        localLang = digitalData.page.pageInfo.language ? digitalData.page.pageInfo.language.replace('-','') : "enus";
                    }catch(e){}
                }
                return langObj[localLang.toLowerCase()] ? langObj[localLang.toLowerCase()] : langObj["enus"];
            }

        }

        window.siteFeedbackClose = function(){
            try{
                //$('#KampyleAnimationContainer').hide();
                document.getElementById('KampyleAnimationContainer').style.right = '-450px'
                document.getElementById('KampyleAnimationContainer').style.width = '0px'


            }catch (e) {}
        }
    
        surveyUtilFn.autoInit();


    }
}(jQuery));

jQuery(document).ready(function ($) {
    custom.ibm.ibmSurvey();
})

function onmouseoverFeedback(feedbackObj){
    feedbackObj.style.backgroundColor = "#e5e5e5";
    feedbackObj.style.color = "#0f62fe";
    feedbackObj.style.cursor = "pointer";
}
function onmouseoutFeedback(feedbackObj){
    feedbackObj.style.backgroundColor = "#ffffff";
    feedbackObj.style.color = "#0f62fe";
}
function onfocusFeedback(feedbackObj){
    feedbackObj.style.backgroundColor = "#ffffff";
    feedbackObj.style.color = "#0f62fe";
    feedbackObj.style.border = "2px solid #0f62fe";
}
function onfocusoutFeedback(feedbackObj){
    feedbackObj.style.backgroundColor = "#ffffff";
    feedbackObj.style.color = "#0f62fe";
    feedbackObj.style.border = "1px solid #0f62fe";
}
function onclickFeedback(surveyId){
    try {
        kampyleEvents(surveyId, 'Site Feedback');
        window.CM_APP.fireEvent('CLOSE_WINDOW');
        KAMPYLE_ONSITE_SDK.showForm(surveyId);
        document.getElementById('KampyleAnimationContainer').style.right = '0px';
        document.getElementById('KampyleAnimationContainer').style.width = '450px';
    } catch (e) {
        KAMPYLE_ONSITE_SDK.showForm(surveyId);
        document.getElementById('KampyleAnimationContainer').style.right = '0px';
        document.getElementById('KampyleAnimationContainer').style.width = '450px';
    }
}


function onmouseoutFeedbackforMarketPlace(feedbackObj){                              

    feedbackObj.style.backgroundColor = "#0066CC";
    feedbackObj.style.color = "#FFFFFF";
}

function onmouseoverFeedbackforMarketPlace(feedbackObj){
    feedbackObj.style.backgroundColor = "#E7F1FA";
    feedbackObj.style.color = "#0066CC";
    feedbackObj.style.cursor = "pointer";

}

function onfocusoutFeedbackforMarketPlace(feedbackObj){
   feedbackObj.style.backgroundColor = "#E7F1FA";
    feedbackObj.style.color = "#0066CC";
    feedbackObj.style.focus = "#2B9AF3";
}


function kampyleEvents(formid, touchPoint){

    var touchPointArr = {"client web":"Client Web NPS","non client nps branded":"Other Web NPS - with IBM logo","Site Feedback":"Site Feedback OSAT","search mot":"Search Experience OSAT","web-purchase":"Digital Purchase NPS", "digital purchase":"Digital Purchase NPS","non client nps non branded":"Other Web NPS - without IBM logo"};
    window.kampyformid = formid;
    window.kampytouchPoint = touchPointArr[touchPoint] ? touchPointArr[touchPoint] : touchPoint;
    if(!window.isKampyCalled){
        // Medallia event code start here
        window.addEventListener('MDigital_ShowForm_Called', function(eventName, payload) {
            console.log('Send the event deatls to MDigital_ShowForm_Called');

            var appInfoEvent = {
                type              : 'element',
                primaryCategory   : 'Medallia_Survey',
                eventName         : 'Called',
                eventCategoryGroup: window.kampytouchPoint,
                eventCallBackCode : window.kampyformid
             }
             console.log('medalia event',appInfoEvent);
             ibmStats.event(appInfoEvent);
             window.removeEventListener('MDigital_ShowForm_Called',function(eventName, payload){});
        });
             
        window.addEventListener('MDigital_Form_Close_Submitted', function(eventName, payload) {
            console.log('MDigital_Form_Close_Submitted Medallia event called');
            
            var appInfoEvent = {
                type              : 'element',
                primaryCategory   : 'Medallia_Survey',
                eventName         : 'Submitted',
                eventCategoryGroup: window.kampytouchPoint,
                eventCallBackCode : window.kampyformid
             }
             ibmStats.event(appInfoEvent);
            window.removeEventListener('MDigital_Form_Close_Submitted',function(){});
        });
        
        window.addEventListener('MDigital_Form_Close_No_Submit', function(eventName, payload) {
            console.log('MDigital_Form_Close_No_Submit Medallia event called');
            var appInfoEvent = {
                type              : 'element',
                primaryCategory   : 'Medallia_Survey',
                eventName         : 'No_Submit',
                eventCategoryGroup: window.kampytouchPoint,
                eventCallBackCode : window.kampyformid
             }
             ibmStats.event(appInfoEvent);
             window.removeEventListener('MDigital_Form_Close_No_Submit',function(){});
        });
         // Medallia event code ends here
         window.isKampyCalled = true;
    }
    
}
    myibm.custnamespace('custom.ibm.surveyccfintercept');
    custom.ibm.surveyccfintercept = function () {
        return language = {
            "enus": {
                invitation: {
                    title: "Tell IBM what you think",
                    content: "Would you please take a minute to send IBM your feedback?",
                    yes_label: "Yes",
                    no_label: "No Thanks",
                },
                anony_text: "Your feedback is anonymous",
                about_feedback: "About ongoing feedback at IBM",
                about_feedback_title: "Ongoing Web Feedback at IBM",
                about_feedback_para1: "IBM collects opt-in feedback from IBM web users on a broad and continual basis throughout its web sites. All feedback submitted are reviewed only by IBM employees or IBM affiliates and no feedback is shared outside of IBM for any reason. See IBM's <a href=\"http://www.ibm.com/privacy/us/en/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">privacy policy</a> and <a href=\"http://www.ibm.com/legal/us/en/\" data-action=\"close-overlay\" target=\"_ibm_tou\">terms of use</a> for further detail.",
                about_feedback_para2: "Your input is very valuable to us and although we read every comment that is sent to IBM in an effort to continuously improve our web sites for you, we generally do not reply to comments from this system unless otherwise stated. Thank you for participating in the IBM web feedback program.",
                back_to_feedback: "Back to Feedback"
            },
            "dede": {
                invitation: {
                    title: "Teilen Sie IBM Ihre Meinung mit",
                    content: "Würden Sie sich bitte ein paar Minuten Zeit nehmen, um Ihr Feedback an IBM zu senden?",
                    yes_label: "Ja",
                    no_label: "Nein danke",
                    first_time_title: "Hello"
                },
                anony_text: "Ihr Feedback ist anonym",
                about_feedback: "Informationen zum kontinuierlichen Feedback an IBM",
                about_feedback_title: "Kontinuierliches Web-Feedback bei IBM",
                about_feedback_para1: "IBM erfasst Opt-in-Feedback von IBM Webbenutzern auf einer breiten und kontinuierlichen Basis auf allen IBM Websites. Das gesamte übermittelte Feedback wird ausschließlich von IBM Mitarbeitern oder IBM Partnern gelesen. Keine Informationen aus dem Feedback verlassen die IBM aus irgendeinem Grund. Weitere Informationen hierzu finden Sie in den IBM <a href=\"http://www.ibm.com/privacy/de/de/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">Datenschutzrichtlinien</a> und den <a href=\"http://www.ibm.com/legal/de/de/\" data-action=\"close-overlay\" target=\"_ibm_tou\">rechtlichen Hinweisen.</a>",
                about_feedback_para2: "Ihre Informationen sind wertvoll für uns. Wir lesen jeden eingesendeten Kommentar, um unsere Websites kontinuierlich für Sie zu verbessern. Wir antworten aber generell nicht auf Kommentare von diesem System aus, es sei denn, es gibt einen entsprechenden Hinweis. Vielen Dank für Ihre Teilnahme am IBM Web-Feedback-Programm.",
                back_to_feedback: "Zurück zum Feedback"
            },
            "eses": {
                invitation: {
                    title: "Cuéntele a IBM lo que piensa",
                    content: "¿Dedicaría unos minutos a enviar a IBM sus comentarios?",
                    yes_label: "Sí",
                    no_label: "No, gracias",
                },
                anony_text: "Sus comentarios son anónimos",
                about_feedback: "Acerca del feedback continuo en IBM",
                about_feedback_title: "Feedback web continuo de IBM",
                about_feedback_para1: "IBM recopila feedback de usuarios web de IBM, de acuerdo con una base amplia y continua en todos sus sitios web. Únicamente empleados o afiliados de IBM revisan los comentarios enviados, y bajo ningún concepto se comparten fuera de IBM. Consulte la <a href=\"http://www.ibm.com/privacy/es/es/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">política de privacidad</a> y las <a href=\"http://www.ibm.com/legal/es/es/\" data-action=\"close-overlay\" target=\"_ibm_tou\">condiciones</a> de uso de IBM para obtener más información.",
                about_feedback_para2: "Su opinión es muy importante para nosotros y, a pesar de que leemos todos los comentarios que se envían a IBM a fin de mejorar continuamente nuestros sitios web, no solemos responder a los comentarios de este sistema, a menos que se indique lo contrario. Gracias por participar en el programa de feedback web de IBM.",
                back_to_feedback: "Volver a Feedback"
            },
            "esco": {
                invitation: {
                    title: "Dé su opinión a IBM",
                    content: "¿Podría dedicar un minuto a enviar su retroalimentación a IBM?",
                    yes_label: "Sí",
                    no_label: "No, gracias",
                },
                anony_text: "Su retroalimentación es anónima",
                about_feedback: "Acerca de la retroalimentación continua en IBM",
                about_feedback_title: "Retroalimentación web continua en IBM",
                about_feedback_para1: "IBM recopila retroalimentación opcional de los usuarios a través de todos sus sitios web de manera amplia y continua. Toda la retroalimentación enviada es revisada solo por los empleados de IBM o sus afiliados y por ninguna razón esta se comparte fuera de IBM. Para detalles adicionales, consulte la <a href=\"http://www.ibm.com/privacy/co/es/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">política de privacidad</a> de IBM y los <a href=\"http://www.ibm.com/legal/co/es/\" data-action=\"close-overlay\" target=\"_ibm_tou\">términos de uso.</a>",
                about_feedback_para2: "Sus comentarios son de mucho valor para nosotros y aunque leemos todos los comentarios enviados a IBM en un esfuerzo continuo por mejorar nuestros sitios web, por lo general no respondemos a los comentarios desde este sistema a menos que se indique lo contrario. Gracias por participar en el programa de retroalimentación web de IBM.",
                back_to_feedback: "Volver a Retroalimentación"
            },
            "frca": {
                invitation: {
                    title: "IBM veut savoir ce que vous pensez",
                    content: "Pourriez-vous prendre quelques instants pour transmettre votre rétroaction à IBM?",
                    yes_label: "Oui",
                    no_label: "Non merci",
                },
                anony_text: "Votre rétroaction est anonyme.",
                about_feedback: "À propos du programme de rétroaction en continu d’IBM",
                about_feedback_title: "Programme en ligne de rétroaction en continu d’IBM",
                about_feedback_para1: "C’est avec consentement qu’IBM collecte des rétroactions auprès des utilisateurs sur une base générale et continuelle partout sur ses sites Web. Seuls des employés d’IBM ou de sociétés affiliées à IBM prennent connaissance des rétroactions envoyées. En aucun cas, et pour quelque raison que ce soit, les rétroactions ne sont partagées à l’extérieur d’IBM. Consultez la <a href=\"http://www.ibm.com/privacy/ca/fr/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">politique d’IBM en matière de protection des renseignements personnels</a> et les <a href=\"http://www.ibm.com/legal/ca/fr/\" data-action=\"close-overlay\" target=\"_ibm_tou\">modalités d’utilisation</a> d’IBM si vous souhaitez en savoir davantage à ce sujet.",
                about_feedback_para2: "Votre apport est précieux, et même si tous les commentaires envoyés à IBM sont lus dans un effort d’amélioration continue des sites Web de l’entreprise que vous consultez, en règle générale, IBM ne répond pas aux commentaires reçus par le biais du présent programme, à moins d’avis contraire. Merci de votre participation au programme de rétroaction d’IBM.",
                back_to_feedback: "Retour à la rétroaction"
            },
            "frfr": {
                invitation: {
                    title: "Faites part de vos impressions à IBM",
                    content: "Accepteriez-vous de prendre quelques minutes pour envoyer vos commentaires à IBM ?",
                    yes_label: "Oui",
                    no_label: "Non, merci.",
                },
                anony_text: "Vos commentaires sont anonymes",
                about_feedback: "A propos du retour d'information continu d'IBM",
                about_feedback_title: "Retour d'information en ligne continu d'IBM",
                about_feedback_para1: "IBM collecte les retours d'information volontaires des utilisateurs Web IBM en permanence sur l'ensemble de ses sites Web. Tous ces retours d'information sont examinés uniquement par des employés ou des affiliés d'IBM et aucun retour n'est communiqué à l'extérieur pour quelque raison que ce soit. Pour plus de détails, se reporter à <a href=\"http://www.ibm.com/privacy/fr/fr/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">la politique de confidentialité</a> et <a href=\"http://www.ibm.com/legal/fr/fr/\" data-action=\"close-overlay\" target=\"_ibm_tou\">aux conditions d'utilisation</a> d'IBM.",
                about_feedback_para2: "Votre avis nous est très précieux et même si, dans notre effort d'amélioration continue de nos sites Web, nous lisons tous les commentaires envoyés à IBM, nous n'y répondons généralement pas depuis ce système sauf indications contraires. Merci de votre participation au programme de retour d'information en ligne d'IBM.",
                back_to_feedback: "Retour à Retour d'information"
            },
            "itit": {
                invitation: {
                    title: "Di’ a IBM cosa ne pensi",
                    content: "Potresti gentilmente dedicarci un minuto per inviare il tuo feedback a IBM?",
                    yes_label: "Sì",
                    no_label: "No, grazie",
                },
                anony_text: "Il tuo feedback è anonimo",
                about_feedback: "Informazioni sul feedback continuo di IBM",
                about_feedback_title: "Feedback continuo online di IBM",
                about_feedback_para1: "IBM raccoglie il feedback opt-in dei propri utenti Web in maniera costante e su ampia scala attraverso i propri siti. Tutti i feedback inviati sono verificati esclusivamente dai dipendenti o dalle consociate di IBM e non vengono condivisi per nessun motivo all'esterno di IBM. Per maggiori dettagli, consulta <a href=\"http://www.ibm.com/privacy/it/it/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">la politica sulla privacy</a> e <a href=\"http://www.ibm.com/legal/it/it/\" data-action=\"close-overlay\" target=\"_ibm_tou\">i termini di utilizzo</a> di IBM.",
                about_feedback_para2: "I tuoi commenti sono molto importanti per noi e sebbene vengano letti tutti ai fini di migliorare costantemente i nostri siti Web, generalmente non rispondiamo ai commenti da questo sistema, se non diversamente specificato. Ti ringraziamo per aver partecipato al programma per l'invio di feedback online di IBM.",
                back_to_feedback: "Torna al feedback"
            },
            "jajp": {
                invitation: {
                    title: "IBM にご意見をお寄せください",
                    content: "IBM へのフィードバックの提供にご協力いただけますか？",
                    yes_label: "はい",
                    no_label: "いいえ、できません",
                },
                anony_text: "お客様のフィードバックは匿名です",
                about_feedback: "IBM への継続的なフィードバックについて",
                about_feedback_title: "IBM への継続的な Web フィードバック",
                about_feedback_para1: "IBM は、IBM の Web サイトの利用者様から、IBM の Web サイト全体をとおして広範かつ継続的な観点で、利用者様の許可を事前に得た上でフィードバックを収集しています。ご提供いただいたすべてのフィードバックは、IBM の社員または IBM の関連会社のみが閲覧し、いかなる理由においても IBM の社外で共有されることはありません。 詳しくは、IBM の<a href=\"http://www.ibm.com/privacy/jp/ja/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">プライバシー・ポリシー</a>および<a href=\"http://www.ibm.com/legal/jp/ja/\" data-action=\"close-overlay\" target=\"_ibm_tou\">ご利用条件</a>を参照してください。",
                about_feedback_para2: "IBM ではお客様のご意見は重要と考えています。お寄せいただいたご意見はすべて拝見し、IBM の Web サイト改善の継続的な取り組みに役立てていますが、別段の定めがない限り、このシステムからの返信はいたしかねますので、あらかじめご了承ください。この度は、IBM の Web フィードバック・プログラムにご協力いただき、ありがとうございました。",
                back_to_feedback: "フィードバックに戻る"
            },
            "kokr": {
                invitation: {
                    title: "IBM에 귀하의 의견을 보내주십시오.",
                    content: "잠시 시간을 할애하셔서 IBM에 피드백을 보내주시겠습니까?",
                    yes_label: "예",
                    no_label: "아니요, 사양하겠습니다",
                },
                anony_text: "귀하의 피드백을 익명으로 유지",
                about_feedback: "IBM의 진행 중인 피드백에 관한 정보",
                about_feedback_title: "IBM의 진행 중인 웹 피드백",
                about_feedback_para1: "IBM은 웹 사이트 전체에서 광범위하고 지속적으로 IBM 웹 사용자의 사전 동의 피드백을 수집합니다. 제출된 모든 피드백은 IBM 직원이나 IBM 계열사만 검토하며 어떠한 이유로도 IBM 외부와 피드백을 공유하지 않습니다. 자세한 내용은 IBM <a href=\"http://www.ibm.com/privacy/kr/ko/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">개인정보 보호정책</a> 및 <a href=\"http://www.ibm.com/legal/kr/ko/\" data-action=\"close-overlay\" target=\"_ibm_tou\">이용 약관</a>을 참조하십시오.",
                about_feedback_para2: "귀하의 의견은 IBM에게 매우 귀중하며, 지속적인 웹 사이트 개선을 위한 노력의 일환으로 보내 주신 모든 의견을 읽고 있습니다. 하지만 별도로 명시되지 않는 한 이 시스템에서 귀하의 의견에 대한 응답을 보내지는 않습니다. IBM 웹 피드백 프로그램에 참여해 주셔서 감사합니다.",
                back_to_feedback: "피드백으로 돌아가기"
            },
            "ptbr": {
                invitation: {
                    title: "Diga à IBM o que você pensa",
                    content: "Você poderia dedicar um minuto para enviar o seu feedback à IBM?",
                    yes_label: "Sim",
                    no_label: "Não, obrigado",
                },
                anony_text: "Seu feedback é anônimo",
                about_feedback: "Sobre o feedback contínuo na IBM",
                about_feedback_title: "Feedback contínuo via web na IBM",
                about_feedback_para1: "A IBM coleta feedback opcionais de usuários da web da IBM de forma ampla e contínua em todos os seus websites. Todos os feedbacks enviados são revisados apenas por funcionários da IBM ou afiliados da IBM e nenhum feedback é compartilhado fora da IBM por qualquer motivo. Consulte a <a href=\"http://www.ibm.com/privacy/br/pt/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">política de privacidade</a> e os <a href=\"http://www.ibm.com/legal/br/pt/\" data-action=\"close-overlay\" target=\"_ibm_tou\">termos de uso</a> da IBM e para obter mais detalhes.",
                about_feedback_para2: "Sua opinião é muito valiosa para nós e, embora todos os comentários enviados à IBM sejam lidos no esforço de melhorar continuamente nossos websites para você, nós geralmente não respondemos aos comentários neste sistema, a menos que definido de outra forma. Agradecemos sua participação no programa de feedback IBM.",
                back_to_feedback: "Voltar ao Feedback"
            },
            "ruru": {
                invitation: {
                    title: "Поделитесь с IBM своим мнением",
                    content: "Согласны ли вы оставить отзыв для компании IBM?",
                    yes_label: "Да",
                    no_label: "Нет, спасибо",
                },
                anony_text: "Мы гарантируем анонимность предоставленного вами отзыва",
                about_feedback: "Информация о предоставлении отзывов для компании IBM",
                about_feedback_title: "Предоставление отзывов о веб-сайте компании IBM",
                about_feedback_para1: "Компания IBM посредством своих веб-сайтов собирает отзывы пользователей веб-сайтов IBM на постоянной основе и в широком масштабе. Все отправленные отзывы просматриваются только сотрудниками компании IBM или ее филиалов. Ни при каких обстоятельствах полученные отзывы не передаются за пределы компании IBM. Подробная информация приведена в <a href=\"http://www.ibm.com/privacy/ru/ru/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">политике конфиденциальности</a> компании IBM и <a href=\"http://www.ibm.com/legal/ru/ru/\" data-action=\"close-overlay\" target=\"_ibm_tou\">условиях использования</a>.",
                about_feedback_para2: "Ваши мнение очень ценно для нас. Несмотря на то, что мы читаем каждый отзыв, отправленный в компанию IBM, с тем что бы непрерывно улучшать работу наших веб-сайтов, как правило, мы не отвечаем на отзывы в этой системы, если не оговорено иное. Спасибо за участие в программе онлайн-отзывов IBM.",
                back_to_feedback: "Назад к отзыву"
            },
            "trtr": {
                invitation: {
                    title: "Görüşlerinizi IBM'le paylaşın",
                    content: "Lütfen bir dakikanızı ayırıp IBM'e geri bildirim gönderir misiniz?",
                    yes_label: "Evet",
                    no_label: "Hayır teşekkür ederim",
                },
                anony_text: "Geri bildiriminiz anonim kalacaktır",
                about_feedback: "IBM'e düzenli geri bildirim gönderme hakkında",
                about_feedback_title: "IBM'de düzenli geri bildirim",
                about_feedback_para1: "IBM, web siteleri aracılığıyla IBM web kullanıcılarının onayını alarak düzenli ve kapsamlı bir şekilde geri bildirim almaktadır. Gönderilen tüm geri bildirimler yalnızca IBM'in veya bağlı kuruluşlarının çalışanları tarafından incelenmekte ve bu geri bildirimler hiçbir nedenle IBM dışında paylaşılmamaktadır. Bu konuya ilişkin daha ayrıntılı bilgi almak için IBM'in <a href=\"http://www.ibm.com/privacy/tr/tr/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">gizlilik ilkesine</a> ve <a href=\"http://www.ibm.com/legal/tr/tr/\" data-action=\"close-overlay\" target=\"_ibm_tou\">kullanım koşullarına</a> bakın.",
                about_feedback_para2: "Geri bildirimleriniz bizim için çok değerlidir ve IBM'e gönderilen her yorumu, sizin için web sitelerimizi sürekli olarak iyileştirmek amacıyla okumamıza karşın aksi belirtilmedikçe genel olarak bu sistemden yorumlara yanıt vermiyoruz. IBM web üzerinden geri bildirim gönderme programına katıldığınız için size teşekkür ederiz.",
                back_to_feedback: "Geri Bildirim'e geri dön"
            },
            "zhcn": {
                invitation: {
                    title: "请告诉IBM您的想法",
                    content: "您愿意花一点时间向IBM提供反馈意见吗？",
                    yes_label: "愿意",
                    no_label: "不愿意",
                },
                anony_text: "您的反馈为匿名反馈",
                about_feedback: "关于IBM的持续反馈",
                about_feedback_title: "关于IBM的持续网络反馈",
                about_feedback_para1: "IBM 在其整个网站内广泛、持续地收集来自 IBM Web用户的输入反馈。提交的所有反馈仅供 IBM 员工或 IBM 附属机构查看， 不会出于任何原因在 IBM 外部共享任何反馈。请参阅 IBM <a href=\"http://www.ibm.com/privacy/cn/zh/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">隐私策略</a>和<a href=\"http://www.ibm.com/legal/cn/zh/\" data-action=\"close-overlay\" target=\"_ibm_tou\">使用条款</a>以获取更多详细信息。",
                about_feedback_para2: "您的意见对我们非常宝贵，虽然我们会阅读发送给 IBM 的旨在持续不断地为您 改进我们网站的每一条意见，但除非另有声明，否则我们通常不会从该系统回复这些意见。感谢您参与 IBM Web 反馈计划。",
                back_to_feedback: "返回“反馈”"
            },
            "zhtw": {
                invitation: {
                    title: "向 IBM 提供您的意見",
                    content: "您有空向IBM提供反饋意見嗎？",
                    yes_label: "有",
                    no_label: "沒有",
                },
                anony_text: "您的意見發表採匿名方式",
                about_feedback: "關於在 IBM 持續提供意見",
                about_feedback_title: "關於IBM的持續網絡反饋",
                about_feedback_para1: "IBM 透過所屬網站廣泛且持續收集 IBM Web 使用者自願提供的意見。所有的提交意見僅供 IBM 員工或 IBM 關係企業檢閱，絕對不會為了任何理由從 IBM 外流。請參閱 IBM 的<a href=\"http://www.ibm.com/privacy/tw/zh/\" target=\"_ibm_privacy_policy\" data-action=\"close-overlay\">隱私權原則</a>與<a href=\"http://www.ibm.com/legal/tw/zh/\" data-action=\"close-overlay\" target=\"_ibm_tou\">使用條款</a>，以取得進一步詳細資料。",
                about_feedback_para2: "您的意見對我們來說很珍貴，雖然 IBM 會盡可能閱讀每個意見，但除非另有說明，否則我們一般不會透過此系統回覆任何評論。謝謝您參與 IBM Web 意見回饋方案。",
                back_to_feedback: "回到意見回饋"
            }
        }
    }
