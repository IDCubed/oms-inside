/**
 * Persona.js uses Backbone.js
 */

 OMS.Backbone.feature({
		item:'Persona'
		,collection:'Personas'
		,url:'persona/'
		,collection_class_selector:'.personas'
		,collection_class:'personas'
		,collection_tag:'section'
		,item_class:'persona accordion-group'
		,item_tag:'div'
		,item_template_id:'#persona-template'
		,collection_template_id:'#personas-template'
		,container:'#container'
		,delete_selector:'input.pn_delete'
		,first_selector:'#pn_first'
		,last_selector:'#pn_last'
		,next_selector:'#pn_next'
		,prev_selector:'#pn_prev'
		,curp_selector:'#pn_curp'
		,render_on_init: true
		,defaults: 
			{
				"alias":"test-alias"
				,"id":0
				,"resource_uri":""
				,"trustframeworks":[]
			}
});

jQuery(function(){
	window.OMS.App.Personas = new OMS.Router.Personas()
	window.OMS.Data.Personas.fetch()
})
