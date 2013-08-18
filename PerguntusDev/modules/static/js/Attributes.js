OMS.Backbone.feature({
		item:'Attribute'
		,collection:'Attributes'
		,url:'attributes/'
		,collection_class_selector:'.attributes'
		,collection_class:'attributes_section'
		,collection_tag:'section'
		,item_tag:'div'
		,item_class:'attribute accordion-group'
		,collection_template_id:'#attributes-template'
		,item_template_id:'#attribute-template'
		,container:'#container'
		,render_on_init:false
		,loadcheckboxes:true
		,load_checkbox_div:'#persona_attributes'
		,delete_selector:'#remove_attribute'
		,first_selector:'#pn_first'
		,last_selector:'#pn_last'
		,next_selector:'#pn_next'
		,prev_selector:'#pn_prev'
		,curp_selector:'#pn_curp'
		,eventlist_collection:{
			create_new_attribute:{
				selector:'button.save_attribute_btn'
				,eaction: function create_new_attribute() {
					console.log('creating new attribute');
					if (!$('#input_attribute_desc')[0].checkValidity()) {
						return false;
					}
					if (!$('#input_attribute_label')[0].checkValidity()) {
						return false;
					}
					if (!$('#input_attribute_value')[0].checkValidity()) {
						return false;
					}
					
					description = $('#input_attribute_desc').val();
					label = $('#input_attribute_label').val();
					value = $('#input_attribute_value').val();
					var new_Attribute = new window.OMS.Model.Attribute();
					new_Attribute.set('description', description);
					new_Attribute.set('label', label);
					new_Attribute.set('value', value);
					new_Attribute.id = null; //ugly hack?
					//create the Trust Wrapper
					window.OMS.Data.Attributes.create(new_Attribute);
					$('#add_attribute_modal').modal('hide');
					
					return false;
				}
			}
		}
		,defaults: 
			{
				"description":""
				,"label":""
				,"resource_uri":""
			}
});
jQuery(function(){
	window.OMS.App.Attributes = new OMS.Router.Attributes()
	window.OMS.Data.Attributes.fetch()
})
