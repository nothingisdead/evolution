// remap jQuery to $
(function($){})(window.jQuery);


/* trigger when page is ready */
$(document).ready(function (){
	// your functions go here
	sim = new evolution($("#sim"));
	sim.start();

});


/* optional triggers

$(window).load(function() {
	
});

$(window).resize(function() {
	
});

*/
