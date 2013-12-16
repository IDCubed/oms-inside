angular.module( 'happathon-engine.holon-type-city', [
  'happathon-engine.holon-base'
])
.service('holonTypeCity', ['pluginBase', 'holonBase', function (pluginBase, holonBase) {
  return angular.extend({},{
    id:null,
    type:'holon',
    version: '0.0.1',
    name_first:"default",
    name_last:"default",
    menu_title:"default",
    name_full:'default'
  },holonBase,pluginBase);
}]);