var STATE_PROVIDER; // ugly global workaround for lazy loading states.  Only used in app.js file.
var DEBUG_MODE = false;
var happ = angular.module( 'happathon', [
  'html_templates_jsfied',
  'ui.router',
  'ngTouch',
  'ui.bootstrap',
  'happathon-api-app_angular',
  'happathon-app-utils'
])
.config( ['$stateProvider','$urlRouterProvider',
  function ($stateProvider , $urlRouterProvider) {
    // store the state provider for lazy loading states
    STATE_PROVIDER = $stateProvider;
    // console.log('$rootScope',$rootScope);

    /**
     * States
     */
    // convert the routing request to a state request to use the state events
    var freshSession = true;
    $urlRouterProvider.otherwise(function($injector,$location){
      console.log('$location','hash:',$location.hash(),'path:',$location.path());
      var redirectTo = $location.path().slice(1);
      var $state = $injector.get('$state');
      var apiPromise = $injector.get('happathon-engine-apis-promise');
      apiPromise.then(function (api) {
        if(freshSession === true){
          freshSession = false;
          redirectTo = api.read('settings',{one:'default_plugin'}).value;
        }
        $state.go(redirectTo,{freshSession:true});
      });
    });

    $stateProvider.state({
      name:'root',
      url:'/',
      // templateProvider:function(){
      //   console.log('debug template()');
      //   return '<div ui-view></div>';
      // },
      // ab
      views:{
        'menuleft':{
          controller:'LeftMenuCtrl',
          templateUrl:'left-menu.tpl.html'
        },
        'menuright':{
          controller:'RightMenuCtrl',
          templateUrl:'right-menu.tpl.html'
        },
        'topnav':{
          controller:'TopNavCtrl',
          templateUrl:'top-nav.tpl.html'
        },
        'main':{
          template:'<ui-view/>'
        }
      }
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
  'lodash',
  '$timeout',
  function ($root, $state, engineApiPromise,utils,stateFactory,$stateParams,_,$timeout) {
    // This section is fugly!
    // Lazy loading templates and states is not something UI router handles well.
    // utils.enableDebugging();

    // set root properties - I think these can go in a parent controller.
    engineApiPromise.then(function(api){
      $root.peopleListObj = api.read('people');
      $root.user = api.read('people',{one:'user'});
      $root.people = $root.user;
      $root.plugin = api.read('plugins',{one:'active'});
      $root.pluginsListObj = api.read('plugins');
      $root.settings = $root.plugin.settings;
      $root.$state = $state;
      $root.pluginOrPeopleChanged = false;
      $root.$stateParams = $stateParams;
      $root.pluginsByType = api.read('plugins',{groupBy:'type'});
      $root.pluginsByType.people.push($root.people); // add the user to the list for managing settings consistently
      console.log('$root.pluginsByType',$root.pluginsByType);
      $root.pluginListType = $root.plugin.type; // set the initial active list type
      $root.closeMenus = function(){
        var open = false;
        if($root.pluginListSelectorVisible){open = true;$root.pluginListSelectorVisible = 0;}
        if($root.showleftmenu){open = true;$root.showleftmenu = 0;}
        if($root.showrightmenu){open = true;$root.showrightmenu = 0;}
        return open;
      };
      $root.switchPluginListType = function (typeStr) {
        $root.pluginListSelectorVisible = 0; // yes, just close the selector
        if($root.pluginListType !== typeStr){ // already on the clicked type?
          $root.pluginListType = typeStr; // no, set the new type and show
        }
      };
      $root.changeState = function(stateName){
        // handle states internally since triggering on $stateChangeSuccess kills css animations,
        // stateChangeStart doesn't fire on reloads
        // and stateNotFound only works the first time a state is called
        if(!stateName){return false; }
        var menusOpen = $root.closeMenus();
        // don't switch states for people changes.

        var pluginObj = stateName === $root.user.name ? $root.user : utils.getPluginObj(stateName);

        if (pluginObj && pluginObj.display_templates) {
          $root.plugin = pluginObj;
          $root.switchPluginListType(pluginObj.type);
          $root.pluginOrPeopleChanged = !$root.pluginOrPeopleChanged;
          if(menusOpen){
            $timeout(function(){
              // $state.transitionTo(stateName,{notify:true});
              $state.go('root.' + pluginObj.name);
            },1050); // wait for menu close
          } else {
            $state.go('root.' + pluginObj.name);
            console.log('switching plugin');
          }
          return true;
        }
        $root.people = _.find($root.peopleListObj,{name:pluginObj.name});
        $root.pluginOrPeopleChanged = !$root.pluginOrPeopleChanged;
        console.log('switching people');
        return false;
      };
    });
    $root.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
      console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
      var pluginObj = utils.getPluginObj(unfoundState.to);
      // if there are display templates, create the state and retry it
      if (pluginObj && pluginObj.display_templates) {
        // $root.closeMenus();
        // event.retry = stateFactory(unfoundState.to);
        event.preventDefault();

        stateFactory(pluginObj.name)
        .then(function(stateObj){
          $root.changeState(pluginObj.name);
        });
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
  '$q',
  function (engineApiPromise, $q) {
    return function(stateName){
      var stateObjDeferred = $q.defer();
        // parse plugins here.
      engineApiPromise.then(function(api){

        // get which plugin to populate the state data from
        var pluginObj = api.read('plugins',{one:stateName});

        var stateObj = {
          name:'root.' + pluginObj.name,
          url:pluginObj.name,
          data:{},
          controller:'MainViewCtrl',
          template:'<partials-container template-objects-array = "display_templates"/>' // gets replaced by the partialsContainer directive
        };

        // create the state
        STATE_PROVIDER.state(stateObj);
        stateObjDeferred.resolve(stateObj);
      // resolve the stateDefinedDeferred to load our newly defined state
      });
      return stateObjDeferred.promise;
    };
  }
])


/**
 * Controllers
 */

.controller("MainViewCtrl", ['$scope', function($scope){
  console.log('MainViewCtrl $scope',$scope);
}])

// Top Nav
.controller("TopNavCtrl", ['$scope', function($scope){
  console.log('TopNavCtrl $scope',$scope);
}])


.controller("LeftMenuCtrl", ['$scope', function($scope){
  $scope.pluginListSource = 'installed';
  console.log('LeftMenuCtrl $scope',$scope);
}])


.controller("RightMenuCtrl", ['$scope', function($scope){
  console.log('RightMenuCtrl $scope',$scope);
}])

// adds a pseudo phone body around the content when on a desktop, for pre-beta evaluation
.directive('hapSize', ['$timeout','$window', 'utils', function ($timeout, $window, utils) {
  return {
    restrict: 'A',
    link: function (scope) { // scope, iElement, iAttrs


      function size(){

        var wHeight = $window.innerHeight;
        var wWidth = $window.innerWidth;
        var container = angular.element('.root-container');

        function px(percent){
          return Math.floor((wWidth * percent) / 100) + 'px';
        }

        // resize the container
        /* global detectMobileBrowser */
        if(utils.detectMobileBrowser() === false){
          // could use a media query for some of this, but doing it here
          // to keep all beta-testing resize code in one place.

          if (wHeight > 800) {
            // 1000 pics is a mobile screen, but it often requires
            // scrolling on conventional browsers, so limit the size here.
            wHeight = 800;
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
        // // console.log('(menuToggleSize + 30)+px',(menuToggleSize + 30)+'px');
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

// renders a series of plugin display template partials as individually scoped elements
.directive('partialsContainer',
['$rootScope','$templateCache','$compile',
function ($root, $templateCache, $compile) {
  return {
    template: '<div></div>',
    replace: true,
    restrict: 'E',
    // compile runs digest once.
    // link would run digest each time the model changes, including each time a new child is appended.
    compile:function(){ // tElement, tAttrs, transclude
      return {
        pre:function(scope, iElement, iAttrs){ // scope, iElement, iAttrs, controller
          var counter = 0;
          // for some reason, making this $root.$watch causes the counter to log 3, 2, 1;
          // where making it scope.$watch only makes it render 1 each time.
          // Apparently a root watch will run 3 times.
          //
          scope.$watchCollection('[plugin,people]', function (changed) { // also works
          // scope.$watch('[plugin,people]', function (changed) {
            console.log('RENDERING',++counter);
            // clean up
            iElement.html('');

            var groupOrIndividual = $root.people.tags.indexOf('group') < 0 ? 'individual' : 'group';
            // loop over the plugin's display templates
            console.log('iAttrs',iAttrs);
            var templateObj = iAttrs.templateObjectsArray === 'appSettings' ?
              $root.user.installed_tabs.happathon_app.settings :
              $root.plugin[iAttrs.templateObjectsArray];
            var templateArray;
            if(templateObj === undefined || templateObj[groupOrIndividual] === undefined || !templateObj[groupOrIndividual].length){
              templateArray = [{template:''}];
              console.log('No templates defined for plugin: ' + $root.plugin.name);
              console.log('templateObj: ' + templateObj);
            } else{
              templateArray = templateObj[groupOrIndividual];
            }
            // var tempDom = angular.element('<div></div>');
            angular.forEach(templateArray,function(obj,idx){
              // create a new child scope for each
              var childScope = scope.$new();
              // add the template's data to its scope
              childScope.template_data = obj;
              childScope.idx = idx;
              // get the partials from the cache
              var templateStr = $templateCache.get('plugins/' + obj.template.split(' : ').join('/'));
              // if the template str is still blank, return a message;
              // console.log('templateStr',templateStr);
              templateStr = templateStr || '<div>The author of plugin "' + $root.plugin.name + '" did not specify a template to display ' + groupOrIndividual + 's.</div>';
              // append the element to the dom - can batch these into one dom write for performance
              iElement.append($compile(templateStr)(childScope));
            });
          });
        }
      };
    }
  };
}]);