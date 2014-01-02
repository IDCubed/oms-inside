angular.module( 'happathon-engine.people-type-human', [
  'happathon-engine.people-base'
])
.service('happathon-engine.people-type-human', ['happathon-engine.people-base', function (peopleBase) {
  return angular.extend({},peopleBase,{
    id:null,
    type:'people',
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
  });
}]);