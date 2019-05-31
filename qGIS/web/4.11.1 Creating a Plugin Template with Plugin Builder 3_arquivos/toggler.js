(function($, Drupal) {
  // Custom functions and variables can go here
  Drupal.behaviors.custom_js_libraries_toggler = {
    attach:function() {
        $(".toggler").click(function(){
         $(this).next().slideToggle("slow");
         return false;
         }).next().hide();
        
    }
  };
}(jQuery, Drupal));