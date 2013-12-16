angular.module('happathon.mock-backend', [
  'ngMockE2E',
  'restangular'
])
.config( ['$stateProvider','$urlRouterProvider','RestangularProvider',
  function myAppConfig ( $stateProvider, $urlRouterProvider, RestangularProvider) {

    // Define Restangular settings for back-end sync
    RestangularProvider.setBaseUrl('/api/v0/');
    RestangularProvider.setListTypeIsArray(false);
    RestangularProvider.setRestangularFields({
      selfLink: 'meta.updatelink'
    });
    RestangularProvider.setResponseExtractor(function(response, operation, what,something,something2) {
      console.log('extractor response',response);
      // console.log('extractor operation',operation);
      // console.log('extractor what',what);
      // console.log('extractor something',something);
      // console.log('extractor something2',something2);
      return operation === 'getList' ?
        response :
        response[what];
    });

  }
])
.run(['$httpBackend',function run ($httpBackend) {
  console.log('running backend module');

  $httpBackend.whenGET(/form|insight|challenge|tpl\.html/gi).passThrough();

  $httpBackend.whenGET(/\/api\/v0\/tabs/)
  .respond(function(method, url, data, headers){
    return [200, [],{}];
  });

  // $httpBackend.whenGET(/\/api\/v0\/plugins/)
  // .respond(function(method, url, data, headers){
  //   return [200, [tempPluginsObj],{}];
  // });

  // $httpBackend.whenGET(/\/api\/v0\/holons/)
  // .respond(function(method, url, data, headers){
  //   return [200, [tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  // });

  // $httpBackend.whenPOST(/\/api\/v0\/holons/)
  // .respond(function(method, url, data, headers){
  //   console.log('add holon');
  //   return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  // });

  // $httpBackend.whenPUT(/\/api\/v0\/holons/)
  //   .respond(function(method, url, data, headers){
  //   return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  // });

  // $httpBackend.whenDELETE(/\/api\/v0\/holons/)
  // .respond(function(method, url, data, headers){
  //   return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  // });
}]);
