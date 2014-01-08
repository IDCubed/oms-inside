angular.module('happathon.settings',[

])

.controller( 'PeopleCtrl', ['$scope', '$log', '$rootScope',
function ( $scope, $log, $rootScope) {

  $scope.addPeople = function(){
    console.log('do stuff when add people button clicked');

  };
  $log.log('PeopleCtrl');

  var openPeople;
// toggle menu open - only one at a time
  $scope.toggleMenu = function($index){
    $log.log('toggling $rootScope.peopleListObj[$index]', $rootScope.peopleListObj[$index]);
    var people = $rootScope.peopleListObj[$index];
    if(openPeople){
      if (openPeople === people){
        people.menuvis = openPeople = false;
        return;
      }
      openPeople.menuvis = false;
    }
    openPeople = people;
    people.menuvis = true;
  };

  $scope.switchActive = function(state,people){
    $log.log('switchActive state,people',state,people);
    $rootScope.people = people;
    $rootScope.$state.go(state);
  };
  // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  //   console.log('$stateChangeSuccess arguments',arguments);
  // });

}]);