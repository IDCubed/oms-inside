angular.module('happathon.challenge', [

])
.controller( 'ChallengeCtrl', ['$scope', '$log',
  function ChallengeCtrl ( $scope, $log) {
    $log.log('ChallengeCtrl');
  }
]);
