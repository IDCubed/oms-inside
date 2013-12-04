angular.module( 'happathon.settings', [
  'ui.router'
])

.controller( 'SettingsCtrl', ['$scope', '$log',
  function SettingsCtrl ( $scope, $log) {
    $log.log('SettingsCtrl');
  }
]);