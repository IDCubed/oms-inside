// providing the holon type data as a service to other modules

angular.module('happathon.holon.city',[
  'happathon.holon.base'
])
.service('holonCity', ['holonBase',function (holonBase) {
  return angular.extend({},holonBase,{
    type:'holon',
    subtype:'city',
    name_first:"default_name_first",
    name_last:"default_name_first",
    menu_title:"default_menu_title",
    is_user:false,
    providedData:[],
    email:'',
    address1:'',
    address2:'',
    phone_mobile_num:'',
    phone_alt_num:''
  });
}]);