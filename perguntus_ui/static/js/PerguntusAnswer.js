Perguntus.Backbone.feature({
	item:'Answer'
	,url: Perguntus_Backend+'api/v1/answer/?limit=500'
	,collection:'Answer'
});
jQuery(function(){
	window.Perguntus.App.Answer = new Perguntus.Router.Answer();
	window.Perguntus.Data.Answer.fetch();
});