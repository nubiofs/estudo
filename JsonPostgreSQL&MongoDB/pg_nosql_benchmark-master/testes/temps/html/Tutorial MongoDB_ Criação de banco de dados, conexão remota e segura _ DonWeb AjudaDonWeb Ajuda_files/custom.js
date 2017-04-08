jQuery.noConflict()(function($){
	"use strict";
	$(document).ready(function() {
            
            //botonera
            
            $('#nav-revendedores').mouseenter(function(){
                $('.submenu-botonera').hide();
                $('#sub-revendedores').show().css('left',$(this).position().left + 12);                
            });
            
            $('#nav-atencion').mouseenter(function(){
                $('.submenu-botonera').hide();
                $('#sub-atencion').show().css('left',$(this).position().left + 11);                
            });
            
             $('#nav-servicios').mouseenter(function(){
                $('.submenu-botonera').hide();
                $('#sub-servicios').show().css('left',$(this).position().left + 11);                
            });
            
            $('#navegacion-categorias').mouseleave(function(){
                $('.submenu-botonera').hide();
            })
            
            $('.submenu-botonera').mouseleave(function(){
                $('.submenu-botonera').hide();
            })
            
            
            //animacion categorias principales
            
            
            $('.categoria-principal').mouseenter(function(){                
                $(this).find('img').css({"width":"100%","margin-top":'-20px'});                                
                $('#bgCategoria').css({'display':'block','opacity':0,'left':$(this).position().left - 27}).stop().animate({'opacity':1},900);
                
                                
                $(this).find('h3 a').css({'background':'#f59600','font-size':'18px'});
                $('#link-dominios').css({'padding': '8px 51px'});
                $('#link-hosting').css({'padding':'8px 38px'});
                $('#link-correos').css({'padding': '8px 56px'});
                $(this).find('h3').css({'margin-top':'-12px'})
                
                $('.ocultarCategoria').stop().css({'display':'block'}).animate({'opacity':1},400);
                $(this).find('.ocultarCategoria').stop().css({'opacity':0,'display':'none'});
            });
            
            $('.categoria-principal').mouseleave(function(){                
                $(this).find('img').css({"width":"90%","margin-top":'0px'});                
                $('#bgCategoria').stop().animate({'opacity':0},100);
                $(this).find('h3 a').css({'background':'#f5ad00','font-size':'16px', 'padding':'8px 60px'})
                $(this).find('h3').css({'margin-top':'-17px'})
                
                $('.ocultarCategoria').stop().animate({'opacity':0},200);
            });
            
            
            $('.ui-autocomplete ').css('z-index','1000 !important');

             //contenido relacionado
             var alturaMaxima = 0;
             $('.post-relacionado').each(function(){                   
                 
                 if($(this).height() > alturaMaxima){
                     alturaMaxima = $(this).height();
                 }              
             })
             
             $('.post-relacionado').height(alturaMaxima);

	$('a[data-rel]').each(function() {
		$(this).attr('rel', $(this).data('rel'));
	});		

		$("a[rel^='prettyPhoto']").prettyPhoto({
			animationSpeed: 'normal', 
			opacity: 0.80, 
			showTitle: true,
			deeplinking: false,
			theme:'light_square'
		});

		$('p:empty').remove();
		
		
		$('.sf-menu').css({'display':'block'});
		
		$('.comment-form-email, .comment-form-url, .comment-form-comment').before('<div class="clear"></div>');

	});
});

	
jQuery.noConflict()(function($){
	"use strict";
	$(document).ready(function() {
		$("<select />").appendTo(".navigation");
		$("<option />",{
			"selected":"selected",
			"value":"",
			"text":"Go to..."
		}).appendTo(".navigation select");
		$(".navigation li a").each(function() {
			var el = $(this);
			$("<option />",{
				"value":el.attr("href"),
				"text":el.text()
			}).appendTo(".navigation select");
		});
		$(".navigation select").change(function() {
			window.location = $(this).find("option:selected").val();
		});
	});
});




/*jQuery.noConflict()(function($){
	"use strict";
	$(window).load(function(){
		var $window = $(window);
		window.prettyPrint() && prettyPrint();
	});
});*/