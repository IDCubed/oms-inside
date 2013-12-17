angular.module('happathon.holon',[
])

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