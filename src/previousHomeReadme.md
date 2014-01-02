# The `src/app/people` Directory

/**
 *
 * From http://en.wikipedia.org/wiki/People_(philosophy)
 * A people (Greek: ὅλον, people neuter form of ὅλος, holos "whole") is something that is simultaneously a whole and a part.
 *
 * A person consists of cells, and a family consists of persons.  A cell, a person, a friendship, a family, a business, a city, a country, a planet, are all people.  It is likely that individual human well-being is determined largely by their people, so this architecture enables simultaneous data display across multiple people.

 * This directory contains templates to display different people types (e.g., city, human).
 * Subdirectories  as well as some default people in subdirectories., and  types folder contains Me is a default people, and defines specific presentation attributes for the people
 * Templates in the src/app/people directory define this presentation
 */

## Overview
```
src/
  |- app/
  |  |- people/
  |  |  |- me/
  |  |  |  |- me-config.json
  |  |  |- somerville/
  |  |  |  |- somerville-config.json
  |  |  |- people-user.tpl.html
  |  |  |- people-human.tpl.html
  |  |  |- people-city.tpl.html
  |  |  |- people-user.less
  |  |  |- people-human.less
  |  |  |- people-city.less
  |  |  |- people-module.less
  |  |  |- home.less
  |  |  |- home.less
  |  |  |- home.spec.js
  |  |  |- home.tpl.html
```

- `me/me-config.json` - defines default people attributes, including presentation template
- `people-user.tpl.html` - display template for people type 'user'
- `people-human.tpl.html` - display template for people type 'human'
- `people-city.tpl.html` - display template for people type 'city'
- `people-module.js` defines the angular module
- `people-spec.js` - module unit tests.

## `people-module.js`

The dependencies block is also where component dependencies should be
specified, as shown below.  As long as dependencies for each module are specified, the
the build system takes care of pulling them together correctly.

```js
angular.module( 'happathon.people', [
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
  $stateProvider.state( 'people-user', {
    url: '/people',
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
