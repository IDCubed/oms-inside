(function($){
	window.OMS = window.OMS || {
		basepath:'/portal_registry/',
		
	}
	window.OMS.status = null;
	window.OMS.streaming = false;
	window.OMS.Welcome = {
			options: {
				
			}
			,start_interval: function start_interval() {
				myInterval = setInterval(function() {
					window.OMS.Welcome.check_status()
				}, 2000)
			}
			,check_status: function check_status(){
				if (window.OMS.status != 'C') {
					$.ajax({
						url: window.OMS.basepath+"api/v1/task/"+task_id+"?format=json"
						,cache: false
						,dataType: "json"
					}).done(function( json ) {
						window.OMS.status = json['status'] 
						if (json['status'] == 'C') {
							eval("var return_data = "+json['return_value']); //BAD
							$('#deplpoylogs').append(return_data.deploy_log+'\r\n');
							clearInterval(myInterval)
							$('#loading_anim').css('display','none');
							var links_list = $('<ul></ul>');
							for (app_name in return_data.app_urls) {
								//var redirect_link = return_data.app_urls.private_registry;
								links_list.append('<li><a href="'+return_data.app_urls[app_name]+'">Click here to go to your '+app_name+'</a>');
							}
							$('#trusttext').html('Your Trust Framework is now deployed!<br />');
							$('#trusttext').append(links_list);
							if (!$('#showlogsbtn').prop('checked')) {
								document.location.href = redirect_link;
							}
						}
					})
				}
			}
			,initialize: function initialize(){
				window.OMS.Welcome.start_interval()
			}
	}
	$('#showlogsbtn').click(function(e) {
		if ($(this).prop('checked')) {
			$('#showlogs').css('display','block')
			if (!window.OMS.streaming) {
				var socket = io.connect(stream_url, { resource: stream_resource })
				socket.on('news', function (data) {
					parsed = $.parseJSON(data);
					$('#deplpoylogs').append('['+parsed['@timestamp']+'] - '+parsed['@message']+'\r\n');
				});
			}
		} else {
			$('#showlogs').css('display','none')
		}
	})
	$(function(){
		window.OMS.Welcome.initialize()
	})
})(jQuery)
