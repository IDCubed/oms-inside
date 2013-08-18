jQuery(function(){
	/*window.Perguntus.App.Question = new Perguntus.Router.Question();
	if (parseInt(window.location.pathname[window.location.pathname.length-1]) != NaN) {
		console.log("found id");
		window.Perguntus.Data.Question.fetch({'id':parseInt(window.location.pathname[window.location.pathname.length-1])});
	} else {
		window.Perguntus.Data.Question.fetch();
	}*/
	window.Perguntus.Editpage = {
			render_list: function render_list() {
				console.log("rendering list");
				var row_count = 1;
				$('.active-questions-table tbody').html('');
				window.Perguntus.Data.Question.each(function(model) {
					console.log(model);
					var myRow = $('<tr id="alert-'+row_count+'"></tr>');
					row_count = row_count+1;
					
					myEditTD = $('<td class="edit"></td>');
					//myRow.append('<td class="edit"><a href="#"><img src="/static/PerguntusUI/img/icons/pencil.png"></a></td>');
					EditLink = $('<a href="#"><img src="/static/PerguntusUI/img/icons/pencil.png"></a> ').click(function(e) {
						e.preventDefault();
						///PerguntusUI/questionform.html
						var r=confirm("Editing a question will mark this question as archived.\r\nThis process cannot be undone");
						if (r==true) {
							$('.addbutton').click();
							setTimeout(function() {
								$(".fancybox-iframe").contents().find("#add_question").val(model.get('text'));
								$(".fancybox-iframe").contents().find("#graph_label").val(model.get('label'));
								console.log(model.get('response_type'));
								if (model.get('response_type') == 'open') {
									$(".fancybox-iframe").contents().find("#res_text").attr('checked', 'checked');
								} else if (model.get('response_type') == 'numeric') {
									$(".fancybox-iframe").contents().find("#res_scale").attr('checked', 'checked');
								} else {
									$(".fancybox-iframe").contents().find("#res_yesno").attr('checked', 'checked');
								} 
								$(".fancybox-iframe").contents().find("#send_time").val(model.get('send_time'));
								$(".fancybox-iframe").contents().find("#editing").val(1);
								$(".fancybox-iframe").contents().find("#archive_id").val(model.get('id'));
							}, 1000);
						}
					});
					myEditTD.append(EditLink);
					deleteLink = $('<a href="#"><img src="/static/PerguntusUI/img/icons/delete.png"></a>').click(function(e) {
						e.preventDefault();
						var r=confirm("Deleting this question will delete all answered data from the dashboard.\r\nAre you sure you want to procced?");
						if (r==true) {
							model.destroy();
						}
					});
					myEditTD.append(deleteLink);
					
					myRow.append(myEditTD);

					myRow.append('<td class="question">'+model.get('text')+'</td>');
					
					myRow.append('<td class="label">'+model.get('label')+'</td>');
					
					response_type = 'Yes or No';
					if (model.get('response_type') == 'boolean') {
						response_type = 'Yes or No';
					} else if (model.get('response_type') == 'numeric') {
						response_type = 'Scale 1-10';
					} else {
						response_type = 'Text';
					}
					
					myRow.append('<td class="response-type">'+response_type+'</td>');
					
					myRow.append('<td class="send-at">'+model.get('send_time')+' '+model.get('time_zone')+'</td>');
					if (model.get('active')) {
						myRow.append('<td>Active</td>');
					} else {
						myRow.append('<td>Archived</td>');
					}
					
					myRow.append('<td><button class="resendbtn" data-id="'+model.get('id')+'">Resend</button></td>');
							
					$('.active-questions-table tbody').append(myRow);
					
					console.log("done");
				});
				$('.resendbtn').unbind('click').click(function(e) {
					console.log("resending email");
					$.ajax({
						url: Perguntus_Backend+'send/?id='+this.dataset.id,
						dataType:'json',
						success:function(data) {
							$.fancybox.open("#message_sent");
						}
					});
				});
				console.log("done rendering");
			},
			set_form_submit: function set_form_submit(e, formRef) {
				e.preventDefault();
				if (formRef.find('#editing').val() == 0) {
			    	questiondata = {
			    		active:	true,
			    		text: formRef.find('#add_question').val(),
			    		response_type: formRef.find('input:radio[name=responsegroup]:checked').val(),
			    		label: formRef.find('#graph_label').val(),
			    		time_zone: 'EST',
			    		send_time: formRef.find('#send_time').val()
			    	};
			    	var newQuestion = new window.Perguntus.Collection.Question();
			    	newQuestion.create(questiondata);
			    	newQuestion.on('sync', window.Perguntus.Data.Question.fetch());
			    	$.fancybox.close();
			    	console.log("Saving new question!");
				} else {
					console.log("Editing question!");
					var myQuestion = window.Perguntus.Data.Question.where({id:parseInt(formRef.find('#archive_id').val())});
					console.log(myQuestion);
					myQuestion = myQuestion[0];
					myQuestion.set('active',false);
					myQuestion.save();
					
					
					questiondata = {
				    	active:	true,
			    		text: formRef.find('#add_question').val(),
			    		response_type: formRef.find('input:radio[name=responsegroup]:checked').val(),
			    		label: formRef.find('#graph_label').val(),
			    		time_zone: 'EST',
			    		send_time: formRef.find('#send_time').val()
			    	};
			    	var newQuestion = new window.Perguntus.Collection.Question();
			    	newQuestion.create(questiondata);
			    	newQuestion.on('sync', window.Perguntus.Data.Question.fetch());
			    	$.fancybox.close();
			    	console.log("Saving new question!");
				}
			}
	};
	window.Perguntus.Data.Question.on('change reset add remove', window.Perguntus.Editpage.render_list);
	
});