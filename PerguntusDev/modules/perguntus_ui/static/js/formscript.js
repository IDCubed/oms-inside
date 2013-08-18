


$(document).ready(function() {

    $('#submitquestion').click(function(e) {
    	if ($('#add_question_form')[0].checkValidity())
    		window.parent.Perguntus.Editpage.set_form_submit(e, $('#add_question_form')); 	
    });
});