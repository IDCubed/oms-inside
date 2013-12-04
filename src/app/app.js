var happ = angular.module( 'happathon', [
  'templates-app',
  'templates-common',
  'ui.router',
  'restangular',
  'happathon.insight',
  'happathon.settings',
  'happathon.challenge',
  // 'happathon.form',
  'happathon.holon'
])

.config( ['$stateProvider','$urlRouterProvider','RestangularProvider',
  function myAppConfig ( $stateProvider, $urlRouterProvider, RestangularProvider) {

    // Define Restangular settings for back-end sync
    RestangularProvider.setBaseUrl('/api/v0/');
    RestangularProvider.setListTypeIsArray(false);
    RestangularProvider.setRestangularFields({
      selfLink: 'meta.updatelink'
    });
    RestangularProvider.setResponseExtractor(function(response, operation, what,something,something2) {
      console.log('extractor response',response);
      // console.log('extractor operation',operation);
      // console.log('extractor what',what);
      // console.log('extractor something',something);
      // console.log('extractor something2',something2);
      return operation === 'getList' ?
        response :
        response[what];
    });


    /**
     * States
     */


    // State factory fn since most states follow a consistent format.
    function stateFactory(stateObj){
      var names = stateObj.name.split('.');
      var i = 1;
      var L = names.length;

      var obj = {
        name:stateObj.name,
        url:'/'+ names.slice(-1).join('/')
      };

      // if there is no controller, make it an abstract state so its children can
      // inherit the root deferred object and not display until it resolves.
      // https://github.com/angular-ui/ui-router/wiki/Nested-States-%26-Nested-Views#abstract-states
      if(!stateObj.ctrl){
        obj.template = '<ui-view/>';
        obj.abstract = true;
      } else{
        // make it a normal child state
        // we want these to inherit the resolve deferred on the root state,
        // so make them children.  However, there's no need to create
        // a blank insight template just to hold its children, so these should
        // display in the parent's scope via the "@" absolute path
        obj.views={
          'main@':{
            templateUrl: function(params){
              var i = 1;
              var L = names.length;
              var templateUrl = '';
              for ( ; i < L; i++) {
                templateUrl += names[i] +'/';
              }
              templateUrl += names[i-1] +'.tpl.html';
              return templateUrl;
            },
            controller: stateObj.ctrl
          }
        };
      }
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
        holonAPI:['holonApiPromise', '$rootScope', '$state','$stateParams',
          function(holonApiPromise, $rootScope, $state, $stateParams){
          // console.log('resolving holonApiPromise',holonApiPromise);
          holonApiPromise.then(function(holonObj){
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.holons = holonObj.list;
            $rootScope.activeHolon = holonObj.active;

          });
          return holonApiPromise;
        }]
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
    stateFactory({name:'root.insight'});
    stateFactory({name:'root.insight.status', ctrl:'InsightCtrl'});
    stateFactory({name:'root.insight.list', ctrl:'InsightCtrl'});
    stateFactory({name:'root.challenge'});
    stateFactory({name:'root.challenge.list',ctrl:'ChallengeCtrl'});
    stateFactory({name:'root.challenge.add',ctrl:'ChallengeCtrl'});
    stateFactory({name:'root.settings'});
    stateFactory({name:'root.settings.all', ctrl:'SettingsCtrl'});
    stateFactory({name:'root.plugins'});
    stateFactory({name:'root.plugins.list',ctrl:'PluginsCtrl'});
    stateFactory({name:'root.plugins.add',ctrl:'PluginsCtrl'});






    // define where to go if no state matched
    $urlRouterProvider.otherwise("/human/insight/status");
  }
])


.directive('hapSize', ['$timeout','$window', function ($timeout, $window) {
  var runs = 0;
  return {
    restrict: 'A',
    link: function (scope, iElement, iAttrs, holons) {
      // this function runs on each menu creation loop
      // only let it run on the last loop
      scope.holons[runs].menuvis = false;
      if(++runs < scope.holons.length){
        return;
      }

      function size(){

        var wHeight = $window.innerHeight;
        var wWidth = $window.innerWidth;
        var container = angular.element('.main-container');

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
        var menuToggleSize = px(25);
        container.find('.menu-toggle').css({
          height:menuToggleSize,
          width:menuToggleSize
        });


        var menu = angular.element('.panel');
        // console.log('(menuToggleSize+30)+px',(menuToggleSize+30)+'px');
        menu.css({
          bottom:px(26),
          fontSize:px(3.5)
        });

        var menuBody = angular.element('.panel-body');
        var guttersWidth = 40;
        var columns = 3;
        var buttonWidth = ((menuBody.width() - guttersWidth) / columns)+'px';
        menuBody.find('.btn').each(function(){
          angular.element(this).css({
            height:buttonWidth,
            width:buttonWidth
          });
        });

        angular.element('.splash').addClass('hidden');
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
}]);
