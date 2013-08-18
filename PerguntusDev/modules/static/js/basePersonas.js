OMS.Backbone.feature({
		item:'basePersona'
		,collection:'basePersonas'
		,url:'basePersonas/'
		,collection_class_selector:'.basePersonas'
		,collection_class:'basePersonas_section'
		,collection_tag:'section'
		,item_tag:'div'
		,item_class:'basePersona accordion-group'
		,collection_template_id:'#basePersonas-template'
		,item_template_id:'#basePersona-template'
		,container:'#container'
		,render_on_init:false
		,delete_selector:'#remove_basePersona'
		,first_selector:'#pn_first'
		,last_selector:'#pn_last'
		,next_selector:'#pn_next'
		,prev_selector:'#pn_prev'
		,curp_selector:'#pn_curp'
		,listdropdowns:true
		,eventlist_collection:{
			new_basePersona:{
				selector: 'button.save_basePersona_btn'
				,eaction: function new_basePersona() {
					if ($('#input_alias')[0].checkValidity()) {
						
						form_alias = $('#input_alias').val();
						var new_basePersona = new window.OMS.Model.basePersona();
						new_basePersona.set('alias', form_alias);
						new_basePersona.id = null; //ugly hack?
						//create the Trust Wrapper
						window.OMS.Data.basePersonas.create(new_basePersona);
						$('#add_basePersonas_modal').modal('hide');
					}
					return false;
				}
			}
		}
		,defaults: 
			{
				"alias":""
				,"guid":null
				,"resource_uri":""
			}
});
jQuery(function(){
	window.OMS.App.basePersonas = new OMS.Router.basePersonas()
	window.OMS.Data.basePersonas.fetch()
})