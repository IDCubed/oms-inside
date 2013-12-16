angular.module( 'happathon-engine.holon-somerville', [
  'happathon-engine.holon-type-city'
])
.service('HolonSomerville', ['HolonTypeCity', function (HolonTypeCity) {
  return angular.extend({},{
    id:1,
    subtype:'city',
    name_full:"Somerville",
    menu_title:"Somerville",
  },HolonTypeCity);
}]);