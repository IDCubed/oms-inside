/**
 * OMS Console javascript
 * This module defines a form using jQuery selectors and ajax and employs some CSS from bootstrap
 * NO USE OF Backbone.js is made here
 */


(function($){
	window.OMS = window.OMS || {
		basepath:'/'
	}

	window.OMS.Console = {
		options: {
			fetched_urls:false
			,urllist: [
				 { 
					value:'>> Select One <<'
				 	,url:'#'
				 }
				 ,{
						value:'Custom Request'
						,url:''
						,data:'{"":""}'
						,method:'GET'
				 }
			]
			,init: function init(el){
				if (console_constance != '' && typeof(console_constance) != 'undefined') {
					OMS.Console.options.get_methods(console_constance);	
				}
				if (!OMS.Console.options.fetched_urls) {
					console.log("failed from constance maybe constance missing");
					OMS.Console.options.get_methods('../api/v1/');
				}
				if (!OMS.Console.options.fetched_urls) {
					console.log("failed to fetch urls!");
					var newurl=prompt("Failed to load commands from Constance and Relative Path\r\nPlease enter an API path to work with","../api/v1/");
					if (newurl!=null && newurl!="")
					  {
						OMS.Console.options.get_methods(newurl);
					  } 
				}
				var output = $('<select></select>').attr('id','ajax_url');
				output.on('change',function(){
					$('#input_host').val(OMS.Console.options.urllist[this.value].host || '')
					$('#input_url').attr('value',OMS.Console.options.urllist[this.value].url + '?limit=1000')
					//$('#input_basepath').attr('value',OMS.Console.options.urllist[this.value].basepath || OMS.basepath)
					$('#ajax_method').attr('value',OMS.Console.options.urllist[this.value].method || 'GET')
					$('#ajax_data').attr('value',OMS.Console.options.urllist[this.value].data || '')
					$('#ajax_headers').attr('value', JSON.stringify(OMS.Console.options.urllist[this.value].headers) || '' )
				})
				window.OMS.Console.options.urllist.forEach(function(item,index,arr){
					output.append($('<option value="' + index + '">' + item.value + '</option>'))
				},el)
				return output
			}
			,get_methods: function get_methods(url) {
				$.ajax({
					url:url
					,dataType:'json'
					,async:false
					,success:function(data) {
						OMS.Console.options.fetched_urls = true;
						console.log("done loading scheme");
						console.log(data);
						for (sname in data) {
							console.log("adding sname: "+sname);
							$.ajax({
								url:data[sname].schema
								,dataType:'json'
								//,async:false
								,success:function(sdata) {
									var output = $('#ajax_url');
									var optgrp = $('<optgroup label="' + sname + '"></optgroup>');
									for (allowed_list in sdata.allowed_list_http_methods) {
										var last_count = OMS.Console.options.urllist.length;
										console.log("running on: "+sdata.allowed_list_http_methods[allowed_list]);
										if (sdata.allowed_list_http_methods[allowed_list] == 'get') {
											console.log("appending to optgrp: "+allowed_list);
											optgrp.append('<option value="' + last_count + '">' + sdata.allowed_list_http_methods[allowed_list] + ' ' + sname + ' list</option>');
											OMS.Console.options.urllist[last_count] = {url:data[sname].list_endpoint, method:sdata.allowed_list_http_methods[allowed_list].toUpperCase()};
										}
									}
									for (allowed_detail in sdata.allowed_detail_http_methods) {
										var last_count = OMS.Console.options.urllist.length;
										if (sdata.allowed_detail_http_methods[allowed_detail] == 'post') {
											optgrp.append('<option value="' + last_count + '">' + sdata.allowed_detail_http_methods[allowed_detail] + ' new ' + sname + '</option>');
											var post_fields = {};
											for (field_name in sdata.fields) {
												if (!sdata.fields[field_name].blank) {
													post_fields[field_name] = '';
												}
											} 
											OMS.Console.options.urllist[last_count] = {data: JSON.stringify(post_fields).replace('settings":""','settings":[]'), url:data[sname].list_endpoint, method:sdata.allowed_detail_http_methods[allowed_detail].toUpperCase()};
										} else if (sdata.allowed_detail_http_methods[allowed_detail] == 'delete') {
											optgrp.append('<option value="' + last_count + '">' + sdata.allowed_detail_http_methods[allowed_detail] + ' ' + sname + '</option>');
											OMS.Console.options.urllist[last_count] = {url:data[sname].list_endpoint, method:sdata.allowed_detail_http_methods[allowed_detail].toUpperCase()};
										}
									}
									output.append(optgrp);
								}
							});
						}
					}
				});
			}
		}
		,methods: {
			list: ['GET','POST','PUT','PATCH','DELETE']
			,init: function init(){
				var output = $('<select></select>').attr('id','ajax_method')
				window.OMS.Console.methods.list.forEach(function(item,index,arr){
					output.append($('<option value="' + item + '">' + item + '</option>'))
				})
				return output
			}
		}
		,hosts:{
			list: [
				{
					host:''
					,name:'thishost'
				}
			]
			,init: function init(){
				var output = $('<select></select>').attr('id','input_host')
				window.OMS.Console.hosts.list.forEach(function(item,index,arr){
					output.append($('<option value="' + item.host + '" ' + (item.host==''?'selected':'') + '>' + item.name + '</option>'))
				})
				return output
			}
		}
		/**
		 *  initialize method uses bootstrap and jquery to style a form
		 *  per http://twitter.github.com/bootstrap/base-css.html
		 */
		,initialize: function initialize(){
			

			$('#container')
				.append(
					$('<form></form>')
						//.addClass('form-horizontal')
						.append(
							$('<fieldset></fieldset>')
								.append(
									$('<legend></legend>').text('Test Console')
								)
								.append(
									$('<div></div>')
										.addClass('controls controls-row')
										.append(
											$('<div></div>')
												.addClass('pull-left span3')
												.append(
									 				$('<label></label>')
									 					.addClass('control-label')
									 					.attr('for','ajax_url')
									 					.text('Actions:')
									 			)
									 			.append(
									 				window.OMS.Console.options.init(this)
									 			)
										)
							 			
							 	
							 			.append(
											$('<div></div>')
												.addClass('pull-left span3')
												.append(
									 				$('<label></label>')
									 					.addClass('control-label')
									 					.attr('for','ajax_method')
									 					.text('choose http method:')
									 			)
									 			.append(
									 				window.OMS.Console.methods.init()
									 			)
										)
							 			
							 	)
								.append(
									$('<div></div>')
										.addClass('controls controls-row')
										
									 	.append(
									 		$('<div></div>')
									 			.addClass('control-group pull-left span3')
									 			.append(
									 				$('<label></label>')
									 					.addClass('control-label')
									 					.attr('for','input_url')
									 					.text('Action URL:')
									 			)
									 			.append(
									 				$('<input></input>')
									 					.attr('id','input_url')
									 					.attr('type','text')
									 					.addClass('input-xxlarge')
									 			)
									 	)
								 )
							 	.append(
							 		$('<div></div>')
							 			.addClass('control-group span12 pull-left')
							 			.append(
							 				$('<label></label>')
							 					.addClass('control-label')
							 					.attr('for','ajax_headers')
							 					.text('headers:')
							 			)
									 	.append(	
									 		$('<textarea></textarea>')
									 			.attr('id','ajax_headers')
									 			.attr('rows','2')
									 			.addClass('span10')
									 			.attr('placeholder','{"":""}')
									 	)
							 	)
							 	.append(
							 		$('<div></div>')
							 		.addClass('control-group span12 pull-left')
							 		.append(
							 				$('<label></label>')
							 					.addClass('control-label')
							 					.attr('for','add_auth')
							 					.text('Authorization Header')
							 			)
									 	.append(	
									 		$('<textarea></textarea>')
									 			.attr('rows','2')
									 			.attr('id','add_auth')
									 			.addClass('span10')
									 	)
							 	)
							 	.append(
							 		$('<div></div>')
							 			.addClass('control-group span12 pull-left')
							 			.append(
							 				$('<label></label>')
							 					.addClass('control-label')
							 					.attr('for','ajax_data')
							 					.text('data for POST/PUT/PATCH methods:')
							 			)
									 	.append(	
									 		$('<textarea></textarea>')
									 			.attr('id','ajax_data')
									 			.attr('rows','2')
									 			.addClass('span10')
									 			.attr('placeholder','{"":""}')
									 	)
							 	)
							 	
							 	.append(
							 		$('<div></div>')
							 			.addClass('control-group span2')
							 			.append(
									 		$('<input></input>')
									 			.attr('type','submit')
									 			.addClass('btn btn-inverse btn-small')
									 			.attr('value','Send')
									 			.on('click',function clicked_send(){
									 				console.log('sending request: ' + $('#input_url').attr('value'))
									 				$('#ajax_results')
									 					.text('Processing ....')
									 					.removeClass('text-error')
									 					.removeClass('text-success')
									 				$('#ajax_raw').empty()
									 				$.ajax({
										 				//url: $('#input_host').attr('value') + $('#input_basepath').attr('value') + $('#input_url').attr('value')
									 					url: $('#input_url').attr('value')
										 				,type: $('#ajax_method').attr('value') || 'GET'
										 				,data: $('#ajax_data').attr('value') || ''
										 				,headers: (function(){
										 					if ($('#add_auth').val() != '') {
										 						return {'Authorization':$('#add_auth').val()};
										 					}
										 				})()
										 				,contentType: 'application/json; charset=UTF-8'
										 				,success: function ajax_success(data,status,xhr){
										 					console.log(data)
										 					$('#ajax_results')
										 						.text(JSON.stringify(data,undefined,2))
										 						.addClass('text-success')
										 				}
										 				,error: function ajax_failure(xhr,status,thrown){
										 					console.log(xhr)
										 					$('#ajax_results')
										 						.text('ERROR: ' + xhr.status + ' - ' + thrown)
										 						.addClass('text-error')
										 					$('#ajax_raw').text(xhr.responseText)
										 					return false
										 				}
									 				})
									 				return false
									 			})
									 	)
							 	)
							 	.append(
							 		$('<br/>')
							 	)
							 	.append(
							 		$('<pre></pre>')
							 			.attr('id','ajax_results')
							 			.addClass('span10 pre-scrollable')
							 			
							 	)
							 	.append(
							 		$('<pre></pre>')
							 			.attr('id','ajax_raw')
							 			.addClass('span10')
							 			
							 	)
					 			
						)
				 )
		}

	}

	$(function load_console_script(){
		window.OMS.Console.initialize();
	})

 	

})(jQuery)
