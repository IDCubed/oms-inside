angular.module('happathon.holon',[
  "happathon.holon.city",
  "happathon.holon.human",
  "happathon.holon.base",
  'restangular',
  'ui.router',
  'restangular',
  'ngMockE2E',
  'happathon.mock-backend'
])

// when this runs, it should get the data and extend city holon objects with
// custom configs from the database
.service('holonApiPromise', ['Restangular', '$q', function (Restangular,$q) {
  // console.log('running holonData in main', Restangular,$q);
  var d = $q.defer();
  var holonsObj = Restangular.all('holons');
  // console.log('holonsObj',holonsObj);
  // TODO: Cache last known holonList locally for faster render.
  holonsObj.getList()
  .then(function (holonList) {
    // make copies we can use for modifying/displaying
    // return those in an object along with with functions to update original
    // console.log('resolving');
    var obj = {
      'list':angular.copy(holonList),
      'active':angular.copy(holonList[0]),
      // make an api for updating... to shortcut/curry restangular functions
      'create':function(){},
      'read':function(){},
      'update':function(){},
      'destroy':function(){}
    };
    d.resolve(obj);
  });
  return d.promise;

}])



.controller( 'HolonCtrl', ['$scope', '$log', '$rootScope',
function HolonCtrl ( $scope, $log, $rootScope) {

  $scope.addHolon = function(){
    console.log('do stuff when add holon button clicked');

  };
  $log.log('HolonCtrl');

  var openHolon;
// toggle menu open - only one at a time
  $scope.toggleMenu=function($index){
    $log.log('toggling $rootScope.holons[$index]', $rootScope.holons[$index]);
    var holon = $rootScope.holons[$index];
    if(openHolon){
      if (openHolon === holon){
        holon.menuvis = openHolon = false;
        return;
      }
      openHolon.menuvis = false;
    }
    openHolon = holon;
    holon.menuvis = true;
  };

  $scope.switchActive = function(state,holon){
    $log.log('switchActive state,holon',state,holon);
    $rootScope.activeHolon = holon;
    $rootScope.$state.go(state);
  };
  // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  //   console.log('$stateChangeSuccess arguments',arguments);
  // });

}])
.controller('MenuCtrl', ['$rootScope','$scope', '$log', 'holons',
  function MenuCtrl ($rootScope,$scope, $log, holons) {
  console.log('MenuCtrl',holons);
  $scope.holons = holons.list;//holonDataPromise.activeHolon;
  $scope.holon = holons.active;//holonDataPromise.activeHolon;


}]);