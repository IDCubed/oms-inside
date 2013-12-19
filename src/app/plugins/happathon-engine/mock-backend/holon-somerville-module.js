angular.module( 'happathon-engine.holon-somerville', [
  'happathon-engine.holon-type-city'
])
.service('happathon-engine.holon-somerville', ['happathon-engine.holon-type-city', function (HolonTypeCity) {
  console.log('HolonTypeCity',HolonTypeCity);
  return angular.extend({},{
    id:1,
    subtype:'city',
    name_full:"Somerville",
    menu_title:"Somerville",
  },HolonTypeCity);
}]);