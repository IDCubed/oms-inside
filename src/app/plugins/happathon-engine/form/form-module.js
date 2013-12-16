// receives config objects and generates json

angular.module('happathon-engine.form', [])
// this needs to be moved into the happathon engine
.controller( 'FormCtrl', ['$scope', '$log',
  function FormCntrl ( $scope, $log) {
    $log.log('FormCtrl');
  }
])

// this needs to be moved into the happathon engine
.controller( 'QuestionCtrl', ['$scope', '$log',
  function QuestionCtrl ( $scope, $log) {
    $log.log('QuestionCtrl');
  }
]);