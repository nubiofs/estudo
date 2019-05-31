(function($, Drupal) {
  // Custom functions and variables can go here
  Drupal.behaviors.custom_js_libraries_printable_links = {
    attach:function() {
       //code starts

//********************
//These functions will grab everything within an element and get the CSS associated with that element
// and all of the elements children.

    $.fn.getStyleObject = function(){
        var dom = this.get(0);
        var style;
        var returns = {};
        if(window.getComputedStyle){
            var camelize = function(a,b){
                return b.toUpperCase();
            }
            style = window.getComputedStyle(dom, null);
            for(var i=0;i<style.length;i++){
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            return returns;
        }
        if(dom.currentStyle){
            style = dom.currentStyle;
            for(var prop in style){
                returns[prop] = style[prop];
            }
            return returns;
        }
        return this.css();
    }


    $.fn.cloneWithCSS = function() {
        styles = {};

        $this = $(this);
        $clone = $this.clone();
        $clone.css( $this.getStyleObject() );

        children = $this.children().toArray();
        var i = 0;
        while( children.length ) {
            $child = $( children.pop() );
            styles[i++] = $child.getStyleObject();
            $child.children().each(function(i, el) {
                children.push(el);
            })
        }

        cloneChildren = $clone.children().toArray()
        var i = 0;
        while( cloneChildren.length ) {
            $child = $( cloneChildren.pop() );
            $child.css( styles[i++] );
            $child.children().each(function(i, el) {
                cloneChildren.push(el);
            })
        }

        return $clone
    }


//*********************

      $(".printable_link").click(function(){
        var id = $(this).closest("div").attr("id");

        var w = window.open();
        var html = $("#"+id).cloneWithCSS()
        $(w.document.body).html(html);

      });

     }
   };
}(jQuery, Drupal));
