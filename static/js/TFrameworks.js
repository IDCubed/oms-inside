/**
 * TFrameworks.js uses Backbone.js
 */

OMS.Backbone.feature({
	item:'TFramework'
	,collection:'TFrameworks'
	,url:'trustframework/'
	,childitems:'TWrappers'
	,childitems_key:'trustwrappers'
	,childitems_parentkey:'trustframework'
	,childitems_class:'twrappers'
	,collection_class_selector:'.tframeworks'
	,collection_class:'tframeworks'
	,collection_tag:'section'
	,item_class:'tframework accordion-group'
	,item_tag:'div'
	,item_template_id:'#tframework-template'
	,collection_template_id:'#tframeworks-template'
	,container:'#container'
	,dropdowns: true
	,dropdowns_selector:'div.mf_install'
	,dropdowns_view: 'ManifestCollections'
	,dropdowns_collection: OMS.Data.ManifestCollections
	,delete_selector:'input.tf_delete'
	,first_selector:'#tf_first'
	,last_selector:'#tf_last'
	,next_selector:'#tf_next'
	,prev_selector:'#tf_prev'
	,curp_selector:'#tf_curp'
	,render_on_init: true
	,onpageload: function onpageload(){
		window.OMS.App.ManifestCollections = new OMS.Router.ManifestCollections()
	}
	,eventlist: {
		install: {
			selector:'button.btn-install'
			  ,eaction: function populateEULA(){
				var that = this
				,EULAText = '<p>This Manifest collects the following data<br /><ul><li>GPS waypoints</li><li>You will be sharing anonymized GPS waypoints with a secured Trusted Compute Cell (TCC). The TCC will be managed by the group leader. You can leave the group at any time and any computed results based off your data will no longer be available to anyone else.</li><li>This Manifest installs a Web Application that allows you to receive location aware, contextual offers based off your previous purchasing habits- synced with all of your mobile devices.</li><li>By clicking the \'I Agree\' button, you acknowledge that you have read and agree to the EULA</li></ul></p>'
				,eulaid = $(that.el).find('select.manifest_collection_select').attr('value')
				,myTW = null;
				thatRef = this;
				myManifestCol = window.OMS.Data.ManifestCollections.get(eulaid)
				$('#EULAModal').modal()
				$('#myModalLabel').html(myManifestCol.get('name') + ' End-User License Agreement')
				var loading_img = $('<img />').prop({'src':'/static/portal_registry/img/loading_animation.gif', 'width':'50', 'height':'50'})
				$('#myModalBody').html(loading_img)
				//window.OMS.Data.Manifests.models[1].attributes.active
				//get te EULA
				var eulaURL = myManifestCol.get('eula');
				$.ajax({
					 type: "GET"
					 ,url: eulaURL
					 ,dataType: "json"
					 ,async: false
				}).done(function(data) {
					EULAText = data.text;
				});
				$('#myModalBody').html(EULAText)
				$('#btn-agreed').unbind("click").click(function(e) {
					
					$('#EULAModal').modal('hide')
					//need to start the wizard
					//then the normal
					$('#myModalMessage').modal('show');
					
					$('#new_continue_btn').unbind("click").click(function(e) {
						$('#myModalMessage').modal('hide');
					
						$('#PersonaModalTitle').html('Create your '+myManifestCol.get('name')+' Persona');
						$('#myModal').modal('show');
	                    
						activateWizard();
						
						
						/*
						
						$('#WelcomeModal').modal()
						$('#WelcomeModalBody').html(loading_img)
						$('#WelcomeModalBody').append("<br />Your Trust Wrapper is being deployed.<br />")
						$('#WelcomeModalBody').append("Please wait a few moments.<br />")
						$('#WelcomeModalLabel').html(myManifestCol.get('name'));
						window.setTimeout(function() {
							window.OMS.Data.TFrameworks.start_delayed(that);
						}, 2000);
						*/
					});
					
				})
			}
			
		}
	}
	,defaults: 
		{
			"registry_url":""
			,"resource_uri":""
			,"settings":[]
			,"trustwrappers":[]
			,"user":""
		}
});

jQuery(function(){
	window.OMS.App.TFrameworks = new OMS.Router.TFrameworks()
	window.OMS.Data.TFrameworks.fetch()
	//adding a function to the Manifests Object
	window.OMS.status = null
		,window.OMS.count = 0
		,window.OMS.myInterval = null;
	window.OMS.Data.TFrameworks.start_delayed = function(that) {
		console.log("start_delayed called");
		var myTW = window.OMS.Data.TWrappers.last();
		//start pulling for the task status of the TW deploy
		window.OMS.Data.TFrameworks.start_interval(that, myTW);
	};
	window.OMS.Data.TFrameworks.start_interval = function(that, myTW) {
		console.log("start_interval called");
		window.OMS.status = null;
		window.OMS.myInterval = setInterval(function() {
			window.OMS.Data.TFrameworks.check_status(that, myTW);
		}, 3000);
	};
	window.OMS.Data.TFrameworks.check_status = function(that, myTW) {
		console.log("check_status called");
		console.log(myTW.get('active_task'));
		task_status_url = myTW.get('active_task')
		app_urls = myTW.get('app_urls')
		console.log(task_status_url);
		if (task_status_url != '') {
			if (window.OMS.status != 'C') {
				$.ajax({
					url: task_status_url
					,cache: false
					,dataType: "json"
				}).done(function( json ) {
					window.OMS.status = json['status'] 
					if (json['status'] == 'C') {
						clearInterval(window.OMS.myInterval)
						window.OMS.Data.TWrappers.last().fetch({success:function(model) {
							console.log('yay');
							eval('app_urls = '+model.get('app_urls')); //VERY BAD!!!!!!
							$('#WelcomeModalBody').html('<p>Your Trust Wrapper is deployed!</p>');
							$('#WelcomeModalBody').append('<p><a href="#" id="showlogs">Click here to see logs</a></p>');
							$('#WelcomeModalBody').append('<p id="logsholder" style="display: none;"><textarea style="width: 100%; height: 150px; font-size: 10px;" id="deplpoylogs" readonly="readonly" rows="10" cols="40">'+json['return_value']+'</textarea><br /></p>');
							var socket = io.connect('http://registry.idhypercubed.org:2338');
							socket.on('news', function (data) {
								parsed = $.parseJSON(data);
								$('#deplpoylogs').append('['+parsed['@timestamp']+'] - '+parsed['@message']+'\r\n');
							});
							$('#showlogs').unbind('click').click(function(e) {
								if ($('#logsholder').css('display') == 'none') {
									$('#logsholder').css('display','block')
								} else {
									$('#logsholder').css('display','none')
								}
							})
							console.log(app_urls);
							console.log(typeof app_urls);
							console.log(app_urls);
							if (app_urls == null || app_urls == '' || app_urls == 'null') {
								$('#WelcomeModalBody').append('<p>There were no app urls assosicated with this TW</p>')
							} else {
								for (var app_url in app_urls) {
									$('#WelcomeModalBody').append('<p>Click here to go to your <a href="'+app_urls[app_url]+'">'+app_url+'</a></p>')
								}
							}
							$(that.el).find('.twrappers').append('<div class="twrapper"><dl class="dl-horizontal well"><dt>name:</dt><dd>'+myTW.get('alias')+'&nbsp;</dd><dt>portal url:</dt><dd>'+myTW.get('trustframework')+'&nbsp;</dd><dt>id:</dt><dd>'+myTW.get('id')+'&nbsp;</dd><dt>manifest:</dt><dd><a href="?format=json">'+myTW.get('manifestCollection')+'</a>&nbsp;</dd><dt>resources_uri:</dt> <dd><a href="'+myTW.get('resource_uri')+'">'+myTW.get('resource_uri')+'</a>&nbsp;</dd><dt>settings:</dt><dd>&nbsp;</dd></dl></div>')
						}});
					}
					if (json['status'] == 'F') {
						clearInterval(window.OMS.myInterval);
						console.log("failed!");
						$('#WelcomeModalBody').html('<p>Your Trust Wrapper has failed to deploy!</p>');
						$('#WelcomeModalBody').append('<h5>Traceback:</h5>');
						$('#WelcomeModalBody').append('<p><pre>'+json['error']+'</pre></p>');
					}
				})
			}
		} else {
			clearInterval(window.OMS.myInterval);
			console.log("no active_task....")
			$('#WelcomeModalBody').html('<p>Your Trust Wrapper has failed to deploy!</p>');
			$('#WelcomeModalBody').append('<p>No active_task available to determine the status of the deployment!</p>');
		}
		/*
		if (window.OMS.count >= 5) {
			clearInterval(window.OMS.myInterval)
			$('#WelcomeModalBody').html('<p>Your Trust Wrapper is deployed!</p>');
			$('#WelcomeModalBody').append('<p>Click here to go to your <a href="#">Trust Wrapper Portal</a></p>')
			$('#WelcomeModalBody').append('<h4>Trust Wrapper Details:</h4>')
			$('#WelcomeModalBody').append("<div id='GUIpage'><a href='http://kodkod.idhypercubed.org:8080'>Click here to go to the GPS Demo GUI</a></div>")
			window.OMS.count = 0;
			$(that.el).find('.twrappers').append('<div class="twrapper"><dl class="dl-horizontal well"><dt>name:</dt><dd>'+$(that.el).find('select.manifest_select option:selected').text()+'&nbsp;</dd><dt>portal url:</dt><dd>1&nbsp;</dd><dt>id:</dt><dd>1&nbsp;</dd><dt>manifest:</dt><dd><a href="?format=json"></a>&nbsp;</dd><dt>resources_uri:</dt> <dd><a href="/private_registry/api/v1/trustwrapper/1/?format=json">/private_registry/api/v1/trustwrapper/1/</a>&nbsp;</dd><dt>settings:</dt><dd>&nbsp;</dd></dl></div>')
		}
		window.OMS.count++*/
	}
})
