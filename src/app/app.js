var happ = angular.module( 'happathon', [
  'html_templates_jsfied',
  'ui.router',
  'ngTouch',
  // 'happathon-engine',
  // 'happathon-engine.holon-johndoe',
  // 'happathon-engine.holon-somerville',
// {{concat.dynamically_add_dependencies_to_appjs.modules}}
])
// {{concat.dynamically_add_dependencies_to_appjs.services}}

.config( ['$stateProvider','$urlRouterProvider','RestangularProvider',
  function myAppConfig ( $stateProvider, $urlRouterProvider, RestangularProvider) {

    /**
     * States
     */


    // State factory fn since most states follow a consistent format.
    function stateFactory(stateObj){
      var o = angular.copy(stateObj);
      var names = o.name.split('.');
      var i = 1;
      var L = names.length;

      var obj = {
        name:o.name,
        url:names.slice(1).join('/'),
        controller: o.ctrl
      };
      // if there is no controller, make it an abstract state so its children can
      // inherit the root deferred object and not display until it resolves.
      // https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#abstract-states
      if(!o.ctrl){
        obj.template = '<ui-view/>';
        obj.abstract = true;
      }
      console.log('state obj',obj);
      // else{
        // make it a normal child state
        // we want these to inherit the resolve deferred on the root state,
        // so make them children.  However, there's no need to create
        // a blank insight template just to hold its children, so these should
        // display in the parent's scope via the "@" absolute path
        // obj.views={
        //   'main@':{
        //     templateUrl: function(params){
        //       var i = 1;
        //       var L = names.length;
        //       var templateUrl = '';
        //       for ( ; i < L; i++) {
        //         templateUrl += names[i] +'/';
        //       }
        //       templateUrl += names[i-1] +'.tpl.html';
        //       return templateUrl;
        //     },
        //     controller: stateObj.ctrl
        //   }
        // };
      // }
      $stateProvider.state(obj);
    }


    // root state
    $stateProvider
    .state({
      url:'/{holonType}',
      name:'root',
      abstract:true,
      template:'<ui-view/>',
      resolve:{
        // waits to resolve the state until the holons list has returned.
        holonAPI:[
          '$rootScope',
          '$state',
          '$stateParams',
          'HolonJohnDoe',
          'HolonSomerville',
          function($rootScope, $state, $stateParams, HolonJohnDoe, HolonSomerville){
            console.log('resolving holonAPI',HolonJohnDoe,HolonSomerville);
            $rootScope.holons = [HolonJohnDoe, HolonSomerville];
            $rootScope.activeHolon = HolonJohnDoe;
            // holonApiPromise.then(function(holonObj){
            //   // not especially fond of putting all params on rootscope, but this works for quick prototyping.
            //   $rootScope.$state = $state;
            //   $rootScope.$stateParams = $stateParams;
            //   $rootScope.holons = holonObj.list;
            //   $rootScope.activeHolon = holonObj.active;
            //   $rootScope.tabs = tabsDynamicData;
            //   $rootScope.plugs = tempPluginsObj;

            // });
            return $rootScope.holons;
            // return holonApiPromise;
          }
        ]
      },
      views:{
        'menus@':{
          templateUrl:'holon/holon-menus.tpl.html',
          controller:'HolonCtrl'
        }
      }
    });

    // child states triggered by menu buttons
    // the last part of the name is also the template name it will look to load
    // e.g., name:'insight.status'  loads 'insight/status/status.tpl.html'

    stateFactory({name:'root.mainview', ctrl:'MainViewCtrl'});
    stateFactory({name:'root.topnav', ctrl:'TopNavCtrl'});
    stateFactory({name:'root.leftmenu', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.individuals', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.groups', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.insights', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.forms', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.challenges', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.apis', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.installed.algorithms', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.individuals', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.groups', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.insights', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.forms', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.challenges', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.apis', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.leftmenu.market.algorithms', ctrl:'LeftMenuCtrl'});
    stateFactory({name:'root.rightmenu', ctrl:'RightMenuCtrl'});

    // stateFactory({name:'root.insight.status', ctrl:'InsightCtrl'});
    // stateFactory({name:'root.insight.list', ctrl:'InsightCtrl'});
    // stateFactory({name:'root.challenge'});
    // stateFactory({name:'root.challenge.list',ctrl:'ChallengeCtrl'});
    // stateFactory({name:'root.challenge.add',ctrl:'ChallengeCtrl'});
    // stateFactory({name:'root.settings'});
    // stateFactory({name:'root.settings.all', ctrl:'SettingsCtrl'});
    // stateFactory({name:'root.plugin'});
    // stateFactory({name:'root.plugin.list',ctrl:'PluginCtrl'});
    // stateFactory({name:'root.plugin.add',ctrl:'PluginCtrl'});
    // stateFactory({name:'root.form'});
    // stateFactory({name:'root.form.moment',ctrl:'FormCtrl'});






    // define where to go if no state matched
    $urlRouterProvider.otherwise("/human/insight/status");
  }
])

.controller("MainViewCtrl", ['$scope',function($scope){
  // $scope.showmenu=false;
  $scope.toggleLeftMenu = function(){
    $scope.showmenu = !$scope.showmenu;
  };
}])
.controller("TopNavCtrl", ['$scope',function($scope){
  // $scope.showmenu=false;
  $scope.toggleLeftMenu = function(){
    $scope.showmenu = !$scope.showmenu;
  };
}])
.controller("RightMenuCtrl", ['$scope',function($scope){
  // $scope.showmenu=false;
  $scope.toggleRightMenu = function(){
    $scope.showmenu = !$scope.showmenu;
  };
}])

.service('pluginBase', [function () {
  return {
    type:null,
    version: '0.0.0',
    description: "default plugin description, based loosely on CommonJS packages",
    keywords: ["package", "example"],
    maintainers: [
      {"name": "Example Name", "email": "example@example.com", "web": "http://www.example.com"}
    ],
    contributors: [
      {"name": "Example Anothername", "email": "example2@example.com", "web": "http://www.example.com"}
    ],
    issues: {"mail": "dev@example.com", "web": "http://www.example.com/issues"},
    licenses: [
      {"type": "MIT", "url": "http://www.example.org/licenses/mit.html"}
    ],
    repositories: {
      canonical:{"type": "git", "url": "http://hg.example.com/mypackage.git"},
      mirror:{"type": "git", "url": "http://hg.example.com/mypackage.git"}
    },
    dependencies:{},
    devDependencies:{}
  };
}])

/*
<h2>Plugins List</h2>
<div ng-repeat="(key,plugin) in tabs.happathon_app.plugins">
  <h3>
    {{key}}
  </h3>
  <hr>
  <div ng-repeat="(k,plug) in plugin">
    <pre>{{k}}:{{plug}}</pre>
  </div>
</div>
 */

.directive('hapSize', ['$timeout','$window', function ($timeout, $window) {
  var runs = 0;
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs, holons) {
      // this function runs on each menu creation loop
      // only let it run on the last loop
      // scope.holons[runs].menuvis = false;
      // if(++runs < scope.holons.length){
      //   return;
      // }

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


/** mobile slide demo */
.directive('LeftMenu', ['$swipe',
  function($swipe) {
    return {
      restrict: 'EA',
      link: function(scope, ele, attrs, ctrl) {
        var startX, pointX;
        $swipe.bind(ele, {
          'start': function(coords) {
            startX = coords.x;
            pointX = coords.y;
          },
          'move': function(coords) {
            var delta = coords.x - pointX;
            // ...
          },
          'end': function(coords) {
            // ...
          },
          'cancel': function(coords) {
            // ...
          }
        });
      }
    };
  }
])




.service('app.happathon.json', [function () {

  var happathon_engine_settings = {
    dependencies:{
      happathon_form_start:'0.0.1',
      happathon_form_moment:'0.0.1',
      happathon_form_daily:'0.0.1',
      happathon_form_quarterly:'0.0.1'
    },
    settings:{
      // extended by each dependency.
      // We can override the dependencies' settings here
      // since we control the dependencies, we can just specify in them instead.
    },
    data_schema:{
      installed_environment:{
        apiBaseUrlSuffix:'/installed_environment',
        table:true,
        primary_key:'user.id',// or something ... talk with folks who know DBs
        columns:['type','resolution','make','model','os','imei'],
      },
      sensors:{
        apiBaseUrlSuffix:'/sensors',
        light:{
          table:true,
          columns:['some_primary_key','timestamp','lux','accuracy'],
          primary_key:'some_primary_key',
          apiBaseUrlSuffix:"/light",
          uniqueSourceIdentifier:"edu.mit.media.funf.probe.builtin.LightSensorProbe",
          formatExample:'[{"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}]'
        },
        battery:{
          apiBaseUrlSuffix:"/battery",
          uniqueSourceIdentifier:"edu.mit.media.funf.probe.builtin.LightSensorProbe",
          formatExample:'[{"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}]'
        }
      },
      forms:{
      }
    }

  };
  return happathon_engine_settings;
}]);
