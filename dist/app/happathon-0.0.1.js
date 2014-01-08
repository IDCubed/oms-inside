/**
 * happathon - v0.0.1 - 2014-01-07
 * https://github.com/IDCubed/oms-happathon
 *
 * Copyright (c) 2014 Adam Laughlin
 * Licensed MIT + IDcubed name use addendum <https://raw.github.com/IDCubed/oms-happathon/master/LICENSE>
 */
(function ( window, angular, undefined ) {

angular.module('happathon-app-utils', [])
// provide lodash
.factory('lodash',['$window',function($window){
  return $window._;
}])

.factory("utils", ['$templateCache','$rootScope','lodash',function($templateCache, $rootScope, _) {
  return {
    // dynamically assembles templates for each state from multiple partials
    lazyCompileStateTemplate: function(pluginObj) {
      // check if we've already cached this state's template
      var forGroupOrIndiv = _.contains($rootScope.people.tags,'group') ? 'group' : 'individual';
      var templateName = 'plugins/' + pluginObj.name + '/' + forGroupOrIndiv;
      var cachedStateTemplate = $templateCache.get(templateName);
      if(cachedStateTemplate){
        return cachedStateTemplate;
      }

      // else compile the template
      var templateStr = '';
      // loop over all the templates specified in this plugin
      _.forEach(pluginObj.display_templates[forGroupOrIndiv],function(obj){
        // get the partials from the cache and compile them into a single template
        templateStr += $templateCache.get('plugins/' + obj.template.split(' : ').join('/')) + '\n';
        // $rootScope.templateDataroot.temp
      });
      // if the template str is still blank, return a message;
      templateStr = templateStr || '<div>No ' + forGroupOrIndiv + ' template defined by this plugin</div>';
      // cache the template
      $templateCache.put(templateName,templateStr);
      return templateStr;
    },

    // debugging for UI router
    enableDebugging: function() {
      $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeStart to ' + toState.to + '- fired when the transition begins. toState,toParams : \n',toState, toParams);
      });
      $rootScope.$on('$stateChangeError',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeError - fired when an error occurs during transition.');
        console.log(arguments);
      });
      $rootScope.$on('$stateChangeSuccess',function(event, toState, toParams, fromState, fromParams){
        console.log('$stateChangeSuccess to ' + toState.name + '- fired once the state transition is complete.');
      });
      $rootScope.$on('$stateNotFound',function(event, unfoundState, fromState, fromParams){
        console.log('$stateNotFound ' + unfoundState.to + '  - fired when a state cannot be found by its name.');
        console.log(unfoundState, fromState, fromParams);
      });
      // $rootScope.$on('$viewContentLoading',function(event, viewConfig){
      //   // runs on individual scopes
      //   console.log('$viewContentLoading - view begins loading - dom not rendered',viewConfig);
      // });
      $rootScope.$on('$viewContentLoaded',function(event){
        console.log('$viewContentLoaded - fired after dom rendered',event);
      });
    },

    getPluginObj:function(pluginOrStateName){ // gets a plugin object by plugin or state name
      return $rootScope.pluginsListObj[pluginOrStateName.indexOf('root.') === 0 ? pluginOrStateName.slice(5) : pluginOrStateName];
    },

    detectMobileBrowser:function(){
      return (function(a){return !!(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || (/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i).test(a.substr(0,4)));})(navigator.userAgent || navigator.vendor || window.opera);
    }

  };
}]);

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
// run is where we set initial rootscope properties
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
angular.module('html_templates_jsfied', ['left-menu.tpl.html', 'plugins/happathon-challenge-2kind/2kind.tpl.html', 'plugins/happathon-challenge-utils_angular/challenge-base.tpl.html', 'plugins/happathon-challenge-utils_angular/challenge-part-analysis.tpl.html', 'plugins/happathon-challenge-utils_angular/challenge-part-chart.tpl.html', 'plugins/happathon-engine/settings/settings.tpl.html', 'plugins/happathon-form-utils_angular/add-custom-with-relationship.tpl.partial', 'plugins/happathon-form-utils_angular/add-custom.tpl.partial', 'plugins/happathon-form-utils_angular/button-continue.tpl.partial', 'plugins/happathon-form-utils_angular/button-submit.tpl.partial', 'plugins/happathon-form-utils_angular/checkbox.tpl.partial', 'plugins/happathon-form-utils_angular/grid-10x10.tpl.partial', 'plugins/happathon-form-utils_angular/heading.tpl.partial', 'plugins/happathon-form-utils_angular/multiselect.tpl.partial', 'plugins/happathon-form-utils_angular/radio.tpl.partial', 'plugins/happathon-form-utils_angular/select.tpl.partial', 'plugins/happathon-form-utils_angular/slider-7point.tpl.partial', 'plugins/happathon-form-utils_angular/text.tpl.partial', 'plugins/happathon-form-utils_angular/textarea.tpl.partial', 'plugins/happathon-form-utils_angular/time-range.tpl.partial', 'plugins/happathon-insight-explorer/insight-miner.tpl.html', 'plugins/happathon-insight-status/status-custom-test.tpl.partial', 'plugins/happathon-insight-utils_angular/all-attributes.tpl.partial', 'plugins/happathon-insight-utils_angular/heading.tpl.partial', 'right-menu.tpl.html', 'top-nav.tpl.html']);

angular.module("left-menu.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("left-menu.tpl.html",
    "<div class=\"menuleft\"\n" +
    "      ng-class=\"{active:$root.showleftmenu}\"\n" +
    "      ng-click=\"$event.stopPropagation();\">\n" +
    "\n" +
    "  <ul class=\"nav nav-tabs plugin-type-nav\">\n" +
    "    <li class=\"menu-title\">Plugins</li>\n" +
    "    <li ng-repeat=\"(key,val) in $root.pluginsByType\"\n" +
    "        ng-click=\"switchPluginListType(key);$event.stopPropagation();\"\n" +
    "        ng-class=\"{active:$root.pluginListType===key}\"\n" +
    "        >\n" +
    "      <a class=\"plug-icon icon-{{key}}\"></a>\n" +
    "    </li>\n" +
    "\n" +
    "  </ul>\n" +
    "  <div class=\"plugin-nav btn-toolbar\">\n" +
    "    <div class=\"btn-group plugin-type-title\">\n" +
    "      <span>{{$root.pluginListType}}</span>\n" +
    "    </div>\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button type=\"button\"\n" +
    "              class=\"btn btn-default\"\n" +
    "              ng-model=\"pluginListSource\"\n" +
    "              btn-radio=\"'installed'\"\n" +
    "              >\n" +
    "              Installed\n" +
    "      </button>\n" +
    "              <!-- ng-click=\"pluginListSource='installed'\" -->\n" +
    "              <!-- ng-click=\"pluginListSource='discover'\" -->\n" +
    "      <button type=\"button\"\n" +
    "              class=\"btn btn-default\"\n" +
    "              ng-model=\"pluginListSource\"\n" +
    "              btn-radio=\"'discover'\"\n" +
    "              >\n" +
    "              Discover\n" +
    "      </button>\n" +
    "    </div>\n" +
    "    <div class=\"btn-group\">\n" +
    "      <button type=\"button\"\n" +
    "        ng-class=\"{editing:$root.people.installed_tabs.happathon.viewMode==='editing'}\"\n" +
    "        class=\"btn btn-default icon-pencil\"\n" +
    "        ng-click=\"toggleEditMode()\"\n" +
    "      ></button>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "\n" +
    "  <div class=\"plugin-list btn-group-vertical\" ng-repeat=\"(pluginType,pluginsArray) in $root.pluginsByType\" ng-show=\"$root.pluginListType===pluginType\">\n" +
    "    <button class=\"btn btn-default\"\n" +
    "        type=\"button\"\n" +
    "        ng-repeat=\"pluginObj in pluginsArray\"\n" +
    "        ng-class=\"{active:pluginObj.name===$root.plugin.name}\"\n" +
    "        >\n" +
    "      <span class=\"plugin-settings\" ng-click=\"$root.showrightmenu=1;\"><span class=\"icon-cog\"></span></span>\n" +
    "      <span class=\"plugin-info\"><span class=\"icon-info4\"></span></span>\n" +
    "      <span class=\"plugin-name\" ng-click=\"changeState(pluginObj.name);\">{{pluginObj.menu_title}}</span>\n" +
    "    </button>\n" +
    "  </div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/happathon-challenge-2kind/2kind.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-challenge-2kind/2kind.tpl.html",
    "");
}]);

angular.module("plugins/happathon-challenge-utils_angular/challenge-base.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-challenge-utils_angular/challenge-base.tpl.html",
    "");
}]);

angular.module("plugins/happathon-challenge-utils_angular/challenge-part-analysis.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-challenge-utils_angular/challenge-part-analysis.tpl.html",
    "");
}]);

angular.module("plugins/happathon-challenge-utils_angular/challenge-part-chart.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-challenge-utils_angular/challenge-part-chart.tpl.html",
    "");
}]);

angular.module("plugins/happathon-engine/settings/settings.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-engine/settings/settings.tpl.html",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/add-custom-with-relationship.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/add-custom-with-relationship.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/add-custom.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/add-custom.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/button-continue.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/button-continue.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/button-submit.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/button-submit.tpl.partial",
    "<button type=\"submit\" class=\"btn btn-default btn-primary\">{{submitButtonTitle}}</button>");
}]);

angular.module("plugins/happathon-form-utils_angular/checkbox.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/checkbox.tpl.partial",
    "<div>\n" +
    "  <input name=\"{{idx}}\" type=\"checkbox\" placeholder=\"{{template_data.placeholder}}\"/>\n" +
    "  <label for=\"{{idx}}\">{{template_data.question}}</label>\n" +
    "</div>");
}]);

angular.module("plugins/happathon-form-utils_angular/grid-10x10.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/grid-10x10.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/heading.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/heading.tpl.partial",
    "<h3>{{plugin.menu_title}}</h3>");
}]);

angular.module("plugins/happathon-form-utils_angular/multiselect.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/multiselect.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/radio.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/radio.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/select.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/select.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/slider-7point.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/slider-7point.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/text.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/text.tpl.partial",
    "<div>\n" +
    "  <label for=\"{{idx}}\">{{template_data.question}}</label>\n" +
    "  <input name=\"{{idx}} \"type=\"text\" placeholder=\"{{template_data.value}}\"/>\n" +
    "</div>");
}]);

angular.module("plugins/happathon-form-utils_angular/textarea.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/textarea.tpl.partial",
    "");
}]);

angular.module("plugins/happathon-form-utils_angular/time-range.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-form-utils_angular/time-range.tpl.partial",
    "<label for=\"{{idx}}\">No Notifications Before:</label>\n" +
    "<input name=\"{{idx}} \"type=\"text\" placeholder=\"{{template_data.value.start}}\"/>\n" +
    "<label for=\"{{idx}}\">No Notifications After:</label>\n" +
    "<input name=\"{{idx}} \"type=\"text\" placeholder=\"{{template_data.value.end}}\"/>\n" +
    "");
}]);

angular.module("plugins/happathon-insight-explorer/insight-miner.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-insight-explorer/insight-miner.tpl.html",
    "");
}]);

angular.module("plugins/happathon-insight-status/status-custom-test.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-insight-status/status-custom-test.tpl.partial",
    "<div>\n" +
    "  <h1>Status</h1>\n" +
    "  <div>type: {{$root.people.type}}</div>\n" +
    "  <div>subtype: {{$root.people.subtype}}</div>\n" +
    "  <div>People is_user: {{$root.people.is_user}}</div>\n" +
    "  <div>People name_first: {{$root.people.name_first}}</div>\n" +
    "  <div>People name_last: {{$root.people.name_last}}</div>\n" +
    "  <div>People name_full: {{$root.people.name_last}}</div>\n" +
    "</div>\n" +
    "");
}]);

angular.module("plugins/happathon-insight-utils_angular/all-attributes.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-insight-utils_angular/all-attributes.tpl.partial",
    "<ul>\n" +
    "  <li>Some Data Insight #1</li>\n" +
    "  <li>Some Data Insight #2</li>\n" +
    "  <li>Some Data Insight #3</li>\n" +
    "</ul>\n" +
    "\n" +
    "");
}]);

angular.module("plugins/happathon-insight-utils_angular/heading.tpl.partial", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("plugins/happathon-insight-utils_angular/heading.tpl.partial",
    "<h2>{{$root.people.menu_title}}</h2>");
}]);

angular.module("right-menu.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("right-menu.tpl.html",
    "<div class=\"menuright\"\n" +
    "    ng-class=\"{active:$root.showrightmenu}\"\n" +
    "    ng-click=\"$event.stopPropagation();\">\n" +
    "  <div class=\"menu-title\">Settings</div>\n" +
    "  <div class=\"settings-section\">App Settings</div>\n" +
    "  <form>\n" +
    "    <partials-container template-objects-array=\"appSettings\"></partials-container>\n" +
    "  </form>\n" +
    "  <div class=\"settings-section plugin\">Plugin Settings</div>\n" +
    "  <form>\n" +
    "    <partials-container template-objects-array=\"settings\"></partials-container>\n" +
    "  </form>\n" +
    "</div>");
}]);

angular.module("top-nav.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("top-nav.tpl.html",
    "<ul class=\"nav nav-pills\">\n" +
    "  <li>\n" +
    "    <a class=\"plugins-dropdown icon-{{$root.pluginListType}}\"\n" +
    "       ng-click=\"$root.showleftmenu=1;$event.stopPropagation();\">\n" +
    "    </a>\n" +
    "  </li>\n" +
    "  <li class=\"people-dropdown dropdown\">\n" +
    "    <a class=\"dropdown-toggle\">\n" +
    "      <span class=\"people-select-title\">{{$root.people.menu_title}}</span>\n" +
    "      <span class='phi'>{{$root.people.phi}}</span>\n" +
    "      <span class=\"caret\"></span>\n" +
    "    </a>\n" +
    "    <ul class=\"dropdown-menu\">\n" +
    "      <li ng-class=\"{active:peep.name===$root.people.name}\"\n" +
    "          ng-repeat=\"peep in $root.peopleListObj\"\n" +
    "          ng-click=\"changeState(peep.name)\">\n" +
    "        <a>\n" +
    "          <span class=\"people-select-title\">{{peep.menu_title}}</span>\n" +
    "          <span class='phi'>{{peep.phi}}</span>\n" +
    "        </a>\n" +
    "      </li>\n" +
    "    </ul>\n" +
    "  </li>\n" +
    "  <li class=\"settings\">\n" +
    "    <a class=\"icon-cog\" ng-click=\"$root.showrightmenu=!$root.showrightmenu; $event.stopPropagation();\">\n" +
    "    </a>\n" +
    "  </li>\n" +
    "  <li class=\"help \">\n" +
    "    <a class=\"icon-info3\">\n" +
    "    </a>\n" +
    "  </li>\n" +
    "  <li class=\"add-moment\">\n" +
    "    <a class=\"icon-plus\" ng-click=\"changeState('happathon-form-moment');\">\n" +
    "    </a>\n" +
    "  </li>\n" +
    "</ul>");
}]);

angular.module('happathon.settings',[

])

.controller( 'PeopleCtrl', ['$scope', '$log', '$rootScope',
function ( $scope, $log, $rootScope) {

  $scope.addPeople = function(){
    console.log('do stuff when add people button clicked');

  };
  $log.log('PeopleCtrl');

  var openPeople;
// toggle menu open - only one at a time
  $scope.toggleMenu = function($index){
    $log.log('toggling $rootScope.peopleListObj[$index]', $rootScope.peopleListObj[$index]);
    var people = $rootScope.peopleListObj[$index];
    if(openPeople){
      if (openPeople === people){
        people.menuvis = openPeople = false;
        return;
      }
      openPeople.menuvis = false;
    }
    openPeople = people;
    people.menuvis = true;
  };

  $scope.switchActive = function(state,people){
    $log.log('switchActive state,people',state,people);
    $rootScope.people = people;
    $rootScope.$state.go(state);
  };
  // $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
  //   console.log('$stateChangeSuccess arguments',arguments);
  // });

}]);
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
  var appAPI = {
    create:function(){
      // peopleObj;
    },
    read:function(argStr,optionsObj){
      // TODO: convert this all over to just use lodash on the collections.
      options = optionsObj || {};
      switch(argStr){
      case 'plugin':
        return appData.settings.default_plugin.value;
      case 'people':
        if(options.one){
          // if(options.one ==='active'){
          //   return appData.settings.default_people_id.value;
          // } else
          if (options.one === 'user'){
            return userObj;
          }
          return 'one supports "user" currently';
        }
        var listObj = appAPI.read('plugins',{filter:'-people-'});
        listObj[userObj.name] = userObj;
        return listObj;
      case 'plugins':
        if(options.one){
          if(options.one === 'active'){
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
            if(pluginName.indexOf(options.filter) > -1){
              pluginListObj[pluginName] = appData.plugins.installed[pluginName];
            }
          }
          return pluginListObj;
        }
        if(options.groupBy){
          if(options.groupBy === 'type'){
            // transform {'plugin-type1-foo':{}
            var plugLists = {};
            var pluginType;
            for (var plugName in appData.plugins.installed){
              pluginType = plugName.replace(/^.+?-|-.+$/g,'');
              if(!plugLists[pluginType]){
                plugLists[pluginType] = [];
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
    }
  };
  var apisDeferred = $q.defer();
  var userPromise = Restangular.all('user').getList();
  userPromise.then(function(user){
    console.log('user',user);
    if(user.constructor !== Array || user.length !== 1){
      return console.error('engine API should return a length 1 array of the user, not: ',user);
    }
    userObj = user[0];
    appData = userObj.installed_tabs.happathon_app;
    apisDeferred.resolve(appAPI);
  });
  return apisDeferred.promise; // return a promise for the API;
}]);



// contains the base forms.
// Provides basic data syncing for apps that want to use the personal data cloud for storage.
// Back end data must have all base form data to authenticate for valid happathon measurement
// provides methods to extend its forms with additional questions
angular.module( 'happathon-engine', [
  'happathon-engine.mock-backend'
]);


angular.module('happathon-engine.mock-backend', [
  'ngMockE2E',
  'restangular',
  'happathon-engine.people-user'
])
.config( ['RestangularProvider', function (RestangularProvider) {
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
  function (user, $httpBackend) {
    // console.log('running backend module');
    $httpBackend.whenGET(/\.|tpl/g).passThrough();
    var userCopy = angular.copy(user);

    /*NOTE: $httpBackend CALLS MUST BE IN A "RUN" FUNCTION TO WORK!!!*/
    $httpBackend.whenGET(/\/api\/v0\/user/)
    .respond(function(url, data, headers){
      // console.log('responding in user whenGET: url, data, headers : ',url, data, headers);
      console.log('responding with userCopy',userCopy);
      return [200, [userCopy], {}];
    });

    $httpBackend.whenPOST(/\/api\/v0\/user/)
    .respond(function(url, data, headers){
      console.log('add people',url, data, headers);
      user.installed_tabs.happathon_app.plugins.installed[data.name] = data;
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
    //   // var peopleID = url.match(/\/api\/v0\/app-data\/([0-9]+)?/gi);
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


angular.module( 'happathon-engine.people-user', [
  'happathon-plugin-generator'
])
.service('user', [
  'pluginGenerator',
  function (pluginGenerator) {
    return pluginGenerator.people({
      name:'happathon-people-john_doe_2014',
      version: "0.0.1",
      name_first:"John",
      name_last:"Doe",
      name_full:"John Doe",
      menu_title:"Me",
      in_groups:['boston_qs','acme_widgets_company_employees'],
      tags:['individual','user','private'],
      email:'',
      address1:'',
      address2:'',
      phone_mobile_num:'',
      phone_alt_num:'',
      age:0,
      birth_year:0,
      birth_month:0,
      birth_day:0,
      time_zone:'GMT-5',
      installed_tabs:{
        happathon_app:{
          settings:{ // stores arbitrary data for the application
            individual:[
              {
                setting:'developer_mode',
                question:"Developer Mode",
                user_configurable:true,
                template:'happathon-form-utils_angular : checkbox.tpl.partial'
              },
              {
                setting:'default_plugin',
                question:'Default Plugin',
                user_configurable:true,
                placeholder:"placeholderText",
                type:'text',
                value:'happathon-insight-status',
                template:'happathon-form-utils_angular : text.tpl.partial'
              }
            ],
            group:[]
          },
          plugins:{
            installed:{
              'happathon-people-somerville':pluginGenerator.people({
                name:'happathon-people-somerville',
                tags:['city','group'],
                name_full:"City of Somerville",
                menu_title:"Somerville",
                user_shared_apis:[],
                people_shared_apis:[]
              }),
              'happathon-people-johns_sister_123':pluginGenerator.people({
                name:'happathon-people-johns_sister_123',
                tags:['individual','family','private'],
                name_full:"Jane D'oh!",
                menu_title:"Jane D'oh!",
                user_shared_apis:[],
                people_shared_apis:[]
              }),
              'happathon-people-user_family':pluginGenerator.people({
                name:'happathon-people-user_family',
                tags:['group','family','private'],
                name_full:"John's Family",
                menu_title:"My Family",
                in_groups:['johndoe_family'],
                user_shared_apis:[],
                people_shared_apis:[]
              }),
              'happathon-people-boston_qs':pluginGenerator.people({
                name:'happathon-people-boston_qs',
                tags:['group','clubs','private'],
                name_full:"Boston QSers Rule Fuhevah!",
                menu_title:"Boston QS"
              }),
              'happathon-people-acme_widgets_company_employees':pluginGenerator.people({
                name:'happathon-people-acme_widgets_company_employees',
                tags:['group','work','private'],
                name_full:"Acme Staff",
                menu_title:"Acme Staff"
              }),
              'happathon-people-friend_bob_123':pluginGenerator.people({
                name:'happathon-people-friend_bob_123',
                tags:['individual','private','work'],
                name_full:"Friend Bob",
                menu_title:"Friend Bob",
                in_groups:['acme_widgets_company_employees']
              }),
              // not adding people yet since we're dynamically constructing them
              // with angular.  That needs to happen on the backend. Perhaps feed
              // the people plugins through the same code that creates them when
              // adding a new one
              "happathon-form-daily":{"name":"happathon-form-daily","menu_title":"Daily Journal","type":"form","display_templates":{"group":["happathon-insight-status : status-custom-test.tpl.html"],"individual":["happathon-insight-utils_angular : heading.tpl.partial","happathon-insight-utils_angular : all-attributes.tpl.partial"]}},"happathon-form-moment":{"type":"form","name":"happathon-form-moment","menu_title":"Capture the Moment","extendable":true,"settings":{"individual":[{"name":"allowed_notification_times","value":{"start":"08:30","end":"21:30"},"template":"happathon-form-utils_angular : time-range.tpl.partial"}]},"display_templates":{"individual":[{"question":"Heading?","placeholder":"placeholderHeading","type":"text","template":"happathon-form-utils_angular : heading.tpl.partial"},{"question":"Text?","placeholder":"placeholderText","type":"text","template":"happathon-form-utils_angular : text.tpl.partial"},{"question":"Where are you?","answers":["Indoors","Outdoors","Home","Work","In transit","Public place"],"others":[],"persist_others":true,"delete_others":true,"other_placement":"append","template":"happathon-form-utils_angular : checkbox.tpl.partial"}],"group":[]}},"happathon-form-values":{"name":"happathon-form-values","type":"form","menu_title":"Values","display_templates":{"group":[],"individual":[{"template":"happathon-insight-utils_angular : heading.tpl.partial"},{"template":"happathon-insight-utils_angular : all-attributes.tpl.partial"}]}},"happathon-insight-explorer":{"name":"happathon-insight-explorer","type":"insight","menu_title":"Explorer","long_description":"Graph two data sources over time.","display_templates":{"group":[{"template":"happathon-insight-status : status-custom-test.tpl.partial"}],"individual":[{"template":"happathon-insight-utils_angular : heading.tpl.partial"},{"template":"happathon-insight-utils_angular : all-attributes.tpl.partial"}]}},"happathon-insight-status":{"name":"happathon-insight-status","type":"insight","menu_title":"Status","long_description":"Overall dashboard. Answers the question 'how is ___ doing?'","display_templates":{"group":[{"template":"happathon-insight-status : status-custom-test.tpl.partial"}],"individual":[{"template":"happathon-insight-utils_angular : heading.tpl.partial"},{"template":"happathon-insight-utils_angular : all-attributes.tpl.partial"}]}}
            },
            market:[]
          }
        },
        happathon_engine:{ // we populate the data here.  We need to define the schema in the happathon engine module
          data:[], // populated by plugin's engine schema
          settings:{
            apis:[] // set by default by the plugin's engine schema defaults
          }

          // app installed
          // app registers with engine
          // app provides data schema, settings schema
          // engine adds default settings to people.
          // engine adds data storage to people based on schema
          //
          //
          //
          // this will go in the happathon engine schema.  Each plugin must provide an engine schema to use it.
          // engine_schema:{
          //   installed_environment:{
          //     apiBaseUrlSuffix:'/installed_environment',
          //     table:true,
          //     primary_key:'user.id',// or something ... talk with folks who know DBs
          //     columns:['type','resolution','make','model','os','imei'],
          //   },
          //   sensors:{
          //     apiBaseUrlSuffix:'/sensors',
          //     light:{
          //       table:true,
          //       columns:['some_primary_key','timestamp','lux','accuracy'],
          //       primary_key:'some_primary_key',
          //       apiBaseUrlSuffix:"/light",
          //       uniqueSourceIdentifier:"edu.mit.media.funf.probe.builtin.LightSensorProbe",
          //       formatExample:'[{"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}]'
          //     },
          //     battery:{
          //       apiBaseUrlSuffix:"/battery",
          //       uniqueSourceIdentifier:"edu.mit.media.funf.probe.builtin.LightSensorProbe",
          //       formatExample:'[{"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}]'
          //     }
          //   },
          //   forms:{
          //   }
          // }
        }
      }
    });
  }
]);

        // '/activeDataSources/'
        // '/discoverableDataSources/'
        // '/hiddenDataSources/'
        // '/sensors':{
        //   '/light':[
        //     {"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.963783}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.972311}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.983740}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.969361}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.992323}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.003813}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.012328}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.980824}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.023900}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.032332}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.043805}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.052325}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.063885}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.072470}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.083867}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.989377}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.092448}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.103931}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.112430}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.123884}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.132421}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.143924}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.152462}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.000917}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.163938}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.172456}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.183936}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.192478}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.203996}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.212527}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.224005}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.232508}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.244009}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.252609}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.009422}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.264018}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.272551}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.284057}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.292781}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.304066}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.312619}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.324117}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.332630}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.344131}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.352772}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.364585}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.372772}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.384151}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.392717}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.404187}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.412739}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.424203}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.020868}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.432675}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.444267}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.452742}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.464284}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.472787}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.484253}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.492787}, {"accuracy":0,"lux":39.0,"timestamp":1384546939.924100}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.103835}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.113956}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.124035}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.133960}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.143988}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.154827}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.164003}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.174013}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.184040}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.194033}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.204039}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.214848}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.224101}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.234164}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.244084}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.504264}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.254102}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.264132}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.274974}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.284144}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.294229}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.304207}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.314186}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.324165}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.334969}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.344295}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.354211}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.364170}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.374170}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.384188}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.395045}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.404285}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.414299}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.424274}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.434276}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.444274}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.455038}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.464292}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.474334}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.484341}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.494302}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.504326}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.515176}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.524319}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.534317}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.544329}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.512802}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.554338}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.564394}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.575147}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.584366}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.594383}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.604386}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.614410}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.624439}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.635240}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.644440}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.654510}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.664500}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.674466}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.684465}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.695309}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.704545}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.714554}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.724562}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.734571}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.744533}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.755344}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.764552}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.774601}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.784561}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.794571}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.804648}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.815421}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.824676}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.834730}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.844695}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.029388}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.524281}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.854715}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.864745}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.875508}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.884792}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.894918}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.904786}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.914773}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.924934}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.935577}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.944789}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.954961}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.964811}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.974829}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.984843}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.995629}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.004943}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.014845}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.024968}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.034918}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.044973}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.055619}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.064836}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.074850}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.084850}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.094863}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.104911}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.115712}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.124963}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.134957}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.144939}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.532803}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.154956}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.164991}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.175835}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.184973}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.195142}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.205010}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.215072}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.225115}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.235860}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.245010}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.255027}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.265071}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.275072}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.285093}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.295922}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.305187}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.315131}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.325230}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.335171}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.345164}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.356056}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.365195}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.375222}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.385174}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.395197}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.405199}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.416123}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.425244}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.435264}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.445287}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.455347}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.465342}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.476099}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.485343}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.495359}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.505386}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.515370}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.525430}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.536242}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.545436}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.544318}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.555437}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.565564}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.575490}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.585463}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.596441}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.605529}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.615635}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.625497}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.635522}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.645508}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.656373}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.665530}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.675541}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.685578}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.695615}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.705587}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.716383}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.725587}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.735609}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.745616}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.552830}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.755638}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.765669}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.776476}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.785716}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.795664}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.805737}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.815703}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.825725}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.836506}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.845807}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.855867}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.865728}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.875826}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.885800}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.896626}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.905881}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.915865}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.925874}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.935833}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.945837}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.956664}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.965893}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.975900}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.985923}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.995927}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.005933}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.016721}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.025971}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.036011}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.046021}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.056031}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.066117}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.076869}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.086122}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.096084}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.106078}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.116066}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.126035}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.136800}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.146026}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.564417}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.156012}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.166039}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.176039}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.186106}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.196844}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.206052}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.216082}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.226083}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.236170}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.246209}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.257051}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.266351}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.276238}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.286303}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.296283}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.306291}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.317081}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.326349}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.336262}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.346275}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.356104}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.366109}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.376926}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.386127}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.396186}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.406204}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.416262}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.426239}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.436976}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.446211}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.572863}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.456215}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.466260}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.476282}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.486304}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.497070}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.506294}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.516312}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.526337}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.536268}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.546297}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.557132}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.566326}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.576342}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.586354}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.596369}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.606350}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.617149}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.626421}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.636426}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.646368}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.656419}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.666426}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.677274}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.686456}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.696459}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.706432}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.716443}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.726470}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.737296}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.746517}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.584361}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.756541}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.766533}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.776567}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.786640}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.797431}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.806625}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.816589}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.826571}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.836581}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.846671}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.040873}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.857459}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.866687}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.876719}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.886735}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.896691}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.906780}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.917557}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.926784}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.936792}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.946836}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.956840}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.966803}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.977655}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.986885}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.996837}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.006925}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.016843}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.026882}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.037678}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.046937}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.592889}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.604402}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.612897}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.624408}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.632959}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.644419}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.652958}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.664677}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.672988}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.684485}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.764645}, {"accuracy":0,"lux":37.0,"timestamp":1384546967.604436}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.773120}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.049422}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.784682}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.793172}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.804683}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.813179}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.824702}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.833201}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.844719}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.853135}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.864648}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.873135}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.060948}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.884706}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.893156}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.904688}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.913171}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.924685}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.933185}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.944677}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.953220}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.964685}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.973229}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.069445}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.984718}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.993273}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.004792}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.013297}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.024772}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.033307}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.044786}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.053331}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.064785}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.073316}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.080964}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.084804}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.093336}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.104852}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.113375}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.124872}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.133398}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.144864}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.153497}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.164907}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.173437}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.089518}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.185047}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.193449}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.205814}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.213457}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.224941}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.233486}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.244984}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.253508}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.264998}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.273540}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.101066}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.285003}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.293531}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.305009}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.313547}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.325033}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.333568}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.345048}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.680605}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.109519}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.353584}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.365069}, {"accuracy":0,"lux":31.0,"timestamp":1384547047.717473}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.373606}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.385100}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.393690}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.405153}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.413684}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.425195}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.433751}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.445254}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.453843}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.465309}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.473824}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.120978}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.485273}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.493796}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.505307}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.513807}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.525303}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.533783}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.545309}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.553806}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.565300}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.573826}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.129525}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.585304}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.593829}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.605305}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.613848}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.625345}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.633880}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.645345}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.653918}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.665379}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.673912}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.689142}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.140996}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.685404}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.693939}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.705433}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.713971}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.725425}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.734038}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.745565}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.754092}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.765538}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.774082}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.149533}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.785554}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.794088}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.805564}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.814056}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.825536}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.834059}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.845538}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.854076}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.748096}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.807660}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.817776}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.827807}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.837807}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.847804}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.858636}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.867866}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.877942}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.887950}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.897866}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.907947}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.918656}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.927950}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.937939}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.947929}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.957974}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.967934}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.978779}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.987958}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.865566}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.998006}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.008032}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.018033}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.028054}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.038882}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.048098}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.058087}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.068042}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.078113}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.088094}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.099008}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.108105}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.118129}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.128211}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.138137}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.148174}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.158948}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.168205}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.178257}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.188241}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.198220}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.208203}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.219048}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.228281}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.238240}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.248323}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.258398}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.268336}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.279141}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.288329}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.874111}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.298314}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.308337}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.318404}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.328440}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.339160}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.348409}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.358376}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.368443}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.378412}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.388450}
        //   ],
        //   '/battery':[
        //     {"health":2,"icon-small":17303197,"invalid_charger":0,"level":80,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":273,"timestamp":1384547187.358,"voltage":3983}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":80,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":283,"timestamp":1384547334.426,"voltage":4008}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":82,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":228,"timestamp":1384546800.425,"voltage":4063}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":82,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":228,"timestamp":1384546837.111,"voltage":4063}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":81,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":259,"timestamp":1384546888.565,"voltage":4004}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":79,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":285,"timestamp":1384547633.266,"voltage":4015}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":78,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":272,"timestamp":1384547933.307,"voltage":4026}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":78,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":287,"timestamp":1384548233.208,"voltage":4005}
        //   ]
        // },





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
      screenshots:['screenshots/example1.jpg','screenshots/example2.jpg','screenshots/example3.jpg'] // url for screenshots, relative to plugin dir
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
    provided_apis:[]
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
    }
  };
}]);
})( window, window.angular );
