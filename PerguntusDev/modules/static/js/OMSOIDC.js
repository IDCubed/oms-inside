(function($){
	var client = 'gps-demo-client';
	var scope = 'openid,gpsdemo';
	var oidc_host = 'baset.idhypercubed.org';

	if (typeof(app_client) != undefined && app_client != '') {
		client = app_client;
	}
	if (typeof(app_scope) != undefined && app_scope != '') {
		scope = app_scope;
	}

	window.OMSOIDC = window.OMSOIDC || {};
	window.OMSOIDC = {
			options : {
				access_token:''
			},
			initialize: function initialize(){
				var hash = window.location.hash;
				if (hash != '' && hash != null) {
					lookup_access_token = hash.substr(hash.indexOf('access_token=')).split('&')[0].split('=')[1];
					if (lookup_access_token != '' && lookup_access_token != null) {
						expires_in = hash.substr(hash.indexOf('expires_in=')).split('&')[0].split('=')[1];
						if (expires_in == '' || expires_in == null) {
							expires_in = 3599;
						}
						window.OMSOIDC.options.access_token = lookup_access_token;
						window.OMSOIDC.createCookie('OMSODIC', lookup_access_token, expires_in);
						window.location.hash = '';
					}
				}
				if (window.OMSOIDC.options.access_token == '' || window.OMSOIDC.options.access_token == null) {
					window.OMSOIDC.options.access_token = window.OMSOIDC.readCookie('OMSODIC');
					if (window.OMSOIDC.options.access_token == '' || window.OMSOIDC.options.access_token == null) {
						redirect_url = "https://"+oidc_host+"/idoic/authorize?response_type=token%20id_token&client_id="+client+"&scope="+scope+"&redirect_uri="+encodeURIComponent(document.URL);
						window.location.href = redirect_url;
					}
				}
				
				if (window.OMSOIDC.options.access_token != '' && window.OMSOIDC.options.access_token != null) {
					$.ajaxSetup({
						headers: {'Authorization':'Bearer '+window.OMSOIDC.options.access_token}
					});
				}
			},
			createCookie: function createCookie(name, value, seconds) {
				var expirey = "";
			    if (seconds) {
			        var date = new Date();
			        date.setTime(date.getTime() + (seconds));
			        expirey = "; expires=" + date.toGMTString();
			    }
			    document.cookie = escape(name) + "=" + escape(value) + expirey + "; path=/";
			},
			readCookie: function readCookie(name) {
			    var nameEQ = escape(name) + "=";
			    var ca = document.cookie.split(';');
			    for (var i = 0; i < ca.length; i++) {
			        var c = ca[i];
			        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
			        if (c.indexOf(nameEQ) == 0) return unescape(c.substring(nameEQ.length, c.length));
			    }
			    return null;
			},
			eraseCookie: function eraseCookie(name) {
				window.OMSOIDC.createCookie(name, "", -1);
			}
	};
	$(function(){
		window.OMSOIDC.initialize();
	});
})(jQuery);
