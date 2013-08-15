(function($){
	"use strict"
	window.Perguntus = window.Perguntus || {
		 Model:{}
		,Collection:{}
		,View:{}
		,Router:{}
		,Data:{}
		,App:{}
		,Backbone:{}
	};
	window.Perguntus.Backbone.feature = function feature(objecttype){
		window.Perguntus.Model[objecttype.item] = Backbone.Model.extend({
			defaults: objecttype.defaults
			,urlRoot: objecttype.url
			,initialize: function initialize(){
				console.log("Model: "+objecttype.item+" Initialized");
			}
	    });
	    window.Perguntus.View['Question'] = Backbone.View.extend({
	    	el: 'body'
	    	,initialize:function() {
	    		this.render();
	    	}
	    	,render: function() {
	    		this.$el.empty();
	    		this.$el.append("<h1>Perguntus app</h1>");
	    		return this;
	    	}
	    });
	    
	    window.Perguntus.Collection[objecttype.collection] = Backbone.Collection.extend({
			model: Perguntus.Model[objecttype.item]
			,url: objecttype.url
			,parse: function parse(response) {
				console.log(response);
			    return response.objects;
			}
		});
	    
	    window.Perguntus.Data[objecttype.collection] = new Perguntus.Collection[objecttype.collection]();
	    
	    window.Perguntus.Router[objecttype.collection] = Backbone.Router.extend({
			routes: {
				'':'home'
				,'blank':'blank'
			}
			,initialize: function initialize(){
				console.log("initializing");
				if(objecttype.render_on_init){
					$(objecttype.container).each(function(){
						var view = new Perguntus.View[objecttype.collection]({
							collection: window.Perguntus.Data[objecttype.collection]
						})
						;
						$(this).append(view.render().el)
					});
				}
				return this;
			}
			,home: function home(){
				return this;
			}
			,blank: function blank(){
				return this;
			}
		})
	}
})(jQuery);