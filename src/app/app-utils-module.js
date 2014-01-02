angular.module('happathon-app-utils', [])
// provide lodash
.factory('lodash',['$window',function($window){
  return $window._;
}])

.factory("utils", ['$templateCache','$rootScope','lodash',function($templateCache, $rootScope, _) {
  return {
    // dynamically assembles templates from urls
    lazyCompileStateTemplate: function(pluginObj) {
      // check if we've already cached this state's template
      var forGroupOrIndiv = _.contains($rootScope.people.tags,'group') ? 'group':'individual';
      var templateName = 'plugins/'+pluginObj.name+'/'+forGroupOrIndiv;
      var cachedStateTemplate = $templateCache.get(templateName);
      if(cachedStateTemplate){
        return cachedStateTemplate;
      }

      // else compile the template
      var templateStr = '';
      // loop over all the templates specified in this plugin
      _.forEach(pluginObj.display_templates[forGroupOrIndiv],function(obj){
        // get the partials from the cache and compile them into a single template
        templateStr += $templateCache.get('plugins/'+obj.template.split(' : ').join('/'))+'\n';
        // $rootScope.templateDataroot.temp
      });
      // if the template str is still blank, return a message;
      templateStr = templateStr || '<div>No '+forGroupOrIndiv+' template defined by this plugin</div>';
      // cache the template
      $templateCache.put(templateName,templateStr);
      return templateStr;
    },

    enableDebugging: function() {
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeStart to '+toState.to+'- fired when the transition begins. toState,toParams : \n',toState, toParams);
      });
      $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
      });
      $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to '+toState.name+'- fired once the state transition is complete.');
      });
      $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
      });
      // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
      //   // runs on individual scopes
      //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
      // });
      $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
      });
    }
  };
}]);
