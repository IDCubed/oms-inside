// TODO - this needs to be part of the custom plugin build process, not created in angular.
// this should take objects and return new plugins, extending the arrays with array values from the passed object
angular.module('happathon-plugin-generator', [])
.service('bowerJsonBase', [function () {
  return {
// See https://github.com/bower/bower.json-spec for property descriptions
    private:true, // prevent publishing
    version: '0.0.0', // The package's semantic version number.
    location: '', // The endpoint where Bower can find your package. Used during registration.
    description: "default plugin description", // Max 140 chars - Helps users identify and search for your package.
    keywords: ["happathon", "plugin"], // Used for search by keyword. Helps make your package easier to discover without people needing to know its name.
    main:'happathon.json', //The primary acting files necessary to use your package.  listed with the commands bower list --json and bower list --paths, for build tools.
    ignore:'',
    "authors": [
      { "name": "John Doe" },
      { "name": "John Doe", "email": "john@doe.com" },
      { "name": "John Doe", "email": "john@doe.com"," homepage": "http://johndoe.com" }
    ],
    homepage: '',// URL to learn more about the package. Falls back to GitHub project if undefined
    issues: {"mail": "dev@example.com", "web": "http://www.example.com/issues"},
    licenses: [
      {"type": "MIT", "url": "http://www.example.org/licenses/mit.html"}
    ],
    "repository": {
      "type": "git",
      "url": "git://github.com/foo/bar.git"
    },
    dependencies:{},
    devDependencies:{}
  };
}])
.service('happathonJsonBase', [function () {
  return {
    type:null, // the type of plugin, e.g., form, insight,
    menu_title:'',// the name used to display the plugin in lists and headers, max 20 chars
    urls:{
      screenshots:['screenshots/example1.jpg','screenshots/example2.jpg','screenshots/example3.jpg'], // url for screenshots, relative to plugin dir
    },
    long_description:'', // to say things too long for the bower.json description. Max 1000 chars.  Falls back to bower desc
    keywords: ["happathon", "plugin","happathon-plugin"], // Used for search by keyword. Helps make your package easier to discover without people needing to know its name.
    required_device_specs:{}, // see http://developer.android.com/guide/topics/manifest/supports-screens-element.html
    optional_device_specs:{}, // see http://developer.android.com/guide/topics/manifest/supports-screens-element.html
    required_datasources:[],
    optional_datasources:[],
    provided_datasources:[],
    required_apis:[],
    optional_apis:[],
    provided_apis:[],
  };
}])
.factory('pluginGenerator', ['happathonJsonBase', function (happathonJsonBase) {
  return {
    people:function(peopleObj){
      return angular.extend({},happathonJsonBase,{
        id:null,
        type:'people',
        subtype:'default',
        version: '0.0.0',
        name_first:"default",
        name_last:"default",
        menu_title:"default",
        name_full:'default',
        user_shared_apis:[],
        people_shared_apis:[],
        user_shared_datasources:[],
        people_shared_datasources:[],
        installed_tabs:{}
      },peopleObj);
    },
    form:function(formObj){
      return angular.extend({},happathonJsonBase,formObj);
    },
    insight:function(insightObj){
      return angular.extend({},happathonJsonBase,insightObj);
    },
    challenge:function(challengeObj){
      return angular.extend({},happathonJsonBase,challengeObj);
    },
    datasource:function(datasourceObj){
      return angular.extend({},happathonJsonBase,datasourceObj);
    },
    device:function(deviceObj){
      return angular.extend({},happathonJsonBase,{
        sensors:{
          gps:{
            identifier:"foo_identifier_1",
            name:"default_accelerometer",
            source:"phone",
            source_make:"samsung",
            source_model:"galaxy",
            source_os:"android",
            imei:"",
            data:{}
          },
          accelerometer:{
            identifier:"foo_identifier_2",
            name:"default_gps",
            source:"phone",
            source_make:"samsung",
            source_model:"galaxy",
            source_os:"android",
            imei:"",
            data:{}
          }
        }
      },deviceObj);
    },

  };
}]);