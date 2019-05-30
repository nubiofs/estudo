// Google Maps plugin by Avi Alkalay
// License LGPL
//
// http://avi.alkalay.net/2006/11/google-maps-plugin-for-wordpress.html
//
// $Id: googlemapsPlugin.js 81498 2008-12-21 11:31:48Z avibrazil $
//




/* Would like to extend Element with Element.prototype but its not supported on IE6.
   So I have to define next 2 methods in an ugly, non-OO way. */

function firstChildElement(elem) {
//	alert("firstChildElement: " + elem.nodeName + " innerHTML='" + elem.innerHTML + "'");

	var walker=elem.firstChild;
//	var i;

	while (walker && (walker.nodeType != 1)) walker=walker.nextSibling;

//	alert(i + " child itarations: " + walker.nodeName);

	return walker;
}



function nextSiblingElement(elem) {
	var walker=elem.nextSibling;

	while (walker && (walker.nodeType != 1)) walker=walker.nextSibling;

	// alert(i + " sibling itarations: " + walker.nodeName);

	return walker;
}





/**
 * Class to store all single map related parameters: markers, geo position,
 * map type, map options, overlays, HTML element to hook to, style etc.
 */
function MapData(elem, commandsAttributeName, defaultW, defaultH) {
	// DOM related stuff
	this.elem=elem;
	this.inheritedStyle=null;
	this.className=null;
	this.inheritedID=null;
	this.defaultW=defaultW;
	this.defaultH=defaultH;

	this.commandsAttributeName=commandsAttributeName;

	// Map related stuff
	this.type=G_NORMAL_MAP;
	this.geoCoord=null;
	this.zoom=null;
	this.overviewMapControl=true;
	this.controls=true;
	this.showMarkers=true;

	this.detaultGeoCoord=new GLatLng(-15.779699,-47.910004);

	// The markers including baloon text, position, etc
	this.markers=[];

	// List of URLs to KMLs and GeoRSSs to overlay the map
	this.xmlOverlays=[];

	this.debug=0;
}


/**
 * Debugging function.
 */
MapData.prototype.toString = function() {
	var text="";

	text += "Center: " + this.geoCoord.toString() + "<br/>";
	text += "Zoom: " + this.zoom + "<br/>";

	return text;
}





/**
 * This is the method that effectively creates the Google Map based
 * on the MapData object.
 */
MapData.prototype.createGoogleMap = function() {
	var realMap;
	var mapNode;
	var dimX;
	var dimY;

	mapNode = document.createElement("div");

	if (this.className) mapNode.className = "map " + this.className;
	else mapNode.className = "map";

	if (this.inheritedStyle) mapNode.style.cssText = this.inheritedStyle;

	mapNode.style.display = "block";
	if (mapNode.style.visibility == "hidden")
		 mapNode.style.visibility="inherit";

	this.elem.parentNode.replaceChild(mapNode, this.elem);


	if (mapNode.style.width == 0) {
		if (this.defaultW.toString().indexOf("%")!=-1)
			mapNode.style.width = this.defaultW;
		else mapNode.style.width = this.defaultW + "px";
	}

	if (mapNode.style.height == 0) {
		if (this.defaultH.toString().indexOf("%")!=-1)
			mapNode.style.height = this.defaultH;
		else mapNode.style.height = this.defaultH + "px";
	}

	if (this.inheritedID) mapNode.id = this.inheritedID;
	else mapNode.id = "googlemap-" + Math.ceil(10000*Math.random());

	// The "size:" exist only for thickbox compatibility
	// http://avi.alkalay.net/2006/11/google-maps-plugin-for-wordpress.html/comment-page-11#comment-134546
//	realMap = new GMap2(mapNode,
//		{size: new GSize(this.defaultW,this.defaultH)});

	realMap = new GMap2(mapNode);

	realMap.setCenter(this.geoCoord, parseInt(this.zoom),this.type);


	if (this.controls) {
		if (parseInt(mapNode.style.height)>=320)
			realMap.addControl(new GLargeMapControl());
		else realMap.addControl(new GSmallMapControl());

		realMap.addControl(new GMapTypeControl());
		realMap.addControl(new GScaleControl());

		if (this.overviewMapControl)
			realMap.addControl(new GOverviewMapControl());
	}
	
	while (this.xmlOverlays.length > 0) {
		var url=this.xmlOverlays.shift();
		var overlay=new GGeoXml(url);

		realMap.addOverlay(overlay);
//		GLog.write("Z-Index: " + GOverlay.getZIndex(-23.250967));
//		GLog.write("KML URI: " + url);
		//	overlay.redraw(true);
	}

	if (this.showMarkers && this.markers.length>0) {
		var manager=new GMarkerManager(realMap);
	
		manager.addMarkers(this.markers,1);
		manager.refresh();
	}
//	alert("Finished map with id=" + this.inheritedID);
}




/**
 * Extract Latitude and Longitude, zoom factor, wheter to show an overview
 * mini map, map type, and possibly detect a My Maps ID, all from a Google
 * Maps URL.
 *
 */
MapData.prototype.parseGoogleMapsURL = function(gmapsurl) {
	if (gmapsurl.indexOf("http://maps.google.")==-1) return 0;

	var i;
	var params = gmapsurl.split("?");
	params = params[1].split("&");

	for (i=0; i<=params.length-1; i++) {
		var param = params[i].split("=");
		switch (param[0]) {
			case "ll": {
				var _geocoord = param[1].split(",");
				if (_geocoord[0]!=null || _geocoord[1]!=null) {
					this.geoCoord=new GLatLng(_geocoord[0],_geocoord[1]);
				}
				//alert("found long lat:"+ll[0]+"/"+ll[1]);
			}
			break;
			case "z": {
				this.zoom = param[1];
			}
			break;
			case "om": {
				this.overviewMapControl = (param[1]==0 ? false : true);
			}
			break;
			case "t": {
				switch (param[1]) {
					case 'k': this.type=G_SATELLITE_MAP;
					break;
					case 'h': this.type=G_HYBRID_MAP;
					break;
					case 'p': this.type=G_PHYSICAL_MAP;
				}
			}
			break;
			case "msid": {
				// This is a multimarker map built and saved on Google Maps UI
				this.xmlOverlays.push("http://maps.google.com/maps/ms?oe=UTF-8&msa=0&output=kml&msid=" + param[1]);
			}
			break;
		}
	}
	return 1;
}




/**
 * Parse stuff from title="" or rel="" attributes on XHTML elements.
 * Mostly operational mode, map size, etc.
 */
MapData.prototype.parseCommands = function(commands) {
	if (commands == undefined) return 0;

	if (commands.indexOf("googlemap") == -1) return 0;

//	alert("This is a googlemap");

	var params=commands.split(";");
	var i;

	for (i=0; i<params.length; i++) {
//		alert("Parsing \"" + params[i] + "\"");
		if (params[i].indexOf("nomarker")!=-1) {
			this.showMarkers=false;
		} else if (params[i].indexOf("w:")!=-1) {
			var val = params[i].split(':');
			this.defaultW=val[1];
		} else if (params[i].indexOf("h:")!=-1) {
			var val = params[i].split(':');
			this.defaultH=val[1];
		} else if (params[i].indexOf("nocontrol")!=-1) {
			this.controls=false;
		}
	}
	return 1;
}



/**
 * Creates a GMaps marker and rich HTML balloon.
 */
MapData.prototype.addMarker = function(point,markerHTML) {
	var marker = new GMarker(point);

	if (markerHTML)
		GEvent.addListener(marker, "click", function() {
			var opts = { maxWidth : 450 };
			marker.openInfoWindowHtml("<div class=\"balloon\" style=\"width:auto;height:auto\">"+markerHTML+"</div>", opts);
		});

	this.markers.push(marker);
}




/**
 * Parse an entire <a title="googlemap"> element, including map URL,
 * operating mode, CSS style, etc and save it on the MapData object.
 */
MapData.prototype.parseAnchorTag = function() {
	if (!this.parseGoogleMapsURL(this.elem.href)) return 0;
	if (this.geoCoord == null) this.geoCoord=this.defaultGeoCoord;

	if (this.elem.style.cssText) this.inheritedStyle=this.elem.style.cssText;
	if (this.elem.className) this.className=this.elem.className;
	if (this.elem.id) this.inheritedID=this.elem.id;

	this.addMarker(this.geoCoord, this.elem.innerHTML);

	return 1;
}





/**
 * Parse an entire <dl title="googlemap"> element, including sub elements,
 * operating mode, CSS style, etc and save it on the MapData object.
 */
MapData.prototype.parseDefinitionBlock = function() {
	var walker;

	if (this.elem.style.cssText) this.inheritedStyle=this.elem.style.cssText;
	if (this.elem.className) this.className=this.elem.className;
	if (this.elem.id) this.inheritedID=this.elem.id;

	this.elem.title=null; // Get rid of "googlemap" and friends commands

//	alert("Found a map with id=" + this.inheritedID);


	walker=firstChildElement(this.elem);  // Points to first <dt>
//	alert("First child: " + walker.nodeName.toLowerCase());

	// Proccess each <dt> and <dd> pair
	while (walker && walker.nodeName.toLowerCase() == "dt") {
		// Get an <a> with the marker's position
		var elem=firstChildElement(walker);

		if (!elem) {
			// Empty <dt></dt>
			// Iterate until next <dt>
			do walker=nextSiblingElement(walker);
			while (walker && walker.nodeName.toLowerCase() != "dt");

			// Restart loop
			continue;
		}

//		alert("Parsing element " + elem.nodeName);

		if (elem.nodeName.toLowerCase() == "a") {
			if (this.geoCoord==null) {
				// We still don't have a center point, so the first <a> is the center of map
				this.parseGoogleMapsURL(elem.href); // && alert("Found a center point");

				do walker=nextSiblingElement(walker); // move to next <dt>
				while (walker && walker.nodeName.toLowerCase() != "dt");

				continue;
			} else if (elem.title=="kml" || elem.title=="georss") {
				// This is a KML or GeoRSS resource on the web.
				this.xmlOverlays.push(elem.href);

				// <dd> is useless in this case
				do walker=nextSiblingElement(walker); // move to next <dt>
				while (walker && walker.nodeName.toLowerCase() != "dt");

				continue;
			} else {
				// We already have a center point, so this is a plain marker
				var tempMapData=new MapData();

				if (!tempMapData.parseGoogleMapsURL(elem.href)) {
					do walker=nextSiblingElement(walker); // move to next <dt>
					while (walker && walker.nodeName.toLowerCase() != "dt");

					continue;
				}

				// We already have the marker position, now get the HTML for the balloon

				// Make walker point to <dd>
				do walker=nextSiblingElement(walker);
				while (walker && (walker.nodeName.toLowerCase() != "dd" && walker.nodeName.toLowerCase() != "dt"));

				if (walker && walker.nodeName.toLowerCase() == "dd") {
					this.addMarker(tempMapData.geoCoord,walker.innerHTML);
//					alert("Found a marker point. Balloon is: " + walker.innerHTML);
				} else this.addMarker(tempMapData.geoCoord); // Marker with no balloon
			}
		}

//		alert("Looking for next <dt>. Walker=" + walker.nodeName.toLowerCase());

		// Parsed a center <dt> ar a <dt>+<dd> pair. Seek next <dt>.
		while (walker && walker.nodeName.toLowerCase() != "dt")
			walker=nextSiblingElement(walker); // move to next <dt>
	}

	if (this.geoCoord==null) return 0;
	else return 1;
}



/**
 * A wrapper for parseAnchorTag() and parseDefinitionBlock() defined above
 */
MapData.prototype.parseNode = function () {
	// alert("parseNode: <" + this.elem.nodeName + " title='" + this.elem.getAttribute("title") + "'>");

	switch (this.elem.nodeName.toLowerCase()) {
		case "dl":
//			alert("Found a <dl id='" + this.elem.id + "'>");
			if (!this.parseCommands(this.elem.getAttribute("title"))) return false;
			if (!this.parseDefinitionBlock(this.commandsAttributeName)) return false;
		break;
		case "a":
			if (!this.parseCommands(this.elem.getAttribute(this.commandsAttributeName))) return false;
			if (!this.parseAnchorTag(this.commandsAttributeName)) return false;
		break;
		default: return false;
	}
	return true;
}





/**
 * Walks through all DOM nodes on the document looking for supported
 * elements and rel=/title="googlemap".
 */
MapPlugin.prototype.consumeMapContainers = function() {
	var mapContainers=["dl","a"];

	var attributeForCommands="title";

	if (this.useRelAttribute)
		attributeForCommands="rel";

	for (var i1=0; i1<mapContainers.length; i1++) {
		var elems=document.getElementsByTagName(mapContainers[i1]);
		var cur=null;
		var i2=0;

//		alert("Found " + elems.length + " " + mapContainers[i1] + " elements."); 

//		alert("Start processing " + mapContainers[i1] + " elements.");
		while ((cur=elems.item(i2))) {
			var cmd=null;
			var map = new MapData(cur,attributeForCommands,this.defaultW,this.defaultH);

			if (map.parseNode()) this.maps.unshift(map);
			else delete map;

// //			dump("Processing element " + cur.nodeName.toLowerCase() + ".\n");
// 			if (cur.nodeName.toLowerCase() == "a")
// 				cmd=cur.getAttribute(attributeForCommands);
// 			else cmd=cur.getAttribute("title");
// 
// 			if (cmd && cmd.indexOf("googlemap")!=-1) {
// 				var map = new MapData(cur,attributeForCommands,this.defaultW,this.defaultH);
// 
// 				if (map.parseNode()) this.maps.unshift(map);
// 				else {
// 					// Not a Google Map
// 					delete map;
// 				}
// 			}

			i2++;
		}

//		alert("Finished processing " + mapContainers[i1] + " elements.");
	}
}




/**
 * After parsing and creating all MapData objects, efficiently create
 * the found maps.
 */
MapPlugin.prototype.createMaps = function() {
	var map;

	while ((map=this.maps.pop())) {
		map.createGoogleMap();
		delete map;     // don't need object in memory anymore
	}
}




/*
 * Object created by window.onload() event, contains global maps options as
 * sizes etc, starts and finishes all maps fetching and creation proccess.
 *
 * This is the plugin object per se.
 */
function MapPlugin(_defaultWidth, _defaultHeight, _useRelAttribute) {
	this.defaultW = _defaultWidth;
	this.defaultH = _defaultHeight;
	this.userRelAttribute = _useRelAttribute;

	this.maps=new Array;

	this.consumeMapContainers();
	this.createMaps();
}



/**
 * Creates triggers on page loading/unloading events for plugin initialization.
 */
function MapPluginInit(_defaultWidth, _defaultHeight, _useRelAttribute) {
	if (! GBrowserIsCompatible()) return;

	var oldOnLoad = window.onload;
	var oldOnUnload = window.onunload;

	var instantiate = function() {
		new MapPlugin(_defaultWidth, _defaultHeight, _useRelAttribute);
	}

	if (typeof window.onload != 'function')
		window.onload = instantiate;
	else window.onload = function() {
		oldOnLoad();
		instantiate();
	}

	if (typeof window.onunload != 'function')
		window.onunload = GUnload;
	else window.onunload = function() {
		oldOnUnload();
		GUnload();
	}
}



