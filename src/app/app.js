var happathon = angular.module( 'happathon', [
  'templates-app',
  'templates-common',
  // 'happathon.insight',
  // 'mockBackend',
  'ui.router',
  'ngMockE2E',
  'restangular'
])


.config( ['$stateProvider','$urlRouterProvider','RestangularProvider',
  function myAppConfig ( $stateProvider, $urlRouterProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('/api/v0/');
    RestangularProvider.setListTypeIsArray(false);
    RestangularProvider.setResponseExtractor(function(response, operation, what,something,something2) {
      // console.log('extractor response',response);
      // console.log('extractor operation',operation);
      // console.log('extractor what',what);
      // console.log('extractor something',something);
      // console.log('extractor something2',something2);
      
      return operation === 'getList' ?
        response.data[what].groups[0].items :
        response;
      
    });

    
    // super generic router for each content type
    angular.forEach(['Challenge','Insight','Form'],function(value,key){
      var lower = value.toLowerCase();
      $stateProvider
      .state({
        name:lower,
        url:'/'+lower+'/{subType}/{holonName}',
        templateUrl: function(params){
          var url = lower +'/'+params.subType + '/' + params.subType +'.tpl.html';
          console.log ('templateUrl',url);
          return url;
        },
        resolve:{
          holonDeferred:['$stateParams', 'Restangular', '$q', function($stateParams, Restangular, $q){
            var d = $q.defer();
            Restangular.one('holon',$stateParams.holonName).get()
            .then(function(result) {
              d.resolve(result);
            });
            return d.promise;
          }]
        },
        controller: value+'Ctrl'
      });
    });

    // missing urls are caught with...
    $urlRouterProvider.otherwise("/insight/status/me");
  }
])

/*Use run() to register work which should be performed when the injector is done loading all modules.*/
.run(['$httpBackend','$http',function run ($httpBackend,$http) {
  var mockData = {
    holon:{
      me:{
        id:1,
        name:'JohnDoe',
        dataSources:{
          phone:{
            manufacturer:'Samsung'
          }
        }
      },
      somerville:{
        id:2,
        name:'Somerville',
        subHolons:['me']
      }
    }
  };

  var holon;
  
  $httpBackend
  .whenGET(/\/api\//)
  .respond(function(method, url, data, headers){
    holon = mockData.holon[url.slice(url.lastIndexOf('/')+1)];
    console.log('holon',holon);
    return holon ? [200,holon,{}] : [404,false,{}];
  });

  $httpBackend.whenGET(/form|insight|challenge|tpl\.html/gi).passThrough();
}])

// these need to be split into separate files
.controller( 'InsightCtrl', ['$scope', '$log', 'Restangular', 'holonDeferred',
  function InsightCtrl ( $scope, $log, Restangular, holonDeferred) {
    // check that the 
    $log.debug($scope,$log,Restangular,holonDeferred);
    $scope.holon = holonDeferred;
  }
])

.controller('FormCtrl', ['$scope', '$log', 'Restangular', 'holonDeferred',
  function FormCtrl ($scope, $log, Restangular, holonDeferred) {
  $log.debug($scope,$log,Restangular,holonDeferred);
  $scope.holon = holonDeferred;
}])


.controller('ChallengeCtrl', ['$scope', '$log', 'Restangular', 'holonDeferred',
  function ChallengeCtrl ($scope, $log, Restangular, holonDeferred) {
  $log.debug($scope,$log,Restangular,holonDeferred);
  $scope.holon = holonDeferred;
}]);

// Scenarios
//   feed a config object to the engine, and have it create a form
//   generate a report
//   create a challenge that extends a form and generates a report
//     values
//     relationships
//     mood


// (Angular uses name-with-dashes for its custom attributes and camelCase for the corresponding directives that implements them. For controllers, Capital + camel).


//   $httpBackend.whenGET('/api/holon').respond(data.holon.me);
//   // // adds a new phone to the phones array
//   // $httpBackend.whenPOST('/phones').respond(function(method, url, data) {
//   //   phones.push(angular.fromJson(data));
//   // });
//   $httpBackend.whenGET(/tpl\.html$/).passThrough();
//   //...
// });