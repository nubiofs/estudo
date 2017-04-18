
/* Merged Plone Javascript file
 * This file is dynamically assembled from separate parts.
 * Some of these parts have 3rd party licenses or copyright information attached
 * Such information is valid for that section,
 * not for the entire composite file
 * originating files are separated by - filename.js -
 */

/* - fckeditor.js - */
// https://wiki.serpro/portal_javascripts/fckeditor.js?original=1
var FCKeditor=function(instanceName,width,height,toolbarSet,value){this.InstanceName=instanceName ;this.Width=width||'100%' ;this.Height=height||'200' ;this.ToolbarSet=toolbarSet||'Default' ;this.Value=value||'' ;this.BasePath=FCKeditor.BasePath ;this.CheckBrowser=true ;this.DisplayErrors=true ;this.Config=new Object() ;this.OnError=null }
FCKeditor.BasePath='/fckeditor/' ;FCKeditor.MinHeight=200 ;FCKeditor.MinWidth=750 ;FCKeditor.prototype.Version='2.6.3' ;FCKeditor.prototype.VersionBuild='19836' ;FCKeditor.prototype.Create=function(){document.write(this.CreateHtml()) }
FCKeditor.prototype.CreateHtml=function(){if(!this.InstanceName||this.InstanceName.length==0){this._ThrowError(701,'You must specify an instance name.') ;return '' }
var sHtml='' ;if(!this.CheckBrowser||this._IsCompatibleBrowser()){sHtml+='<input type="hidden" id="'+this.InstanceName+'" name="'+this.InstanceName+'" value="'+this._HTMLEncode(this.Value)+'" style="display:none" />' ;sHtml+=this._GetConfigHtml() ;sHtml+=this._GetIFrameHtml() }
else{var sWidth=this.Width.toString().indexOf('%')>0?this.Width:this.Width+'px' ;var sHeight=this.Height.toString().indexOf('%')>0?this.Height:this.Height+'px' ;sHtml+='<textarea name="'+this.InstanceName+'" rows="4" cols="40" style="width:'+sWidth+';height:'+sHeight ;if(this.TabIndex)
sHtml+='" tabindex="'+this.TabIndex ;sHtml+='">'+this._HTMLEncode(this.Value)+'<\/textarea>' }
return sHtml }
FCKeditor.prototype.ReplaceTextarea=function(){if(!this.CheckBrowser||this._IsCompatibleBrowser()){var oTextarea=document.getElementById(this.InstanceName) ;var colElementsByName=document.getElementsByName(this.InstanceName) ;var i=0;while(oTextarea||i==0){if(oTextarea&&oTextarea.tagName.toLowerCase()=='textarea')
break ;oTextarea=colElementsByName[i++] }
if(!oTextarea){alert('Error: The TEXTAREA with id or name set to "'+this.InstanceName+'" was not found') ;return }
oTextarea.style.display='none' ;if(oTextarea.tabIndex)
this.TabIndex=oTextarea.tabIndex ;this._InsertHtmlBefore(this._GetConfigHtml(),oTextarea) ;this._InsertHtmlBefore(this._GetIFrameHtml(),oTextarea) }}
FCKeditor.prototype._InsertHtmlBefore=function(html,element){if(element.insertAdjacentHTML)
element.insertAdjacentHTML('beforeBegin',html) ;else{var oRange=document.createRange() ;oRange.setStartBefore(element) ;var oFragment=oRange.createContextualFragment(html);element.parentNode.insertBefore(oFragment,element) }}
FCKeditor.prototype._GetConfigHtml=function(){var sConfig='' ;for(var o in this.Config){if(sConfig.length>0) sConfig+='&amp;' ;sConfig+=encodeURIComponent(o)+'='+encodeURIComponent(this.Config[o]) }
return '<input type="hidden" id="'+this.InstanceName+'___Config" value="'+sConfig+'" style="display:none" />' }
FCKeditor.prototype._GetIFrameHtml=function(){var sFile='fckeditor.html' ;try{if((/fcksource=true/i).test(window.top.location.search))
sFile='fckeditor.original.html' }
catch(e){}
var sLink=this.BasePath+'editor/'+sFile+'?InstanceName='+encodeURIComponent(this.InstanceName) ;if(this.ToolbarSet)
sLink+='&amp;Toolbar='+this.ToolbarSet ;html='<iframe id="'+this.InstanceName+'___Frame" src="'+sLink+'" width="'+this.Width+'" height="'+this.Height ;if(this.TabIndex)
html+='" tabindex="'+this.TabIndex ;html+='" frameborder="0" scrolling="no"></iframe>' ;return html }
FCKeditor.prototype._IsCompatibleBrowser=function(){return FCKeditor_IsCompatibleBrowser() }
FCKeditor.prototype._ThrowError=function(errorNumber,errorDescription){this.ErrorNumber=errorNumber ;this.ErrorDescription=errorDescription ;if(this.DisplayErrors){document.write('<div style="COLOR: #ff0000">') ;document.write('[ FCKeditor Error '+this.ErrorNumber+': '+this.ErrorDescription+' ]') ;document.write('</div>') }
if(typeof(this.OnError)=='function')
this.OnError(this,errorNumber,errorDescription) }
FCKeditor.prototype._HTMLEncode=function(text){if(typeof(text)!="string")
text=text.toString() ;text=text.replace(/&/g,"&amp;").replace(/"/g, "&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;") ;return text }
;(function(){var textareaToEditor=function(textarea){var editor=new FCKeditor(textarea.name) ;editor.Width=Math.max(textarea.offsetWidth,FCKeditor.MinWidth) ;editor.Height=Math.max(textarea.offsetHeight,FCKeditor.MinHeight) ;return editor }
FCKeditor.ReplaceAllTextareas=function(){var textareas=document.getElementsByTagName('textarea') ;for(var i=0 ;i<textareas.length ;i++){var editor=null ;var textarea=textareas[i] ;var name=textarea.name ;if(!name||name.length==0)
continue ;if(typeof arguments[0]=='string'){var classRegex=new RegExp('(?:^| )'+arguments[0]+'(?:$| )') ;if(!classRegex.test(textarea.className))
continue }
else if(typeof arguments[0]=='function'){editor=textareaToEditor(textarea) ;if(arguments[0](textarea,editor)===false)
continue }
if(!editor)
editor=textareaToEditor(textarea) ;editor.ReplaceTextarea() }}})() ;
function FCKeditor_IsCompatibleBrowser(){var sAgent=navigator.userAgent.toLowerCase() ;if(/*@cc_on!@*/false&&sAgent.indexOf("mac")==-1){var sBrowserVersion=navigator.appVersion.match(/MSIE (.\..)/)[1] ;return(sBrowserVersion>=5.5) }
if(navigator.product=="Gecko"&&navigator.productSub>=20030210&&!(typeof(opera)=='object'&&opera.postError))
return true ;if(window.opera&&window.opera.version&&parseFloat(window.opera.version())>=9.5)
return true ;if(sAgent.indexOf(' adobeair/')!=-1)
return(sAgent.match(/ adobeair\/(\d+)/ )[1] >= 1 ) ;	// Build must be at least v1
if(sAgent.indexOf(' applewebkit/')!=-1)
return(sAgent.match(/ applewebkit\/(\d+)/ )[1] >= 522 ) ;	// Build must be at least 522(v3)
return false }


/* - fck_plone.js - */
// https://wiki.serpro/portal_javascripts/fck_plone.js?original=1
var FCKBaseHref={};makeLinksRelative=function(basehref,contents){var base=basehref.replace('https://wiki.serpro','');var href=base.replace(/\/[^\/]*$/,'/');var hrefparts=href.split('/');return contents.replace(/(<[^>]* (?:src|href)=")([^"]*)"/g,
function(str,tag,url,offset,contents){url=url.replace('https://wiki.serpro','');if(url.substring(0,1)=='#'){str=tag+url+'"'}
else{var urlparts=url.split('#');var anchor=urlparts[1]||'';url=urlparts[0];var urlparts=url.split('/');var common=0;while(common<urlparts.length&&common<hrefparts.length&&urlparts[common]==hrefparts[common])
common++;var last=urlparts[common];if(common+1==urlparts.length&&last=='emptypage'){urlparts[common]=''}
if(common>0){var path=new Array();var i=0;for(;i+common<hrefparts.length-1;i++){path[i]='..'};while(common<urlparts.length){path[i++]=urlparts[common++]};if(i==0){path[i++]='.'}
str=path.join('/');if(anchor){str=[str,anchor].join('#')}
str=tag+str+'"'}}
return str})};finalizePublication=function(editorInstance){var oField=editorInstance.LinkedField;var fieldName=oField.name;var baseHref=FCKBaseHref[fieldName];if(baseHref){relativeLinksHtml=makeLinksRelative(FCKBaseHref[fieldName],editorInstance.GetXHTML());oField.value=relativeLinksHtml}
else oField.value=editorInstance.GetXHTML()}
getParamValue=function(id){value=document.getElementById(id).value;if(value=='true') return true;if(value=='false') return false;return value}
FCKeditor_Plone_start_instance=function(fckContainer,inputname){var inputContainer=document.getElementById(inputname+'_'+'cleaninput');if(inputContainer){var fckParams=['path_user','base_path','fck_basehref','links_basehref','input_url','allow_server_browsing','browser_root','allow_file_upload','allow_image_upload','allow_flash_upload','fck_skin_path','lang','fck_default_r2l','force_paste_as_text','allow_latin_entities','spellchecker','keyboard_entermode','keyboard_shiftentermode','fck_toolbar','editor_width','editor_height'];var fckValues={};for(var i=0;i<fckParams.length;i++){var id=inputname+'_'+fckParams [i];fckValues [fckParams [i]]=getParamValue(id)}
var oFck=new FCKeditor(inputname);var pathUser=fckValues ['path_user']+'/';oFck.BasePath=fckValues ['base_path']+'/';oFck.Config['CustomConfigurationsPath']=fckValues ['input_url']+'/fckconfigPlone.js?field_name='+inputname;oFck.BaseHref=fckValues ['fck_basehref'];FCKBaseHref[inputname]=fckValues ['links_basehref'];if(inputContainer.innerText!=undefined) oFck.Value=inputContainer.innerText;else oFck.Value=inputContainer.textContent;oFck.Config['LinkBrowser']=fckValues ['allow_server_browsing'];oFck.Config['LinkBrowserURL']=fckValues ['base_path']+'/fckbrowser/browser.html?field_name='+inputname+'&Connector='+fckValues ['input_url']+'/connectorPlone&ServerPath='+fckValues ['browser_root']+'&CurrentPath='+pathUser ;oFck.Config['LinkUpload']=fckValues ['allow_file_upload'] ;oFck.Config['LinkUploadURL']=fckValues ['input_url']+'/uploadPlone?field_name='+inputname+'&CurrentPath='+pathUser;oFck.Config['ImageBrowser']=fckValues ['allow_server_browsing'];oFck.Config['ImageBrowserURL']=fckValues ['base_path']+'/fckbrowser/browser.html?field_name='+inputname+'&Type=Image&Connector='+fckValues ['input_url']+'/connectorPlone&ServerPath='+fckValues ['browser_root']+'&CurrentPath='+pathUser ;oFck.Config['ImageUpload']=fckValues ['allow_image_upload'] ;oFck.Config['ImageUploadURL']=fckValues ['input_url']+'/uploadPlone?field_name='+inputname+'&CurrentPath='+pathUser;oFck.Config['FlashBrowser']=fckValues ['allow_server_browsing'];oFck.Config['FlashBrowserURL']=fckValues ['base_path']+'/fckbrowser/browser.html?field_name='+inputname+'&Type=Flash&Connector='+fckValues ['input_url']+'/connectorPlone&ServerPath='+fckValues ['browser_root']+'&CurrentPath='+pathUser ;oFck.Config['FlashUpload']=fckValues ['allow_flash_upload'] ;oFck.Config['FlashUploadURL']=fckValues ['input_url']+'/uploadPlone?field_name='+inputname+'&CurrentPath='+pathUser;oFck.Config['MediaBrowser']=fckValues ['allow_server_browsing'];oFck.Config['MediaBrowserURL']=fckValues ['base_path']+'/fckbrowser/browser.html?field_name='+inputname+'&Type=Media&Connector='+fckValues ['input_url']+'/connectorPlone&ServerPath='+fckValues ['browser_root']+'&CurrentPath='+pathUser ;oFck.Config['SkinPath']=fckValues ['base_path']+'/editor/'+fckValues ['fck_skin_path'];oFck.Config['AutoDetectLanguage']=false;oFck.Config['DefaultLanguage']=fckValues ['lang'];oFck.Config['ForcePasteAsPlainText']=fckValues ['force_paste_as_text'];oFck.Config['IncludeLatinEntities']=fckValues ['allow_latin_entities'];oFck.Config['SpellChecker']=fckValues ['spellchecker'];oFck.Config['EnterMode']=fckValues ['keyboard_entermode'];oFck.Config['ShiftEnterMode']=fckValues ['keyboard_shiftentermode'];oFck.ToolbarSet=fckValues ['fck_toolbar'];oFck.Width=fckValues ['editor_width'];oFck.Height=fckValues ['editor_height'];try{fckContainer.innerHTML=oFck.CreateHtml();document.getElementById(inputname+'_fckLoading').style.display='none'}
catch(e){document.getElementById(inputname+'_fckLoading').style.display='none';document.getElementById(inputname+'_fckError').style.display='block'}}}
Save_inline=function(fieldname,form,editorInstance){if(editorInstance.Commands.GetCommand('FitWindow').GetState()){kukit.log('Full screen mode must be disabled before saving inline');editorInstance.Commands.GetCommand('FitWindow').Execute()} ;saveField=document.getElementById(fieldname+'_fckSaveField');if(saveField){kukit.log('Fire the savekupu server event = save inline without submitting');saveField.style.visibility='visible';if(saveField.fireEvent){saveField.fireEvent('onChange')}
else{var evt=document.createEvent("HTMLEvents");evt.initEvent("change",true,true);saveField.dispatchEvent(evt)}
comp=(setTimeout("saveField.style.visibility='hidden'",2000));return false}
else{kukit.log('Try to submit the form in portal_factory');window.onbeforeunload=null;form.submit()}}


/* - fck_ploneInit.js - */
// https://wiki.serpro/portal_javascripts/fck_ploneInit.js?original=1
function getElementsByClassName(oElm,strTagName,strClassName){var arrElements=(strTagName=="*"&&oElm.all)?oElm.all:oElm.getElementsByTagName(strTagName);var arrReturnElements=new Array();strClassName=strClassName.replace(/\-/g,"\\-");var oRegExp=new RegExp("(^|\\s)"+strClassName+"(\\s|$)");var oElement;for(var i=0;i<arrElements.length;i++){oElement=arrElements[i];if(oRegExp.test(oElement.className)){arrReturnElements.push(oElement)}}
return(arrReturnElements)}
function FCKeditor_OnComplete(editorInstance){editorInstance.Events.AttachEvent('OnAfterLinkedFieldUpdate',finalizePublication) }
FCKeditor_Plone_Init=function(){var fckContainers=getElementsByClassName(document,'div','fckContainer');for(var i=0;i<fckContainers.length;i++){var fckContainer=fckContainers [i];var fckContainerId=fckContainer.getAttribute('id');var inputname=fckContainerId.replace("_fckContainer","");FCKeditor_Plone_start_instance(fckContainer,inputname)}}
registerPloneFunction(FCKeditor_Plone_Init);

/* - Plorum.js - */
// https://wiki.serpro/portal_javascripts/Plorum.js?original=1
function confirmaExclusao(){objCheckbox=document.getElementById(idCheckbox);tamCheckbox=objCheckbox.length;flag=false;for(var i=0;i<tamCheckbox;i++){alert(tamCheckbox[i]);if(tamCheckbox[i].checked)
flag=true}
if(flag)
return window.confirm('TEM CERTEZA DE QUE DESEJA EXCLUIR O(S) ITEM(NS) SELECIONADO(S)?');return true}
function foco(idElemento){elemento=document.getElementById(idElemento);try{alert(elemento);elemento.focus()}
catch(error){}}
function marcarTodos(idCheckBox){checkBox=document.getElementById(idCheckBox);alert(checkBox);try{tamCheckBox=checkBox.options.length;if(tamCheckBox!=undefined){for(var i=0;i<tamCheckBox;i++){checkBox[i].checked=true}}
else{checkBox.checked=true}
return}
catch(error){}
return}

