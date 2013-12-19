// contains the base forms.
// Provides basic data syncing for apps that want to use the personal data cloud for storage.
// Back end data must have all base form data to authenticate for valid happathon measurement
// provides methods to extend its forms with additional questions
angular.module( 'happathon-engine', [
  'happathon-engine.mock-backend',
  'happathon-engine.raw-data-api',
])
.service('engineModule', ['rawDataApi', function (rawDataApi) {
  console.log('rawDataApi',rawDataApi);
  return {enginTest:true};
}]);

// module to specify what modules are:
// enabled by default
// mandatory