angular.module('happathon-engine.mock-backend', [
  'ngMockE2E',
  'restangular',
  'happathon-engine.people-user',
  'happathon-engine.people-type-human',
])
.config( ['$stateProvider','$urlRouterProvider','RestangularProvider',
  function myAppConfig ( $stateProvider, $urlRouterProvider, RestangularProvider) {

    // console.log('RestangularProvider',RestangularProvider);
    // Define Restangular settings for back-end sync
    RestangularProvider.setBaseUrl('/api/v0/');
    RestangularProvider.setListTypeIsArray(false);
    RestangularProvider.setRestangularFields({
      selfLink: 'meta.updatelink'
    });
    RestangularProvider.setResponseExtractor(function(response, operation, what,something,something2) {
      // console.log('extractor response',response);
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


.run([
  'user',
  '$httpBackend',
  function happathonEngineMockBackend (user,$httpBackend) {
    // console.log('running backend module');
    $httpBackend.whenGET(/\.|tpl/g).passThrough();
    var userCopy = angular.copy(user);

    /*NOTE: $httpBackend CALLS MUST BE IN A "RUN" FUNCTION TO WORK!!!*/
    $httpBackend.whenGET(/\/api\/v0\/user/)
    .respond(function(url, data, headers){
      // console.log('responding in user whenGET: url, data, headers : ',url, data, headers);
      console.log('responding with userCopy',userCopy);
      return [200, [userCopy],{}];
    });

    $httpBackend.whenPOST(/\/api\/v0\/user/)
    .respond(function(url, data, headers){
      console.log('add people',url, data, headers);
      user.installed_tabs.happathon_app.plugins.installed[data.name]=data;
      return [200,[angular.copy(user)],{}];
    });

    $httpBackend.whenPUT(/\/api\/v0\/user/)
      .respond(function(url, data, headers){
      console.log('update people',data);
      // angular.extend(people[data.id],data);
      // return [200,[people[data.id]],{}];
    });

    $httpBackend.whenDELETE(/\/api\/v0\/user/)
    .respond(function(url, data, headers){
      // delete people[data.id];
      // return [200,[people[data.id]],{}];
    });

    // // create a different api for settings, so the app doesn't
    // $httpBackend.whenGET(/\/api\/v0\/app-data/)
    // .respond(function(url, data, headers){
    //   // var peopleID=url.match(/\/api\/v0\/app-data\/([0-9]+)?/gi);
    //   console.log('responding with app-data: url, data, headers : ',url, data, headers);
    //   console.log('responding with app-data: peopleCopiesArr[0].installed_tabs.happathon_app : ',peopleCopiesArr[0].installed_tabs.happathon_app);
    //   return [200, [peopleCopiesArr[0].installed_tabs.happathon_app],{}];
    // });

    // $httpBackend.whenPOST(/\/api\/v0\/app-data/)
    // .respond(function(url, data, headers){
    //   console.log('add people');
    //   people.push(data);
    //   return [200,people,{}];
    // });

    // $httpBackend.whenPUT(/\/api\/v0\/app-data/)
    //   .respond(function(url, data, headers){
    //   console.log('update people',data);
    //   angular.extend(people[data.id],data);
    //   return [200,[people[data.id]],{}];
    // });

    // $httpBackend.whenDELETE(/\/api\/v0\/app-data/)
    // .respond(function(url, data, headers){
    //   delete people[data.id];
    //   return [200,[people[data.id]],{}];
    // });

  }
]);
