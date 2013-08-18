/**
 * TWrappers.js uses Backbone.js
 */

OMS.Backbone.feature({
	item:'TWrapper'
	,collection:'TWrappers'
	,url:'trustwrapper/'
	,collection_class_selector:'.twrappers'
	,collection_class:'twrapperscon'
	,collection_tag:'div'
	,item_class:'twrapper'
	,item_tag:'div'
	,item_template_id:'#twrapper-template'
	,collection_template_id:'#twrappers-template'
	,container:'#container'
	,render_on_init: false
	,defaults: 
		{
			 "manifestCollection":""
			,"settings":[]
			,"trustframework":[]
			,"active_task":""
			,"app_urls":""
		}
});


jQuery(function(){
	window.OMS.App.TWrappers = new OMS.Router.TWrappers()
	window.OMS.Data.TWrappers.fetch()
})
