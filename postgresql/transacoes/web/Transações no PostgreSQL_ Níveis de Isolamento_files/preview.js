function carregaPreview(id_user, elemento, callback){
	$(elemento).addClass("preview-loading");
	$.ajax({
		type:'POST',
		dataType:'html',
		data: {'id_usuario': id_user },
		url:'//www.devmedia.com.br/perfil/script/retorna_preview.php',
		success:function(data){
			var preview = $(data);
			if(preview.hasClass("perfil-preview")){
			$(elemento).append(data);
			callback();
			}
		},
		complete:function(){
			$(elemento).removeClass("preview-loading");
		}
	});
}

function posicionarPreview(preview, mouse){
	//$('.preview-perfil-show').removeClass('preview-perfil-show');
	var winHeight = window.innerHeight;
	var winWidth = window.innerWidth;

	var scrollTop = $(window).scrollTop();
	var scrollBottom = scrollTop + winHeight;

	var elementHeight = mouse.currentTarget.getBoundingClientRect().height;
	var elementTop = scrollTop + mouse.currentTarget.getBoundingClientRect().top;
	var elementBottom = elementTop + elementHeight;

	var elementLeft = mouse.currentTarget.getBoundingClientRect().left;

	var margem = 25;

	var height = preview.height();
	var width = preview.width();
	if(scrollBottom > elementBottom + height){
		preview.css("top", elementHeight - margem);
	} else if(scrollTop < elementBottom - height){
		preview.css("top", (height) *-1.05);
	} else {
		preview.css("top", (scrollTop - elementBottom) + margem);
	}

	if (elementLeft + width > winWidth) {
		preview.css("right", '0px');
		preview.css("left", 'auto');
	}else{
		preview.css("left", '0px');
		preview.css("right", 'auto');
	}
}

$(document).ready(function() {
	$('head').append('<link rel="stylesheet" type="text/css" href="//www.devmedia.com.br/perfil/css/preview.css?i=17.99">');

$('body').on('mouseenter', '[data-preview]', function(e) {
	if($(window).width()>567){
		var id = $(this).attr('data-preview');
		var preview = $(this).find('[data-block-preview="'+id+'"]'); 
		if (preview.length == 0) {
			carregaPreview(id, $(this), function(){
				preview = $(e.currentTarget).find('[data-block-preview="'+id+'"]');
				posicionarPreview(preview, e);
				//$(preview).addClass('preview-perfil-show');
			});
		} else {
			posicionarPreview(preview, e);
			//$(preview).addClass('preview-perfil-show');
		}
	}
	});
});

/* $('body').on('mouseleave', '[data-preview]', function() {
	$('.preview-perfil-show').removeClass('preview-perfil-show');
}); */