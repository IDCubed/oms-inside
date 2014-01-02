var STATE_PROVIDER; // ugly global workaround for lazy loading states.  Only used in app.js file.
var DEBUG_MODE=false;
var happ = angular.module( 'happathon', [
  'html_templates_jsfied',
  'ui.router',
  'ngTouch',
  'ui.bootstrap',
  'happathon-api-app_angular',
  'happathon-app-utils'
])
.config( ['$stateProvider','$urlRouterProvider',
  function myAppConfig ($stateProvider , $urlRouterProvider) {
    // store the state provider for lazy loading states
    STATE_PROVIDER = $stateProvider;
    // console.log('$rootScope',$rootScope);

    /**
     * States
     */
    // convert the routing request to a state request to use the state events
    var freshSession=true;
    $urlRouterProvider.otherwise(function($injector,$location){
      console.log('$location','hash:',$location.hash(),'path:',$location.path());
      var redirectTo = $location.path().slice(1);
      var $state = $injector.get('$state');
      var apiPromise = $injector.get('happathon-engine-apis-promise');
      apiPromise.then(function (api) {
        if(freshSession===true){
          freshSession=false;
          redirectTo = api.read('settings',{one:'default_plugin'}).value;
        }
        $state.go(redirectTo,{freshSession:true});
      });
    });
  }
])

.run([
  '$rootScope',
  '$state',
  'happathon-engine-apis-promise',
  'utils',
  'stateFactory',
  '$stateParams',
  '$q',
  'lodash',
  '$timeout',
  function ($rootScope, $state, engineApiPromise,utils,stateFactory,$stateParams,$q,_,$timeout) {
    // This section is fugly!
    // Lazy loading templates and states is not something UI router handles well.
    utils.enableDebugging();

    // set root properties - I think these can go in a parent controller.
    engineApiPromise.then(function(api){
      $rootScope.peopleListObj = api.read('people',{add:'user'});
      $rootScope.people = api.read('people',{one:'user'});
      $rootScope.plugin = api.read('plugins',{one:'active'});
      $rootScope.pluginsListObj = api.read('plugins');
      $rootScope.$state = $state;
      $rootScope.pluginOrPeopleChanged=false;
      $rootScope.$stateParams = $stateParams;
      $rootScope.pluginsByType = api.read('plugins',{groupBy:'type'});
      $rootScope.pluginsByType.people.push($rootScope.people); // add the user to the list for managing settings consistently
      console.log('$rootScope.pluginsByType',$rootScope.pluginsByType);
      $rootScope.pluginListType = $rootScope.plugin.type; // set the initial active list type

      $rootScope.closeMenus = function(){
        var open=false;
        if($rootScope.pluginListSelectorVisible){open=true;$rootScope.pluginListSelectorVisible=0;}
        if($rootScope.showleftmenu){open=true;$rootScope.showleftmenu=0;}
        if($rootScope.showrightmenu){open=true;$rootScope.showrightmenu=0;}
        return open;
      };
      $rootScope.changeState = function(stateName){
        // handle states internally since triggering on $stateChangeSuccess kills css animations,
        // stateChangeStart doesn't fire on reloads
        // and stateNotFound only works the first time a state is called
        if(!stateName){return false; }
        $rootScope.closeMenus();
        // don't switch states for people changes.
        var pluginObj = $rootScope.pluginsListObj[stateName];
        if (pluginObj && pluginObj.display_templates) {
          $rootScope.plugin = $rootScope.pluginsListObj[stateName];
          // $rootScope.pluginOrPeopleChanged=!$rootScope.pluginOrPeopleChanged;
          if(open){
            $timeout(function(){
              // $state.transitionTo(stateName,{notify:true});
              $state.go(stateName);
            },1050); // wait for menu close
          } else {
            $state.go(stateName);
            console.log('switching plugin');
          }
          return true;
        }
        $rootScope.people = _.find($rootScope.peopleListObj,{name:stateName});
        $rootScope.pluginOrPeopleChanged=!$rootScope.pluginOrPeopleChanged;
        console.log('switching people');
        return false;
      };
    });

    $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound '+unfoundState.to+'  - fired when a state cannot be found by its name.');

      var pluginObj = $rootScope.pluginsListObj[unfoundState.to];
      // if there are display templates, create the state and retry it
      if (pluginObj&&pluginObj.display_templates) {
        event.retry = stateFactory(unfoundState.to);
        return;
      }
      // else prevent the transition
      console.log('preventing switch to new state - no display templates');
      event.preventDefault();
    });
  }
])
// lazy loads states
// returns a promise for when the state is done loading
.service('stateFactory', [
  'happathon-engine-apis-promise',
  'utils',
  function (engineApiPromise, utils) {
    return function(stateName){

        // parse plugins here.
      engineApiPromise.then(function(api){

        // get which plugin to populate the state data from
        var pluginObj = api.read('plugins',{one:stateName});

        var stateObj = {
          name:pluginObj.name,
          url:'/'+pluginObj.name,
          data:{},
          views:{
            'main@':{
              controller:'MainViewCtrl',
              template:'<partials-container/>' // gets replaced by the partialsContainer directive
            },
            'menuleft@':{
              controller:'LeftMenuCtrl',
              templateUrl:'left-menu.tpl.html'
            },
            'menuright@':{
              controller:'RightMenuCtrl',
              templateUrl:'right-menu.tpl.html'
            },
            'topnav@':{
              controller:'TopNavCtrl',
              templateUrl:'top-nav.tpl.html'
            }
          }
        };

        // create the state
        STATE_PROVIDER.state(stateObj);

      // resolve the stateDefinedDeferred to load our newly defined state
      });
      return engineApiPromise;
    };
  }
])


/**
 * Controllers
 */

.controller("MainViewCtrl", ['$scope','$state','$rootScope',function($scope,$state,$root){

  // console.log('MainViewCtrl $scope',$scope);
  // console.log('MainViewCtrl $state',$state);
}])

// Top Nav
.controller("TopNavCtrl", ['$scope','$state','$rootScope',function($scope,$state,$root){
  console.log('TopNavCtrl $scope',$scope);
  $scope.switchPluginListType = function (typeStr) {
    $root.pluginListSelectorVisible=0; // yes, just close the selector
    $root.showleftmenu=1;
    if($root.pluginListType!==typeStr){ // already on the clicked type?
      $root.pluginListType = typeStr; // no, set the new type and show
    }
  };
}])


.controller("LeftMenuCtrl", ['$scope','$state','$rootScope',function($scope,$state,$root){
  $scope.pluginListSource='installed';
  console.log('LeftMenuCtrl $scope',$.extend({},$scope));
  //
}])


.controller("RightMenuCtrl", ['$scope','$state','$rootScope',function($scope,$state,$rootScope){
  // $scope.showmenu=false;
}])


.directive('hapSize', ['$timeout','$window', function ($timeout, $window) {
  var runs = 0;
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs, people) {


      function size(){

        var wHeight = $window.innerHeight;
        var wWidth = $window.innerWidth;
        var container = angular.element('.root-container');

        function px(percent){
          return Math.floor((wWidth*percent)/100) + 'px';
        }

        // resize the container
        /* global detectMobileBrowser */
        if(detectMobileBrowser() === false){
          // could use a media query for some of this, but doing it here
          // to keep all beta-testing resize code in one place.

          if (wHeight > 800) {
            // 1000 pics is a mobile screen, but it often requires
            // scrolling on conventional browsers, so limit the size here.
            wHeight=800;
          }
          // maintain a 16:9 aspect ratio
          var maxWidth = Math.floor(wHeight / 16 * 9);
          var maxHeight = Math.floor(wWidth / 9 * 16);
          if(wWidth > maxWidth){
            wWidth = maxWidth;
          } else if (wHeight > maxHeight){
            wHeight = maxHeight;
          }

          // wrap iin a pseudo phone border for beta testers to see on their computers
          // and resize to fit aspect ratio
          container.css({
            width:wWidth,
            height:wHeight,
            border:"30px solid #000",
            borderBottom:"90px solid #000",
            // and center it
            position:'absolute',
            margin:'auto',
            top:0,
            left:0,
            bottom:0,
            right:0
          });

        } else{
          container.attr('style','width:100%;height:100%;');
        }

        // make the font size dynamic
        container.css({
          fontSize:px(4)
        });

        // resize menu buttons
        // var menuToggleSize = px(25);
        // container.find('.menu-toggle').css({
        //   height:menuToggleSize,
        //   width:menuToggleSize
        // });


        // var menu = angular.element('.panel');
        // // console.log('(menuToggleSize+30)+px',(menuToggleSize+30)+'px');
        // menu.css({
        //   bottom:px(26),
        //   fontSize:px(3.5)
        // });

        // var menuBody = angular.element('.panel-body');
        // var guttersWidth = 40;
        // var columns = 3;
        // var buttonWidth = ((menuBody.width() - guttersWidth) / columns)+'px';
        // menuBody.find('.btn').each(function(){
        //   angular.element(this).css({
        //     height:buttonWidth,
        //     width:buttonWidth
        //   });
        // });

        // angular.element('.splash').addClass('hidden');
      }
      // wait for browser rendering to finish the last menu
      // ugh. Angular lacks a callback for all rendering done.
      // this is hacky.  Need a better way within the scope lifecycle so we don't need setTimeout.
      // Potential solution!!
      // $viewContentLoaded from ui router at https://github.com/angular-ui/ui-router/wiki/Quick-Reference#events-1
      $timeout(size,0);

      // resize when window resizes
      angular.element($window).bind('resize', function () {
        scope.$apply(function(){
          size();
        });
      });
    }
  };
}])



.directive('partialsContainer',
['$templateCache','$rootScope','$compile',
function ($templateCache, $root, $compile) {
  return {
    template: '<div></div>',
    replace: true,
    restrict: 'E',
    // compile runs digest once.
    // link would run digest each time the model changes, including each time a new child is appended.
    compile:function(tElement, tAttrs, transclude){
      return {
        pre:function(scope, iElement, iAttrs,controller){
          var counter = 0;
          // for some reason, making this $root.$watch causes the counter to log 3, 2, 1;
          // where making it scope.$watch only makes it render 1 each time.
          // Apparently a root watch will run 3 times.
          //
          scope.$watch('pluginOrPeopleChanged', function (changed) { // also works
          // scope.$watch('[plugin,people]', function (changed) {
            console.log('RENDERING',++counter);
            // clean up
            iElement.html('');

            var groupOrIndividual = $root.people.tags.indexOf('group') < 0 ? 'individual' : 'group';
            var templateArray = $root.plugin.display_templates[groupOrIndividual];
            // loop over the plugin's display templates
            if(templateArray===undefined||templateArray.length===0){
              templateArray=[{template:''}];
            }
            // var tempDom = angular.element('<div></div>');
            angular.forEach(templateArray,function(obj,idx){
              // create a new child scope for each
              var childScope=scope.$new();
              // add the template's data to its scope
              childScope.template_data=obj;
              childScope.idx=idx;
              // get the partials from the cache
              var templateStr = $templateCache.get('plugins/'+obj.template.split(' : ').join('/'));
              // if the template str is still blank, return a message;
              // console.log('templateStr',templateStr);
              templateStr = templateStr || '<div>The author of plugin "'+$root.plugin.name+'" did not specify a template to display '+groupOrIndividual+'s.</div>';
              // append the element to the dom - can batch these into one dom write for performance
              iElement.append($compile(templateStr)(childScope));
            });
          });
        }
      };
    }
  };
}]);