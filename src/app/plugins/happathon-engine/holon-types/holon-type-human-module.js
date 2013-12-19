angular.module( 'happathon-engine.holon-type-human', [
  'happathon-engine.holon-base'
])
.service('holonTypeHuman', ['happathon-engine.holon-base', function (holonBase) {
  return angular.extend({},{
    id:null,
    type:'holon',
    version: '0.0.1',
    name_first:"default",
    name_last:"default",
    menu_title:"default",
    name_full:'default',
    settings:{
      // each installed tab extends these settings
      // each installed tab can also change the default settings of its dependencies
    },
    installed_tabs:{

    }
  },holonBase);
}]);