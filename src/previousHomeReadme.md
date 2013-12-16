# The `src/app/holon` Directory

/**
 * 
 * From http://en.wikipedia.org/wiki/Holon_(philosophy)
 * A holon (Greek: ὅλον, holon neuter form of ὅλος, holos "whole") is something that is simultaneously a whole and a part.
 * 
 * A person consists of cells, and a family consists of persons.  A cell, a person, a friendship, a family, a business, a city, a country, a planet, are all holons.  It is likely that individual human well-being is determined largely by their holons, so this architecture enables simultaneous data display across multiple holons.

 * This directory contains templates to display different holon types (e.g., city, human).
 * Subdirectories  as well as some default holons in subdirectories., and  types folder contains Me is a default holon, and defines specific presentation attributes for the holon
 * Templates in the src/app/holon directory define this presentation
 */

## Overview
```
src/
  |- app/
  |  |- holon/
  |  |  |- me/
  |  |  |  |- me-config.json
  |  |  |- somerville/
  |  |  |  |- somerville-config.json
  |  |  |- holon-user.tpl.html
  |  |  |- holon-human.tpl.html
  |  |  |- holon-city.tpl.html
  |  |  |- holon-user.less
  |  |  |- holon-human.less
  |  |  |- holon-city.less
  |  |  |- holon-module.less
  |  |  |- home.less
  |  |  |- home.less
  |  |  |- home.spec.js
  |  |  |- home.tpl.html
```

- `me/me-config.json` - defines default holon attributes, including presentation template
- `holon-user.tpl.html` - display template for holon type 'user'
- `holon-human.tpl.html` - display template for holon type 'human'
- `holon-city.tpl.html` - display template for holon type 'city'
- `holon-module.js` defines the angular module
- `holon-spec.js` - module unit tests.

## `holon-module.js`

The dependencies block is also where component dependencies should be
specified, as shown below.  As long as dependencies for each module are specified, the
the build system takes care of pulling them together correctly.

```js
angular.module( 'happathon.holon', [
  'ui.state', // optional dependencies here
])
```

Each section or module of the site can also have its own routes. AngularJS will
handle ensuring they are all available at run-time, but splitting it this way
makes each module more self-contained. We use [ui-router](https://github.com/angular-ui/ui-router) to create
a state for our 'home' page. We set the url we'd like to see in the address bar
as well as the controller and template file to load. Specifying "main" as our view
means the controller and template will be loaded into the <div ui-view="main"/> element
of the root template (aka index.html). Read more over at the [ui-router wiki](https://github.com/angular-ui/ui-router/wiki).
Finally we add a custom data property, pageTitle, which will be used to set the page's
title (see the app.js controller).

```js
.config(['$stateProvider', function ( $stateProvider ) {
  $stateProvider.state( 'holon-user', {
    url: '/holon',
    views: {
      "main": {
        controller: 'HomeCtrl',
        templateUrl: 'home/home.tpl.html'
      }
    },
    data:{ pageTitle: 'Home' }
  });
}])
```

And of course we define a controller for our route, though in this case it does
nothing.

```js
.controller( 'HomeCtrl', function HomeController( $scope ) {
})
```
