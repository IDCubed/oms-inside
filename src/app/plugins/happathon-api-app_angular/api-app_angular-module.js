// contains the base forms.
// Provides basic data syncing for apps that want to use the personal data cloud for storage.
// Back end data must have all base form data to authenticate for valid happathon measurement
// provides methods to extend its forms with additional questions
angular.module( 'happathon-api-app_angular', [
  'happathon-engine',
  'happathon-engine.mock-backend',
  'restangular'
])
.service('happathon-engine-apis-promise', ['Restangular', '$q', 'lodash',function (Restangular,$q,_) {
  // App API: provides a engine back-end wrapper to cache data for faster rendering and dev shortcuts
  // Get the whole user object, necessary data streams, and plugins to start with.
  // Longer data streams will query separately from the engine api and return promises.
  // returns an api promise for the engine - purposes

  var userObj;
  var appData;
  var options;
  var installedPlugins;
  var appAPI = {
    create:function(){
      // peopleObj;
    },
    read:function(argStr,optionsObj){
      // TODO: convert this all over to just use lodash on the collections.
      options=optionsObj||{};
      switch(argStr){
      case 'plugin':
        return appData.settings.default_plugin.value;
      case 'people':
        if(options.one){
          // if(options.one==='active'){
          //   return appData.settings.default_people_id.value;
          // } else
          if (options.one==='user'){
            return userObj;
          } else{
            return 'one supports "user" currently';
          }
        }
        var listObj = appAPI.read('plugins',{filter:'-people-'});
        listObj[userObj.name] = userObj;
        return listObj;
      case 'plugins':
        if(options.one){
          if(options.one==='active'){
            var set = appAPI.read('settings',{one:'default_plugin'}).value;
            console.log("appAPI.read('settings',{one:'default_plugin'})",appAPI.read('settings',{one:'default_plugin'}));
            return appData.plugins.installed[set];
          }
          if(appData.plugins.installed[options.one]){
            return appData.plugins.installed[options.one];
          }
          return 'one only supports "active" currently';
        }
        if(options.filter){
          var pluginListObj = {};
          for (var pluginName in appData.plugins.installed){
            if(pluginName.indexOf(options.filter)>-1){
              pluginListObj[pluginName]=appData.plugins.installed[pluginName];
            }
          }
          return pluginListObj;
        }
        if(options.groupBy){
          if(options.groupBy==='type'){
            // transform {'plugin-type1-foo':{}
            var plugLists={};
            var pluginType;
            for (var plugName in appData.plugins.installed){
              pluginType=plugName.replace(/^.+?-|-.+$/g,'');
              if(!plugLists[pluginType]){
                plugLists[pluginType]=[];
              }
              plugLists[pluginType].push(appData.plugins.installed[plugName]);
            }
            return plugLists;
          }
          return 'options groupBy only supports "type"';
        }
        return appData.plugins.installed;
      case 'listDataSources':
        return '';
      case 'listDataSourcesUpdated':
        return '';
      case 'settings':
        if(options.one){
          var oneSetting = _.find(appData.settings.individual,{setting:options.one});
          if(oneSetting){
            return oneSetting;
          }
          return 'No setting named ' + options.one;
        }
        return appData.settings.individual;
      default:
        return 'default-case';
      }
    },
    update:function(){
    },
    delete:function(){
    },
  };
  var apisDeferred = $q.defer();
  var userPromise = Restangular.all('user').getList();
  userPromise.then(function(user){
    console.log('user',user);
    if(user.constructor !== Array || user.length!==1){
      return console.error('engine API should return a length 1 array of the user, not: ',user);
    }
    userObj=user[0];
    appData = userObj.installed_tabs.happathon_app;
    apisDeferred.resolve(appAPI);
  });
  return apisDeferred.promise; // return a promise for the API;
}]);
