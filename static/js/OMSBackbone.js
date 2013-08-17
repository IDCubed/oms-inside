/**
 *  OMS Backbone MVC builder
 */

(function OMSinstantiate($){
	window.OMS = window.OMS || {
			 Model:{}
			,Collection:{}
			,View:{}
			,Router:{}
			,Data:{}
			,App:{}
			,Backbone:{}
	}

	window.OMS.Backbone.feature = function feature(objecttype){

		window.OMS.Model[objecttype.item] = Backbone.Model.extend({
			defaults: objecttype.defaults
			,urlRoot: api_base_url + objecttype.url
			,initialize: function initialize(){
				this.load_subordinates()
			}
			,load_subordinates: function load_subordinates(){
				if( ! OMS.Data[objecttype.childitems]) return false
				/**
				 * javascript does not allow key naming with variables in an object literal
				 * the square bracket notation method used below 
				 * allows us to use a variable to instantiate a key after object created
				 */
				var whereoption = {}
				;
				whereoption[objecttype.childitems_parentkey] = this.id

				this.subordinates = new OMS.Collection[objecttype.childitems](OMS.Data[objecttype.childitems].where(whereoption))
				this.subordinates.on('reset',this.updateCounts)
				return this
			}
		})

		window.OMS.Collection[objecttype.collection] = Backbone.Collection.extend({
			model: OMS.Model[objecttype.item]
			,url: api_base_url + objecttype.url
			,parse: function parse(response) {

				this.meta = response.meta
				var last_limit = parseInt(this.meta.total_count - this.meta.limit)<=0?0:parseInt(this.meta.total_count - this.meta.limit)
				;
				this.meta.first = api_base_url + objecttype.url
				this.meta.last = api_base_url + objecttype.url + '/?offset=' + parseInt((last_limit<=this.meta.limit) ? 0 : this.meta.limit )
			    return response.objects
			}
		})

		window.OMS.Data[objecttype.collection] = new OMS.Collection[objecttype.collection]()

		window.OMS.View[objecttype.item] = Backbone.View.extend({
			attributes: function(){
				if(objecttype.loads_as_dropdown){
					return { value: this.model.id }
				}
			}
			,tagName: objecttype.item_tag
			,className: objecttype.item_class
			,events: {
		        "click a.child_nav": function(e){
		        	this.load_dropdowns()
		        	this.load_children(e)
		        }
		    }
			,initialize: function initialize(){
				var that = this
				;
				_.bindAll(this, 'render')
				this.model.bind('change', this.render)
				this.model.bind('create', this.render)
				this.template = _.template($(objecttype.item_template_id).html())
				this.events["click " + objecttype.delete_selector] = function(){this.delete_record()}
				
				if(objecttype.eventlist){
					Object.keys(objecttype.eventlist).forEach(function(key){
						that.events["click " + objecttype.eventlist[key].selector] = objecttype.eventlist[key].eaction
					})
				}
				return this
				
			}
			,delete_record: function delete_record(){
				this.model.destroy({
					success:function success(){
						window.OMS.Data[objecttype.collection].fetch()
					}
				})
				return this
			}
			,load_dropdowns: function load_dropdowns(){
				if(objecttype.dropdowns){

					var itemview = new OMS.View[objecttype.dropdowns_view]({collection: objecttype.dropdowns_collection })
					;
					$(objecttype.dropdowns_selector + '-' + this.model.toJSON()['id'])
						.empty()
						.append(itemview.render().el)
				}
			}
			,load_children: function load_children(e){
				e.preventDefault()
				/*
				if(this.model.subordinates && this.model.subordinates.length==0){
					this.model.load_subordinates()
					console.log('no subordinates found, reloading')
				}
				*/
				this.model.load_subordinates()
				if(objecttype.childitems_key){
					var itemview = new OMS.View[objecttype.childitems]({collection: this.model.subordinates })
					;
					$('div.' + objecttype.childitems_class + '-' + this.model.toJSON()['id'])
						.empty()
						.append(itemview.render().el)
				}
				return this
			}
			,render: function render(options){
				$(this.el).html(this.template(this.model.toJSON()))
				return this				
			}
		})

		window.OMS.View[objecttype.collection] = Backbone.View.extend({
			tagName: objecttype.collection_tag
			,className: objecttype.collection_class
			,events: {}
			,initialize: function initialize(){
				_.bindAll(this, 'render')
				this.template = _.template($(objecttype.collection_template_id).html())
				this.collection.bind('reset', this.render)
				this.events["click " + objecttype.next_selector] = function(){this.load_page('next')}
		        this.events["click " + objecttype.prev_selector] = function(){this.load_page('previous')}
		        this.events["click " + objecttype.first_selector] = function(){this.load_page('first')}
		        this.events["click " + objecttype.last_selector] = function(){this.load_page('last')}
				return this
			}
			,update_curp: function update_curp(){
				var that = this
				;
				if(this.collection.meta){
					$(objecttype.curp_selector).text( parseInt(this.collection.meta.offset / this.collection.meta.limit) + 1 + ' / ' + 
							parseInt(
								(this.collection.meta.total_count / this.collection.meta.limit) + 
								(function(){if((that.collection.meta.total_count % that.collection.meta.limit) >0){return 1}})() 
							)
					)
				}else{
					$(objecttype.curp_selector).text('1 / 1')
				}
				return this
			}
			,load_page: function load_page(direction){
				var that = this
				;
				if(this.collection.meta[direction]){
					this.collection.url = this.collection.meta[direction]
					this.collection.fetch({
						success: function success(){
							if(objecttype.onpageload){
								objecttype.onpageload()
							}
						}
					})
					console.log(direction + ' page loaded')
				}
				return this
			}
			,render: function render(){
				
				var $items = undefined
					,collection = this.collection
					,that = this
					;

				$(this.el).html(this.template({}))
				$items = this.$(objecttype.collection_class_selector)
				$items.empty()
				collection.each(function(item){

					var view = new OMS.View[objecttype.item]({
						model: item
						,collection: collection
					})
					;
					$items.append(view.render().el)

					that.update_curp()
				})
				return this
			}
		})



		window.OMS.Router[objecttype.collection] = Backbone.Router.extend({
			routes: {
				'':'home'
				,'blank':'blank'
			}
			,initialize: function initialize(){
				if(objecttype.render_on_init){
					$(objecttype.container).each(function(){
						var view = new OMS.View[objecttype.collection]({
							collection: window.OMS.Data[objecttype.collection]
						})
						;
						$(this).append(view.render().el)
					})
				}
				return this
			}
			,home: function home(){
				return this
			}
			,blank: function blank(){
				return this
			}
		})

		

	}
})(jQuery);