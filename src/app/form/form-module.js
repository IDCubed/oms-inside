angular.module('happathon.form', [
  'happathon-engine'
])
// this needs to be moved into the happathon engine
.controller( 'FormCntrl', ['$scope', '$log',
  function FormCntrl ( $scope, $log) {
    $log.log('FormCntrl');
  }
])

// this needs to be moved into the happathon engine
.controller( 'QuestionCtrl', ['$scope', '$log',
  function QuestionCtrl ( $scope, $log) {
    $log.log('QuestionCtrl');
  }
]);