angular.module('happathon.insight',[])

.controller( 'InsightCtrl', ['$scope', '$log',
  function InsightCtrl ( $scope, $log) {
    $log.log('InsightCtrl $scope',$scope);
  }
]);