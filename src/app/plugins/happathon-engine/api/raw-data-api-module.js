//auth
//form
//holon
// routing
// settings

angular.module( 'happathon-engine.holon-api', [
  'restangular'
])
.service('holonApiPromise', ['Restangular', '$q', function (Restangular,$q) {
  // console.log('running holonData in main', Restangular,$q);
  var d = $q.defer();
  var holonsObj = Restangular.all('holons');
  // console.log('holonsObj',holonsObj);
  // TODO: Cache last known holonList locally for faster render.
  holonsObj.getList()
  .then(function (holonList) {
    // make copies we can use for modifying/displaying
    // return those in an object along with with functions to update original
    // console.log('resolving');
    var obj = {
      'list':angular.copy(holonList),
      'active':angular.copy(holonList[0]),
      // make an api for updating... to shortcut/curry restangular functions
      'create':function(){},
      'read':function(){},
      'update':function(){},
      'destroy':function(){}
    };
    d.resolve(obj);
  });
  return d.promise;

}]);