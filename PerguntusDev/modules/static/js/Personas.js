OMS.Backbone.feature({
		item:'Persona'
		,collection:'Personas'
		,url:'personas/'
		,collection_class_selector:'.personas'
		,collection_class:'personas_section'
		,collection_tag:'section'
		,item_tag:'div'
		,item_class:'persona accordion-group'
		,collection_template_id:'#personas-template'
		,item_template_id:'#persona-template'
		,container:'#container'
		,render_on_init:false
		,delete_selector:'#remove_persona'
		,first_selector:'#pn_first'
		,last_selector:'#pn_last'
		,next_selector:'#pn_next'
		,prev_selector:'#pn_prev'
		,curp_selector:'#pn_curp'
		,eventlist_collection:{
			create_new_persona:{
				selector:'button.save_Persona_btn'
				,standalone:true
				,eaction: function create_new_attribute() {
					console.log("creating Persona!");
					if (!$('#input_basePersona')[0].checkValidity()) {
						return false;
					}
					if (!$('#input_desc')[0].checkValidity()) {
						return false;
					}
					if (!$('#input_label')[0].checkValidity()) {
						return false;
					}
					//Need to check that atleast one checkbox is marked in persona_attributes and persona_scopes
					persona_attributes = [];
					persona_scopes = [];
					$('#persona_attributes input:checkbox:checked').each(function() {
						persona_attributes.push($(this).val());
					});
					$('#persona_scopes input:checkbox:checked').each(function() {
						persona_scopes.push($(this).val());
					});
					if (persona_scopes.length <= 0) {
						return false;
					}
					if (persona_attributes.length <= 0) {
						return false;
					}
					basePersona = $('#input_basePersona').val();
					desc = $('#input_desc').val();
					label = $('#input_label').val();
					
					var new_Persona = new window.OMS.Model.Persona();
					new_Persona.set('attributes', persona_attributes);
					new_Persona.set('scopes', persona_scopes);
					new_Persona.set('base_persona', basePersona);
					new_Persona.set('description', desc);
					new_Persona.set('label', label);					
					new_Persona.id = null; //ugly hack?
					//create the Trust Wrapper
					window.OMS.Data.Personas.create(new_Persona);
					$('#add_Personas_modal').modal('hide');
					
					return false;
				}
			}
		}
		,defaults: 
			{
				"attributes":[]
				,"base_persona":null
				,"description":""
				,"label":""
				,"resource_uri":""
				,"scopes":[]
			}
});
jQuery(function(){
	window.OMS.App.Personas = new OMS.Router.Personas()
	window.OMS.Data.Personas.fetch()
})
