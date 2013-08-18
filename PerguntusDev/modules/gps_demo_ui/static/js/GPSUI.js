(function($){
	window.GPSUI = window.GPSUI || {
		positions:null
		,map:null
	};
	window.GPSUI = {
			pull_positions: function pull_positions() {
				//pull the data from the backend
				$.ajax({
					url: resource_endpoint+"api/v1/location/?limit=500"
					,type:'GET'
					,dataType:'json'
					,headers: {'Authorization':'Bearer eyJhbGciOiJSUzI1NiJ9.eyJleHAiOjEzNjc5OTExNzcsImF1ZCI6WyJncHMtZGVtby1jbGllbnQiXSwiaXNzIjoiaHR0cHM6XC9cL2Jhc2V0LmlkaHlwZXJjdWJlZC5vcmdcL2lkb2ljXC8iLCJqdGkiOiJlNTMxMjMwMi02YjFkLTQwMTAtYjA0ZS1mYmM0N2JlOGZmYTEiLCJpYXQiOjEzNjc5ODc1Nzd9.uaGwnWCjT56m59eTaw-C_jHcwhl_hplt3hFISqmttV-th9tKCKUcnALq2dcN41IP5V7xHyx-Q_qSyUoVeYhEiNTaCjnTBbfKP8lDf22Fhe0DQv-qTM_b1H2cZ0HdDr3RqeISyUSXHkLUzwgpQX9b_mOKWoSll20KCc9aLPSAOYk'}
			 	})
				.done(function(data) { 
					console.log(data.objects)
					if (data.objects.length >= 1) {
						window.GPSUI.createMap(data.objects)
					} else {
						console.log("Not location data objects found")
					}
				});
			}
			,createMap: function createMap(location_objects) {
				console.log("createMap called");
				var first_location = location_objects[0]; 
				var centerMap = new google.maps.LatLng(first_location.latitude,first_location.longitude);
				var mapOptions = {
						zoom: 16,
						mapTypeId: google.maps.MapTypeId.HYBRID,
						center: centerMap
				};
				map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
				window.GPSUI.dropLocationPins(location_objects);
			}
			,dropLocationPins: function dropLocationPins(location_objects) {
				console.log("dropLocationPins called");
				//make sure there are more than 2 positions or only show one positions
				if (location_objects.length >= 2) {
					for (var i = 0; i < location_objects.length; i++) {
						setTimeout(function() {
							window.GPSUI.addMarker(location_objects);
						}, 200 * i);
					}
				} else {
					//only one pin!
				}
			}
			,addMarker: function addMarker(location_objects) {
				console.log("addMarker called");
				var new_marker = new google.maps.Marker({
			          position: new google.maps.LatLng(location_objects[iterator].latitude, location_objects[iterator].longitude),
			          map: map,
			          draggable: false,
			          animation: google.maps.Animation.DROP
			          });
				iterator++;
				if (iterator >= location_objects.length) {
					$('#beachModal').modal('hide');
					$('#myModal').modal();
					google.maps.event.addListener(new_marker, 'click', function() {
						$('#myModal').modal();
			  	    });
			    }
			}
			,initialize: function initialize() {
				//start the app
				window.GPSUI.pull_positions();
			}
	};
	$(function(){
		window.GPSUI.initialize();
	});	
})(jQuery);
var iterator = 0;
var map;