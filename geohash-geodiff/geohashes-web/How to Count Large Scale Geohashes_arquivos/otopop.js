
	jQuery(document).ready(function () {
		//jQuery(".otopop").hide();
		jQuery(".openpop").click(function (e) {
			e.preventDefault();
												
			//jQuery(".otopop-links").fadeOut('slow');
			jQuery("#otopop-iframe-container").fadeIn('slow');
		});

		jQuery(".otopop-close").click(function (e) {
			e.preventDefault();
			jQuery(this).parent().fadeOut("slow");
		});
		
	});