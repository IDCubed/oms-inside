var mchart;
jQuery(function(){
	/*window.Perguntus.App.Question = new Perguntus.Router.Question();
	if (parseInt(window.location.pathname[window.location.pathname.length-1]) != NaN) {
		console.log("found id");
		window.Perguntus.Data.Question.fetch({'id':parseInt(window.location.pathname[window.location.pathname.length-1])});
	} else {
		window.Perguntus.Data.Question.fetch();
	}*/
	function showday(day) {
		//remove selected from all parent li
		//add selected to current parent li
		//var test = $('.daily-info li #' + day).parent();
		//alert(test);
		

		$('.days-in-month li').removeClass("selected");
		$('.days-in-month  li .' + day).parent().addClass("selected");
		$(".daily-info .day").hide();
		
		$('.daily-info #' + day).show();
	}
	
	window.Perguntus.Dashboard = {
			redner_graph: function redner_graph() {
				if (a_render && q_render) {
					console.log("rendering graph");
					
					var numericData = [];
					var personalLog = [];
					var features = [];
					var total_answers = 0;
					var lastlong,lastlat;
					window.Perguntus.Data.Answer.each(function(answer) {
						console.log("running on answers");
						var question_id = answer.get('questionid');
						var question = window.Perguntus.Data.Question.get(question_id);
						if (question.get('response_type') == 'numeric') {
							console.log("great!");
							var answer_date = answer.get('answer_date');
							var answer_label = question.get('label');
							var answer_answer = answer.get('answer');
							console.log(answer_label);
							if (typeof(numericData[answer_label]) == 'undefined') {
								numericData[answer_label] = [];
							}
							numericData[answer_label].push({answer_date:answer_date, answer:answer_answer});
							if (!isNaN(parseFloat(answer.get('longitude'))) && !isNaN(parseFloat(answer.get('latitude')))) {
								var feature = {
									"geometry": {
						                "type": "Point",
						                "coordinates": [
										answer.get('longitude'),
										answer.get('latitude')
										
										
										]
						            },
						            "type": "Feature",
						            "properties": {
						                "popupContent": answer_label+": "+answer.get('answer'),
									        "style": {
									            fillOpacity: parseFloat("0."+answer.get('answer'))
									        }			    
						            },
						            "id": answer.get('id')	
								};
								lastlat = answer.get('latitude');
								lastlong = answer.get('longitude');
								features.push(feature);
							}
						} else if (question.get('response_type') == 'open') {
							console.log("text question!");
							myDate = new Date(Date.parse(answer.get('answer_date')));
							myDay = myDate.getDate();
							console.log(myDay);
							if (typeof(personalLog[myDay]) == 'undefined')
								personalLog[myDay] = [];
							personalLog[myDay].push({'text':question.get('text'),'label':question.get('label'), 'answer':answer.get('answer'), 'answer_date':answer.get('answer_date')});
						} else if (question.get('response_type') == 'boolean') {
							console.log("Yes No Question! - great :)");
							var answer_date = answer.get('answer_date');
							var answer_label = question.get('label');
							var answer_answer = answer.get('answer');
							
							if (typeof(personalLog[myDay]) == 'undefined')
								personalLog[myDay] = [];
							personalLog[myDay].push({'text':question.get('text'),'label':question.get('label'), 'answer':answer.get('answer'), 'answer_date':answer.get('answer_date')});
							
							console.log(answer_label);
							if (typeof(numericData[answer_label]) == 'undefined') {
								numericData[answer_label] = [];
							}
							numericData[answer_label].push({answer_date:answer_date, answer:answer_answer});
							if (!isNaN(parseFloat(answer.get('longitude'))) && !isNaN(parseFloat(answer.get('latitude')))) {
								var feature = {
									"geometry": {
						                "type": "Point",
						                "coordinates": [
										answer.get('longitude'),
										answer.get('latitude')
										
										
										]
						            },
						            "type": "Feature",
						            "properties": {
						                "popupContent": answer_label+": "+answer.get('answer'),
									        "style": {
									            fillOpacity: parseFloat("1")
									        }			    
						            },
						            "id": answer.get('id')	
								};
								lastlat = answer.get('latitude');
								lastlong = answer.get('longitude');
								features.push(feature);
							}
						}
						
					});
					console.log(personalLog);
					listObj = $('.daily-info');
					listObj.empty();
					for (var i = 1; i<=31; i++) {
						//personalLog
						var currentTime = new Date();
						var monthNames = [ "January", "February", "March", "April", "May", "June",
						                   "July", "August", "September", "October", "November", "December" ];
						
						var structurebody = $('<div id="'+i+'" class="day"></div>');
						structurebody.append('<span class="day-label">'+monthNames[currentTime.getMonth()]+' '+i+'</span>');
						var day_survey = $('<div class="day-survey"></div>');
						var answers_per_day = 0;
						if (typeof(personalLog[i]) != 'undefined') {
							for (p_answer in personalLog[i]) {
								answers_per_day = answers_per_day+1;
								day_survey.append('<p class="record-time">Recorded '+new Date(Date.parse(personalLog[i][p_answer].answer_date)).toISOString()+'</p>'); // near <a href="#">70 western ave, cambridge ma</a></p>');
								var day_answers = $('<ul></ul>');
								day_answers.append('<span class="label">'+personalLog[i][p_answer].text+'</span><span class="result">'+personalLog[i][p_answer].answer+'</span>');
								day_survey.append(day_answers);
							}
							if (answers_per_day > 0) {
								$('#s_'+i).before('<div class="num_pop">'+answers_per_day+'</div>');
								total_answers += answers_per_day;
							}
						} else {
							day_survey.append('<h2 style="padding-top: 10px; padding-left: 20px;">No data recorded</h2>');
						}
						structurebody.append(day_survey);
						listObj.append(structurebody);
					}
					
					showday(1);
					
					$(".days-in-month li a").unbind('click').click( function() {
						var day = $(this).attr("class");
						showday(day);
						
						return false;
						
					});
					
					console.log(numericData);
					var numericKeysData = [];
					for (x in numericData) {
						console.log(x);
						var myvalues = [];
						//var d = new Date(Date.parse("2013-05-07T09:23:12.650286"))
						for (y in numericData[x]) {
							if (!isNaN(parseInt(numericData[x][y].answer))) {
								myvalues.push([new Date(Date.parse(numericData[x][y].answer_date)), parseInt(numericData[x][y].answer)]);
							}
						}
						console.log(numericData[x][y].answer_date);
						numericKeysData.push({
							"key" : x,
							"values" : myvalues
						});
					}
					console.log("numericKeysData");
					console.log(numericKeysData);
					var testdata = numericKeysData.map(function(series) {
		            	  series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
		            	  return series;
		              });
								//.map(function(series) {
					              //  series.values = series.values.map(function(d) { return {x: d[0], y: d[1] } });
					               // return series;
					              //});
	
					              
	
					              var chart;
	
					              nv.addGraph(function() {
					                  chart = nv.models.lineChart()
					              		 .x(function(d) { 
					              			//console.log(d.x);
					              			//console.log(d3.time.format("%Y-%m-%d").parse(d.x));
					              			//return d.x; 
					              			//return d3.time.format("%Y-%m-%d").parse(d.x);
					              			 return d.x;
					              			}).forceY([10,0]);
					              	chart.xAxis
					              	    .showMaxMin(true)
					              	    .tickFormat(function(d) {
					              	                     //return d3.time.format('%Y-%m-%d')(new Date(d))
					              	    					//return d;
					              	    					return d3.time.format('%b %e %H:%M')(new Date(d));
					              	                   });
	
					                  chart.xAxis.tickFormat(function(d) {
					                    return d3.time.format('%b %e %H:%M')(new Date(d));
					                  });

					                  
					                  var yScale = d3.scale.linear()
					                  .range([10, 0]);
					                  
					                  chart.yAxis.scale(yScale).tickFormat(d3.format('d'));
					                  
	
	
	
					                  d3.select('#chart1 svg')
					                      .datum(testdata)
					                    .transition().duration(500).call(chart);
	
					                  nv.utils.windowResize(chart.update);
	
					                  mchart = chart;
					                  return chart;
					              });
					              
					              
					              if (typeof(lastlat) == 'undefined')
					            	  lastlat = 32.0721054;
					              if (typeof(lastlong) == 'undefined')
					            	  lastlong = 34.7719512;
					              var map = L.map('map').setView([lastlat, lastlong], 14);



					           // note that this is my api key for cloud made 48ef4e0fd9ea4f51adf50e1705429d4e. May need to be changed

					           L.tileLayer('http://{s}.tile.cloudmade.com/48ef4e0fd9ea4f51adf50e1705429d4e/997/256/{z}/{x}/{y}.png', {
					               attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
					            	maxZoom: 18
					           }).addTo(map);

					           function onEachFeature(feature, layer) {
					           	var popupContent = " ";

					           	if (feature.properties && feature.properties.popupContent) {
					           		popupContent += feature.properties.popupContent;
					           	}

					           	layer.bindPopup(popupContent);
					           }
					           
					           var newmoodpoints = {
					        	   "type" : "FeatureCollection",
					        	   "features" : features 
					           };
					           console.log(newmoodpoints);
					           console.log(moodpoints);
					           moodpoints = newmoodpoints;
					           L.geoJson(moodpoints, {

					           			style: function (feature) {
					           				return feature.properties && feature.properties.style;
					           			},

					           			onEachFeature: onEachFeature,

					           			pointToLayer: function (feature, latlng) {
					           				console.log("feature");
					           				console.log(feature);
					           				return L.circleMarker(latlng, {
					           				 color: 'red',
					           				    fillColor: 'red'
					           				});
					           			}
					           		}).addTo(map);
					           
					$('#total_answers').html(total_answers);           
					console.log("done rendering");
				}
			},
			set_form_submit: function set_form_submit(e, formRef) {
				e.preventDefault();
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
	};
	window.Perguntus.Data.Answer.on('change reset add remove', function() {
		a_render = true;
		window.Perguntus.Dashboard.redner_graph();
	});
	window.Perguntus.Data.Question.on('change reset add remove', function() {
		q_render = true;
		window.Perguntus.Dashboard.redner_graph();
	});
	
});
var a_render=q_render=false;