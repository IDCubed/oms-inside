angular.module( 'happathon-engine.people-type-city', [
  'happathon-engine.people-base'
])
.service('happathon-engine.people-type-city', [
  'happathon-engine.people-base',
  function (peopleBase) {
    return angular.extend({},peopleBase,{
      id:null,
      type:'people',
      version: '0.0.1',
      name_first:"default",
      name_last:"default",
      menu_title:"default",
      name_full:'default'
    });
  }
]);