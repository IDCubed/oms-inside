angular.module('happathon.mock-backend', [
  'ngMockE2E',
  'happathon.holon',
  'happathon.plugin'
])

/*Use run() to register work which should be performed when the injector is done loading all modules.*/
.run(['$httpBackend','holonGenerator',function run ($httpBackend,holonGenerator) {
  console.log('running backend module');
  $httpBackend.whenGET(/\/api\//)
  .respond(function(method, url, data, headers){
    console.log('responding to backend call');
    var holons = [];

    holons.push(holonGenerator({
      subtype:'human',
      name_first:"Adam",
      name_last:"Laughlin",
      menu_title:"Me",
      id:0,
      is_user:true,
      meta:{ // self referencing link for put/delete
        updatelink:"/holons/0/"
      }
    }));
    holons.push(holonGenerator({
      subtype:'city',
      id:1,
      name:"Somerville",
      menu_title:"Somerville"
    }));
    return [200,holons,{}];
  });

  $httpBackend.whenGET(/form|insight|challenge|tpl\.html/gi).passThrough();

}])

.service('holonGenerator', ['holonCity','holonHuman', function (holonCity, holonHuman) {
  console.log('running holonGenerator in main', holonCity);
  return function(configObj){
    var t = configObj.subtype;
    if(!t){
      throw 'the object passed to holonGenerator must contain a "subtype" property';
    }
    var generator = t === 'city' ?
      holonCity :
      holonHuman;

    return angular.extend({}, generator, configObj);
  };

}]);

//TODO: add insight and challenge generators

  // $httpBackend.whenGET(/\/api\/holon\/[a-zA-Z]/)
  // .respond(function(method, url, data, headers){
  //   holon = mockData.holon[url.slice(url.lastIndexOf('/')+1)];
  //   console.log('holon',holon);
  //   return holon ? [200,holon,{}] : [404,false,{}];
  // });


