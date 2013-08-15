Perguntus.Backbone.feature({
	item:'Question'
	,url: Perguntus_Backend+'api/v1/question/'
	,collection:'Question'
});
var mmodel;
var lat,lon;
jQuery(function(){
	window.Perguntus.App.Question = new Perguntus.Router.Question();
	if (!isNaN(parseInt(window.location.pathname[window.location.pathname.length-1]))) {
		console.log("found id");
		var id = parseInt(window.location.pathname[window.location.pathname.length-1]);
		console.log("got id: "+id);
		window.Perguntus.Data.Question.fetch({
			success: function(model, response) {
				mmodel = model;
				console.log("success");
				var asked_question = model.where({'id':id})[0];
				mmodel = asked_question;
				console.log(asked_question);
				var label,text,response_type;
				label = asked_question.get('label');
				text = asked_question.get('text');
				response_type = asked_question.get('response_type');
				render_response(response_type, text, label);
			}
		});
	} else {
		window.Perguntus.Data.Question.fetch();
	}
	//$('#submitbtn').buttonMarkup( "refresh" );
	function render_response(response_type, text, label) {
		console.log("rendering: "+response_type);
		var content = $('<div class="question"></div>');
		if (response_type == 'boolean') {
			content.append('<label for="answer">'+text+'</label>');
			content.append('<select name="answer" id="answer" data-role="slider" data-theme="a"><option value="no">No</option><option value="yes">Yes</option></select>');
		} else if (response_type == 'open') {
			content.append('<label for="answer">'+text+'</label>');
			content.append('<textarea id="answer" name="answer" class="ui-input-text ui-body-c ui-corner-all ui-shadow-inset"></textarea>');
		} else if (response_type == 'numeric') {
			content.append('<label for="answer">'+text+'</label>');
			content.append('<input type="range"  name="answer" id="answer" value="5" min="0" max="10" data-highlight="true" />');
		}
		$('#questions').html(content);
		$('#questions .question').trigger('create');
		$('#title').html(label);
		
		$('#submitbtn').click(function(e) {
			e.preventDefault();
			console.log($('#answer').val());
			answerdata = {
				questionid:	mmodel,
	    		answer: 	$('#answer').val(),
	    		latitude:	lat,
	    		longitude:	lon
	    	};
	    	newAnswer = window.Perguntus.Data.Answer.create(answerdata);
	    	//newAnswer.create(answerdata);
	    	newAnswer.on('sync', question_answered());
			console.log('submit it!');
		});
		function question_answered() {
			console.log("Answered!");
			$('.ui-content').html('<h1 style="font-size: 50px; text-align: center;">Thank you</h1>');
		}
		function getLocation() {
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(showPosition);
			} else {
				$('#geoaddress').html("Geolocation is not supported by this browser.");
			}
		}
		
		function showPosition(position) {
			lat = position.coords.latitude;
			lon = position.coords.longitude;
			$('#geoaddress').html("Latitude: " + position.coords.latitude +
			"<br>Longitude: " + position.coords.longitude);
		}
		getLocation();
		$('.dob').hide(); // hide all first
	    $('input[type="radio"]').click( function() {
	        $('.dob').hide(); // hide all on click
	        if( $(this).hasClass('show_dob') ) { // only if the radio button has a dob-field
	            $(this).nextAll('.dob:first').show(); // show only the following first
				console.log($(this).nextAll('.dob:first'));
	        }
	    });
	}
});