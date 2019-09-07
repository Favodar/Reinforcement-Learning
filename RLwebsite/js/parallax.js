




  /*   $.fn.isInViewport = function() {
      var elementTop = $(this).offset().top;
      var elementBottom = elementTop + $(this).outerHeight();
      var viewportTop = $(window).scrollTop();
      var viewportBottom = viewportTop + $(window).height();
      return elementBottom > viewportTop && elementTop < viewportBottom;
      };
  
  
  
  
  
  var win = $(window);
  
  var allMods = $(".module");
  
  allMods.each(function(i, el) {
    var el = $(el);
    if (el.isInViewport(true)) {
      el.addClass("already-visible"); 
    } 
  });
  
  win.scroll(function(event) {
    
    allMods.each(function(i, el) {
      var el = $(el);
      if (el.isInViewport(true)) {
        el.addClass("come-in"); 
      } 
    });
    
  });
   */

  document.addEventListener("DOMContentLoaded", function() {
    Barba.Pjax.start();
    
    //Barba.Pjax.init();
    //Barba.Prefetch.init();
  });
 
var overlayed = false;
var disIsOverlayClick = false;

  function reveal(element) {
    var id = "overlay" + element.id;


    document.getElementById(id).style.visibility = "visible";    
    document.getElementById(id).style.opacity = "100";

    overlayed = true;
    disIsOverlayClick = true;
}

window.onclick = hideOverlays;

function hideOverlays(){

if(overlayed&&!disIsOverlayClick)
{
  $( ".overlay" ).css("opacity", "0");
  $( ".overlay" ).css("visibility", "hidden");

  overlayed = false;
}
else disIsOverlayClick = false;
  
  /* document.getElementsByClassName("overlay").style.opcacity = "0";
  document.getElementsByClassName("overlay").style.visibility = "hidden"; */
}
  
  $.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();
    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();
    return elementBottom > viewportTop && elementTop < viewportBottom;
    };
  
  $(window).on('resize scroll', function() {
    $('.parallax_text').each(function() {
       
      if ($(this).isInViewport()) {
        $(this).addClass("text_fade"); 
      } else {
        
      }
    });
  });
  
  
  
  
      
