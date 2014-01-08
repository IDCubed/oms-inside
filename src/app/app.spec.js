/* globals describe, beforeEach, inject, it, chai */

describe( 'AppCtrl', function() {
  describe( 'isCurrentUrl', function() {
    // var $location, $scope, AppCtrl;
    var expect = chai.expect;

    // beforeEach( inject( function( $controller, _$location_, $rootScope ) {
    //   $location = _$location_;
    //   $scope = $rootScope.$new();
    //   AppCtrl = $controller( 'AppCtrl', { $location: $location, $scope: $scope });
    // }));
    angular.mock.module('happathon',function(utils){
      console.log(utils);
    });


    it( 'should pass a dummy test', function() {
      expect( true ).to.be.ok;
    });
  });
});