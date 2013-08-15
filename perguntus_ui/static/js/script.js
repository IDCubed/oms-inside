


$(document).ready(function() {


	$(".formlightbox").fancybox({
		maxWidth	: 800,
		maxHeight	: 600,
		fitToView	: false,
		width		: '70%',
		height		: '70%',
		autoSize	: true,
		closeClick	: false,
		openEffect	: 'fade',
		padding		: 5,
		closeEffect	: 'fade'
	});
	


/*
	$(".security, .phone-section, .arrow, .sample-graph").css("display", "none")


	//Need to clean this up
		$('.phone-section').delay(1000).fadeIn(500, function() {
				$('.arrow').delay(500).fadeIn(500, function() {
						$('.sample-graph').delay(1000).fadeIn(500, function() {
								$('.security').delay(1000).fadeIn(500, function() {
								        // Animation complete
								      });					   
								   });			     
						 });	      
				});      
*/


    //dropdown

	$("#chooseMenu").hide();
	var tracker = 0; //tracks whether drop down is open
    $('a.chooseArea').click(function(){
    	if (tracker == 0) {
	    	$("#chooseMenu").slideDown();
	    	tracker = 1;
	    } else {
	    	$("#chooseMenu").slideUp();
	    	tracker = 0;
	    }
    	return false;
    });
    $("body").bind("BodyClick",function() {
         $("#chooseMenu").slideUp();
         tracker = 0;
    });

	
	
	


});

