/**
 * Manifests.js uses Backbone.js
 */
 OMS.Backbone.feature({
		defaults: this.defaults
		,item:'ManifestColletion'
		,collection:'ManifestCollections'
		,url:'manifestCollection/'
		,collection_class_selector:'select.manifest_collection_select'
		,collection_class:'manifest_collection pull-left'
		,collection_tag:'div'
		,item_class:'manifestcollection'
		,item_tag:'option'
		,item_id: 'manifestcollection_'
		,item_template_id:'#manifestcollection-template'
		,collection_template_id:'#manifestcollections-template'
		,loads_as_dropdown: true
		,container:'#container'
		,render_on_init: false
		,defaults: 
			{
				 "active":true
				,"description":""
				,"eula":""
				,"guid":""
				,"id":""
				,"name":""
				,"resource_uri":""
			}

})
;


jQuery(function(){
	window.OMS.App.ManifestCollections = new OMS.Router.ManifestCollections()
	window.OMS.Data.ManifestCollections.fetch()
})
