/* ########################################
GLOBAL ASSETS RELEASE v5.1.3
BUILD DATE: 20090817
COPYRIGHT SUN MICROSYSTEMS INC. 2009
CONTACT US AT http://www.sun.com/secure/contact/cer.jsp?id=1073e17d-8d6c-43f6-b7e8-cf210cc89ba9 WITH ANY QUESTIONS
######################################## */

window.reg=(function(){
var reg={};
reg.importAll=function(){
var _11=[];
try{
reg.importSelectorAPI();
}
catch(err){
_11.push(err.message);
}
try{
reg.importHelperFunctions();
}
catch(err){
_11.push(err.message);
}
try{
reg.importEventFunctions();
}
catch(err){
_11.push(err.message);
}
if(_11.length>0){
if(console&&console.log){
console.log(_11.join("\n"));
}
}
};
function globalError(_12){
return "reglib tried to add \""+_12+"\" to global namespace but \""+_12+"\" already existed.";
}
if(window.Node&&Node.prototype&&!Node.prototype.contains){
Node.prototype.contains=function(arg){
return !!(this.compareDocumentPosition(arg)&16);
};
}
var _14={leadSpace:new RegExp("^\\s+"),tagName:new RegExp("^([a-z_][a-z0-9_-]*)","i"),wildCard:new RegExp("^\\*([^=]|$)"),className:new RegExp("^(\\.([a-z0-9_-]+))","i"),id:new RegExp("^(#([a-z0-9_-]+))","i"),att:new RegExp("^(@([a-z0-9_-]+))","i"),matchType:new RegExp("(^\\^=)|(^\\$=)|(^\\*=)|(^~=)|(^\\|=)|(^=)"),spaceQuote:new RegExp("^\\s+['\"]")};
reg.Selector=function(_15){
var exp=_14;
this.items=[];
var _17=[];
var _18=0;
var _19=_15;
while(_15.length>0){
if(_18>100){
throw new Error("failed parsing '"+_19+"' stuck at '"+_15+"'");
}
var _1a=false;
if(exp.leadSpace.test(_15)){
_15=_15.replace(exp.leadSpace,"");
_1a=true;
}
var _1b=exp.tagName.exec(_15);
if(_1b){
if(_17.length>0&&_17[_17.length-1].name=="tag"){
_17.push({name:"descendant"});
}
_17.push({name:"tag",tagName:_1b[1].toLowerCase()});
_15=_15.substring(_1b[1].length);
_1b=null;
continue;
}
if(exp.wildCard.test(_15)){
if(_17.length>0&&_17[_17.length-1].name=="tag"){
_17.push({name:"descendant"});
}
_17.push({name:"tag",tagName:"*"});
_15=_15.substring(1);
continue;
}
var _1c=exp.className.exec(_15);
var _1d=exp.id.exec(_15);
var _1e=exp.att.exec(_15);
if(_1c||_1d||_1e){
if(_1a&&_17.length>0&&_17[_17.length-1].name=="tag"){
_17.push({name:"descendant"});
}
if(_17.length==0||_17[_17.length-1].name!="tag"){
_17.push({name:"tag",tagName:"*"});
}
var _1f=_17[_17.length-1];
if(_1c){
if(!_1f.classNames){
_1f.classNames=[_1c[2]];
}else{
_1f.classNames.push(_1c[2]);
}
_15=_15.substring(_1c[1].length);
_1c=null;
continue;
}
if(_1d){
_1f.id=_1d[2];
_15=_15.substring(_1d[1].length);
_1d=null;
continue;
}
if(_1e){
if(!_1f.attributes){
_1f.attributes=[{name:_1e[2]}];
}else{
_1f.attributes.push({name:_1e[2]});
}
_15=_15.substring(_1e[1].length);
_1e=null;
continue;
}
}
var _20=exp.matchType.exec(_15);
if(_20){
if(_1f&&_1f.attributes&&!_1f.attributes[_1f.attributes.length-1].value){
var _21=_1f.attributes[_1f.attributes.length-1];
_21.matchType=_20[0];
_15=_15.substring(_21.matchType.length);
if(_15.charAt(0)!="\""&&_15.charAt(0)!="'"){
if(exp.spaceQuote.test(_15)){
_15=_15.replace(exp.leadSpace,"");
}else{
throw new Error(_19+" is invalid, single or double quotes required around attribute values");
}
}
var q=_15.charAt(0);
var _23=_15.indexOf(q,1);
if(_23==-1){
throw new Error(_19+" is invalid, missing closing quote");
}
while(_15.charAt(_23-1)=="\\"){
_23=_15.indexOf(q,_23+1);
if(_23==-1){
throw new Error(_19+" is invalid, missing closing quote");
}
}
_21.value=_15.substring(1,_23);
if("~="==_21.matchType){
_21.valuePatt=new RegExp("(^|\\s)"+_21.value+"($|\\s)");
}else{
if("|="==_21.matchType){
_21.valuePatt=new RegExp("^"+_21.value+"($|\\-)");
}
}
_15=_15.substring(_21.value.length+2);
continue;
}else{
throw new Error(_19+" is invalid, "+_20[0]+" appeared without preceding attribute identifier");
}
_20=null;
}
if(_15.charAt(0)==">"){
_17.push({name:"child"});
_15=_15.substring(1);
continue;
}
if(_15.charAt(0)=="+"){
_17.push({name:"nextSib"});
_15=_15.substring(1);
continue;
}
if(_15.charAt(0)=="~"){
_17.push({name:"followingSib"});
_15=_15.substring(1);
continue;
}
if(_15.charAt(0)==","){
this.items.push(_17);
_17=[];
_15=_15.substring(1);
continue;
}
_18++;
}
this.items.push(_17);
this.selectorString=_19;
for(var a=0;a<this.items.length;a++){
var _17=this.items[a];
if(_17.length==0){
throw new Error("illegal structure: '"+_19+"' contains an empty set");
}
if(_17[0].name!="tag"){
throw new Error("illegal structure: '"+_19+"' contains a dangling relation");
}
if(_17[_17.length-1].name!="tag"){
throw new Error("illegal structure: '"+_19+"' contains a dangling relation");
}
for(var b=1;b<_17.length;b++){
if(_17[b].name!="tag"&&_17[b-1].name!="tag"){
throw new Error("illegal structure: '"+_19+"' contains doubled up relations");
}
}
}
};
function toQuerySelectorString(sel){
if(!sel.qss){
var _27=[];
for(var i=0;i<sel.items.length;i++){
var _29="";
var _2a=sel.items[i];
for(var j=0;j<_2a.length;j++){
var des=_2a[j];
if(des.name=="tag"){
_29+=des.tagName;
if(des.classNames){
_29+="."+des.classNames.join(".");
}
if(des.id){
_29+="#"+des.id;
}
if(des.targeted){
_29+=":target";
}
if(des.attributes){
for(var k=0;k<des.attributes.length;k++){
_29+="["+des.attributes[k].name;
if(des.attributes[k].matchType){
_29+=des.attributes[k].matchType;
_29+="\""+des.attributes[k].value.replace(/"/,"\\\"")+"\"";
}
_29+="]";
}
}
}else{
if(des.name=="descendant"){
_29+=" ";
continue;
}else{
if(des.name=="child"){
_29+=" > ";
continue;
}else{
if(des.name=="followingSib"){
_29+=" ~ ";
continue;
}else{
if(des.name=="nextSib"){
_29+=" + ";
continue;
}
}
}
}
}
}
_27.push(_29);
}
sel.qss=_27.join(", ");
}
return sel.qss;
}
reg.Selector.prototype.matches=function(el){
if(!el){
throw new Error("no element provided");
}
if(el.nodeType!=1){
throw new Error(this.selectorString+" cannot be evaluated against element of type "+el.nodeType);
}
commas:
for(var a=0;a<this.items.length;a++){
var _30=el;
var _31=this.items[a];
for(var b=_31.length-1;b>=0;b--){
var itm=_31[b];
if(itm.name=="tag"){
if(!matchIt(_30,itm)){
if(_30&&b<_31.length-1&&_31[b+1].name=="descendant"){
_30=_30.parentNode;
b++;
continue;
}else{
if(_30&&b<_31.length-1&&_31[b+1].name=="followingSib"){
_30=_30.previousSibling;
b++;
continue;
}else{
continue commas;
}
}
}
}else{
if(itm.name=="nextSib"){
_30=previousElement(_30);
}else{
if(itm.name=="followingSib"){
_30=previousElement(_30);
}else{
if(itm.name=="child"){
_30=_30.parentNode;
}else{
if(itm.name=="descendant"){
_30=_30.parentNode;
}
}
}
}
}
}
return true;
}
return false;
};
function matchIt(el,itm){
if(!el){
return false;
}
if(el.nodeName.toLowerCase()!=itm.tagName&&itm.tagName!="*"){
return false;
}
if(itm.classNames){
for(var i=0;i<itm.classNames.length;i++){
if(!hasClassName(el,itm.classNames[i])){
return false;
}
}
}
if(itm.id&&el.id!=itm.id){
return false;
}
if(itm.attributes){
for(var i=0;i<itm.attributes.length;i++){
var _37=itm.attributes[i];
if(typeof el.hasAttribute!="undefined"){
if(!el.hasAttribute(_37.name)){
return false;
}
var att=el.getAttribute(_37.name);
}else{
if(el.nodeType!=1){
return false;
}
var att=el.getAttribute(_37.name,2);
if(_37.name=="class"){
att=el.className;
}else{
if(_37.name=="for"){
att=el.htmlFor;
}
}
if(!att){
return false;
}
}
if(_37.value){
if(_37.matchType=="^="){
if(att.indexOf(_37.value)!=0){
return false;
}
}else{
if(_37.matchType=="*="){
if(att.indexOf(_37.value)==-1){
return false;
}
}else{
if(_37.matchType=="$="){
var _39=att.indexOf(_37.value);
if(_39===-1||_39!=att.length-_37.value.length){
return false;
}
}else{
if(_37.matchType=="="){
if(att!=_37.value){
return false;
}
}else{
if("|="==_37.matchType||"~="==_37.matchType){
if(!_37.valuePatt.test(att)){
return false;
}
}else{
if(!_37.matchType){
throw new Error("illegal structure, parsed selector cannot have null or empty attribute match type");
}else{
throw new Error("illegal structure, parsed selector cannot have '"+itm.matchType+"' as an attribute match type");
}
}
}
}
}
}
}
}
}
return true;
}
function getTagNames(sel){
var _3b={};
for(var a=0;a<sel.items.length;a++){
_3b[sel.items[a][sel.items[a].length-1].tagName]=null;
}
var _3d=[];
for(var tag in _3b){
if(_3b.hasOwnProperty(tag)){
_3d.push(tag);
}
}
return _3d;
}
reg.importSelectorAPI=function(){
if(window.Selector){
throw new Error(globalError("Selector"));
}
window.Selector=reg.Selector;
};
var _3f={};
var _40={};
function hasClassName(_41,_42){
if(!_3f[_42]){
_3f[_42]=new RegExp("(^|\\s)"+_42+"($|\\s)");
}
return _41.className&&_3f[_42].test(_41.className);
}
function addClassName(_43,_44){
if(!hasClassName(_43,_44)){
_43.className+=" "+_44;
}
}
function removeClassName(_45,_46){
if(!_3f[_46]){
_3f[_46]=new RegExp("(^|\\s+)"+_46+"($|\\s+)");
}
_45.className=_45.className.replace(_3f[_46]," ");
}
function toggleClassName(_47,_48){
if(hasClassName(_47,_48)){
removeClassName(_47,_48);
}else{
addClassName(_47,_48);
}
}
function switchClassName(_49,_4a,_4b){
if(_4a==_4b){
throw new Error("cName1 and cName2 both equal "+_4a);
}
var _4c=hasClassName(_49,_4a);
var _4d=hasClassName(_49,_4b);
if(_4c&&_4d){
removeClassName(_49,_4b);
}else{
if(!_4c&&!_4d){
addClassName(_49,_4a);
}else{
if(_4c){
removeClassName(_49,_4a);
addClassName(_49,_4b);
}else{
removeClassName(_49,_4b);
addClassName(_49,_4a);
}
}
}
}
function matchClassName(_4e,_4f){
var _50=_4e.className.split(" ");
for(var a=0;a<_50.length;a++){
var _52=_50[a].match(_4f);
if(_52){
return _52;
}
}
return null;
}
function elementMatchesSelector(_53,_54){
if(!_40[_54]){
_40[_54]=new reg.Selector(_54);
}
return _40[_54].matches(_53);
}
function previousElement(el){
var _56=el.previousSibling;
while(_56&&_56.nodeType!=1){
_56=_56.previousSibling;
}
return _56;
}
function nextElement(el){
var _58=el.nextSibling;
while(_58&&_58.nodeType!=1){
_58=_58.nextSibling;
}
return _58;
}
function innerWrap(el,_5a){
var _5b=el.childNodes;
while(_5b.length>0){
var _5c=_5b[0];
el.removeChild(_5c);
_5a.appendChild(_5c);
}
el.appendChild(_5a);
}
function outerWrap(el,_5e){
el.parentNode.insertBefore(_5e,el);
el.parentNode.removeChild(el);
_5e.appendChild(el);
}
function getParent(el,_60){
var _61=new reg.Selector(_60);
while(el.parentNode){
el=el.parentNode;
if(el.nodeType==1&&_61.matches(el)){
return el;
}
}
return null;
}
function insertAfter(_62,_63){
var _64=_63.nextSibling;
var _65=_63.parentNode;
if(_64){
_65.insertBefore(_62,_64);
}else{
_65.appendChild(_62);
}
}
function newElement(_66,_67,_68){
if(_66.indexOf(".")+_66.indexOf("#")>-2){
var _69=(_66.indexOf(".")>-1)?_66.replace(/^.*\.([^\.#]*).*$/,"$1"):"";
var id=(_66.indexOf("#")>-1)?_66.replace(/^.*#([^\.#]*).*$/,"$1"):"";
_66=_66.replace(/^([^\.#]*).*$/,"$1");
}
var e=document.createElement(_66);
if(_69){
e.className=_69;
}
if(id){
e.id=id;
}
if(_67){
for(var key in _67){
if(!_67.hasOwnProperty(key)){
continue;
}
if(key=="class"){
e.className=e.className?e.className+=" "+_67[key]:_67[key];
}else{
if(key=="for"){
e.htmlFor=_67[key];
}else{
if(key.indexOf("on")==0){
e[key]=_67[key];
}else{
e.setAttribute(key,_67[key]);
}
}
}
}
}
if(_68){
if(!(_68 instanceof Array)){
_68=[_68];
}
for(var a=0;a<_68.length;a++){
if(_68[a].nodeType!==undefined){
e.appendChild(_68[a]);
}else{
e.appendChild(document.createTextNode(_68[a]));
}
}
}
if(_66.toLowerCase()=="img"&&!e.alt){
e.alt="";
}
return e;
}
function elementText(el){
if(!el){
return "";
}
var _6f=el.childNodes;
var _70="";
if(reg.matches(el,"img@alt,area@alt")){
_70+=el.alt;
}else{
if(reg.matches(el,"input")){
_70+=el.value;
}else{
for(var a=0;a<_6f.length;a++){
if(3==_6f[a].nodeType){
_70+=_6f[a].data;
}else{
if(1==_6f[a].nodeType){
_70+=elementText(_6f[a]);
}
}
}
}
}
return _70;
}
function getElementById(id){
return document.getElementById(id);
}
function getElementsByTagName(tag,_74){
if(!_74){
_74=document;
}
return _74.getElementsByTagName(tag);
}
var _75=/^\s*([a-z0-9_-]+)?\.([a-z0-9_-]+)\s*$/i;
var _76=/^\s*([a-z0-9_-]+)?\#([a-z0-9_-]+)\s*$/i;
function getElementsBySelector(_77,_78){
_78=_78||window.document.documentElement;
var _79=[];
var _7a,iMat;
if(_7a=_77.match(_75)){
var cl=_7a[2];
var tg=_7a[1];
_79=reg.gebcn(cl,_78,tg);
}else{
if(iMat=_77.match(_76)){
var id=iMat[2];
var tg=iMat[1];
var el=reg.gebi(id);
if(el&&_78.contains(el)&&reg.matches(el,_77)){
_79[0]=el;
}
}else{
if(!_40[_77]){
_40[_77]=new reg.Selector(_77);
}
var sel=_40[_77];
if(_78.querySelectorAll){
var _80=_78.querySelectorAll(toQuerySelectorString(sel));
for(var i=0;i<_80.length;i++){
_79[_79.length]=_80[i];
}
}else{
var _82=getTagNames(sel);
for(var a=0;a<_82.length;a++){
var els=getElementsByTagName(_82[a],_78);
for(var b=0,el;el=els[b++];){
if(el.nodeType!=1){
continue;
}
if(sel.matches(el)){
_79.push(el);
}
}
}
}
}
}
return _79;
}
function getElementsByClassName(_86,_87,tag){
_87=(_87)?_87:document;
tag=(tag)?tag.toLowerCase():"*";
var _89=[];
if(document.getElementsByClassName){
var _8a=_87.getElementsByClassName(_86);
if(tag!="*"){
for(var i=0;i<_8a.length;i++){
var el=_8a[i];
if(tag==el.nodeName.toLowerCase()){
_89.push(el);
}
}
}else{
for(var i=0;i<_8a.length;i++){
_89.push(_8a[i]);
}
}
}else{
_86=_86.split(/\s+/);
if(document.evaluate){
var _8d=".//"+tag;
var len=_86.length;
for(var i=0;i<len;i++){
_8d+="[contains(concat(' ', @class, ' '), ' "+_86[i]+" ')]";
}
var _8f=document.evaluate(_8d,_87,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,_8f);
var el;
while(el=_8f.iterateNext()){
_89.push(el);
}
}else{
var els=(tag=="*"&&_87.all)?_87.all:getElementsByTagName(tag,_87);
elements:
for(var i=0,el;el=els[i++];){
for(var j=0;j<_86.length;j++){
if(!hasClassName(el,_86[j])){
continue elements;
}
}
_89.push(el);
}
}
}
return _89;
}
var _92={hasClassName:hasClassName,addClassName:addClassName,removeClassName:removeClassName,toggleClassName:toggleClassName,switchClassName:switchClassName,matchClassName:matchClassName,elementMatchesSelector:elementMatchesSelector,previousElement:previousElement,nextElement:nextElement,innerWrap:innerWrap,outerWrap:outerWrap,getParent:getParent,insertAfter:insertAfter,newElement:newElement,elementText:elementText,getElementById:getElementById,getElementsByTagName:getElementsByTagName,getElementsBySelector:getElementsBySelector,getElementsByClassName:getElementsByClassName};
_92.hcn=_92.hasClassName;
_92.acn=_92.addClassName;
_92.rcn=_92.removeClassName;
_92.tcn=_92.toggleClassName;
_92.scn=_92.switchClassName;
_92.mcn=_92.matchClassName;
_92.matches=_92.elementMatchesSelector;
_92.prevElem=_92.previousElement;
_92.nextElem=_92.nextElement;
_92.elem=_92.newElement;
_92.elemText=_92.elementText;
_92.gebi=_92.getElementById;
_92.gebtn=_92.getElementsByTagName;
_92.gebs=_92.getElementsBySelector;
_92.gebcn=_92.getElementsByClassName;
reg.importHelperFunctions=function(){
var _93=[];
for(var _94 in _92){
if(!_92.hasOwnProperty(_94)){
continue;
}
if(window[_94]){
_93.push(globalError(_94));
}else{
window[_94]=_92[_94];
}
}
if(_93.length>0){
throw new Error(_93.join("\n"));
}
};
for(var _95 in _92){
if(!_92.hasOwnProperty(_95)){
continue;
}
if(reg[_95]){
throw new Error("Already exists under reg: "+_95);
}else{
reg[_95]=_92[_95];
}
}
function getTarget(e){
if(!e){
e=window.event;
}
if(e.target){
var _97=e.target;
}else{
if(e.srcElement){
var _97=e.srcElement;
}
}
if(_97.nodeType==3){
_97=_97.parentNode;
}
return _97;
}
function getRelatedTarget(e){
if(!e){
e=window.event;
}
var _99=e.relatedTarget;
if(!_99){
if("mouseover"==e.type){
_99=e.fromElement;
}
if("mouseout"==e.type){
_99=e.toElement;
}
}
return _99;
}
function cancelDefault(e){
if(typeof e.preventDefault!="undefined"){
e.preventDefault();
return;
}
e.returnValue=false;
}
function cancelBubble(e){
if(typeof e.stopPropagation!="undefined"){
e.stopPropagation();
return;
}
e.cancelBubble=true;
}
var _9c={};
var _9d=0;
function rememberEvent(_9e,evt,_a0,_a1,_a2){
var _a3=_9d++;
_9c[_a3+""]={element:_9e,event:evt,handler:_a0,capture:!!_a1,cleanable:!!_a2};
return _a3;
}
function removeEvent(_a4){
var key=_a4+"";
var eo=_9c[key];
if(eo){
var el=eo.element;
if(el.removeEventListener){
el.removeEventListener(eo.event,eo.handler,eo.capture);
delete _9c[key];
return true;
}else{
if(el.detachEvent){
el.detachEvent("on"+eo.event,eo.handler);
delete _9c[key];
return true;
}
}
}
return false;
}
function cleanup(all){
for(var key in _9c){
if(!_9c.hasOwnProperty(key)){
continue;
}
if(all||(_9c[key].cleanable&&!document.documentElement.contains(_9c[key].element))){
removeEvent(key);
}
}
}
window.setInterval(function(){
cleanup(false);
},10000);
function addEvent(_aa,evt,_ac,_ad,_ae){
if(_aa.addEventListener){
_aa.addEventListener(evt,_ac,_ad);
return rememberEvent(_aa,evt,_ac,_ad,_ae);
}else{
if(_aa.attachEvent){
var _af=function(){
_ac.call(_aa,window.event);
};
_aa.attachEvent("on"+evt,_af);
return rememberEvent(_aa,evt,_af,_ad,_ae);
}
}
}
addEvent(window,"unload",function(){
cleanup(true);
});
var _b0={getTarget:getTarget,getRelatedTarget:getRelatedTarget,cancelDefault:cancelDefault,addEvent:addEvent,removeEvent:removeEvent,cancelBubble:cancelBubble};
reg.importEventFunctions=function(){
var _b1=[];
for(var _b2 in _b0){
if(!_b0.hasOwnProperty(_b2)){
continue;
}
if(window[_b2]){
_b1.push(globalError(_b2));
}else{
window[_b2]=_b0[_b2];
}
}
if(_b1.length>0){
throw new Error(_b1.join("\n"));
}
};
for(var _95 in _b0){
if(!_b0.hasOwnProperty(_95)){
continue;
}
if(reg[_95]){
throw new Error("Already exists under reg: "+_95);
}else{
reg[_95]=_b0[_95];
}
}
var _b3=[];
var _b4=[];
var _b5={};
var _b6=[];
reg.setup=function(_b7,_b8,_b9){
_b9=!!_b9;
var sqt=_b5;
var _bb=new reg.Selector(_b7);
var _bc=getTagNames(_bb);
var _bd={selector:_bb,setup:_b8,ran:false,firstTimeOnly:_b9};
_b4.push(_bd);
for(var a=0;a<_bc.length;a++){
var _bf=_bc[a];
if(!sqt[_bf]){
sqt[_bf]=[_bd];
}else{
sqt[_bf].push(_bd);
}
}
};
reg.preSetup=function(fn){
_b3.push(fn);
};
reg.postSetup=function(fn){
_b6.push(fn);
};
var _c2=reg.rerun=function(el,_c4){
function runIt(el,_c6){
_c6.setup.call(el);
_c6.ran=true;
}
var _c7=new Date().getTime();
if(typeof el.clobberable!="undefined"&&el.clobberable&&_c4){
return;
}
var doc=(el)?el:document;
var sqt=_b5;
var _ca=true;
for(var _cb in sqt){
if(!sqt.hasOwnProperty(_cb)){
continue;
}
_ca=false;
break;
}
if(el.querySelector){
var _cc=[];
for(var i=0;i<_b4.length;i++){
var _ce=_b4[i];
if(_ce.firstTimeOnly){
if(_ce.ran){
continue;
}
try{
var _cf=el.querySelector(toQuerySelectorString(_ce.selector));
if(_cf){
_cc.push({el:_cf,regObj:_ce});
}
}
catch(ex){
console.log("querySelector('"+toQuerySelectorString(_ce.selector)+"') threw "+ex);
continue;
}
}else{
try{
var _d0=el.querySelectorAll(toQuerySelectorString(_ce.selector));
for(var j=0;j<_d0.length;j++){
_cc.push({el:_d0[j],regObj:_ce});
}
}
catch(ex){
console.log("querySelectorAll('"+toQuerySelectorString(_ce.selector)+"') threw "+ex);
continue;
}
}
}
for(var i=0;i<_cc.length;i++){
runIt(_cc[i].el,_cc[i].regObj);
}
}else{
if(!_ca){
var _d2=getElementsByTagName("*",doc);
for(var i=_d2.length-1,els=[];i>=0;i--){
els[i]=_d2[i];
}
var _cc=[];
for(var a=0,_cf;_cf=els[a++];){
if(_cf.nodeType!=1){
continue;
}
var _d4=_cf.nodeName.toLowerCase();
var _d5=sqt["*"];
var _d6=sqt[_d4];
if(_d5){
for(var b=0;b<_d5.length;b++){
var _ce=_d5[b];
if(_ce.firstTimeOnly&&_ce.ran){
continue;
}
var _d8=_ce.selector.matches(_cf);
if(_d8){
_cc.push({el:_cf,regObj:_ce});
_ce.ran=true;
}
}
}
if(_d6){
for(var b=0;b<_d6.length;b++){
var _ce=_d6[b];
if(_ce.firstTimeOnly&&_ce.ran){
continue;
}
var _d8=_ce.selector.matches(_cf);
if(_d8){
_cc.push({el:_cf,regObj:_ce});
_ce.ran=true;
}
}
}
}
for(var i=0;i<_cc.length;i++){
runIt(_cc[i].el,_cc[i].regObj);
}
}
}
el.clobberable=true;
var _d9=new Date().getTime()-_c7;
if(!reg.setupTime){
reg.setupTime=_d9;
}
reg.lastSetupTime=_d9;
};
var ie6=navigator.appVersion.indexOf("MSIE 6.0")!=-1;
if(!ie6){
addClassName(document.documentElement,"regloading");
}
var _db=false;
function loadFunc(e){
if(!_db){
_db=true;
for(var a=0;a<_b3.length;a++){
_b3[a]();
}
_c2(document,true);
for(var a=0;a<_b6.length;a++){
_b6[a]();
}
if(!ie6){
removeClassName(document.documentElement,"regloading");
addClassName(document.documentElement,"regloaded");
}
}
}
addEvent(window,"load",loadFunc);
addEvent(window,"DOMContentLoaded",loadFunc);
var _de={};
var _df={};
var _e0={};
var _e1={};
var _e2={};
var _e3={};
var _e4={};
var _e5={};
var _e6={};
var _e7={};
var _e8={};
var _e9={};
var _ea={};
var _eb={};
var _ec={};
function getDepth(_ed){
var _ee=null;
for(var i=2;i<_ed.length;i++){
if(!isNaN(parseInt(_ed[i]))){
_ee=_ed[i];
break;
}
}
if(_ee===null){
_ee=-1;
}
if(_ee<-1){
throw new Error("bad arg for depth, must be -1 or higher");
}
return _ee;
}
function pushFunc(_f0,_f1,_f2,_f3,_f4){
if(!_f1||typeof _f1!="function"){
return;
}
var _f5=new reg.Selector(_f0);
if(!_f3[_f0]){
_f3[_f0]=[];
}
var _f6={selector:_f5,handle:_f1,depth:_f2,hoverFlag:_f4};
_f3[_f0].push(_f6);
}
reg.click=function(_f7,_f8,_f9,_fa,_fb){
var _fc=getDepth(arguments);
pushFunc(_f7,_f8,_fc,_de,false);
pushFunc(_f7,_f9,_fc,_df,false);
pushFunc(_f7,_fa,_fc,_e0,false);
pushFunc(_f7,_fb,_fc,_e1,false);
};
reg.hover=function(_fd,_fe,_ff){
var _100=getDepth(arguments);
pushFunc(_fd,_fe,_100,_e2,true);
pushFunc(_fd,_ff,_100,_e3,true);
};
reg.focus=function(_101,_102,_103){
var _104=getDepth(arguments);
pushFunc(_101,_102,_104,_e4,false);
pushFunc(_101,_103,_104,_e5,false);
};
reg.key=function(_105,_106,_107,_108){
var _109=getDepth(arguments);
pushFunc(_105,_106,_109,_e6,false);
pushFunc(_105,_107,_109,_e7,false);
pushFunc(_105,_108,_109,_e8,false);
};
reg.submit=function(_10a,func){
var _10c=getDepth(arguments);
pushFunc(_10a,func,_10c,_e9,false);
};
reg.reset=function(_10d,func){
var _10f=getDepth(arguments);
pushFunc(_10d,func,_10f,_ea,false);
};
reg.change=function(_110,func){
var _112=getDepth(arguments);
pushFunc(_110,func,_112,_eb,false);
};
reg.select=function(_113,func){
var _115=getDepth(arguments);
pushFunc(_113,func,_115,_ec,false);
};
if(document.all&&!window.opera){
function ieSubmitDelegate(e){
delegate(_e9,e);
cancelBubble(e);
}
function ieResetDelegate(e){
delegate(_ea,e);
cancelBubble(e);
}
function ieChangeDelegate(e){
delegate(_eb,e);
cancelBubble(e);
}
function ieSelectDelegate(e){
delegate(_ec,e);
cancelBubble(e);
}
reg.focus("form",function(){
removeEvent(this._submit_prep);
this._submit_prep=addEvent(this,"submit",ieSubmitDelegate,false,true);
removeEvent(this._reset_prep);
this._reset_prep=addEvent(this,"reset",ieResetDelegate,false,true);
},function(){
removeEvent(this._submit_prep);
removeEvent(this._reset_prep);
});
reg.focus("select,input,textarea",function(){
removeEvent(this._change_prep);
this._change_prep=addEvent(this,"change",ieChangeDelegate,false,true);
},function(){
removeEvent(this._change_prep);
});
reg.focus("input,textarea",function(){
removeEvent(this._select_prep);
this._select_prep=addEvent(this,"select",ieSelectDelegate,false,true);
},function(){
removeEvent(this._select_prep);
});
}
function delegate(_11a,_11b){
if(_11a){
var _11c=[];
var targ=getTarget(_11b);
for(var sel in _11a){
if(!_11a.hasOwnProperty(sel)){
continue;
}
for(var a=0;a<_11a[sel].length;a++){
var _120=_11a[sel][a];
var _121=(_120.depth==-1)?100:_120.depth;
var el=targ;
for(var b=-1;b<_121&&el&&el.nodeType==1;b++,el=el.parentNode){
if(_120.selector.matches(el)){
if(_120.hoverFlag){
var _124=getRelatedTarget(_11b);
if(_124&&(el.contains(_124)||el==_124)){
break;
}
}
_11c.push({"handle":_120.handle,"element":el});
break;
}
}
}
}
for(var i=0;i<_11c.length;i++){
var exec=_11c[i];
var _127=exec.handle.call(exec.element,_11b);
if(_127!==undefined&&!_127){
cancelDefault(_11b);
}
}
}
}
if(typeof document.onactivate=="object"){
var _128="activate";
var _129="deactivate";
}else{
var _128="focus";
var _129="blur";
}
var _12a=document.documentElement;
addEvent(_12a,"click",function(e){
delegate(_de,e);
});
addEvent(_12a,"mousedown",function(e){
delegate(_df,e);
});
addEvent(_12a,"mouseup",function(e){
delegate(_e0,e);
});
addEvent(_12a,"dblclick",function(e){
delegate(_e1,e);
});
addEvent(_12a,"keydown",function(e){
delegate(_e6,e);
});
addEvent(_12a,"keypress",function(e){
delegate(_e7,e);
});
addEvent(_12a,"keyup",function(e){
delegate(_e8,e);
});
addEvent(_12a,_128,function(e){
delegate(_e4,e);
},true);
addEvent(_12a,_129,function(e){
delegate(_e5,e);
},true);
addEvent(_12a,"mouseover",function(e){
delegate(_e2,e);
});
addEvent(_12a,"mouseout",function(e){
delegate(_e3,e);
});
addEvent(_12a,"submit",function(e){
delegate(_e9,e);
});
addEvent(_12a,"reset",function(e){
delegate(_ea,e);
});
addEvent(_12a,"change",function(e){
delegate(_eb,e);
});
addEvent(_12a,"select",function(e){
delegate(_ec,e);
});
var _13a=[];
var log=function(str){
_13a.push(str);
};
var _13d=function(){
return _13a.join("\n")+"\n";
};
if(!window.console){
window.console={log:log,contents:_13d};
}else{
if(!window.console.log){
window.console.log=log;
if(!window.console.contents){
window.console.contents=_13d;
}
}
}
addClassName(_12a,"regenabled");
return reg;
})();
(function(){
var ap=Array.prototype;
if(!ap.filter){
ap.filter=function(fun){
var len=this.length>>>0;
if(typeof fun!="function"){
throw new TypeError();
}
var res=new Array();
var _142=arguments[1];
for(var i=0;i<len;i++){
if(i in this){
var val=this[i];
if(fun.call(_142,val,i,this)){
res.push(val);
}
}
}
return res;
};
}
if(!ap.forEach){
ap.forEach=function(fun){
var len=this.length>>>0;
if(typeof fun!="function"){
throw new TypeError();
}
var _147=arguments[1];
for(var i=0;i<len;i++){
if(i in this){
fun.call(_147,this[i],i,this);
}
}
};
}
if(!ap.every){
ap.every=function(fun){
var len=this.length>>>0;
if(typeof fun!="function"){
throw new TypeError();
}
var _14b=arguments[1];
for(var i=0;i<len;i++){
if(i in this&&!fun.call(_14b,this[i],i,this)){
return false;
}
}
return true;
};
}
if(!ap.map){
ap.map=function(fun){
var len=this.length>>>0;
if(typeof fun!="function"){
throw new TypeError();
}
var res=new Array(len);
var _150=arguments[1];
for(var i=0;i<len;i++){
if(i in this){
res[i]=fun.call(_150,this[i],i,this);
}
}
return res;
};
}
if(!ap.some){
ap.some=function(fun){
var i=0,len=this.length>>>0;
if(typeof fun!="function"){
throw new TypeError();
}
var _154=arguments[1];
for(;i<len;i++){
if(i in this&&fun.call(_154,this[i],i,this)){
return true;
}
}
return false;
};
}
})();
reg.importAll();
var is=new ottosniff();
function ottosniff(){
var ua=navigator.userAgent.toLowerCase();
var b=navigator.appName;
if(b=="Netscape"){
this.b="ns";
}else{
this.b=b;
}
this.version=navigator.appVersion;
this.v=parseInt(this.version);
this.gecko=/\bgecko\/(20\d\d)(\d\d)(\d\d)/.test(ua);
this.ns=(this.b=="ns"&&this.v>=5);
this.op=(ua.indexOf("opera")>-1);
this.safari=(ua.indexOf("safari")>-1&&this.v<5);
this.safariAll=(ua.indexOf("safari")>-1);
this.op7=(this.op&&this.v>=7&&this.v<8);
this.op78=(this.op&&this.v>=7||this.op&&this.v>=8);
this.ie5=(this.version.indexOf("MSIE 5")>-1);
this.ie6=(this.version.indexOf("MSIE 6")>-1);
this.ie7=(this.version.indexOf("MSIE 7")>-1);
this.ie8=(this.version.indexOf("MSIE 8")>-1);
this.ie56=(this.ie5||this.ie6);
this.ie567=(this.ie5||this.ie6||this.ie7);
this.ie=(this.ie5||this.ie6||this.ie7||this.ie8);
this.iewin=(this.ie56&&ua.indexOf("windows")>-1||this.ie7&&ua.indexOf("windows")>-1);
this.iemac=(this.ie56&&ua.indexOf("mac")>-1);
this.moz=(ua.indexOf("mozilla")>-1);
this.ff=(ua.indexOf("firefox")>-1);
this.moz13=(ua.indexOf("mozilla")>-1&&ua.indexOf("1.3")>-1);
this.oldmoz=(ua.indexOf("sunos")>-1||this.moz13&&!this.ff||this.moz&&ua.indexOf("1.4")>-1&&!this.ff||this.moz&&ua.indexOf("1.5")>-1&&!this.ff||this.moz&&ua.indexOf("1.6")>-1&&!this.ff);
this.anymoz=this.gecko;
this.ns6=(ua.indexOf("netscape6")>-1);
this.geckoAtOrAbove=function(_157){
var gVer=(this.gecko)?ua.substring(ua.indexOf("; rv:")+5,ua.indexOf(") gecko")):"";
var t=gVer.split(".");
var v=_157.split(".");
while(t.length<v.length){
t.push("0");
}
while(v.length<t.length){
v.push("0");
}
for(var i=0;i<v.length;i++){
var ti=parseInt(t[i]),vi=parseInt(v[i]);
if(ti==vi){
continue;
}else{
return (ti>vi);
}
}
return true;
};
}
var rtl=(document.documentElement.lang.indexOf("he")>-1&&document.documentElement.lang.indexOf("IL"))?true:false;
if(rtl){
addClassName(document.documentElement,"rtl");
}
if(is.op){
var bclass="browserOpera";
}else{
if(is.safariAll){
var bclass="browserSafari";
}else{
if(is.ie56){
var bclass="browserExplorer56 browserExplorer";
}else{
if(is.ie7){
var bclass="browserExplorer7 browserExplorer";
}else{
if(is.iemac){
var bclass="browserExplorerMac";
}else{
if(is.oldmoz){
var bclass="browserOldMoz";
}else{
var bclass="";
}
}
}
}
}
}
if(is.gecko){
bclass+=" gecko";
}
if(is.safari||is.geckoAtOrAbove("1.9")){
bclass+=" radius";
}else{
bclass+=" noradius";
}
bclass+=" jsenabled";
addClassName(document.documentElement,bclass);
if(typeof shutoff=="undefined"){
var shutoff={global:false,share:false,pop:false,misc:false};
}
if(!shutoff.global){
reg.setup("div.a1r2 span.toolbarlinks > a,div.a1r2 span.siteid > a",sniffA1);
reg.setup("div#a5 a",sniffA5);
reg.focus("input#searchfield,input.searchfield",function(){
addClassName(this,"sfieldfocused");
},function(){
removeClassName(this,"sfieldfocused");
});
reg.focus("div#a5 > ul li.hasmenu",function(){
addClassName(this,"a5show");
gebtn("div",this)[0].style.top=((gebtn("div",this)[0].offsetHeight*-1))+4+"px";
},function(){
removeClassName(this,"a5show");
});
reg.hover("div#a5 > ul li.hasmenu",function(){
addClassName(this,"a5show");
gebtn("div",this)[0].style.top=((gebtn("div",this)[0].offsetHeight*-1))+4+"px";
},function(){
removeClassName(this,"a5show");
});
reg.hover("div.a5menu",function(){
addClassName(this.parentNode,"a5show");
},function(){
removeClassName(this,"a5show");
});
reg.setup("td.navlinks > div",sniffA2);
reg.hover("ul#mtopics",function(){
if(!a2["ent"]){
reg.setup("ul#mtopics > li",sniffA2);
reg.rerun(this);
}
});
reg.focus("ul#mtopics",function(){
if(!a2["ent"]){
reg.setup("ul#mtopics > li",sniffA2);
reg.rerun(this);
}
});
if(is.ie56){
reg.hover("ul#mtopics > li",function(){
addClassName(this,"a2mshow");
},function(){
removeClassName(this,"a2mshow");
});
reg.hover("td.navlinks",function(){
addClassName(this,"a2mshow");
},function(){
removeClassName(this,"a2mshow");
},5);
}
if(shutoff.misc){
reg.preSetup(function(){
var a2v8=gebi("a2v8");
if(!a2v8){
return;
}
reg.setup("select.goto, select.showDiv",sniffGoto);
reg.setup("ul.goto, ul.showDiv",sniffGotoUL);
});
}
}
if(!shutoff.pop){
reg.click(".k5, .media-popin",k5Click);
reg.click(".k5close",k5Close);
reg.click(".k5softclose",k5SoftClose);
reg.key("html",function(e){
if(27==e.keyCode){
k5Close();
}
});
reg.setup("@class*='k2ajax-'",sniffK2ajax);
reg.setup("@class*='k2over', @class*='k2focus', @class*='k2cl', @class*='k2show', @class*='k2hide'",sniffK2);
reg.setup(".modal-launch",sniffModal);
}
reg.preSetup(function(){
var cpy=gebi("copyDate");
if(!cpy){
return;
}
cpy.innerHTML="1994-"+new Date().getFullYear()+" ";
});
reg.focus("body",blurOut);
var blurIt=[];
function blurOut(ev){
var obj=this;
t=getTarget(ev);
var b=blurIt;
blurIt=[];
for(var i=0;i<b.length;i++){
if(!hasParent(t,b[i][0])){
if(b[i][1]=="hidden"){
b[i][0].style.visibility="hidden";
}else{
if(b[i][1]){
removeClassName(b[i][0],b[i][1]);
}else{
b[i][0].style.display="none";
}
}
}else{
blurIt.push(b[i]);
}
}
}
reg.click("a.popup, area.popup, a.media-launch",bubblePop);
function bubblePop(e){
var link=this;
if(hasClassName(link,"media-launch")&&!matchClassName(link,"[0-9]+x[0-9]+")){
addClassName(link,"662x652");
}
var popW="820";
var popH="600";
var _168=["no",0,0,0,0,0,0,"",""];
var _169=link.href;
if(link.target){
var _16a=link.target;
}else{
var _16a="newpopup";
}
var cls=link.className.split(" ");
for(var v=0;v<cls.length;v++){
if(cls[v].search("[0-9]+x[0-9]+")>-1){
var f=cls[v].split("x");
popW=f[0];
popH=f[1];
}else{
if(cls[v].indexOf("name-")==0){
var f=cls[v].split("name-");
_16a=f[1];
}else{
if(cls[v]=="scrolling"){
var _168=["yes",1,0,0,0,0,0];
}else{
if(cls[v]=="full"){
var _168=["yes",1,1,1,1,1,1];
}else{
if(cls[v].indexOf("yes_")==0||cls[v].indexOf("no_")==0){
var f=cls[v].split("_");
f[1]="f"+f[1];
var _168=f[1].split("");
_168[0]=f[0];
}
}
}
}
}
if(link.className.indexOf("centerpop")>1){
_168[7]=screen.availHeight/2-popH/2;
_168[8]=screen.availWidth/2-popW/2;
}
}
openPopup(_169,_16a,popW,popH,_168[0],_168[1],_168[2],_168[3],_168[4],_168[5],_168[6],_168[7],_168[8]);
cancelDefault(e);
}
function openPopup(url,name,_170,_171,_172,_173,_174,_175,_176,_177,_178,top,left){
var tl=(top&&left)?",top="+top+",left="+left:"";
var _17c=window.open(url,name,"width="+_170+",height="+_171+",resizable="+_172+",scrollbars="+_173+",menubar="+_174+",toolbar="+_175+",location="+_176+",directories="+_177+",status="+_178+tl);
_17c.focus();
}
reg.focus("input.autoclear,input#searchfield,input.searchfield",autoclearFocus,autoclearBlur);
function autoclearFocus(){
if(this.value==this.defaultValue){
this.value="";
addClassName(this,"autocleared");
}
}
function autoclearBlur(){
if(this.value==""){
this.value=this.defaultValue;
removeClassName(this,"autocleared");
}
}
reg.submit("div.a2search form",function(e){
i=gebs("input.searchfield,input#searchfield",this);
if(i[0].value==""||i[0].value==i[0].defaultValue){
i[0].value="";
cancelDefault(e);
}
});
var a1=[];
a1["x"]=1;
function sniffA1(){
var link=this;
oldA1Content();
var a1w=["<div class=\"a1menux1\"></div>\n<div class=\"a1menuw2\"><div class=\"a1menuw1\">\n","</div><div class=\"a1menux2\"></div></div>"];
if(!a1["ent"]){
for(key in a1){
var d=elem("div");
d.innerHTML=key;
a1[d.innerHTML]=a1[key];
}
a1["ent"]=true;
}
var _181=link.innerHTML.normalize();
var a1id="a1menu"+a1["x"];
a1["x"]++;
if(hasClassName(link,"language-select")){
var d=elem("div.a1menu");
addClassName(link,"k2over-languageselector y3 x-10");
d.id="languageselector";
d.style.width="170px";
d.innerHTML=a1w[0]+"<h5></h5><div></div>"+a1w[1];
link.parentNode.insertBefore(d,link.nextSibling);
sniffK2.call(link);
sniffSiteSelector(link.parentNode);
}else{
if(a1[_181]){
var d=elem("div.a1menu");
addClassName(link,"karrow");
addClassName(link,"k2over-"+a1id+" y3 x-6");
if(hasClassName(link,"a1cart")){
link.innerHTML="<span class=\"carticon small\">"+link.innerHTML+"</span>";
link.style.paddingLeft="0px";
}
if(a1[_181].indexOf("a1-2col")>-1){
var wc="a1Large";
}else{
if(a1[_181].indexOf("<p>")>-1){
var wc="a1Medium";
}else{
var wc="a1Small";
}
}
d.id=a1id;
addClassName(d,wc);
d.innerHTML=a1w[0]+a1[_181]+a1w[1];
link.parentNode.insertBefore(d,link.nextSibling);
sniffK2.call(link);
}
}
}
var a1hrefs=[];
var a1menus=[];
function oldA1Content(){
var k;
for(k in a1hrefs){
a1[a1hrefs[k][0]]=a1menus[k][1];
}
a1hrefs=a1menus=[];
}
var a2=[];
function sniffA2(){
var fobj=this;
var sall=(typeof ltxt=="undefined")?seeall:ltxt.seeall;
if(navmenu["1.0"]){
oldA2Content();
}
if(gebi("ip1")){
oldA2TableFix();
}
if(!a2["ent"]){
for(key in a2){
var d=elem("div");
d.innerHTML=key;
a2[d.innerHTML.strip()]=a2[key];
}
a2["ent"]=true;
}
var _188=gebtn("a",fobj)[0];
var n=_188.innerHTML.normalize();
if(a2[n]){
var h=_188.href;
addEvent(_188,"focus",function(){
if(this.parentNode.nodeName.toLowerCase()=="li"){
addClassName(this.parentNode,"a2mshow");
blurIt.push([this.parentNode,"a2mshow"]);
}else{
addClassName(this.parentNode.parentNode,"a2mshow");
blurIt.push([this.parentNode.parentNode,"a2mshow"]);
}
});
var d=elem("div.a2m",{});
d.style.marginLeft=(rtl)?"-"+(204-fobj.offsetWidth)+"px":"-20px";
var u=elem("ul",{});
var a=elem("a",{"href":h});
a.innerHTML=sall+" &#187;";
var l=elem("li",{});
if(h.indexOf("#")<0&&h.split("#")[1]!=""&&a2[n].indexOf("<!-- no see all -->")<0){
l.appendChild(a);
}
u.innerHTML=a2[n];
u.appendChild(l);
d.appendChild(u);
fobj.appendChild(d);
addClassName(gebtn("li",fobj)[0],"firstchild");
}else{
if(fobj.nodeName.toLowerCase()=="li"){
addClassName(fobj,"a2nomenu");
}else{
addClassName(fobj.parentNode,"a2nomenu");
}
}
}
var navmenu=[];
var oldmenu=[];
function popfly(){
}
function closefly(){
}
function prepmenus(){
}
function printmenus(){
}
function oldA2Content(){
var x=1;
while(x<10){
if(navmenu[x+".0"]&&!a2[navmenu[x+".0"].split("|")[0]]){
var xx=1;
var li="";
while(navmenu[x+"."+xx]){
li+="<li><a href=\""+navmenu[x+"."+xx].split("|")[1]+"\">"+navmenu[x+"."+xx].split("|")[0]+"</a></li>\n";
xx++;
}
a2[navmenu[x+".0"].split("|")[0]]=li;
}
if(oldmenu[x+".0"]&&!a2[oldmenu[x+".0"].split("|")[0]]){
var xx=1;
var li="";
while(oldmenu[x+"."+xx]){
li+="<li><a href=\""+oldmenu[x+"."+xx].split("|")[1]+"\">"+oldmenu[x+"."+xx].split("|")[0]+"</a></li>\n";
xx++;
}
a2[oldmenu[x+".0"].split("|")[0]]=li;
}
x++;
}
navmenu=oldmenu=[];
}
function oldA2TableFix(){
var x=1;
while(gebi("ip"+x)){
var td=gebi("ip"+x).parentNode;
td.parentNode.removeChild(td);
x++;
}
}
var a5=[];
function sniffA5(){
var a5w=["<div class=\"a5menuw2\"><div class=\"a5menuw1\">\n","</div></div><div class=\"a5menux2\"></div>"];
if(!a5["ent"]){
for(key in a5){
var d=elem("div");
d.innerHTML=key;
a5[d.innerHTML]=a5[key];
}
a5["ent"]=true;
}
var _195=this.innerHTML.normalize();
if(a5[_195]){
var d=elem("div.a5menu");
d.innerHTML=a5w[0]+a5[_195]+a5w[1];
addClassName(this.parentNode,"hasmenu");
this.parentNode.insertBefore(d,this.nextSibling);
}
}
ked=[];
function sniffK2(_196){
var fobj=this;
var pdoc=document;
fobj.prp=[0,0,0,"","",""];
fobj.className=fobj.className.replace(/(k2over) +/,"$1-");
fobj.className=fobj.className.replace(/(k2click) +/,"$1-");
fobj.className=fobj.className.replace(/(k2focus) +/,"$1-");
fobj.className=fobj.className.replace(/(k2close) +/,"$1-");
var cls=fobj.className.split(" ");
if(fobj.className.indexOf("k2ajaxload")>-1&&fobj.href&&gebtn("div",document.body)[0]){
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf("k2over")>-1||cls[v].indexOf("k2click")>-1||cls[v].indexOf("k2focus")>-1){
var k2id=cls[v].split("-");
if(!k2id[2]){
k2id[2]=k2id[1];
}
}
}
var link=document.createElement("a");
link.className="loadUrl";
link.href=fobj.href+"#"+k2id[2];
if(!gebi(k2id[2])){
var div=document.createElement("div");
div.className="g32auto";
div.id=k2id[2];
div.appendChild(link);
gebtn("div",document.body)[0].appendChild(div);
}
}
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf("k2over")>-1||cls[v].indexOf("k2click")>-1||cls[v].indexOf("k2focus")>-1){
var _19e=fobj.aob=cls[v].split("-");
if(!_19e[2]){
fobj.aob[2]=_19e[2]=_19e[1];
fobj.aob[1]=fobj;
}
kpop=gebi(_19e[2]);
kpop.kp_objs=_19e[2];
kpop.kp_trig=_19e[1];
}else{
if(cls[v].indexOf("k2close")>-1){
fobj.aob=cls[v].split("-");
}else{
if(cls[v].indexOf("x")==0){
fobj.prp[0]=(cls[v].substring(1)*1)+fobj.prp[0];
}else{
if(cls[v].indexOf("y")==0){
fobj.prp[1]=(cls[v].substring(1)*1)+fobj.prp[1];
}else{
if(cls[v].indexOf("z")==0){
fobj.prp[2]=(cls[v].substring(1)*1);
}else{
if(cls[v].indexOf("pAbsolute")==0){
fobj.prp[3]=(cls[v].substring(1));
}else{
if(cls[v].indexOf("vBottom")==0||cls[v].indexOf("vTop")==0||cls[v].indexOf("vMiddle")==0||cls[v].indexOf("vAlignTopBottom")==0){
fobj.prp[4]=cls[v];
}else{
if(cls[v].indexOf("hRight")==0||cls[v].indexOf("hMiddleRight")==0||cls[v].indexOf("hLeft")==0||cls[v].indexOf("hMiddleLeft")==0||cls[v].indexOf("hMiddle")==0||cls[v].indexOf("hAlignRight")==0){
fobj.prp[5]=cls[v];
}
}
}
}
}
}
}
}
}
if(fobj.aob[0].indexOf("k2over")>-1){
addEvent(fobj,"mouseover",function(){
showK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
});
if(!hasClassName(fobj,"mOverOff")){
addEvent(kpop,"mouseover",function(){
showK2(this.kp_objs);
});
}
addEvent(kpop,"mouseout",function(){
hideK2(this.kp_objs);
});
addEvent(fobj,"mouseout",function(){
hideK2(this.aob[2]);
});
addEvent(fobj,"focus",function(){
showK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
blurIt.push([gebi(this.aob[2]),"hidden"]);
});
if(_196){
showK2(fobj.aob[2],fobj.aob[1],fobj.prp[0],fobj.prp[1],fobj.prp[2],fobj.prp[3],fobj.prp[4],fobj.prp[5]);
return false;
}
}else{
if(fobj.aob[0]=="k2click"){
addEvent(fobj,"click",function(e){
showK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
addK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
cancelDefault(e);
return false;
});
if(_196){
showK2(fobj.aob[2],fobj.aob[1],fobj.prp[0],fobj.prp[1],fobj.prp[2],fobj.prp[3],fobj.prp[4],fobj.prp[5]);
addK2(fobj.aob[2],fobj.aob[1],fobj.prp[0],fobj.prp[1],fobj.prp[2],fobj.prp[3],fobj.prp[4],fobj.prp[5]);
return false;
}
}else{
if(fobj.aob[0]=="k2focus"){
addEvent(fobj,"focus",function(){
showK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
addK2(this.aob[2],this.aob[1],this.prp[0],this.prp[1],this.prp[2],this.prp[3],this.prp[4],this.prp[5]);
});
addEvent(fobj,"blur",function(){
hideK2(this.aob[2],1);
});
}else{
if(fobj.aob[0]=="k2close"){
addEvent(fobj,"click",function(e){
hideK2(this.aob[1],1);
cancelDefault(e);
});
}
}
}
}
fobj.className=fobj.className.replace(/(k2over)-|(k2focus)-|(k2cl...)-/,"$1 ");
}
function showK2(_1a1,_1a2,_1a3,_1a4,_1a5,posy,_1a7,ort,_1a9){
var _1aa=gebi(_1a1);
if(!_1aa){
var _1aa=_1a1;
}
if(_1a2){
var ptop=plft=0;
var _1ac=gebi(_1a2);
if(!_1ac){
var _1ac=_1a2;
}
if(ort=="hLeft"){
plft=plft-_1aa.offsetWidth;
}else{
if(ort=="hMiddleLeft"){
plft=plft-_1aa.offsetWidth;
plft=plft+parseInt(_1ac.offsetWidth/2);
}else{
if(ort=="hMiddle"){
plft=parseInt(_1ac.offsetWidth/2);
plft=plft-parseInt(_1aa.offsetWidth/2);
}else{
if(ort=="hMiddleRight"){
plft=parseInt(_1ac.offsetWidth/2);
}else{
if(ort=="hRight"){
plft=_1ac.offsetWidth;
}else{
if(ort=="hAlignRight"){
plft=plft+_1ac.offsetWidth-_1aa.offsetWidth;
}
}
}
}
}
}
if(_1a7=="vTop"){
ptop=ptop-_1aa.offsetHeight;
}else{
if(_1a7=="vMiddle"){
ptop=ptop+parseInt(_1ac.offsetHeight/2);
ptop=ptop-parseInt(_1aa.offsetHeight/2);
}else{
if(_1a7=="vBottom"){
ptop=ptop+_1ac.offsetHeight;
}else{
if(_1a7=="vAlignBottom"){
ptop=ptop+_1ac.offsetHeight-_1aa.offsetHeight;
}else{
if(_1a7=="vAlignTopBottom"){
var _1ad=0;
if(document.body&&(document.body.scrollLeft||document.body.scrollTop)){
_1ad=document.body.scrollTop;
}else{
if(document.documentElement&&(document.documentElement.scrollLeft||document.documentElement.scrollTop)){
_1ad=document.documentElement.scrollTop;
}
}
var _1ae=0;
if(typeof (window.innerWidth)=="number"){
_1ae=window.innerHeight;
}else{
if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){
_1ae=document.documentElement.clientHeight;
}
}
var _1af=_1ac.offsetHeight-_1aa.offsetHeight;
}
}
}
}
}
if(is.safari&&posy=="Absolute"){
if(posy!="Absolute"){
_1ac.style.position="relative";
}
getXY(_1ac.offsetParent);
}else{
getXY(_1ac);
}
ptop=ptop+_1ac.Y;
plft=plft+_1ac.X;
if(_1a7=="vAlignTopBottom"&&ptop>_1ad+(_1ae/2)){
ptop=ptop+_1af;
_1a4=_1a4*-1;
}
plft=plft+_1a3;
ptop=ptop+_1a4;
_1aa.style.top=ptop+"px";
_1aa.style.left=plft+"px";
}
if(_1a5){
_1aa.style.zIndex=_1a5;
}
_1aa.style.visibility="visible";
}
function hideK2(_1b0,_1b1,_1b2){
var _1b3=gebi(_1b0);
if(!_1b3){
var _1b3=_1b0;
}
_1b3.style.visibility="hidden";
if(_1b1){
ked[_1b0]="";
}
}
function addK2(p0,p1,p2,p3,p4,p5,p6,p7){
ked[p0]=[p0,p1,p2,p3,p4,p5,p6,p7];
}
addEvent(window,"resize",function(){
var kdp;
for(kdp in ked){
if(ked[kdp][0]){
showK2(ked[kdp][0],ked[kdp][1],ked[kdp][2],ked[kdp][3],ked[kdp][4],ked[kdp][5],ked[kdp][6],ked[kdp][7]);
}
}
});
function sniffK2ajax(){
var fobj=this;
var _1be=fobj.className.split("k2ajax-")[1].split(" ")[0];
var _1bf=gebtn("a",gebi(_1be))[0].href;
var mvnt=(fobj.className.indexOf("k2over-")>-1)?"mouseover":"click";
addEvent(fobj,mvnt,function(){
if(gebi(_1be).innerHTML.indexOf("getUrl")>-1){
var _1c1=[_1be,fobj];
getfile(_1bf,function(_1c2,fvar){
if(_1c2.indexOf("contentchunk")>-1){
_1c2=getRequestObject("contentchunk",_1c2).innerHTML;
}
gebi(fvar[0]).innerHTML=_1c2;
reg.rerun(gebi(fvar[0]));
sniffK2.call(fvar[1],true);
},_1c1);
}
});
}
function sniffModal(){
var fobj=this;
if(hasClassName(fobj,"modal-launch")){
var _1c5=fobj.className.match(/launch\-id\-([a-z0-9_-]+)/);
if(!_1c5){
return;
}else{
fobj.modalId=_1c5[1];
}
fobj.onclick=function(e){
showK4(this.modalId);
return false;
};
}
}
function showK4(id){
var div=gebi(id);
if(!div){
return;
}
removeClassName(div,"k4hidden");
var _1c9=gebtn("input",div);
for(var a=0;a<_1c9.length;a++){
if(_1c9[a].type=="text"){
_1c9[a].focus();
break;
}
}
if(is.ie6){
var _1cb=gebtn("select");
for(var a=0;a<_1cb.length;a++){
addClassName(_1cb[a],"k4in-effect");
}
}
}
function hideK4(id){
var div=gebi(id);
addClassName(div,"k4hidden");
if(is.ie6){
var _1ce=gebtn("select");
for(var a=0;a<_1ce.length;a++){
removeClassName(_1ce[a],"k4in-effect");
}
}
}
function modalClose(e){
var k4=this.parentNode;
while(!hasClassName(k4,"k4")&&k4.parentNode){
k4=k4.parentNode;
}
if(hasClassName(k4,"k4")&&k4.id){
hideK4(k4.id);
}
return false;
}
function sniffSiteSelector(span){
var lnks=gebtn("a",span);
for(var a=0;a<lnks.length;a++){
var lnk=lnks[a];
if(hasClassName(lnk,"country-select")){
addClassName(lnk,"modal-launch launch-id-country-selector");
sniffModal.call(lnk);
var k4=elem("div",{"class":"k4 k4v1 k4hidden","id":"country-selector"});
k4.innerHTML="<div class=\"k4w1\"><div class=\"k4w2\"><div class=\"k4w3\"><div class=\"k4w4\"><div class=\"k4title\"><h2>"+"</h2><p class=\"modal-extra\"><a href=\"\" class=\"modal-close\">[X]</a></p></div><div class=\"k4body\">"+"</div></div></div></div></div>";
k4.setTitle=function(txt){
gebtn("h2",this)[0].innerHTML=txt;
};
k4.setBody=function(txt){
gebtn("div",this)[5].innerHTML=txt;
};
document.body.appendChild(k4);
addEvent(lnk,"click",function(){
var _1d9=this.href;
try{
getfile(this.href,function(_1da,fvar){
try{
var _1dc=elemText(getRequestObject("country-data-title",_1da,"h2"));
var _1dd=getRequestObject("country-data",_1da).innerHTML;
}
catch(ex){
window.location=_1d9;
}
k4.setTitle(_1dc);
k4.setBody(_1dd);
});
}
catch(e){
window.location=_1d9;
}
});
}else{
if(hasClassName(lnk,"language-select")){
var k2=gebi("languageselector");
k2.setTitle=function(txt){
gebtn("h5",this)[0].innerHTML=txt;
};
k2.setBody=function(txt){
gebtn("div",this)[3].innerHTML=txt;
};
addEvent(lnk,"mouseover",function(){
var _1e1=this.href;
try{
getfile(this.href,function(_1e2,fvar){
try{
var _1e4=elemText(getRequestObject("language-data-title",_1e2,"h2"));
var _1e5=getRequestObject("language-data",_1e2).innerHTML;
}
catch(ex){
k2.setTitle("no data");
return;
}
k2.setTitle(_1e4);
k2.setBody(_1e5);
});
}
catch(e){
window.location=_1e1;
}
});
}
}
}
}
reg.postSetup(function(){
var _1e6=gebi("k5onload");
if(!_1e6){
return;
}
k5Click.call(_1e6);
});
function pauseAll(){
window.paused=true;
addClassName(document.body,"paused");
}
function resumeAll(){
window.paused=false;
removeClassName(document.body,"paused");
}
function k5Click(){
var _1e7=this.href;
if(reg.matches(this,"div.k5")){
return;
}
k5Close();
var _1e8=matchClassName(this,/^id-(\S+)$/);
if(_1e8){
var id=_1e8[1];
}else{
if(_1e7&&_1e7.indexOf("#")!=-1){
var id=_1e7.substring(_1e7.indexOf("#")+1);
}else{
throw new Error("no id value was specified for k5 object. className \"id-someId\" or URL anchor reference \"...page.html#someId\"");
}
}
var _1ea="k5 k5empty";
var _1eb,isInf,isLog,isMed,isInterrupt,interruptParent=getParent(this,".k5interrupt");
if(hcn(this,"k5interrupt")||interruptParent){
_1ea+=" k5interrupt";
isInterrupt=true;
}
if(hcn(this,"k5vid")){
_1ea+=" k5vid";
_1eb=true;
}else{
if(hcn(this,"k5login")){
_1ea+=" k5login";
isLog=true;
}else{
if(hcn(this,"k5media")){
_1ea+=" k5media hijax-"+id;
isMed=true;
}else{
if(hcn(this,"k5info")){
_1ea+=" k5info";
isInf=true;
}
}
}
}
var _1ec=(this.title)?this.title:elemText(this);
if(!_1ec){
_1ec=" ";
}
if(isLog){
var _1ed={"title":"close","alt":"close","src":imdir+"/k5login_x.gif","border":"0","width":"21","height":"21"};
}else{
if(isInf){
var _1ed={"title":"close","alt":"close","src":imdir+"/k5info_x.gif","border":"0","width":"21","height":"21"};
}else{
var _1ed={"title":"close","alt":"close","src":imdir+"/ic_close_win_big_x.gif","border":"0","width":"30","height":"19"};
}
}
if(interruptParent){
this.continueTo=interruptParent.continueTo;
this.submitTo=interruptParent.submitTo;
this.thankYouHref=interruptParent.thankYouHref;
}
var _1ee=elem("h2.k5title",null,_1ec);
var _1ef=elem("span."+(isInterrupt?"k5skip":"k5close"),null,elem("img",_1ed));
var _1f0=elem("p.k5closer",null,_1ef);
var k5w2=elem("div.k5w2");
var k5w1=elem("div.k5w1",null,[_1ee,_1f0,k5w2]);
var _1f3=elem("div.k5shadow");
_1f3.innerHTML="<table><tr><td class=\"tl\"></td><td class=\"tc\"></td><td class=\"tr\"></td></tr><tr><td class=\"ml\"></td><td class=\"mc\"></td><td class=\"mr\"></td></tr><tr><td class=\"bl\"></td><td class=\"bc\"></td><td class=\"br\"></td></tr></table>";
var _1f4=elem("div#k5",{"class":_1ea},[k5w1,_1f3]);
if(this.continueTo){
_1f4.continueTo=this.continueTo;
}
if(this.submitTo){
_1f4.submitTo=this.submitTo;
}
if(this.thankYouHref){
_1f4.thankYouHref=this.thankYouHref;
}
_1f3.position=function(_1f5,_1f6){
_1f5-=33;
_1f6-=29;
var _1f7=gebcn("mc",_1f3)[0].style;
_1f7.width=_1f5+"px";
_1f7.height=_1f6+"px";
this.style.top=(-31-_1f6)+"px";
this.style.left="8px";
};
k5w1.centerOnScreen=function(){
if(!this.viewportHeight){
this.viewportHeight=(window.innerHeight)?window.innerHeight:document.documentElement.clientHeight;
}
if(!this.viewportWidth){
this.viewportWidth=(window.innerWidth)?window.innerWidth:document.documentElement.clientWidth;
}
var _1f8=this.offsetHeight;
var _1f9=this.offsetWidth;
var _1fa=((this.viewportHeight/2)-(_1f8/2))*0.666;
if(_1fa<0){
_1fa=0;
this.style.height=(this.viewportHeight-20)+"px";
this.style.overflow="auto";
}
if(_1f9>this.viewportWidth){
this.style.width=(this.viewportWidth-40)+"px";
this.style.overflow="auto";
}
this.style.marginTop=_1fa+"px";
};
k5w1.setContent=function(_1fb){
_1fb.style.visibility="hidden";
_1f3.style.visibility="hidden";
removeClassName(_1f4,"k5empty");
removeClassName(_1fb,"hidethis");
var _1fc=gebcn("k5customtitle",_1fb);
if(_1fc&&_1fc.length>0){
var _1fd=_1fc[0];
var _1fe=elemText(_1fd);
_1fd.parentNode.removeChild(_1fd);
_1ee.firstChild.data=_1fe;
}
var _1ff=matchClassName(_1fb,/^(\d+)(x(\d+))?$/);
if(_1ff){
if(!k5w1.style.width){
k5w1.style.width=_1ff[1]+"px";
}
if(_1ff.length>3&&_1ff[3]&&!k5w2.style.height){
k5w2.style.height=_1ff[3]+"px";
}
}
k5w2.innerHTML="";
k5w2.appendChild(_1fb);
var _200=k5w2.offsetHeight;
this.centerOnScreen();
_1fb.style.visibility="";
window.setTimeout(function(){
_1f3.position(k5w1.offsetWidth,k5w1.offsetHeight);
_1f3.style.visibility="";
},40);
};
_1f4.setError=function(_201,_202,url){
removeClassName(this,"k5empty");
addClassName(this,"k5error");
k5w1.style.height="auto";
k5w1.style.width="";
k5w2.style.height="";
_202=_202||"Unspecified error";
_201=_201||"Error";
var _204=_201?elem("h5.k5customtitle",{},_201):"";
var _205=elem("p",{},_202);
var _206=url?elem("p",{},""+url):"";
k5w1.setContent(elem("div",{"class":"g29 g29v2"},elem("div.g29w1",{},elem("div.g29w2",{},[_204,_205,_206]))));
};
_1f4.style.visibility="hidden";
if(is.ie6){
var _207=elem("div#k5ie6bg");
document.body.appendChild(_207);
}
document.body.appendChild(_1f4);
var _208=matchClassName(this,/^(\d+)(x(\d+))?$/);
if(_208){
k5w1.style.width=_208[1]+"px";
if(_208.length>3&&_208[3]){
k5w2.style.height=_208[3]+"px";
}
}
k5w1.centerOnScreen();
_1f4.style.visibility="";
var _209=_1e7||location.href;
if(_209.indexOf("http")!==0){
_209=resolveUrl(_209);
}
if(_209.indexOf("#")!=-1){
_209=_209.substring(0,_209.indexOf("#"));
}
var _20a=location.href;
if(_20a.indexOf("#")!=-1){
_20a=_20a.substring(0,_20a.indexOf("#"));
}
if(_20a===_209){
var _20b=gebi(id);
if(!_20b){
_1f4.setError("Unable to load content","id=\""+id+"\" not found on this page",_209);
}else{
k5w1.setContent(_20b.cloneNode(true));
}
}else{
try{
xhr(_209,function(_20c){
var _20d=getElementByIdFromString(_20c,id);
if(!_20d){
_1f4.setError("Unable to load content","id=\""+id+"\" not found on remote page",_209);
}else{
k5w1.setContent(_20d);
}
},function(_20e,_20f,url){
_1f4.setError("Unable to load content",_20e+" "+_20f,url);
});
}
catch(ex){
_1f4.setError("Unable to load content","XHR FAIL: "+(ex.message||ex),_209);
}
}
try{
this.blur();
var _211=gebs("input@type=\"text\",button,select,textarea",_1f4);
if(_211&&_211.length>0){
_211[0].focus();
}
}
catch(ex){
}
pauseAll();
return false;
}
function k5Close(e){
k5SoftClose();
return false;
}
function k5SoftClose(e){
var _214=gebi("k5");
if(_214){
document.body.removeChild(_214);
}
var _215=gebi("k5ie6bg");
if(_215){
document.body.removeChild(_215);
}
resumeAll();
}
(function(){
var done=false;
window.k5Onload=function(href,id,_219,lf,_21b,_21c){
if(done){
throw new Error("k5Onload called multiple times");
}else{
done=true;
}
if(!href){
href=location.href;
}
if(href.indexOf("#")!=-1){
if(!id){
id=href.substring(href.indexOf("#")+1);
}
href=href.substring(0,href.indexOf("#"));
}
href=href+"#"+id;
var _21d="k5";
if(_21b){
_21d+=" "+_21b;
}
if(_21c){
_21d+="x"+_21c;
}
if(lf){
_21d+=" "+lf;
}
var a=elem("a",{"class":_21d,"href":href},_219);
reg.postSetup(function(){
window.setTimeout(function(){
k5Click.call(a);
},200);
});
};
})();
(function(){
var _21f,done=false;
function handleIt(el,_221,_222,_223){
if(!done&&(done=true)){
_21f=gebs("link@rel=\"k5interrupt\"",gebtn("head")[0]);
}
for(var i=0;i<_21f.length;i++){
var link=_21f[i];
var _226=link.getAttribute("match");
var _227=link.getAttribute("select");
if(!_226&&!_227){
continue;
}
var _226=_226||".?";
var _227=_227||"*";
var _228=new RegExp(_226);
if(!_226&&!_227){
continue;
}
if(!_228.test(_223)||!matches(el,_227)){
continue;
}
var href=link.href;
var _22a=link.getAttribute("title");
var _22b=link.getAttribute("thanks");
var _22c=elem("a",{"class":link.className+" k5interrupt","href":href},_22a);
_22c.continueTo=_221;
_22c.submitTo=_222;
_22c.thankYouHref=_22b;
try{
return k5Click.call(_22c);
}
catch(ex){
console.log("error while calling k5Click(): "+ex.message);
return true;
}
}
}
var _22d=/^https?:/;
var _22e=/^\/\//;
var _22f=/^\//;
var _230=/^\?/;
var _231=/^#/;
var l=location;
var _233=l.protocol+"//"+l.host+l.pathname;
_233=_233.substring(0,_233.lastIndexOf("/")+1);
function resolveUrl(frag,_235){
frag=frag.strip();
var _236=null;
if(_22d.test(frag)){
_236=frag;
}else{
if(_22e.test(frag)){
_236=l.protocol+frag;
}else{
if(_22f.test(frag)){
_236=l.protocol+"//"+l.host+frag;
}else{
if(_230.test(frag)){
_236=l.protocol+"//"+l.host+l.pathname+frag;
}else{
if(_231.test(frag)){
_236=l.protocol+"//"+l.host+l.pathname+l.search+frag;
}else{
if(!frag){
_236=l.href;
}else{
_236=_233+frag;
}
}
}
}
}
}
if(_235){
var qind=_236.indexOf("?");
var hind=_236.indexOf("#");
if(qind!=-1){
_236=_236.substring(0,qind);
}
if(hind!=-1){
_236=_236.substring(0,hind);
}
_236+="?"+_235;
}
return _236;
}
window.resolveUrl=resolveUrl;
reg.click("@href",function(e){
try{
var _23a=resolveUrl(this.href);
}
catch(ex){
console.log(ex.message);
return;
}
return handleIt(this,_23a,null,_23a);
});
reg.submit("form",function(e){
try{
var _23c=resolveUrl(this.action);
}
catch(ex){
console.log(ex.message);
return;
}
return handleIt(this,null,this,_23c);
});
function getLabel(_23d){
var _23e=getParent(_23d,"label");
var id=_23d.id||_23d.name;
if(!_23e){
var _240=gebtn("label");
for(var i=0;i<_240.length;i++){
if(_240[i].htmlFor===id){
_23e=_240[i];
break;
}
}
}
return (_23e)?elemText(_23e):id;
}
reg.submit(".k5interrupt",function(e){
cancelDefault(e);
if(!this.continueTo&&!this.submitTo){
console.log("no continueTo url or submitTo form");
return false;
}
var _243=this.continueTo;
var _244=this.submitTo;
var _245=this.thankYouHref;
var _246=this.className;
var _247=getTarget(e);
var _248=getFormData(_247);
var url=resolveUrl(_247.action,_248);
var _24a=this;
var _24b=validateForm(_247);
if(_24b){
if(!hcn(_247,"failsilent")){
alert(_24b);
}else{
k5Close();
_243&&(location.href=_243);
_244&&_244.submit();
}
return;
}
if(_247.whichSubmit){
_247.whichSubmit.value="sending...";
}
try{
xhr(url,function(){
if(_245){
k5Click.call(elem("a",{"href":_245,"class":_246},"Thank You"));
window.setTimeout(function(){
k5Close();
_243&&(location.href=_243);
_244&&_244.submit();
},2700);
}else{
k5Close();
_243&&(location.href=_243);
_244&&_244.submit();
}
},function(_24c,_24d){
if(_243){
var url=_243;
}else{
if(_244){
var url=resolveUrl(_244.action,getFormData(_244));
}
}
_247.appendChild(elem("input",{"type":"hidden","name":"redirect_to","value":url}));
_247.appendChild(elem("input",{"type":"hidden","name":"goto","value":url}));
_247.submit();
window.setTimeout(function(){
k5Close();
},100);
});
}
catch(ex){
if(_243){
var url=_243;
}else{
if(_244){
var url=resolveUrl(_244.action,getFormData(_244));
}
}
_247.appendChild(elem("input",{"type":"hidden","name":"redirect_to","value":url}));
_247.appendChild(elem("input",{"type":"hidden","name":"goto","value":url}));
_247.submit();
window.setTimeout(function(){
k5Close();
},100);
}
});
reg.click(".k5skip",function(e){
var _250=gebi("k5");
if(!_250||(!_250.continueTo&&!_250.submitTo)){
return;
}
var _251=_250.continueTo;
var _252=_250.submitTo;
k5Close();
_251&&(location.href=_251);
_252&&_252.submit();
return false;
});
reg.click(".k5interrupt form @type=\"submit\"",function(e){
if(hcn(this,"k5skip")){
return;
}
var form=getParent(this,"form");
form.whichSubmit=this;
});
})();
(function(){
function getLabel(_255){
var _256=getParent(_255,"label");
var id=_255.id||_255.name;
if(!_256){
var _258=gebtn("label");
for(var i=0;i<_258.length;i++){
if(_258[i].htmlFor===id){
_256=_258[i];
break;
}
}
}
return (_256)?elemText(_256):id;
}
function validateForm(form){
var _25b="";
var _25c=gebs("input.required@type=\"text\", input.required@type=\"password\", textarea.required",form);
var _25d=gebs("input.required@type=\"checkbox\", input.required@type=\"radio\"",form);
var _25e=gebs("select.required",form);
for(var i=0;i<_25c.length;i++){
var f=_25c[i];
if(!f.value){
_25b+="missing: "+getLabel(f)+"\n";
}
}
for(var i=0;i<_25d.length;i++){
var f=_25d[i];
if(!f.checked){
_25b+="must select: "+getLabel(f)+"\n";
}
}
for(var i=0;i<_25e.length;i++){
var f=_25e[i];
if(!f.options[f.selectedIndex].value){
_25b+="must select: "+getLabel(f)+"\n";
}
}
_25b&&(_25b="This form is not complete. Please provide the\nrequired information in order to proceed.\n\n"+_25b);
return _25b;
}
window.validateForm=validateForm;
})();
reg.click("@href*='thisURL'",function(e){
this.href=this.href.replace(/(thisURL)/,encodeURIComponent(document.location));
});
reg.submit("div.a2search form",function(e){
i=gebs("input.searchfield,input#searchfield",this);
if(i[0].value!=""&&i[0].value!=i[0].defaultValue){
oTrack(this,"A2","Search-"+document.getElementById("searchfield").value);
}
});
reg.click("a#sunlogo",function(){
oTrack(this,"A2","SunLogo");
});
reg.click("div.a2topiclinks > ul > li > a",function(){
oTrack(this,"A2",this.innerHTML);
});
reg.click("div.a2m a",function(){
oTrack(this,"A2",this.parentNode.parentNode.parentNode.parentNode.getElementsByTagName("a")[0].innerHTML+"-"+this.innerHTML);
});
reg.click("div.a1menu a",function(){
var p=hasParent(this,"div","a1menu");
p=prevElem(p);
oTrack(this,"A1",elemText(p)+"-"+elemText(this));
});
reg.click("div.a1 span > a",function(){
oTrack(this,"A1");
});
reg.click("div#a5 > ul > li > a",function(){
oTrack(this,"A5");
});
reg.click("div#a5 li li a",function(){
var p=hasParent(this,"li","hasmenu");
oTrack(this,"A5",elemText(p.getElementsByTagName("a")[0])+"-"+elemText(this));
});
reg.click("div.k5 a",function(){
var type="K5";
if(hasParent(this,"poweredby")){
type="-poweredby";
}else{
if(hasParent(this,"countries")){
type="-countries";
}
}
oTrack(this,type,this.innerHTML);
});
var omniwhite={"www":["all"],"star-wip.eng":["all"]};
function oTrack(a,comp,atxt,aud){
if(window.s_account){
var l=(typeof document.location.host.split("sun.com")[0].replace(/\.$/gi,"").split(":")[0]=="undefined")?navigator.userAgent.toLowerCase().normalize("_"):document.location.host.split("sun.com")[0].replace(/\.$/gi,"").split(":")[0];
var _26b=false;
if(omniwhite[l]){
for(var i=0;i<omniwhite[l].length;i++){
if(omniwhite[l][i]==comp||omniwhite[l][i]=="all"){
_26b=true;
}
}
}else{
if(omniwhite["home"]){
_26b=true;
}
}
if(_26b){
if(a.getElementsByTagName("img")[0]&&!atxt){
if(a.getElementsByTagName("img")[0].alt){
atxt=a.getElementsByTagName("img")[0].alt;
}else{
if(a.getElementsByTagName("img")[0].title){
atxt=a.getElementsByTagName("img")[0].title;
}else{
atxt=a.getElementsByTagName("img")[0].src.replace(/.*\/([^\/.]+)\..*$/g,"$1");
}
}
}else{
if(!atxt){
atxt=elemText(a);
}
}
atxt=atxt.replace(/\.\.\./gi,"");
atxt=atxt.normalize();
s_linkType="o";
if(!omniwhite["home"]){
s_linkTrackVars="prop13,prop14,prop15,prop16,s_eVar37,s_eVar38";
}else{
if(omniwhite["home"]&&aud&&l&&atxt&&comp){
s_linkTrackVars="prop13,prop14,prop15,prop16,s_eVar37,s_eVar38,eVar30,eVar36";
s_eVar30=l+"-"+comp+"-"+atxt;
s_eVar36=l+"-"+aud;
}else{
if(omniwhite["home"]&&l&&atxt&&comp){
s_linkTrackVars="prop13,prop14,prop15,prop16,s_eVar37,s_eVar38,eVar30";
s_eVar30=l+"-"+comp+"-"+atxt;
}
}
}
s_prop13=comp;
s_prop14=decodeURIComponent(a.href);
s_prop15=s_pageName;
s_prop16=atxt;
s_eVar37=l+"-"+atxt;
s_eVar38=l+"-"+comp;
s_linkName=l+":"+comp+":"+atxt;
if(omniwhite["console"]){
console.log("   s_prop13 = "+comp+"\n   s_prop14 = "+decodeURIComponent(a.href)+"\n   s_prop15 = "+s_pageName+"\n   s_prop16 = "+atxt+"\n   s_eVar37 = "+l+"-"+atxt+"\n   s_eVar38 = "+l+"-"+comp+"\n s_linkName = "+l+":"+comp+":"+atxt);
if(omniwhite["home"]){
console.log("\n s_eVar30 = "+l+"-"+comp+"-"+atxt);
}
if(aud){
console.log("\n s_eVar36 = "+l+"-"+aud);
}
}
if(s_prop13&&s_prop14&&s_prop15&&s_prop16&&s_eVar37&&s_eVar38){
s_lnk=s_co(a);
s_gs(s_account);
}
s_prop13=s_prop14=s_prop15=s_prop16=s_linkTrackVars=s_eVar37=s_eVar38=s_eVar30=s_eVar36="";
}
}
}
(function(){
window.surveyPop=function(url,_26e,_26f,_270,_271,_272){
if(_26e&&_26e<Math.random()){
return false;
}
if(beenThereDoneThat(surveyUrl,_26f)){
return false;
}
if(!_271){
_271=548;
}
if(!_270){
_270=600;
}
var args="resizable,status,width="+_271+",height="+_270;
if(!_272){
args+=",scrollbars";
}
var _274=window.open(url,"_surveyWin",args);
return _274;
};
window.surveyDialog=function(_275,_276,_277){
if(_276&&_276<Math.random()){
return false;
}
if(beenThereDoneThat(_275,_277)){
return false;
}
var _278=elem("a",{"class":"k5 k5info","href":_275},"");
k5Click.call(_278);
};
function beenThereDoneThat(url,_27a){
var patt=new RegExp("^"+ckName+"_"+uHash+"=seen$");
var ck=document.cookie;
var _27d="surveyHash";
var _27e=ck.split("; ");
var _27f=url.toLowerCase().replace(/[^a-z0-9_\/]/g,"_");
var _280=false;
for(var i=0;i<_27e.length;i++){
if(patt.test(_27e[i])){
return true;
}
}
if(_27a){
if(_27a<0){
_27a=9999;
}
var _282=new Date();
_282.setTime(_282.getTime()+_27a*1000*60*60*24);
document.cookie=_27d+"_"+_27f+"=seen; expires="+_282.toGMTString();
}
return false;
}
})();
function decodeSunSessionCookie(){
var _283="SASC=";
var _284="";
var ca=document.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_283)==0){
_284=c.substring(_283.length,c.length);
}
}
return decodeURIComponent(_284);
}
function setSunSessionCookie(name,_289){
var _28a=decodeSunSessionCookie();
var _28b="";
var _28c=true;
if(_28a!=""){
var nvps=_28a.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
nvp[1]=encodeURIComponent(_289);
_28c=false;
}
_28b+=nvp[0]+"="+nvp[1]+"&";
}
_28b=_28b.substring(0,_28b.length-1);
}
if(_28c){
if(_28b!=""){
_28b+="&";
}
_28b+=name+"="+encodeURIComponent(_289);
}
if(_28b.length>4080){
throw "Out of application session cookie space";
}
document.cookie="SASC="+encodeURIComponent(_28b)+"; path=/";
}
function getSunSessionCookie(name){
var _291=decodeSunSessionCookie();
if(_291!=""){
var nvps=_291.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
return decodeURIComponent(nvp[1]);
}
}
}
return null;
}
function removeSunSessionCookie(name){
var _296=decodeSunSessionCookie();
var _297="";
if(_296!=""){
var nvps=_296.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
continue;
}
_297+=nvp[0]+"="+nvp[1]+"&";
}
_297=_297.substring(0,_297.length-1);
}
document.cookie="SASC="+encodeURIComponent(_297)+"; path=/";
}
function deriveExpirationForAppExtendedCookie(){
var date=new Date();
date.setTime(date.getTime()+(365*24*60*60*1000));
return "; expires="+date.toGMTString();
}
function decodeSunExtendedCookie(){
var _29c="SAEC=";
var _29d="";
var ca=document.cookie.split(";");
for(var i=0;i<ca.length;i++){
var c=ca[i];
while(c.charAt(0)==" "){
c=c.substring(1,c.length);
}
if(c.indexOf(_29c)==0){
_29d=c.substring(_29c.length,c.length);
}
}
return decodeURIComponent(_29d);
}
function setSunExtendedCookie(name,_2a2,days){
if(suncomExtendedCookieWhiteList[name]){
}else{
if(name.length>4&&name.substring(name.length-4,name.length)=="_exp"&&suncomExtendedCookieWhiteList[name.substring(0,name.length-4)]){
}else{
throw "This cookie name is not supported - "+name;
}
}
var _2a4=decodeSunExtendedCookie();
var _2a5="";
var _2a6=true;
if(_2a4!=""){
var nvps=_2a4.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
nvp[1]=encodeURIComponent(_2a2);
_2a6=false;
}
_2a5+=nvp[0]+"="+nvp[1]+"&";
}
_2a5=_2a5.substring(0,_2a5.length-1);
}
if(_2a6){
if(_2a5!=""){
_2a5+="&";
}
_2a5+=name+"="+encodeURIComponent(_2a2);
}
if(_2a5.length>4080){
throw "Out of application session cookie space";
}
var _2aa=deriveExpirationForAppExtendedCookie();
document.cookie="SAEC="+encodeURIComponent(_2a5)+_2aa+"; path=/";
if(days){
var date=new Date();
var _2ac=days+Math.ceil(date.getTime()/24/60/60/1000);
setSunExtendedCookie(name+"_exp",_2ac,null);
}
}
function getSunExtendedCookie(name){
var _2ae=null;
if(!(name.length>4&&name.substring(name.length-4,name.length)=="_exp")){
_2ae=getSunExtendedCookie(name+"_exp");
}
if(_2ae!=null){
var _2af=Math.ceil(new Date().getTime()/24/60/60/1000);
if(_2af>_2ae){
removeSunExtendedCookie(name);
return null;
}
}
var _2b0=decodeSunExtendedCookie();
if(_2b0!=""){
var nvps=_2b0.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
return decodeURIComponent(nvp[1]);
}
}
}
return null;
}
function removeSunExtendedCookie(name){
if(!(name.length>4&&name.substring(name.length-4,name.length)=="_exp")){
removeSunExtendedCookie(name+"_exp");
}
var _2b5=decodeSunExtendedCookie();
var _2b6="";
if(_2b5!=""){
var nvps=_2b5.split("&");
for(var i=0;i<nvps.length;i++){
var nvp=nvps[i].split("=");
if(nvp[0]==name){
continue;
}
_2b6+=nvp[0]+"="+nvp[1]+"&";
}
_2b6=_2b6.substring(0,_2b6.length-1);
}
var _2ba=deriveExpirationForAppExtendedCookie();
document.cookie="SAEC="+encodeURIComponent(_2b6)+_2ba+"; path=/";
}
var suncomExtendedCookieWhiteList={};
var imgpostload=[];
reg.postSetup(function(){
if(typeof imgpostload=="undefined"){
return;
}
for(var imp=0;imp<imgpostload.length;imp++){
if(imgpostload[imp].title){
imgpostload[imp].src=imgpostload[imp].title;
imgpostload[imp].title="";
}
}
});
if(!shutoff.global){
if(is.ie56){
reg.setup("div.g15v5 > table",function(){
addClassName(this,"tickle");
});
}
}
if(!shutoff.share){
reg.setup("div.pagetitle, div.smallpagetitle",sniffSharePage,true);
}
if(!shutoff.misc){
reg.setup("@class*='cTool-'",sniffClassTool);
reg.setup("img@src*='_off.'",sniffRollover);
reg.setup("div.g23",sniffG23);
reg.setup("div.g27w2",sniffG27);
reg.click("div.g27w2 > h3 > span.g27targ",toggleG27);
reg.setup("div.imgbox",sniffImgbox);
reg.setup("select.goto, select.showDiv",sniffGoto);
reg.setup("ul.goto, ul.showDiv",sniffGotoUL);
reg.setup(".xfadefirst",sniffXfade);
reg.setup("ul.listfade",sniffListfade);
reg.setup("a.loadUrl@href",sniffLoadUrl);
reg.setup("a.imgswap, area.imgswap, img.imgswap, span.imgswap",sniffImgswap);
reg.setup("img@class*=\"mswap\"",sniffMultiswap);
reg.setup("img.postload",function(){
imgpostload.push(this);
});
reg.setup("a.toggleObj, area.toggleObj",sniffToggler);
reg.setup("a.toggle-all-table-checkboxes",sniffToggleAllCheckboxesInTable);
reg.setup("div.pc1collapsible",sniffExpandCollapsePc1);
reg.setup("select.platformDetect",platformDetect);
reg.setup("select.langDetect",langDetect);
reg.setup("form@class*=\"wgform-\"",sniffFormHijax);
reg.setup(".pn0 > .pn0v5 a.big,.pn0 > .pn0v3 a.big,.pn0 > .pn0v2 a.big,.pn0 > .pn0v1 a.big",sniffpn00links);
reg.setup("div.g15v5 > table.details tr.main-row > th",function(){
this.appendChild(elem("div.after",{},[elem("div.show",{},ltxt.showDetails),elem("div.hide",{},ltxt.hideDetails)]));
});
if(location.hash){
try{
reg.setup("div.g15v5 table tbody"+location.hash,function(){
removeClassName(this,"collapsed");
addClassName(this,"uncollapsed");
});
}
catch(ex){
console.log(ex.message);
}
}
if(is.ie56){
reg.setup("div.g15v5 > table",function(){
addClassName(this,"tickle");
});
reg.setup("div.pngimg",function(){
this.style.filter="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='"+this.getElementsByTagName("img")[0].src+"')";
});
}
if(typeof widgets!="undefined"){
reg.setup(".wg1",sniffWg1);
}
}
function sniffpn00links(){
if(this.href){
var pn0=hasParent(this,"div","pn0");
if(!hasClassName(pn0,"hasimglink")){
addClassName(pn0,"hasimglink");
pn0.appendChild(elem("a.pn0linkimg",{"href":this.href},[]));
}
}
}
reg.preSetup(function(){
var pc10=gebi("pc10");
if(!pc10){
return;
}
var imgs=gebs("p.pc10img img.pc10img");
if(!imgs||imgs.length==0){
return;
}
for(var a=0;a<imgs.length;a++){
var img=imgs[a];
var src=img.src;
var _2c2=src.replace(/(\.[a-z]+$)/,"_hvr$1");
var _2c3=img.cloneNode(true);
_2c3.src=_2c2;
_2c3.className="pc10img_over";
img.parentNode.appendChild(_2c3);
}
if(!window.pc10active){
window.pc10active=true;
reg.hover("div.pc10item",function(e){
addClassName(this,"pc10itemover");
},function(e){
removeClassName(this,"pc10itemover");
});
}
});
reg.preSetup(function(){
var fn1=gebi("productFinder");
if(!fn1){
return;
}
reg.setup("td.fnCmp input@type=\"checkbox\"",function(){
if(this.checked==true){
addClassName(this.parentNode.parentNode,"checked");
}
});
reg.setup("ul#fn1Filters",function(){
var ems=gebtn("em",this);
for(var i=0;i<ems.length;i++){
if(ems[i].parentNode.nodeName.toLowerCase()=="li"){
var a=elem("a",{"href":"#toggleView"});
a.onclick=function(){
toggleClassName(this.parentNode.parentNode,"collapsed");
return false;
};
innerWrap(ems[i],a);
}
}
var li=gebtn("li",this);
var n=0;
for(var i=0;i<li.length;i++){
var _2cc=gebtn("li",li[i])[0];
if(li[i].parentNode==this&&n>3&&_2cc&&_2cc.className.indexOf("selection")>-1){
addClassName(li[i],"collapsed");
}else{
if(li[i].parentNode==this&&gebtn("em",li[i])[0]){
n++;
}
}
}
});
reg.setup("fieldset.fieldset-collapsed,fieldset.fieldset-uncollapsed",function(){
if(gebtn("h6",this)[0]){
var a=elem("a.fieldsettoggle",{"href":"#toggleView"});
innerWrap(gebtn("h6",this)[0],a);
addClassName(gebtn("h6",this)[0],"fieldsettoggle");
}
});
reg.click("td.fnCmp input@type=\"checkbox\"",function(){
var _2ce=this;
while(_2ce=_2ce.parentNode){
if(_2ce.nodeName.toLowerCase()=="form"){
var form=_2ce;
break;
}
}
var _2d0=form.className.split("maxchecked-")[1].split(" ")[0];
if(_2d0){
var n=0;
var ck=gebtn("input",form);
for(var i=0;i<ck.length;i++){
if(ck[i].type=="checkbox"&&ck[i].checked==true){
n++;
}
}
if(n>_2d0){
this.checked=false;
alert(ltxt["maxCheckedPart1"]+" "+_2d0+" "+ltxt["maxCheckedPart2"]);
}
}
if(this.checked==true){
addClassName(this.parentNode.parentNode,"checked");
}else{
if(this.checked==false){
removeClassName(this.parentNode.parentNode,"checked");
}
}
});
});
reg.preSetup(function(){
var frw=gebi("findresellerwidget");
if(!frw){
return;
}
frw.onsubmit=function(e){
var k=this.keywords;
var l=this.location;
if(hasClassName(k,"autoclear")&&k.value==k.defaultValue){
k.value="";
}
if(hasClassName(l,"autoclear")&&l.value==l.defaultValue){
l.value="";
}
return true;
};
});
reg.click("a@class*=\"hijax-\",@class*=\"hijax-\" a,.fn1 .g8pages a",hijaxLink);
reg.click("div.g15v5 tr.main-row > th@scope=\"row\"",function(ev){
switchClassName(this.parentNode.parentNode,"collapsed","uncollapsed");
});
reg.hover("img.spriteswap",spriteOver,spriteOut,0);
reg.click(".modal-close",modalClose);
reg.click("a@class*=\"mswap\", area@class*=\"mswap\", span@class*=\"mswap\"",clickMultiswap);
reg.click("a.fieldsettoggle",function(ev){
switchClassName(this.parentNode.parentNode,"fieldset-collapsed","fieldset-uncollapsed");
return false;
});
reg.click("a#sr2Adv,a.sr2Adv",function(){
addClassName(document.getElementById("sr2"),"sr2showOptions");
document.getElementById("searchtermsAll").focus();
return false;
});
reg.click("a#sr2Simple,a.sr2Simple",function(){
removeClassName(document.getElementById("sr2"),"sr2showOptions");
document.getElementById("simpleSearch").focus();
return false;
});
reg.click("span.disabled a",function(){
return false;
});
function sniffG27(){
var h3=gebtn("h3",this);
if(!h3||h3.length<1){
return;
}
h3=h3[0];
var _2db=elemText(h3).strip();
var _2dc=elem("span.g27targ");
acn(h3,"g27head");
innerWrap(h3,_2dc);
if(!_2db){
var im=elem("img.g27targimg",{"src":imdir+"/a.gif","alt":""});
_2dc.appendChild(im);
}
var _2de=gebcn("g27block",this);
if(!_2de||_2de.length<1){
return;
}
_2de=_2de[0];
if(hcn(_2de,"hidethis")){
acn(this,"g27collapsed");
rcn(this,"g27expanded");
}else{
rcn(this,"g27collapsed");
acn(this,"g27expanded");
}
if(location.hash&&location.hash.length>1){
var lh=location.hash.substring(1);
var targ=gebi(lh);
if(!targ){
return;
}
var pG27=getParent(this,".g27");
if(pG27.contains(targ)||pG27.id==lh){
rcn(_2de,"hidethis");
rcn(this,"g27collapsed");
acn(this,"g27expanded");
}
}
}
function toggleG27(e){
var h3=this.parentNode;
var _2e4=h3.parentNode;
var _2e5=gebcn("g27block",_2e4);
if(!_2e5||_2e5.length<1){
return;
}
_2e5=_2e5[0];
if(hcn(_2e5,"hidethis")){
rcn(_2e5,"hidethis");
rcn(_2e4,"g27collapsed");
acn(_2e4,"g27expanded");
}else{
acn(_2e5,"hidethis");
acn(_2e4,"g27collapsed");
rcn(_2e4,"g27expanded");
}
}
(function(){
function expand(li){
if(gebtn("ul",li).length===0){
return;
}
rcn(li,"collapsed");
if(is.ie6&&li.isLast&&li.isBranch){
rcn(li,"ie-collapsed-last");
acn(li,"ie-expanded-last");
}
}
function collapse(li){
if(gebtn("ul",li).length===0){
return;
}
acn(li,"collapsed");
if(is.ie6&&li.isLast&&li.isBranch){
acn(li,"ie-collapsed-last");
rcn(li,"ie-expanded-last");
}
}
function expandCollapse(){
var _2e8=getParent(this,"li");
if(!hcn(_2e8,"collapsed")){
collapse(_2e8);
}else{
expand(_2e8);
}
}
function checkUncheck(){
var _2e9=getParent(this,"li");
var _2ea=gebtn("input",_2e9);
for(var c=0;c<_2ea.length;c++){
if(!_2ea[c].disabled){
_2ea[c].checked=this.checked;
}
}
var _2ec=gebtn("li",_2e9);
for(var c=0;c<_2ec.length;c++){
if(typeof _2ec[c].updateCount=="function"){
_2ec[c].updateCount();
}
}
var _2ed=getParent(_2e9,"li");
if(!this.checked){
_2e9=this;
while(_2e9.parentNode){
_2e9=_2e9.parentNode;
if(_2e9.checkBox){
_2e9.checkBox.checked=false;
}
}
}else{
if(_2ed&&_2ed.checkBox){
_2ea=gebtn("input",_2ed);
var _2ee=true;
for(var c=0;c<_2ea.length;c++){
if(_2ea[c].type!="checkbox"){
continue;
}
if(_2ea[c]!=_2e9.parentNode.parentNode.checkBox&&!_2ea[c].checked){
_2ee=false;
}
}
_2e9.parentNode.parentNode.checkBox.checked=_2ee;
}
}
_2e9=this;
while(_2e9.parentNode){
_2e9=_2e9.parentNode;
if(typeof _2e9.updateCount=="function"){
_2e9.updateCount();
}
}
_2e9=null;
}
reg.click("a.g23toggler",expandCollapse);
reg.click("div.g23 p.exp-coll a.expand-all",function(){
var _2ef=getParent(this,"div.g23");
var lis=gebs("ul.g23tree li",_2ef);
for(var i=0;i<lis.length;i++){
expand(lis[i]);
}
return false;
});
reg.click("div.g23 p.exp-coll a.collapse-all",function(){
var _2f2=getParent(this,"div.g23");
var lis=gebs("ul.g23tree li",_2f2);
for(var i=0;i<lis.length;i++){
collapse(lis[i]);
}
return false;
});
reg.click(".g23check-tree input@type='checkbox'",checkUncheck);
})();
function sniffG23(){
if(hcn(this,"multi")){
var p=elem("p",{"class":"multi exp-coll"});
var ex=ltxt.expandAll||"expand all";
var cl=ltxt.collapseAll||"collapse all";
p.innerHTML="<a class=\"expand-all\" href=\"#expand\">"+ex+"</a> <a class=\"collapse-all\" href=\"#collapse\">"+cl+"</a>";
var _2f8=gebcn("g23w4",this)[0];
_2f8.insertBefore(p,_2f8.firstChild);
}
var fobj=this;
if(hcn(this,"static")){
var uls=gebcn("g23tree",fobj,"ul");
for(var a=0;a<uls.length;a++){
var tree=uls[a];
var lis=gebtn("li",tree);
for(var b=0,li;li=lis[b++];){
var _2ff=!nextElem(li);
if(_2ff){
acn(li,"last");
}
if(is.ie6&&_2ff){
acn(li,"ie-"+(hcn(li,"collapsed")?"collapsed":"expanded")+"-last");
}
var _300=li.firstChild;
if(_300.nodeType!=1){
_300=nextElem(_300);
}
if(hcn(li,"branch")&&_300&&_300.href){
var link=elem("a.g23toggler",{"href":_300.href},elem("img",{"src":"/im/a.gif","height":"10","width":"20","alt":"expand / collapse "}));
li.insertBefore(link,li.firstChild);
}
}
}
return;
}
var uls=gebcn("g23tree",fobj,"ul");
for(var a=0;a<uls.length;a++){
var tree=uls[a];
var lis=gebtn("li",tree);
for(var b=0,li;li=lis[b++];){
var _302=hcn(li,"default-expanded");
var _303=false;
if(gebtn("ul",li).length>0){
if(_302){
acn(li,"branch");
}else{
acn(li,"collapsed branch");
}
_303=true;
var _304=gebtn("ul",li)[0];
_304.parentNode.removeChild(_304);
li.innerWrap=elem("div.g23x");
innerWrap(li,li.innerWrap);
li.appendChild(_304);
}
var _2ff=!nextElem(li);
if(_2ff){
acn(li,"last");
}
if(is.ie6){
li.isLast=_2ff;
li.isBranch=_303;
}
if(is.ie6&&li.isLast&&li.isBranch&&_302){
acn(li,"ie-expanded-last");
}else{
if(is.ie6&&li.isLast&&li.isBranch&&!_302){
acn(li,"ie-collapsed-last");
}
}
if(_303){
var link=elem("a.g23toggler",{},elem("img",{"src":"/im/a.gif","height":"10","width":"20","alt":"expand / collapse "}));
gebtn("div",li)[0].insertBefore(link,gebtn("div",li)[0].firstChild);
if(hcn(tree,"g23check-tree")){
var _305=document.createElement("span");
_305.className="g23checked-count";
for(var c=0;c<li.childNodes.length;c++){
if(li.childNodes[c].nodeName.toLowerCase()=="ul"){
li.sublist=li.childNodes[c];
}
if(hcn(li.childNodes[c],"g23item-extra-info")){
li.extraInfo=li.childNodes[c];
}
}
li.innerWrap.appendChild(_305);
li.countSpan=_305;
_305.appendChild(document.createTextNode(" "));
if(window.opera){
_305.innerHTML="&nbsp;";
}
li.updateCount=function(){
var _307=0;
var _308=gebs("input@type=\"checkbox\"",this.sublist);
for(var b=0;b<_308.length;b++){
if(_308[b].checked){
_307++;
}
}
_308=null;
if(this.countSpan){
if(_307<1){
this.countSpan.firstChild.data=" ";
if(window.opera){
this.countSpan.innerHTML="&nbsp;";
}
}
if(_307==1){
this.countSpan.firstChild.data="(1 checked item not shown)";
}
if(_307>1){
this.countSpan.firstChild.data="("+_307+" checked items not shown)";
}
}
};
}
}
li=null;
}
if(location.hash){
var _30a=gebi(location.hash.substring(1));
if(_30a&&matches(_30a,"ul.g23tree li")){
do{
rcn(_30a,"collapsed");
_30a=getParent(_30a,"ul.g23tree li");
}while(_30a);
}
}
if(hcn(tree,"g23check-tree")){
var _30b=gebs("input@type=\"checkbox\"",tree);
for(var b=0;b<_30b.length;b++){
var _30c=getParent(_30b[b],"li");
_30c.checkBox=_30b[b];
}
if(location.hash){
var _30a=location.hash.substring(1);
for(var b=0;b<lis.length;b++){
var li=lis[b];
if(li.id==_30a){
var _30b=gebtn("input",li);
for(var c=0;c<_30b.length;c++){
if(_30b[c].type!="checkbox"){
continue;
}
_30b[c].checked=true;
}
var el=li;
while(el.parentNode&&!hcn(el,"g23tree")){
if(el.nodeName.toLowerCase()=="li"&&hcn(el,"branch")){
rcn(el,"collapsed");
if(is.ie6&&el.isLast&&el.isBranch){
rcn(el,"ie-collapsed-last");
acn(el,"ie-expanded-last");
}
}
el=el.parentNode;
}
var _30f=gebtn("li",li);
for(var c=0,subitem;subitem=_30f[c++];){
if(hcn(subitem,"branch")){
rcn(subitem,"collapsed");
if(is.ie6&&subitem.isLast&&subitem.isBranch){
rcn(subitem,"ie-collapsed-last");
acn(subitem,"ie-expanded-last");
}
}
}
_30b=null;
el=null;
}
}
}
for(var b=0;b<lis.length;b++){
var li=lis[b];
if(typeof li.updateCount=="function"){
li.updateCount();
}
li=null;
}
}
tree=null;
}
}
var preloaderOn=[];
var preloaderOff=[];
var preloaderActive=[];
var activeImg=[];
function sniffRollover(){
var fobj=this;
fobj.rsrc=fobj.src;
preloaderOff[fobj.rsrc]=new Image();
preloaderOff[fobj.rsrc].src=fobj.rsrc;
if(hasClassName(fobj,"rollover")){
preloaderOn[fobj.rsrc]=new Image();
preloaderOn[fobj.rsrc].src=fobj.src.replace(/_off\./,"_on.");
fobj.onmouseout=function(){
if(activeImg[this.imgGroup]!=this){
this.src=preloaderOff[this.rsrc].src;
}
};
fobj.onmouseover=function(){
if(activeImg[this.imgGroup]!=this){
this.src=preloaderOn[this.rsrc].src;
}
};
}
if(fobj.className.indexOf("active-")>-1){
fobj.imgGroup=fobj.className;
fobj.imgGroup=fobj.imgGroup.replace(/.*active-(.*).*/,"$1");
preloaderActive[fobj.rsrc]=new Image();
preloaderActive[fobj.rsrc].src=fobj.src.replace(/_off\./,"_active.");
if(fobj.className.indexOf("setactive-")>-1){
activeImg[fobj.imgGroup]=fobj;
fobj.src=preloaderActive[fobj.rsrc].src;
}
fobj.onclick=function(){
if(this.src!=preloaderActive[this.rsrc].src){
this.src=preloaderActive[this.rsrc].src;
if(activeImg[this.imgGroup]){
activeImg[this.imgGroup].src=preloaderOff[activeImg[this.imgGroup].rsrc].src;
}
activeImg[this.imgGroup]=this;
}
};
}
}
function sniffGoto(){
var fobj=this;
if(hasClassName(fobj,"showDiv")){
addEvent(fobj,"change",function(){
var _312=this.options[this.selectedIndex].value.split("#")[1];
if(this.currentItem){
addClassName(this.currentItem,"hidethis");
}
if(gebi(_312)){
this.currentItem=gebi(_312);
removeClassName(this.currentItem,"hidethis");
}else{
this.currentItem=null;
}
});
}else{
if(this.className.indexOf("hijax-")>-1){
addEvent(fobj,"change",function(){
var link=this.options[this.selectedIndex];
try{
var id=matchClassName(this,/^hijax-(\S*)/)[1];
var _315=gebi(id);
var h=_315.offsetHeight;
_315.innerHTML="";
_315.style.height=h+"px";
addClassName(_315,"hijaxLoading");
}
catch(ex){
return;
}
if(_315.className.indexOf("hijaxTrue")>-1){
var _317=(link.value.indexOf("?")>-1)?"&":"?";
var _318=link.value+_317+"hijax=true";
}else{
var _318=link.value;
}
if(link.value!=""&&link.getAttribute("value")){
xhr(_318,function(_319,obj){
var el=getElementByIdFromString(_319,id);
if(!el){
window.location=link.href;
}
_319=el.innerHTML;
hijaxCache[_318+" "]=_319;
removeClassName(_315,"hijaxLoading");
_315.style.height="auto";
_315.innerHTML=_319;
reg.rerun(_315);
if(gebi("linkToPage")&&!hasClassName(_315,"noPermalink")){
gebi("linkToPage").href=link.value;
}
},function(){
window.location=link.value;
});
}
});
}else{
addEvent(fobj,"change",function(){
if(this.options[this.selectedIndex].value!=""&&this.options[this.selectedIndex].getAttribute("value")){
document.location=this.options[this.selectedIndex].value;
}
});
}
}
}
function sniffGotoUL(){
var fobj=this;
var li=getChildNodesByTagName(fobj,"li");
var _31e="";
var _31f=prevElem(fobj);
if(_31f&&hasClassName(_31f,"listTitle")&&gebtn("a",_31f)[0]){
_31e=_31e+"<option value=\""+gebtn("a",_31f)[0].href+"\" class=\"gotoHeading\">"+_31f.innerHTML+"</option>\n";
}else{
if(_31f&&hasClassName(_31f,"listTitle")){
_31e=_31e+"<option value=\"\" class=\"gotoHeading\">"+_31f.innerHTML+"</option>\n";
}
}
var _320="goto";
var hi=(this.className.indexOf("hijax-")>-1)?" "+matchClassName(this,/^(hijax-\S*)/)[1]:"";
var form=elem("form",{"action":""});
fobj.parentNode.insertBefore(form,fobj);
if(hasClassName(fobj,"showDiv")){
_320="showDiv";
var _323=document.createElement("div");
fobj.parentNode.insertBefore(_323,fobj);
}
for(var n=0;n<li.length;n++){
var sel=(hasClassName(li[n],"selected"))?" selected=\"selected\"":"";
if(gebtn("a",li[n])[0]){
_31e=_31e+"<option"+sel+" value=\""+gebtn("a",li[n])[0].href+"\">"+gebtn("a",li[n])[0].innerHTML+"</option>";
}else{
if(li[n].innerHTML){
_31e=_31e+"<option"+sel+" value=\"\">"+li[n].innerHTML+"</option>";
}
}
if(hasClassName(fobj,"showDiv")&&gebtn("div",li[n])[0]){
_323.appendChild(gebtn("div",li[n])[0]);
}
}
var _326=(this.id)?" id=\""+this.id+"\"":"";
form.innerHTML="<select class=\""+_320+hi+"\""+_326+">"+_31e+"</select>";
fobj.parentNode.removeChild(fobj);
reg.rerun(form);
}
var zimg=1;
function sniffImgbox(){
var _327=this;
var img=gebtn("img",_327)[0];
_327.style.background="url("+img.src+") no-repeat";
_327.style.width=img.width+"px";
_327.style.height=img.height+"px";
img.style.visibility="hidden";
if(is.ie56&&hasParent(_327,"div","g20w1")){
var _329=hasParent(_327,"div","g20w1");
_329.style.width=((img.width*1)+12)+"px";
addClassName(_329,"showcorners");
}
if(hasClassName(_327,"imgcorners")){
_327.innerHTML="<div class=\"imgw1\"><div class=\"imgw2\"><div class=\"imgw3\"><div class=\"imgw4\" style=\"width:"+img.width+"px;height:"+img.height+"px\">"+_327.innerHTML+"</div></div></div></div>";
}
if(hasClassName(_327,"imgzoom")){
var _32a=gebtn("a",_327)[0].href;
var _32b=document.createElement("div");
_32b.className="zoomimg k2";
_32b.id="zoomimg"+zimg;
var _32c=document.createElement("a");
_32c.style.backgroundImage="none";
_32c.onclick=function(){
return false;
};
var _32d=document.createElement("img");
_32d.src=_32a;
_32c.appendChild(_32d);
_32b.appendChild(_32c);
_327.appendChild(_32b);
if(hasClassName(_327,"imgright")){
_327.className=_327.className+" hAlignRight x10";
}else{
_327.className=_327.className+" x-10";
}
_327.className=_327.className+" vAlignTopBottom y-10 k2over-zoomimg"+zimg;
sniffK2.call(_327);
var _32e=gebtn("a",_327)[0];
_32e.onclick=function(){
return false;
};
_32e.style.width=img.width+"px";
_32e.style.height=img.height+"px";
zimg++;
}
}
function sniffSharePage(){
var _32f=this;
if(typeof sharetxt!="undefined"){
var _330=getSafelyEncodedString(location.href);
var _331=getSafelyEncodedString(document.title);
var _332="\t\t<div class=\"sharepagew1 share-mailto\">\t\t<table summary=\"layout\" cellpadding=\"0\" cellspacing=\"0\"><tr>\t\t<td id=\"share-mailto\"><a href=\"mailto:?subject="+sharetxt[0]+"{pagetitle}&body="+sharetxt[1]+"%0A%0A"+_330+"\" class=\"sharelink mailto\" title=\""+sharetxt[2]+"\"></a></td>\t\t<td id=\"share-technorati\"><a href=\"http://technorati.com/search/"+_330+"\" class=\"sharelink technorati\" title=\""+sharetxt[3]+"\"></a></td>\t\t<td id=\"share-delicious\"><a href=\"http://del.icio.us/post?v=4;url="+_330+";title="+_331+"\" class=\"sharelink delicious\" title=\""+sharetxt[4]+"\"></a></td>\t\t<td id=\"share-digg\"><a href=\"http://digg.com/submit?phase=2&amp;url="+_330+"&amp;title="+_331+"\" class=\"sharelink digg\" title=\""+sharetxt[5]+"\"></a></td>\t\t<td id=\"share-slashdot\"><a href=\"http://slashdot.org/bookmark.pl?title="+_331+"&amp;url="+_330+"\" class=\"sharelink slashdot\" title=\""+sharetxt[6]+"\"></a></td>\t\t";
var _333=gebtn("link");
var _334=null;
var _335=null;
var _336=0;
for(var a=0;a<_333.length;a++){
if(""+_333[a].rel.toLowerCase()=="alternate"){
_336++;
if(!_334){
_334=_333[a].href;
_335=_333[a].title;
}
}
}
if(_336>1){
_332+="<td id=\"share-multiple-feeds\"><a href=\"#\" title=\""+sharetxt[7]+"\"></a></td>";
}else{
if(_336==1){
_332+="<td id=\"share-feed\"><a href=\""+_334+"\" class=\"sharelink feed\" title=\""+_335+"\"></a></td>";
}else{
_332+="<td id=\"share-blank\"> </td>";
}
}
_332+="</tr></table></div>";
if(hasClassName(document.body,"a0v3")){
return;
}
_32f.id="sharepage";
if(is.ie5){
return;
}
if(typeof _332=="undefined"){
return;
}
_331=(gebtn("h1",_32f)[0])?elemText(gebtn("h1",_32f)[0]):_331;
_331=_331.normalize();
_332=_332.replace(/{pagetitle}/,_331);
var _338=gebtn("meta");
for(var a=0;a<_338.length;a++){
if(""+_338[a].name.toLowerCase()=="share-this-page"&&""+_338[a].content.toLowerCase()=="no"){
return;
}
}
var _339=document.createElement("div");
_339.className="sharepage";
_32f.appendChild(_339);
_339.innerHTML=_332;
var mult=gebi("share-multiple-feeds");
if(mult){
var lnk=gebtn("a",mult)[0];
lnk.titleDiv=_32f;
lnk.mult=mult;
addEvent(lnk,"click",function(e){
if(!this.feedListDiv){
var _33d=gebtn("link");
var _33e=[];
var _33f="<ul>";
for(var a=0;a<_33d.length;a++){
if(""+_33d[a].rel.toLowerCase()=="alternate"){
_33e[_33e.length]=_33d[a];
}
}
for(var a=0;a<_33e.length;a++){
_33f+="<li";
if(a==0){
_33f+=" class=\"first-child\"";
}else{
if(a==_33e.length-1){
_33f+=" class=\"last-child\"";
}
}
_33f+="><div><a class=\"sharelink feed\" href=\""+_33e[a].href+"\">"+_33e[a].title+"</a></div></li>";
}
_33f+="</ul><span class=\"x1\"></span><span class=\"x2\"></span>";
var _341=elem("div",{"id":"share-feed-list"});
_341.innerHTML=_33f;
this.titleDiv.appendChild(_341);
this.feedListDiv=_341;
addClassName(this.mult,"showing");
tagOmnitureCustomLinksForSharePage(this.feedListDiv);
}else{
if(hasClassName(this.feedListDiv,"hidethis")){
removeClassName(this.feedListDiv,"hidethis");
addClassName(this.mult,"showing");
}else{
addClassName(this.feedListDiv,"hidethis");
removeClassName(this.mult,"showing");
}
}
cancelDefault(e);
});
}
tagOmnitureCustomLinksForSharePage(_339);
}
}
function tagOmnitureCustomLinksForSharePage(el){
if(typeof window.s_co!="undefined"){
var _343=function(e){
var _345=this.className.replace(/sharelink /,"")+": ";
s_linkType="o";
s_linkName=_345+this.href;
s_lnk=s_co(this);
s_gs(s_account);
};
var _346=gebtn("a",el);
for(var a=0;a<_346.length;a++){
if(!hasClassName(_346[a],"sharelink")){
continue;
}
addEvent(_346[a],"click",_343);
}
}
}
var imgpreload=[];
function sniffImgswap(){
var link=this;
if(link.src){
imgpreload[link.id]=new Image();
imgpreload[link.id].src=link.src;
}else{
link.imgref=link.className.replace(/[^ ]* ?([^ ]+_\d).*/,"$1").split("_");
link.src=gebi(link.imgref[0]).src.replace(/_\d+\./,"_"+link.imgref[1]+".");
imgpreload[link.src]=new Image();
imgpreload[link.src].src=link.src;
if(!hasClassName(link,"swapOnclick")){
link.onmouseover=function(){
gebi(this.imgref[0]).src=imgpreload[this.src].src;
};
link.onmouseout=function(){
gebi(this.imgref[0]).src=imgpreload[this.imgref[0]].src;
};
if(!hasClassName(link,"followLink")){
link.onclick=function(){
return false;
};
}
}else{
link.onclick=function(){
imgpreload[this.imgref[0]].src=gebi(this.imgref[0]).src=imgpreload[this.src].src;
return false;
};
}
}
}
function sniffMultiswap(){
var fobj=this;
if(fobj.src){
imgpreload[fobj.id]=new Image();
imgpreload[fobj.id].src=fobj.src;
if(fobj.className.indexOf("mswap-")>-1){
var aimg=fobj.className.split("mswap-")[1].split("-")[0].split(" ")[0];
fobj.src=fobj.src.replace(/[^\/]+(\.....?)$/,aimg+"$1");
}
}
}
function clickMultiswap(){
this.targetid=this.className.split("mswap-")[1].split("-")[0].split(" ")[0];
var _34b=this.targetid.replace(/(.*)\d+?/,"$1");
this.pre=_34b;
if(this.className.indexOf("mswap-"+this.targetid+"-")>-1){
var _34c=this.className.split("mswap-"+this.targetid+"-")[1].split(" ")[0];
}else{
var _34c=this.href.replace(/.*\/([^\/]+)?/,"$1").split(".")[0];
}
this.src=gebi(this.targetid).src.replace(/[^\/]+(\.....?)$/,_34c+"$1");
imgpreload[this]=new Image();
imgpreload[this].src=this.src;
var n=1;
while(gebi(this.pre+n)){
gebi(this.pre+n).src=imgpreload[this.pre+n].src;
n++;
}
gebi(this.targetid).src=this.src;
if(hasClassName(this,"followLink")||this.target!=""){
}else{
cancelDefault(e);
}
}
function sniffToggleAllCheckboxesInTable(){
var lnk=this;
var pTab=lnk.parentNode;
while(pTab.nodeName.toLowerCase()!="table"){
pTab=pTab.parentNode;
}
lnk.checkStatus=true;
lnk.titleSelect="Select All";
lnk.titleUnselect="Unselect All";
lnk.title=lnk.titleSelect;
lnk.img=gebtn("img",lnk)[0];
lnk.img.alt=lnk.titleSelect;
var _350=gebtn("input",pTab);
lnk.checkboxes=[];
for(var b=0;b<_350.length;b++){
if("checkbox"==_350[b].type){
lnk.checkboxes.push(_350[b]);
}
}
lnk.onclick=function(){
for(var c=0;c<this.checkboxes.length;c++){
this.checkboxes[c].checked=this.checkStatus;
}
this.title=(this.checkStatus)?this.titleUnselect:this.titleSelect;
this.img.alt=(this.checkStatus)?this.titleUnselect:this.titleSelect;
this.checkStatus=!this.checkStatus;
return false;
};
}
function sniffExpandCollapsePc1(){
var div=this;
addClassName(div,"pc1collapsed");
removeClassName(div,"pc1collapsible");
var h=gebtn("h2",div)[0];
var lnk=elem("a",{"href":"#"}," "+elemText(h));
var im=elem("img",{"src":"/im/pc1-expand.gif","alt":"","class":"pc1expand-collapse-icon","border":"0"});
im.srcCollapse="/im/pc1-collapse.gif";
im.srcExpand=im.src;
lnk.titleCollapse="Collapse this section";
lnk.titleExpand="Expand this section";
lnk.title=lnk.titleExpand;
lnk.insertBefore(im,lnk.firstChild);
lnk.im=im;
lnk.div=div;
h.innerHTML="";
h.appendChild(lnk);
lnk.onclick=function(){
if(hasClassName(this.div,"pc1expanded")){
addClassName(this.div,"pc1collapsed");
removeClassName(this.div,"pc1expanded");
this.title=this.titleExpand;
this.im.src=this.im.srcExpand;
}else{
addClassName(this.div,"pc1expanded");
removeClassName(this.div,"pc1collapsed");
this.title=this.titleCollapse;
this.im.src=this.im.srcCollapse;
}
return false;
};
var _357=gebcn("cornerBR",div)[0];
var p=elem("p",{"class":"pc1expand-note"}," Click the plus icon to expand this section.");
_357.appendChild(p);
}
function sniffClassTool(){
var fobj=this;
var cls=fobj.className.split(" ");
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf("cTool-")==0){
var objs=cls[v].split("cTool-")[1].split("-");
if(objs[objs.length-1].indexOf("RMV")>-1||objs[objs.length-1].indexOf("TGL")>-1||objs[objs.length-1].indexOf("ADD")>-1){
var _35d="click";
}else{
var _35d=objs[objs.length-1];
objs.pop();
}
fobj.objs=objs;
fobj.tid=objs.shift();
var _35e=fobj.tid;
if(fobj.tid=="this"){
fobj.tid=fobj;
}
if(_35d=="hover"&&!is.ie56&&_35e=="this"){
}else{
if(_35d=="hover"){
addEvent(fobj,"mouseout",function(e){
classomatic(this.tid,this.objs);
});
var _35d="mouseover";
addEvent(fobj,_35d,function(e){
classomatic(this.tid,this.objs);
if(_35d=="click"){
cancelDefault(e);
}
});
}else{
addEvent(fobj,_35d,function(e){
classomatic(this.tid,this.objs);
if(_35d=="click"){
cancelDefault(e);
}
});
}
}
}
}
}
function classomatic(id,todo){
if(!gebi(id)){
var tobj=id;
}else{
var tobj=gebi(id);
}
for(var v=0;v<todo.length;v++){
if(todo[v].indexOf("RMV")==0){
removeClassName(tobj,todo[v].substring(3,todo[v].length));
}else{
if(todo[v].indexOf("ADD")==0){
addClassName(tobj,todo[v].substring(3,todo[v].length));
}else{
if(todo[v].indexOf("TGL")==0){
if(hasClassName(tobj,todo[v].substring(3,todo[v].length))){
removeClassName(tobj,todo[v].substring(3,todo[v].length));
}else{
if(!hasClassName(tobj,todo[v].substring(3,todo[v].length))){
addClassName(tobj,todo[v].substring(3,todo[v].length));
}
}
}
}
}
}
}
function sniffToggler(){
var fobj=this;
if(fobj.toggler){
return;
}
if(hasClassName(fobj,"showThis")){
fobj.toggler=fobj.href.split("#")[1];
addEvent(fobj,"click",function(e){
var _368=this.toggler.replace(/\d+?/,"");
var n=1;
while(gebi(_368+n)){
if(this.toggler==_368+n){
removeClassName(gebi(this.toggler),"hidethis");
}else{
addClassName(gebi(_368+n),"hidethis");
}
n++;
}
cancelDefault(e);
});
}else{
var cls=fobj.className.split(" ");
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf("objects-")==0){
fobj.toggler=cls[v].replace(/objects-/,"");
}
}
addEvent(fobj,"click",function(e){
var tid=this.toggler.split("-");
for(var i=0;i<tid.length;i++){
if(tid[i].indexOf("ALL")>-1){
var tAll=[];
var x=1;
while(gebi(tid[i].split("ALL")[0]+x)){
tAll.push(tid[i].split("ALL")[0]+x);
x++;
}
for(var j=0;j<tAll.length;j++){
toggler(this,tAll[j]);
}
}else{
toggler(this,tid[i]);
}
}
cancelDefault(e);
});
}
}
function toggler(fobj,id){
if(hasClassName(gebi(id),"hidethis")&&!hasClassName(fobj,"hideall")||hasClassName(fobj,"showall")){
removeClassName(gebi(id),"hidethis");
}else{
if(!hasClassName(gebi(id),"hidethis")||hasClassName(fobj,"hideall")){
addClassName(gebi(id),"hidethis");
}
}
}
var ulid=0;
function sniffListfade(){
var fobj=this;
ulid++;
var li=gebtn("li",fobj);
var x=0;
while(li[x]){
li[x].id="ulfade"+ulid+(x+1);
if(x==0){
addClassName(li[x],"xfadefirst");
var p="pause5";
if(fobj.className.indexOf("pause")>-1){
p=getClassContains(fobj,"pause");
}
addClassName(li[x],p);
}else{
addClassName(li[x],"xfade");
}
x++;
}
sniffXfade.call(li[0]);
}
function sniffLoadUrl(){
var fobj=this;
if(fobj.href.indexOf("#")>-1){
var _379=fobj.href.split("#")[0];
var id=fobj.href.split("#")[1];
getfile(_379,function(_37b,objs){
if(objs[0]){
_37b=getRequestObject(objs[0],_37b);
var _37d=_37b.className;
_37b=_37b.innerHTML;
}
if(objs[1].parentNode.className.indexOf("g32auto")>-1&&objs[0]){
objs[1].parentNode.className=_37d;
objs[1].parentNode.innerHTML=_37b;
}else{
var _37e=elem("div");
objs[1].parentNode.insertBefore(_37e,objs[1]);
_37e.innerHTML=_37b;
reg.rerun(_37e);
objs[1].parentNode.removeChild(objs[1]);
}
},[id,fobj]);
}
}
function sniffFormHijax(){
var fobj=this;
addEvent(fobj,"submit",function(e){
var _381=getClassContains(this,"wgform-").split("wgform-")[1];
if(hasParent(this,_381)){
var _382=gebtn("input",this);
var _383=[];
for(i=0;i<_382.length;i++){
if(_382[i].type=="submit"){
_383.push(_382[i]);
}
}
for(i=0;i<_383.length;i++){
addClassName(_383[i],"disabled");
}
}
getfile(this.action+"?"+getFormData(this),function(_384,fvar){
if(_384.indexOf(_381)>-1){
_384=getRequestObject(_381,_384).innerHTML;
}
gebi(_381).innerHTML=_384;
reg.rerun(gebi(_381));
});
cancelDefault(e);
});
}
var xfade=[];
var xfadeObj=[];
var xfadeLoop=[];
var xfadeStop=[];
function sniffXfade(){
var fobj=this;
if((fobj.id.substring((fobj.id.length-1),fobj.id.length)*1)==1){
var _387=false;
var _388;
var _389=10000;
var id=fobj.id.substring(0,(fobj.id.length-1));
var cls=fobj.className.split(" ");
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf("pause")==0){
_389=cls[v].replace(/pause(.*)$/,"$1");
_389=_389*1000;
}else{
if(cls[v].indexOf("transparent")==0){
_387=true;
}else{
if(cls[v].indexOf(".jpg")==0||cls[v].indexOf(".gif")==0){
_388=cls[v];
}
}
}
}
var xf=1;
while(gebi(id+xf)){
xfadeObj[id+xf]=[gebi(id+xf),0];
xfadeObj[id+xf][0].onmouseover=function(){
if(xfadeStop[id][0]!=-1){
xfadeStop[id][0]=0;
}
};
xfadeObj[id+xf][0].onmouseout=function(){
if(xfadeStop[id][0]!=-1){
xfadeStop[id][0]=1;
}
};
if(_387){
if(is.oldmoz){
setopacity(xfadeObj[id+xf][0],1);
xfadeObj[id+xf][0].style.visibility="hidden";
}
if(_388&&is.iewin){
xfadeObj[id+xf][0].style.backgroundImage="url("+_388+")";
}
if(is.oldmoz&&xf==1){
xfadeObj[id+xf][0].style.visibility="visible";
}
}
xf++;
}
xf--;
xfade[id]=[xf,1,_389];
if(gebi(id+"Total")){
gebi(id+"Total").innerHTML=xf;
}
if(gebi(id+"Back")){
gebi(id+"Back").onclick=function(){
xfadeStop[id]=[-1,-1];
clearTimeout(xfadeLoop[id]);
xfader(id);
return false;
};
}
if(gebi(id+"Next")){
gebi(id+"Next").onclick=function(){
xfadeStop[id]=[-1,1];
clearTimeout(xfadeLoop[id]);
xfader(id);
return false;
};
}
xfadeStop[id]=[1,1];
xfadeLoop[id]=setTimeout("xfader('"+id+"')",_389);
}
}
function xfader(id){
var nx=xfade[id][1]+xfadeStop[id][1];
if(nx>xfade[id][0]){
nx=1;
}
if(nx<1){
nx=xfade[id][0];
}
var _390=false;
if(xfadeStop[id][0]==0&&xfadeObj[id+nx][1]!=0){
var _390=true;
}
var ox=xfade[id][1];
if(xfadeObj[id+ox][1]==0){
xfadeObj[id+ox][1]=1;
}
if(xfadeStop[id][0]!=0||_390){
if(xfadeObj[id+nx][1]==0){
if(!is.oldmoz){
setopacity(xfadeObj[id+nx][0],0.1);
}
xfadeObj[id+nx][0].style.visibility="visible";
xfadeObj[id+ox][0].style.zIndex=2;
xfadeObj[id+nx][0].style.zIndex=10;
}
if(xfadeStop[id][0]==-1){
xfadeObj[id+nx][1]=1;
}else{
if(is.safari||is.oldmoz||is.ns6||is.iemac){
xfadeObj[id+nx][1]=1;
}else{
xfadeObj[id+nx][1]=xfadeObj[id+nx][1]+0.2;
}
}
if(is.anymoz&&xfadeObj[id+nx][1]==1){
if(!is.oldmoz){
setopacity(xfadeObj[id+nx][0],0.99);
}
}else{
setopacity(xfadeObj[id+nx][0],xfadeObj[id+nx][1]);
}
if(xfadeObj[id+nx][1]<1){
setTimeout("xfader('"+id+"')",120);
}else{
xfade[id][1]=nx;
xfadeObj[id+ox][0].style.visibility="hidden";
xfadeObj[id+ox][1]=0;
if(gebi(id+"This")){
gebi(id+"This").innerHTML=nx;
}
if(xfadeStop[id][0]!=0){
xfadeStop[id]=[1,1];
xfadeLoop[id]=setTimeout("xfader('"+id+"')",xfade[id][2]);
}
}
}
if(xfadeStop[id][0]==0){
clearTimeout(xfadeLoop[id]);
xfadeLoop[id]=setTimeout("xfader('"+id+"')",200);
}
}
var hijaxCache={};
function hijaxLink(ev){
var link=this;
if(hasClassName(link,"noHijax")){
return true;
}
if(this.target){
return true;
}
try{
if(link.className.indexOf("hijax-")>-1){
var _394=this;
}else{
var _394=getParent(link,"@class*='hijax-'");
}
var id=matchClassName(_394,/^hijax-(\S*)/)[1];
var _396=gebi(id);
if(_396.className.indexOf("hijaxTrue")>-1){
var _397=(link.href.indexOf("?")>-1)?"&":"?";
var _398=link.href+_397+"hijax=true";
}else{
var _398=link.href;
}
var h=_396.offsetHeight;
_396.innerHTML="";
_396.style.height=h+"px";
addClassName(_396,"hijaxLoading");
}
catch(ex){
return true;
}
var _39a=_398+" ";
if(!hijaxCache[_39a]){
xhr(_398,function(_39b,obj){
var el=getElementByIdFromString(_39b,id);
if(!el){
window.location=link.href;
}
_39b=el.innerHTML;
hijaxCache[_39a]=_39b;
removeClassName(_396,"hijaxLoading");
_396.style.height="auto";
_396.innerHTML=_39b;
reg.rerun(_396);
if(gebi("linkToPage")&&!hasClassName(_396,"noPermalink")){
gebi("linkToPage").href=link.href;
}
},function(){
window.location=link.href;
});
return false;
}else{
_396.innerHTML=hijaxCache[_39a];
removeClassName(_396,"hijaxLoading");
reg.rerun(_396);
if(gebi("linkToPage")&&!hasClassName(_396,"noPermalink")){
gebi("linkToPage").href=link.href;
}
return false;
}
}
function spriteOver(){
this.style.left=(this.width)/2*-1+"px";
}
function spriteOut(){
this.style.left=0+"px";
}
(function(){
var _39e=[];
function launchCal(e){
var id=this.id;
if(!id){
throw "date field missing id attribute";
}
if(_39e[id]&&_39e[id].parentNode){
return;
}
for(var oid in _39e){
if(id==oid){
continue;
}
if(_39e[oid]&&_39e[oid].parentNode){
_39e[oid].parentNode.removeChild(_39e[oid]);
_39e[oid]=null;
}
}
var _3a2=getParent(this,"div.labeled-input");
if(_3a2){
addClassName(_3a2,"has-jscal");
}
if(this.value){
var time=Date.parse(this.value);
var _3a4=(!isNaN(time))?new Date(time):new Date();
}else{
var _3a4=new Date();
}
var _3a5=matchClassName(this,/^range-(.+)/);
if(_3a5){
var _3a6=gebi(_3a5[1]);
if(!_3a6){
throw "no element found with id=\""+_3a5[1]+"\"";
}
var _3a7,endDate;
var _3a8=gebcn("jscal-start",_3a6);
var _3a9=gebcn("jscal-end",_3a6);
if(_3a8.length){
var time=Date.parse(elemText(_3a8[0]));
if(isNaN(time)){
throw "Date.parse(\""+elemText(_3a8[0])+"\") returns NaN";
}
_3a7=new Date(time);
}
if(_3a9.length){
var time=Date.parse(elemText(_3a9[0]));
if(isNaN(time)){
throw "Date.parse(\""+elemText(_3a9[0])+"\") returns NaN";
}
endDate=new Date(time);
}
if(_3a7&&_3a7.getTime()>_3a4.getTime()){
_3a4=_3a7.diffDay(0);
}
if(endDate&&endDate.getTime()<_3a4.getTime()){
_3a4=endDate.diffDay(0);
}
if(_3a7&&endDate&&_3a7.getTime()>endDate.getTime()){
throw "whoops! start date is less than end date";
}
}
var _3aa=defaultDateFormat;
var _3ab=matchClassName(this,/^format-(.+)/);
if(_3ab){
var _3ac=gebi(_3ab[1]);
if(!_3ac){
throw "no element found with id=\""+_3ab[1]+"\"";
}
_3aa=elemText(_3ac);
}
_39e[id]=(new Calendar(_3a4,_3a7,endDate)).getCalendarTable();
_39e[id].inp=this;
this.parentNode.appendChild(_39e[id]);
addEvent(_39e[id],"click",function(e){
var targ=getTarget(e);
if(targ.date&&getParent(targ,".jscal-inrange")){
this.inp.value=targ.date.format(_3aa);
_39e[id].parentNode.removeChild(_39e[id]);
}
});
}
function closeCal(e){
var targ=getTarget(e);
var _3b1=getParent(targ,"div.jscal-x1");
if(_3b1||matches(targ,"input.jscal@type=\"text\", table.jscal, div.jscal-x1")){
return;
}
for(var id in _39e){
if(_39e[id]&&_39e[id].parentNode){
_39e[id].parentNode.removeChild(_39e[id]);
_39e[id]=null;
}
}
}
reg.focus("input.jscal@type=\"text\"",launchCal);
reg.focus("body",closeCal);
reg.click("body",closeCal);
})();
(function(){
function animate(_3b3,_3b4){
removeClassName(_3b3,"g39exp");
removeClassName(_3b4,"g39coll");
addClassName(_3b3,"g39t1");
addClassName(_3b4,"g39t6");
var inc=20;
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t1/,"g39t2");
_3b4.className=_3b4.className.replace(/g39t6/,"g39t5");
},inc*1);
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t2/,"g39t3");
_3b4.className=_3b4.className.replace(/g39t5/,"g39t4");
},inc*2);
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t3/,"g39t4");
_3b4.className=_3b4.className.replace(/g39t4/,"g39t3");
},inc*3);
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t4/,"g39t5");
_3b4.className=_3b4.className.replace(/g39t3/,"g39t2");
},inc*4);
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t5/,"g39t6");
_3b4.className=_3b4.className.replace(/g39t2/,"g39t1");
},inc*5);
window.setTimeout(function(){
_3b3.className=_3b3.className.replace(/g39t6/,"g39coll");
_3b4.className=_3b4.className.replace(/g39t1/,"g39exp");
},inc*6);
}
reg.click("div.g39sect",function(e){
var _3b7=gebs("div.g39sect",this.parentNode);
for(var i=0;i<_3b7.length;i++){
var _3b9=_3b7[i];
if(hasClassName(_3b9,"g39exp")&&_3b9!=this){
animate(_3b9,this);
break;
}
}
});
})();
function platformDetect(){
var _3ba="";
var _3bb="";
var _3bc=navigator.userAgent.toUpperCase();
if(_3bc.indexOf("SUNOS")>-1){
_3ba="Solaris";
}else{
if(_3bc.indexOf("MAC OS")>-1){
_3ba="Mac OS X";
}else{
if(_3bc.indexOf("LINUX")>-1){
_3ba="Linux";
}else{
if(_3bc.indexOf("WINDOWS")>-1){
_3ba="Windows";
}
}
}
}
if(_3bc.indexOf("SUNOS SUN4")>-1){
_3bb="Solaris SPARC";
}
if(_3bc.indexOf("SUNOS I86PC")>-1){
_3bb="Solaris x86";
}
if(_3bc.indexOf("LINUX")>-1&&_3bc.indexOf("86;")>-1){
_3bb="Linux x86";
}
if(_3bc.indexOf("LINUX")>-1&&_3bc.indexOf("X86_64")>-1){
_3bb="Linux x64";
}
if(_3bc.indexOf("WINDOWS NT 5.0")>-1){
_3bb="Windows 2000";
}
if(_3bc.indexOf("WINDOWS NT 5.1")>-1){
_3bb="Windows XP";
}
if(_3bc.indexOf("WINDOWS NT 6.0")>-1){
_3bb="Windows Vista";
}
if(_3bc.indexOf("INTEL MAC OS")>-1){
_3bb="Mac OS X (Intel)";
}
if(_3bc.indexOf("PPC MAC OS")>-1){
_3bb="Mac OS X (PowerPC)";
}
var _3bd=false;
var _3be=gebtn("option",this);
for(var n=0;n<_3be.length;n++){
if(_3be[n].innerHTML.toUpperCase()==_3bb.toUpperCase()){
_3be[n].selected=true;
_3bd=true;
break;
}
}
if(!_3bd){
for(var n=0;n<_3be.length;n++){
if(_3be[n].innerHTML.toUpperCase()==_3ba.toUpperCase()){
_3be[n].selected=true;
break;
}
}
}
}
function langDetect(){
var lang=null;
if(navigator.language){
lang=navigator.language.toUpperCase();
}else{
if(navigator.browserLanguage){
lang=navigator.browserLanguage.toUpperCase();
}else{
if(document.documentElement.lang){
lang=document.documentElement.lang.toUpperCase();
}
}
}
if(lang.indexOf("DA")>-1){
lang="da_Danish";
}else{
if(lang.indexOf("NL")>-1){
lang="nl_Dutch";
}else{
if(lang.indexOf("FR")>-1){
lang="fr_French";
}else{
if(lang.indexOf("DE")>-1){
lang="de_German";
}else{
if(lang.indexOf("HI")>-1){
lang="hi_Hindi";
}else{
if(lang.indexOf("IT")>-1){
lang="it_Italian";
}else{
if(lang.indexOf("JA")>-1){
lang="ja_Japanese";
}else{
if(lang.indexOf("KO")>-1){
lang="ko_Korean";
}else{
if(lang.indexOf("PL")>-1){
lang="pl_Polish";
}else{
if(lang.indexOf("PT")>-1){
lang="pt_Portuguese";
}else{
if(lang.indexOf("RU")>-1){
lang="ru_Russian";
}else{
if(lang.indexOf("ZH-CN")>-1||lang.indexOf("ZH-HANS")>-1){
lang="zh-cn_Simplified Chinese";
}else{
if(lang.indexOf("ZH-TW")>-1||lang.indexOf("ZH-HANT")>-1){
lang="zh-tw_Traditional Chinese";
}else{
if(lang.indexOf("ES")>-1){
lang="es_Spanish";
}else{
if(lang.indexOf("SV")>-1){
lang="sv_Swedish";
}else{
if(lang.indexOf("TR")>-1){
lang="tr_Turkish";
}else{
lang="en_English";
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
var _3c1=gebtn("option",this);
for(var n=0;n<_3c1.length;n++){
if(_3c1[n].innerHTML.toUpperCase()==lang.split("_")[1].toUpperCase()||_3c1[n].className.indexOf("lang_"+lang.split("_")[0])>-1){
_3c1[n].selected=true;
break;
}
}
}
var l6=(function(s){
function openBox(e){
reg.addClassName(reg.getParent(this,s.box),s.classOpen);
reg.cancelDefault(e);
}
function closeBox(e){
reg.removeClassName(reg.getParent(this,s.box),s.classOpen);
reg.cancelDefault(e);
}
function l6(){
reg.click(s.open,openBox);
reg.click(s.close,closeBox);
return l6;
}
return l6();
})({bg:"div.l6bg",box:"div.l6box",classOpen:"l6box-open",open:"div.l6box a.l6box-open",close:"div.l6 a.l6box-close"});
reg.click("@class*='pc11' img",function(){
if(this.parentNode.nodeName.toLowerCase()!="a"&&!hasClassName(this,"fullsized")&&!is.ie56){
var pdiv=getParent(this,".pc11");
this.style.border="0px";
var x=0;
while(getElementById("imgMax"+x)){
x++;
}
pdiv.appendChild(elem("div",{"id":"imgMax"+x,"class":"maximagek5"},[elem("div",{"style":"text-align:center"},[elem("img",{"src":this.src})])]));
var a=elem("a.k5 "+((getElementById("imgMax"+x).getElementsByTagName("img")[0].offsetWidth)),{"href":"#imgMax"+x});
outerWrap(this,a);
k5Click.call(this.parentNode);
}
});
reg.hover("@class*='imgMax-' img",function(){
var imgw=this.offsetWidth;
var maxw=getParent(this,".pc11");
maxw=maxw.className.split("imgMax-")[1].split(" ")[0];
if(imgw<maxw){
addClassName(this,"fullsized");
}else{
removeClassName(this,"fullsized");
}
});
reg.click("div#breadcrumb a",function(){
oTrack(this,"A4");
});
reg.click("div.gwpadding1 a,td.sectiontitle2 a",function(){
oTrack(this,"D1/2");
});
reg.click("td.suntab a",function(){
oTrack(this,"D7-Tab");
});
reg.click("div.suntabsubrow a",function(){
oTrack(this,"D7-SubTab");
});
reg.click("div.d7v10 a",function(){
oTrack(this,"D7-TertiaryTab");
});
reg.click("div.d8 a",function(){
oTrack(this,"D8");
});
reg.click("div.e14 a",function(){
oTrack(this,"E14");
});
reg.click("div.e15 a",function(){
oTrack(this,"E15");
});
reg.click("div.e19 a",function(){
oTrack(this,"E19");
});
reg.click("div.g23x a",function(){
if(!hasClassName(this,"g23toggler")){
oTrack(this,"G23");
}
});
reg.click("div.g28 a",function(){
oTrack(this,"G28");
});
reg.click("div.vidtext a,div.vidbox a",function(){
oTrack(this,"G37");
});
reg.click("div.hb1w1 a,div.hb1v1 a,div.hb1v2 a",function(){
oTrack(this,"HB1");
});
reg.click("div.i03 a",function(){
oTrack(this,"I3");
});
reg.click("div.l0v0 a,div.l0v1 area,div.l0v2 area,div.l0v3 a",function(){
oTrack(this,"L0");
});
reg.click("div.l1 a",function(){
oTrack(this,"L1");
});
reg.click("div.l2 a",function(){
oTrack(this,"L2");
});
reg.click("div.l3 a",function(){
oTrack(this,"L3");
});
reg.click("div.l5 a",function(){
oTrack(this,"L5");
});
reg.click("div.l6v1 a",function(){
oTrack(this,"L6");
});
reg.click("div.pm1 a",function(){
oTrack(this,"PM1");
});
reg.click("div.pc0 a",function(){
oTrack(this,"PC0");
});
reg.click("div.pc3 a",function(){
oTrack(this,"PC3");
});
reg.click("div.pc4 a",function(){
oTrack(this,"PC4");
});
reg.click("div.pc9 a",function(){
oTrack(this,"PC9");
});
reg.click("div.pn0 a",function(){
oTrack(this,"PN0");
});
reg.click("div.pn4 a",function(){
oTrack(this,"PN4");
});
reg.click("div.pn5 a",function(){
oTrack(this,"PN5");
});
reg.click("div.e4v0 a",function(){
oTrack(this,"E4v0");
});
reg.click("div.e4v2 a",function(){
oTrack(this,"E4v2");
});
reg.click("div.e4v3 a",function(){
oTrack(this,"E4v3");
});
reg.click("div.pn6xnav a,div.pn6 a",function(){
oTrack(this,"PN6");
});
(function(){
var loco=document.location+"";
if(loco.indexOf("#")>1){
reg.setup("div.hb1w1 a",function(){
if(loco.split("#")[1]==this.href.split("#")[1]){
hb1select(this);
}
});
}
})();
reg.click("div.hb1w1 a,a.hb1trigger",function(){
hb1select(this);
return false;
});
function hb1select(a,st){
if(a.href.split("#")[1]&&!hasClassName(a,"hb1trigger")){
if(!hasClassName(a.parentNode,"hb1selected")||hasClassName(a.parentNode,"hb1selected")&&st){
var li=a.parentNode.parentNode.getElementsByTagName("li");
for(var i=0;i<li.length;i++){
if(!st){
removeClassName(li[i],"hb1selected");
}
removeClassName(gebi(li[i].getElementsByTagName("a")[0].href.split("#")[1]),"hb1selectedpanel");
}
addClassName(gebi(a.href.split("#")[1]),"hb1selectedpanel");
gebi(a.href.split("#")[1]).sfade=null;
setopacity(gebi(a.href.split("#")[1]),0);
sfadein(gebi(a.href.split("#")[1]),0.025);
addClassName(a.parentNode,"hb1selected");
}
}else{
if(a.href.split("#")[1]&&hasClassName(a,"hb1trigger")){
var _3d0=(hasClassName(a,"subtoggle"))?true:false;
hb1s=gebs("div.hb1w1 a");
for(var i=0;i<hb1s.length;i++){
if(hb1s[i].href.split("#")[1]==a.href.split("#")[1]){
hb1select(hb1s[i],_3d0);
}
}
}else{
return;
}
}
}
reg.setup("div.g41",function(){
var pre=this.getElementsByTagName("pre")[0];
if(this.className.indexOf("fixed-")>-1){
if(this.getElementsByTagName("h5")[0]){
addClassName(this,"hasttl");
}
var ex=elem("a.g41expand",{"href":"#increase"});
var co=elem("a.g41collapse",{"href":"#decrease"});
ex.onclick=function(){
resizeObjectHeight(this.parentNode.getElementsByTagName("div")[0],80,-20);
return false;
};
co.onclick=function(){
resizeObjectHeight(this.parentNode.getElementsByTagName("div")[0],-80,20);
return false;
};
this.appendChild(ex);
this.appendChild(co);
this.getElementsByTagName("div")[0].style.height=this.className.split("fixed-")[1].split(" ")[0]+"px";
}
var _3d4=(is.ie)?false:true;
while(_3d4){
pre.innerHTML=pre.innerHTML.replace(/^[ 	]*\n/,"\n");
if(pre.innerHTML.indexOf("\n")==0){
pre.innerHTML=pre.innerHTML.replace(/^\n/,"");
}else{
_3d4=false;
pre.innerHTML=pre.innerHTML.replace(/[ 	\n]*$/,"\n");
}
}
if(typeof prettyPrint=="undefined"&&hasClassName(pre,"prettyprint")){
document.getElementsByTagName("head")[0].appendChild(elem("script",{"src":"/js/g41_codeprettify.js","type":"text/javascript"}));
}
});
function resizeObjectHeight(obj,incr,_3d7){
var _3d8=obj.offsetHeight;
if(obj.rsize){
if((_3d8+incr)<=obj.rsize){
obj.style.height=obj.rsize+"px";
}else{
obj.style.height=obj.offsetHeight+incr+_3d7+"px";
}
}else{
if(incr<0){
obj.rsize=obj.offsetHeight;
}else{
obj.rsize=obj.offsetHeight;
obj.style.height=obj.offsetHeight+incr+_3d7+"px";
}
}
}
reg.change(".g25 select.showhide",function(){
var _3d9=this.options[this.options.selectedIndex];
var _3da={};
gebs("option",this).forEach(function(_3db){
_3db.showHide={};
var _3dc=_3db.className.match(/(^|\s)(#.+(\s+#.+)*)/);
if(!_3dc){
return;
}
var _3dd=_3dc[2].split(/\s+/);
_3dd.forEach(function(_3de){
var id=_3de.substring(1);
var _3e0=gebi(id);
if(!_3e0){
return;
}
_3da[id]=_3db.showHide[id]=_3e0;
});
});
for(id in _3da){
acn(_3da[id],"hidethis");
}
gebs("option",this).forEach(function(_3e1){
if(_3e1===_3d9){
for(id in _3e1.showHide){
rcn(_3e1.showHide[id],"hidethis");
}
}
});
});
(function(){
var _3e2=null;
reg.click("div.lppkged li > a@href",function(){
if(!_3e2){
_3e2=gebs("div.lppkged li > a@href");
for(var i=0;i<_3e2.length;i++){
var link=_3e2[i];
var _3e5=link.href.indexOf("#");
if(_3e5===-1){
continue;
}
var item=gebi(link.href.substring(_3e5+1));
if(!item){
continue;
}
link.item=item;
}
}
if(!this.item){
return false;
}
if(hcn(this.parentNode,"current")){
return false;
}
var pkg=getParent(this,".lppkg");
for(var i=0;i<_3e2.length;i++){
var link=_3e2[i];
if(!pkg.contains(link)){
continue;
}
rcn(link.parentNode,"current");
rcn(link.item,"current");
}
acn(this.parentNode,"current");
acn(this.item,"current");
num();
return false;
});
function setText(el,txt){
for(var i=0;i<el.childNodes.length;i++){
if(el.childNodes[i].nodeType==1){
setText(el.childNodes[i],txt);
return;
}
}
el.innerHTML=txt;
}
var _3eb;
reg.preSetup(function(){
if(!gebi("lp")){
return;
}
_3eb=gebcn("lpitemid");
for(var i=0;i<_3eb.length;i++){
var _3ed=true;
var _3ee=getParent(_3eb[i],".lpitem");
if(gebs(".lpfollow",_3ee).length>0){
_3ed=false;
}else{
var pkg=getParent(_3eb[i],".lppkg");
if(pkg&&gebs(".lppkg > .lpfollow",pkg).length>0){
_3ed=false;
}
}
if(_3ed){
setText(_3eb[i],1);
}
}
num();
});
function num(el){
var n=2;
for(var i=0;i<_3eb.length;i++){
var iNum=_3eb[i];
var num=parseInt(elemText(iNum));
var par=getParent(iNum,".lppkgitems");
if(num===1){
n=2;
}else{
if(!par||hcn(par,"current")){
setText(iNum,n++);
}
}
}
}
})();
reg.postSetup(function(){
var dumb=is.ie6||(is.gecko&&!is.geckoAtOrAbove("1.8"));
var _3f7=gebi("pc9v1");
if(!_3f7){
return;
}
var _3f8=0;
gebcn("pc9carousel",_3f7).forEach(function(csl){
var head=gebcn("pc9carousel-numbering",csl.parentNode);
head=head.length>0?head[0]:null;
var _3fb=gebs("div.pc9carousel > div.pane",csl);
if(_3fb.length<2){
return;
}
dumb||acn(csl,"pc9carousel-animating");
_3fb.forEach(function(pane,i){
if(!pane.id){
pane.id="pc9carousel_pane_"+(_3f8++);
}
var _3fe=i+1;
var _3ff=i-1;
if(_3ff<0){
_3ff+=_3fb.length;
}
if(_3fe>=_3fb.length){
_3fe-=_3fb.length;
}
pane.prev=_3fb[_3ff];
pane.next=_3fb[_3fe];
if(i>0){
acn(pane,"hidethis");
}
});
_3fb.forEach(function(pane){
gebs("p.thumb > img",pane).forEach(function(img){
var pdot=elem("img",{"src":imdir+"/a.gif","alt":"previous"});
var ndot=pdot.cloneNode(false);
ndot.alt="next";
var prev=elem("a.pc9prev",{"href":"#"+pane.prev.id},pdot);
var next=elem("a.pc9next",{"href":"#"+pane.next.id},ndot);
img.parentNode.insertBefore(prev,img);
insertAfter(next,img);
});
});
if(head){
var _406=elem("span.number",null,"1");
var _407=elem("span.marker",null,[" ",_406,"/"+_3fb.length+" "]);
_3fb.forEach(function(pane,i){
pane.numHolder=_406;
pane.num=i+1;
});
head.insertBefore(_407,head.firstChild);
}
});
function setPhase(pane,_40b){
pane.style.left=(_40b*10)+"%";
pane.style.right=(_40b*-10)+"%";
}
var _40c=20;
reg.click("a.pc9prev,a.pc9next",function(){
var pane=getParent(this,".pane");
var _40e=this.href.substring(this.href.indexOf("#")+1);
var _40f=gebi(_40e);
if(dumb){
acn(pane,"hidethis");
rcn(_40f,"hidethis");
}else{
var neg=hcn(this,"pc9prev")?1:-1;
setPhase(pane,1*neg);
setPhase(_40f,-9*neg);
rcn(_40f,"hidethis");
for(var i=2,phase=2,mult=1;i<10;i++){
window.setTimeout(function(){
setPhase(pane,neg*phase);
setPhase(_40f,-neg*(10-(phase++)));
},(mult++)*_40c);
}
window.setTimeout(function(){
acn(pane,"hidethis");
setPhase(pane,0);
setPhase(_40f,0);
},9*_40c);
}
if(_40f.numHolder){
_40f.numHolder.firstChild.data=_40f.num+"";
}
return false;
});
});
function domCrawl(_412,_413){
reg.rerun(_412);
}
function catchBodyClicks(){
if(document.body){
addEvent(document.body,"click",function(e){
if(!e){
var e=window.event;
}
if(e.target){
var targ=e.target;
}else{
if(e.srcElement){
var targ=e.srcElement;
}
}
if(targ.nodeType==3){
targ=targ.parentNode;
}
var sel;
if(typeof bodyClickHandlers!="undefined"){
selectors:
for(sel in bodyClickHandlers){
var el=targ;
var _418=0;
while(el.nodeType==1){
try{
if(matches(el,sel)){
bodyClickHandlers[sel](el,e);
break;
}
}
catch(e){
continue selectors;
}
if(!el.parentNode||_418>20){
break;
}
el=el.parentNode;
_418++;
}
}
}
});
}else{
window.setTimeout("catchBodyClicks()",100);
}
}
catchBodyClicks();
window.bodyClickHandlers={};
function sniffLinkHijax(fobj){
if(fobj.nodeName.toLowerCase()=="a"){
var _41a=new Array(fobj);
}else{
if(gebtn("a",fobj)[0]){
var _41a=gebtn("a",fobj);
}
}
for(i=0;i<_41a.length;i++){
_41a[i].targetDiv=fobj.className.split("hijax-")[1];
addEvent(_41a[i],"click",function(e){
var _41c=this.targetDiv;
var _41d=this.href+" ";
if(!hijaxCache[_41d]){
getfile(this.href,function(_41e,fvar){
if(_41e.indexOf("id=\""+_41c+"\"")>-1){
_41e=getRequestObject(_41c,_41e).innerHTML;
hijaxCache[_41d]=_41e;
gebi(_41c).innerHTML=_41e;
reg.rerun(gebi(_41c));
}
});
cancelDefault(e);
}else{
gebi(_41c).innerHTML=hijaxCache[_41d];
reg.rerun(gebi(_41c));
cancelDefault(e);
}
});
}
}
function addOnresizeEvent(func){
addEvent(window,"resize",func);
}
if(!String.prototype.strip){
String.prototype.strip=function(){
return this.replace(/^\s+|\s+$/g,"");
};
}
if(!String.prototype.normalize){
String.prototype.normalize=function(sp){
sp=(!sp&&sp!=="")?" ":sp;
return this.strip().replace(/\s+/g,sp);
};
}
function getfile(_422,_423,fvar,ferr){
var _426=false;
if(window.XMLHttpRequest){
_426=new XMLHttpRequest();
if(_426.overrideMimeType&&_422.indexOf(".xml")>-1){
_426.overrideMimeType("text/xml");
}
}else{
if(window.ActiveXObject){
try{
_426=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(ex1){
try{
_426=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(ex2){
}
}
}
}
if(!_426){
return false;
}
_426.onreadystatechange=function(){
if(_426.readyState==4){
if(_426.status==200){
if(_422.indexOf(".xml")>-1){
var _427=_426.responseXML.documentElement;
}else{
var _427=_426.responseText;
}
_423(_427,fvar);
}else{
if(ferr){
ferr(fvar,_422,_426.status,_426.statusText);
}
}
}
};
_426.open("GET",_422,true);
_426.send(null);
}
function getRequestObject(_428,_429,_42a){
if(!_42a){
_42a="div";
}
var _42b=document.createElement(_42a);
_42b.innerHTML=_429;
var x=gebtn(_42a,_42b);
var _42d;
for(var i=0;i<x.length;i++){
if(x[i].id==_428){
_42d=x[i];
break;
}
}
return _42d;
}
function getElementByIdFromString(_42f,id){
var _431=document.createElement("div");
_431.innerHTML=_42f;
var tags=gebtn("*",_431);
for(var a=0,tag;tag=tags[a++];){
if(tag.id==id){
return tag;
}
}
return null;
}
function xhr(url,_435,_436,obj,_438){
var _439=false;
if(window.XMLHttpRequest){
_439=new XMLHttpRequest();
}else{
if(window.ActiveXObject){
try{
_439=new ActiveXObject("Msxml2.XMLHTTP");
}
catch(e){
try{
_439=new ActiveXObject("Msxml3.XMLHTTP");
}
catch(ex1){
try{
_439=new ActiveXObject("Microsoft.XMLHTTP");
}
catch(ex2){
}
}
}
}
}
if(!_439){
return false;
}
if(!_438){
_438=null;
}
var _43a=(_438)?"POST":"GET";
_439.open(_43a,url,true);
_439.setRequestHeader("User-Agent","XMLHTTP/1.0");
if(_438){
_439.setRequestHeader("Content-type","application/x-www-form-urlencoded");
}
_439.onreadystatechange=function(){
if(_439.readyState==4){
if(_439.status==200){
_435(_439.responseText,obj);
}else{
try{
_436(_439.status,_439.statusText,url,obj);
}
catch(ex){
_436("",ex,url,obj);
}
}
}
};
_439.send(_438);
}
function getFormData(_43b){
var _43c=[];
var inps=reg.getElementsBySelector("input, select, textarea",_43b);
for(var a=0;a<inps.length;a++){
var inp=inps[a];
if(matches(inp,"@type=\"text\",@type=\"hidden\",@type=\"password\"")){
_43c.push(encodeURIComponent(inp.name)+"="+encodeURIComponent(inp.value));
}
if(inp.type=="checkbox"&&inp.checked||inp.type=="radio"&&inp.checked){
_43c.push(encodeURIComponent(inp.name)+"="+encodeURIComponent(inp.value));
}
if(inp.nodeName.toLowerCase()=="select"){
var _440=inp.options[inp.selectedIndex].value;
_43c.push(encodeURIComponent(inp.name)+"="+encodeURIComponent(_440));
}
if(inp.nodeName.toLowerCase()=="textarea"){
_43c.push(encodeURIComponent(inp.name)+"="+encodeURIComponent(inp.value));
}
}
return _43c.join("&");
}
function hasParent(obj,tag,_443){
var _444=obj;
if(_443){
while(_444=_444.parentNode){
if(_444.nodeName.toLowerCase()==tag&&hasClassName(_444,_443)||tag=="*"&&hasClassName(_444,_443)){
return _444;
}
}
}else{
if(typeof tag=="string"){
while(_444=_444.parentNode){
if(_444.id==tag){
return _444;
}
}
}else{
while(_444=_444.parentNode){
if(_444==tag){
return _444;
}
}
}
}
}
function getXY(obj){
var o=obj;
obj.X=obj.Y=0;
while(o){
obj.X=obj.X+o.offsetLeft;
obj.Y=obj.Y+o.offsetTop;
o=o.offsetParent;
}
}
function getClassContains(obj,_448){
var rcl=false;
var cls=obj.className.split(" ");
for(var v=0;v<cls.length;v++){
if(cls[v].indexOf(_448)>-1){
rcl=cls[v];
}
}
return rcl;
}
function getChildNodesByTagName(el,_44d){
var cn=el.childNodes;
var nd=[];
for(var n=0;n<cn.length;n++){
if(_44d==cn[n].nodeName.toLowerCase()){
nd.push(cn[n]);
}
}
return nd;
}
function setopacity(_451,opac){
if(gebi(_451)){
var oobj=gebi(_451);
}else{
if(_451){
var oobj=_451;
}
}
if(oobj){
if(oobj.filters&&oobj.filters.alpha){
oobj.filters.alpha.opacity=opac*100;
}else{
oobj.style.MozOpacity=opac;
oobj.style.opacity=opac;
}
}
}
function sfadein(obj,n){
if(!obj.sfade){
obj.sfade=0;
}
if(obj.sfade<1){
if(is.safariAll){
obj.sfade=obj.sfade+(n*5);
}else{
obj.sfade=obj.sfade+n;
}
setopacity(obj,obj.sfade);
setTimeout(function(){
sfadein(obj,obj.sfade);
},75);
}else{
setopacity(obj,1);
obj.sfade=null;
}
}
Date.prototype.diffDay=function(days){
var r=new Date(this.getTime());
r.setDate(r.getDate()+days);
return r;
};
Date.prototype.diffMonth=function(_458){
var r=new Date(this.getTime());
var num=r.getMonth()+_458;
var _45b=0;
if(num<0){
while(num<0){
num+=12;
_45b--;
}
}else{
if(num>11){
while(num>11){
num-=12;
_45b++;
}
}
}
r.setMonth(num);
r.setFullYear(r.getFullYear()+_45b);
return r;
};
String.prototype.padLeft=function(ch,_45d){
var r=this;
while(r.length<_45d){
r=ch+r;
}
return r;
};
Date.prototype.format=(function(){
var _45f=/(WEEKDAY)|(Weekday)|(weekday)|(WEE)|(Wee)|(wee)|(WE)|(We)|(we)|(W)|(w)|(MONTH)|(Month)|(month)|(MON)|(Mon)|(mon)|(MM)|(M)|(DD)|(Dth)|(D)|(YYYY)|(YY)|(HH)|(hh)|(H)|(h)|(mm)|(ss)|(A)|(a)|(X)/g;
var dobj;
function parser(str,_462,_463,_464,WEE,Wee,wee,WE,We,we,W,w,_46d,_46e,_46f,MON,Mon,mon,MM,M,DD,Dth,D,YYYY,YY,HH,hh,H,h,mm,ss,A,a,X){
var _483;
if(ss){
return (""+dobj.getSeconds()).padLeft("0",2);
}
if(mm){
return (""+dobj.getMinutes()).padLeft("0",2);
}
if(H){
return dobj.getHours()+"";
}
if(HH){
return (dobj.getHours()+"").padLeft("0",2);
}
if(h){
_483=(dobj.getHours()%12)+"";
if(_483=="0"){
_483="12";
}
return _483;
}
if(hh){
_483=(dobj.getHours()%12)+"";
if(_483=="0"){
_483="12";
}
_483=_483.padLeft("0",2);
return _483;
}
if(_463){
return dayNamesFull[dobj.getDay()];
}
if(W){
return dayNames1[dobj.getDay()];
}
if(We){
return dayNames2[dobj.getDay()];
}
if(Wee){
return dayNames3[dobj.getDay()];
}
if(_462){
return dayNamesFull[dobj.getDay()].toUpperCase();
}
if(WE){
return dayNames2[dobj.getDay()].toUpperCase();
}
if(WEE){
return dayNames3[dobj.getDay()].toUpperCase();
}
if(_464){
return dayNamesFull[dobj.getDay()].toLowerCase();
}
if(w){
return dayNames1[dobj.getDay()].toLowerCase();
}
if(we){
return dayNames2[dobj.getDay()].toLowerCase();
}
if(wee){
return dayNames3[dobj.getDay()].toLowerCase();
}
if(D){
return dobj.getDate()+"";
}
if(DD){
return (dobj.getDate()+"").padLeft("0",2);
}
if(Dth){
_483=dobj.getDate()+"";
if(_483.match(/^1\d$/)){
_483+="th";
}else{
if(_483.match(/1$/)){
_483+="st";
}else{
if(_483.match(/2$/)){
_483+="nd";
}else{
if(_483.match(/3$/)){
_483+="rd";
}else{
_483+="th";
}
}
}
}
return _483;
}
if(YYYY){
return dobj.getFullYear()+"";
}
if(YY){
return (dobj.getFullYear()+"").substring(2,4);
}
if(M){
return (dobj.getMonth()+1)+"";
}
if(MM){
return ((dobj.getMonth()+1)+"").padLeft("0",2);
}
if(_46e){
return monthNamesFull[dobj.getMonth()];
}
if(Mon){
return monthNames3[dobj.getMonth()];
}
if(_46d){
return monthNamesFull[dobj.getMonth()].toUpperCase();
}
if(MON){
return monthNames3[dobj.getMonth()].toUpperCase();
}
if(_46f){
return monthNamesFull[dobj.getMonth()].toLowerCase();
}
if(mon){
return monthNames3[dobj.getMonth()].toLowerCase();
}
if(X){
return (dobj.getTimezoneOffset()/60)+"";
}
if(A){
return (dobj.getHours()<12)?"AM":"PM";
}
if(a){
return (dobj.getHours()<12)?"am":"pm";
}
}
return function(fmt){
dobj=this;
var _485=fmt.split("'");
if(_485.length%2==0){
throw "missing closing single quote in date format \""+fmt+"\"";
}
for(var i=0;i<_485.length;i+=2){
_485[i]=_485[i].replace(_45f,parser);
}
return _485.join("");
};
})();
function Calendar(date,_488,_489,_48a){
this.origDate=(_48a)?_48a:date.diffDay(0);
this.startDate=_488;
this.endDate=_489;
date.setDate(1);
this.canonicalMonth=date.diffDay(0);
this.g=[];
this.g[0]=[];
var _48b=date.getDay();
var row=this.g[0];
for(var a=0;a<_48b;a++){
row[a]=date.diffDay(a-_48b);
row[a].dayClass="jscal-before";
if(_488&&row[a].getTime()<_488){
row[a].dayClass+=" jscal-outofrange";
}else{
if(_489&&row[a].getTime()>_489){
row[a].dayClass+=" jscal-outofrange";
}else{
row[a].dayClass+=" jscal-inrange";
}
}
}
var _48e=new Date().format("DD/MM/YYYY");
var _48f=this.origDate.format("DD/MM/YYYY");
while(date.getMonth()==this.canonicalMonth.getMonth()){
var _490=this.g[this.g.length-1][date.getDay()];
this.g[this.g.length-1][date.getDay()]=date;
this.g[this.g.length-1][date.getDay()].dayClass="jscal-during";
var _491=date.format("DD/MM/YYYY");
if(_491==_48e){
date.dayClass+=" jscal-today";
}
if(_491==_48f){
date.dayClass+=" jscal-current";
}
if(_488&&date.getTime()<_488){
date.dayClass+=" jscal-outofrange";
}else{
if(_489&&date.getTime()>_489){
date.dayClass+=" jscal-outofrange";
}else{
date.dayClass+=" jscal-inrange";
}
}
date=date.diffDay(1);
if(date.getDay()==0&&date.getMonth()==this.canonicalMonth.getMonth()){
this.g[this.g.length]=[];
}
}
var row=this.g[this.g.length-1];
var _492=row.length;
for(var a=row.length;a<7;a++){
row[a]=date.diffDay(a-_492);
row[a].dayClass="jscal-after";
if(_488&&row[a].getTime()<_488){
row[a].dayClass+=" jscal-outofrange";
}else{
if(_489&&row[a].getTime()>_489){
row[a].dayClass+=" jscal-outofrange";
}else{
row[a].dayClass+=" jscal-inrange";
}
}
}
}
Calendar.prototype.weeks=function(){
return this.g.length;
};
Calendar.prototype.getDayAt=function(_493,_494){
return this.g[_493][_494];
};
Calendar.prototype.diffMonth=function(_495){
return new Calendar(this.canonicalMonth.diffMonth(_495),this.startDate,this.endDate,this.origDate);
};
Calendar.prototype.getCalendarTable=function(){
var t=elem("table.jscal",{"cellSpacing":"0"});
var div=elem("div.jscal-x1",{},elem("div.jscal-x2",{},t));
t.createTHead().insertRow(0);
t.tHead.rows[0].className="jscal-mname";
t.tHead.rows[0].appendChild(elem("th")).colSpan="7";
t.tHead.insertRow(1).className="jscal-dname";
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[0]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[1]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[2]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[3]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[4]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[5]));
t.tHead.rows[1].appendChild(elem("th")).appendChild(document.createTextNode(dayNames1[6]));
t.appendChild(elem("tbody"));
var m=t.tHead.rows[0].cells[0];
var _499=elem("span.jscal-closer",{"href":"#","border":"0"},elem("img",{"alt":"[x]","src":imdir+"/ic_close_win_light.gif","title":"close"}));
var _49a=elem("a.jscal-mselect",{"title":"previous month"},"\xab ");
var _49b=elem("span.jscal-monthyear",{},this.canonicalMonth.format("Mon")+" "+this.canonicalMonth.format("YYYY"));
var _49c=elem("a.jscal-mselect",{"title":"next month"}," \xbb");
_49a.calendar=_49c.calendar=div.calendar=this;
_499.div=_49a.div=_49c.div=div;
m.appendChild(_499);
m.appendChild(_49a);
m.appendChild(_49b);
m.appendChild(_49c);
addEvent(_49a,"click",function(e){
getParent(this,"div.jscal-x1").setCalendar(this.calendar.diffMonth(-1));
cancelDefault(e);
});
addEvent(_49c,"click",function(e){
getParent(this,"div.jscal-x1").setCalendar(this.calendar.diffMonth(1));
cancelDefault(e);
});
addEvent(_499,"click",function(e){
var _4a0=getParent(this,"div.jscal-x1");
_4a0.parentNode.removeChild(_4a0);
cancelDefault(e);
});
for(var a=0;a<this.weeks();a++){
t.tBodies[0].insertRow(a);
for(var b=0;b<7;b++){
t.tBodies[0].rows[a].insertCell(b);
var dt=this.getDayAt(a,b);
if(!dt){
throw "empty month date at "+a+","+b;
}
t.tBodies[0].rows[a].cells[b].className=dt.dayClass;
var lnk=elem("span",{},""+dt.getDate());
lnk.date=dt;
t.tBodies[0].rows[a].cells[b].appendChild(lnk);
}
}
div.setCalendar=function(cal){
var _4a6=cal.getCalendarTable();
this.appendChild(_4a6.firstChild);
this.removeChild(this.firstChild);
};
return div;
};
function getSafelyEncodedString(s){
s=encodeURIComponent(s);
s=s.replace(/&/,"&amp;").replace(/"/,"&quot;").replace(/</,"&lt;").replace(/>/,"&gt;");
return s;
}
