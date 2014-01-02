# [The H(app)athon Project](https://github.com/IDCubed/oms-happathon) [![Build Status](https://travis-ci.org/IDCubed/oms-happathon.png?branch=master)](https://travis-ci.org/IDCubed/oms-happathon)

***

## Quick Start

[Install Node.js](http://nodejs.org/) and then:

```sh
$ git clone git@github.com:IDCubed/oms-happathon.git    # copy repo to your computer
$ cd oms-happathon    # change to happathon directory
$ npm -g install grunt-cli karma bower    # installs grunt-cli,karma,bower (mac/linux add sudo)
$ npm install    # installs node dependencies in a /node_modules/ directory (mac/linux add sudo)
$ bower install    # installs js/css dependencies in your /app/vendor directory
$ grunt watch
```

Unit tests will run in a new browser window.
`localhost:8000/#/` will open in your default browser.

And Boom!  You're set up to hack on any of the project's HTML/JavaScript/AngularJS code.  Making changes to those files in the src/ directory will also reload your page automatically.  Happy hacking!

##What next?

For issues to get started on, check out our [issues page](issues).  If you don't see one that interests you, ask!  There are other things not on that list.

We're currently looking for:
- Data Visualizers to make well-being insights intuitive
- Android developer(s) to display html app in webview, set up notifications, and integrate sensor library
- iPhone developer(s) for the same
- UI Developers (HTML/JavaScript/CSS/Angular)
- UX designers to make the app is useful and enjoyable

To ask questions, check out [Communication](#communication) or join one of the [Meetups](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/).

To Beta test the app when it's ready, join the [Beta Testers Google Group](https://groups.google.com/forum/#!forum/happathon).

Learn more about or the project in general at [Meetup](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/about/), and tech in particular by reading on below.



## Pilot Goal

Increase participating Somerville residents' well-being (as each defines it) by 2% over baseline by 12/31/2014.

## Philosophy

**Self-defined well-being**
Our key differentiator is that we do not attempt to apply a “one size fits all” approach. Well-being is inherently subjective and differs with different people’s needs and perceptions. Thus this application will apply machine learning to customize a personal wellbeing index for each user, then aggregate our personal indices for a community index. As our perceptions and communities change over time, the aggregate indices change with us.

**Separate Measure from Improve (Engine and Application)**
There are [many](http://emotionsense.org/) [happiness-related](https://www.happier.com/) [applications](http://www.happsee.com/).  There is no standard way mobile applications measure happiness.  We're building the Happathon Engine, a happiness measurement tool co-designed with psychologists that any mobile happiness app can include.  That way developers can spend less time measuring well-being, and more time improving it.  To [dogfood](http://en.wikipedia.org/wiki/Eating_your_own_dog_food) it, we're also building the Happathon Application designed to measurably improve well-being.

**Empower Community**
TODO (community visualizations, question additions, challenges)

**Rapid Iteration**
A web app to run in iPhone and Android to iterate quickly, combined with a mobile sensor library to gain rich data for insights.  On Android, the application runs in a webview paired with the sensor library funf journal or emotionsense libraries.

**Usefulness**
Only questions that have obvious usefulness.




## Architecture
- plugin management with bower
- all functionality that can be a plugin, should be a plugin
- plugins contain no renderer-specific code (e.g., angular) so plugin
  developers do not need to know the rendering framework, and we can
  switch ui rendering frameworks to any platform without plugins changes
  (if we switch renderers, unit tests in plugins may go wonky.  Need to
  think about how to resolve that)
  Unit tests alongside the code they are testing.
- end-to-end tests in separate directory
- The build system should integrate plugins into the UI automatically.
  Components should end up tested, linted, compiled,
  and minified, ready for use in a production environment.
- *Encourages* test-driven development. It's the only way to code.
- A directory structure that is cogent, meaningful to new team members, and
  supporting of the above points.
- Well-documented, to show new developers *why* things are set up the way they
  are.  If you see something that's unclear, please submit a pull request if
  you understand it, or open an issue if you don't.
- Errors shouldn't just tell you what broke.  They should tell you how to fix it.

## Learn

### Overall Directory Structure

At a high level, the structure looks roughly like this:
\* Note: All plugins will eventually be separate git repositories. They're placed a plugins directory to encourage modularity and act as if they were installed.

```
oms-happathon/
  |- .jshintrc // file syntax checking
  |- bower_components/ // all bower components, including 3rd party libraries and happathon plugins
  |  |- happathon-challenge-utils/ // provides utils to make a challenge from
  |  |  |- challenge-config.js // provides a config object to the challenge module
  |  |  |- challenge-base.tpl.html
  |  |  |- challenge.less
  |  |  |- challenge-part-analysis.tpl.html
  |  |  |- challenge-part-chart.tpl.html
  |  |- happathon-challenge-2kind/
  |  |  |- 2kind-config.js
  |  |  |- 2kind.tpl.html
  |  |  |- 2kind.less
  |  |- happathon-challenge-somerville-happiness-research/ // provides json for somerville happiness survey
  |  |  |- somerville-happiness-research-config.js
  |  |- happathon-challenge-happathon-research/ // provides json for start and quarterly surveys
  |  |  |- happathon-research-config.js
  |  |- happathon-insight-miner/ // explorers let you play with the data, then click to share cool visualizations as a plugin
  |  |  |  |- insight-miner-module.js
  |  |  |  |- insight-miner-spec.js
  |  |  |  |- insight-miner.tpl.html
  |  |- happathon-insight-status/ // status insight
  |  |  |  |- insight-status-module.js
  |  |  |  |- insight-status-spec.js
  |  |  |  |- insight-status.tpl.html
  |  |- insight-utils/ provides a base module and utilities for building insights
  |  |  |  |- insight-module.js
  |  |  |  |- insight-spec.js
  |  |  |  |- insight-base.tpl.html
  |  |  |  |- insight-part-analysis.tpl.html
  |  |  |  |- insight-part-chart.tpl.html
  |  |  |  |- insight-part-chart.tpl.html
  |  |- happathon-utils/ // templates, controllers, services, directives, used in multiple app places
  |  |- happathon-engine/
  |  |  |- engine-module.js //
  |  |  |- engine-spec.js
  |  |  |- api/
  |  |  |  |- settings-api-module.js // accepts json objects to configure the engine settings and optionally additional settings to store
  |  |  |  |- settings-api-spec.js // unit tests
  |  |  |  |- routing-api-module.js // provides routing to forms and api
  |  |  |  |- routing-api-spec.js // routing unit tests
  |  |  |  |- people-api-module.js // provides people CRUD api
  |  |  |  |- people-api-spec.js // people unit tests
  |  |  |  |- form-api-module.js // provides form gen/config api. Defines states for routing api. Passes instructions to form-module.js
  |  |  |  |- form-api-spec.js // form unit tests
  |  |  |  |- auth-service.js // authorizationa/authentication services that provide apis with promises
  |  |  |  |- auth-spec.js // authorizor unit tests
  |  |  |- assets/
  |  |  |  |- <static files>
  |  |  |- form/
  |  default form part json for form-module to extend with incoming config objects
  |  |  |  |- form-spec.js // form module unit tests - contains defaults
  |  |  |  |- moment.json // +moment form
  |  |  |  |  |- daily.json // daily form
  |  |  |  |  |- form.less // form styles
  |  |  |  |  |- form-base.tpl.html // form container to render forms in
  |  |  |  |  |- form-multi-page-base.tpl.html
  |  |  |- form-utils/ // contains form templates and custom directives
  |  |  |  |  |- checkbox-tpl.html
  |  |  |  |  |- add-custom-tpl.html
  |  |  |  |  |- add-custom-with-relationship.tpl.html
  |  |  |  |  |- radio-tpl.html
  |  |  |  |  |- text-tpl.html
  |  |  |  |  |- textarea-tpl.html
  |  |  |  |  |- select-tpl.html
  |  |  |  |  |- multiselect-tpl.html
  |  |  |  |  |- slider-7point-tpl.html
  |  |  |  |  |- grid-10x10-tpl.html
  |  |  |  |  |- button-submit-tpl.html
  |  |  |  |  |- button-continue-tpl.html
  |  |  |- people-types/
  |  |  |  |  |- people-type-city-module.js // extends base with properties specific to city peoples and returns json obj
  |  |  |  |  |- people-type-human-module.js // extends base with properties specific to human peoples and returns json obj
  |  |  |- mock-backend/
  |  |  |  |  |- mock-backend-module.js // provides back end CRUD interface to all APIs
  |  |  |  |  |- mock-backend-spec.js
  |  |  |  |  |- people-somerville-module.js // extends people-type-city-module with somerville specific details and data
  |  |  |  |  |- people-johndoe-module.js // extends people-type-human-module with johndoe specific details and data
  |  |  |- settings/
  |  |  |  |  |- settings.tpl.html // to display a people's settings
  |  |  |  |  |- settings-module.js // provides fns for people-api-module.js to CRUD people settings
  |- bower.json // bower dependencies stored in bower_components
  |- build.config.js // build configuration variables
  |- e2e-tests/ // mocha + chai code to test user scenarios involving multiple screens
  |- Gruntfile.js // build configuration
  |- karma/ // testing configuration
  |- module.prefix // anon function to prefix compiled/minified js
  |- module.suffix // anon function to suffix compiled/minified js
  |- package.json // node package dependencies
  |- travis.yml // enables continuous integration
  |- src/ // contains all the raw source files
  |  |- happathon-android/ // contains all code that runs on android
  |  |- assets/
  |  |  |- <static files>
  |  |- app/ // the happathon app
  |  |  |- index.html
  |  |  |- app.js // routing, engine api interaction, plugin base
  |  |  |- app.spec.js
  |  |  |- app.less // styles
  |  |  |- people-module.js // handles people display
  |  |  |- people-spec.js
  |  |  |- insight-base.tpl.html
  |  |  |- plugin-list.tpl.html
  |  |  |- plugin-adding-instructions.tpl.html  // instructions for how to add a plugin
  |  |  |- mock-backend-module.js
  |  |  |- settings-config-module.js // provides app specific settings schema with default for the engine to store
  |  |  |- people-type-base-module.js // contains the base people json for new people types to extend


```

What follows is a brief description of each entry, but most directories contain
their own `README.md` file with additional documentation, so browse around to
learn more.

- `e2e-tests/` - contain end-to-end test scripts
- `karma/` - test configuration.
- `src/` - our application sources. [Read more &raquo;](src/README.md)
- `vendor/` - third-party libraries. [Bower](http://bower.io) will install
  packages here. Anything added to this directory will need to be manually added
  to `build.config.js` and `karma/karma-unit.js` to be picked up by the build
  system.
- `.bowerrc` - the Bower configuration file. This tells Bower to install
  components into the `vendor/` directory.
- `.jshintrc` - a configuration file to standardize JSHint code linting
- `bower.json` - this is our project configuration for Bower and it contains the
  list of Bower dependencies we need.
- `build.config.js` - our customizable build settings; see "The Build System"
  below.
- `Gruntfile.js` - our build script; see "The Build System" below.
- `module.prefix` and `module.suffix` - our compiled application script is
  wrapped in these, which by default are used to place the application inside a
  self-executing anonymous function to ensure no clashes with other libraries.
- `package.json` - metadata about the app, used by NPM and our build script. Our
  NPM dependencies are listed here.

### Detailed Installation

This section provides a little more detailed understanding of what goes into
getting `oms-happathon` up and running. Though `oms-happathon` is really simple
to use, it might help to have an understanding of the tools involved here, like
Node.js and Grunt and Bower. If you're completely new to highly organized,
modern JavaScript development, take a few short minutes to read [this overview
of the tools](tools.md) before continuing with this section.

Okay, ready to go? Here it is:

`oms-happathon` uses [Grunt](http://gruntjs.org) as its build system, so
[Node.js](http://nodejs.org) is required. Also, Grunt by default no longer comes
with a command-line utility and Karma and Bower must end up in your global path
for the build system to find it, so they must be installed independently. Once
you have Node.js installed, you can simply use `npm` to make it all happen:

```sh
$ npm -g install grunt-cli karma bower
```

If you're on Linux (like I am) then throw `sudo` in front of that command.  If
you're on Windows, then you're on your own.

Next, you can either clone this repository using Git, download it as a zip file
from GitHub, or merge the branch into your existing repository. Assuming you're
starting from scratch, simply clone this repository using git:

```sh
$ git clone git@github.com:IDCubed/oms-happathon.git oms-happathon
$ cd oms-happathon
```

And then install the remaining build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `oms-happathon`, like Twitter Bootstrap
and Angular UI, which are listed in `bower.js`. To install them into the
`vendor/` directory, simply run:

```sh
$ bower install
```

In the future, should you want to add a new Bower package to your app, run the
`install` command:

```sh
$ bower install packagename --save-dev
```

The `--save-dev` flag tells Bower to add the package at its current version to
our project's `bower.js` file so should another developer download our
application (or we download it from a different computer), we can simply run the
`bower install` command as above and all our dependencies will be installed for
us. Neat!

Technically, `oms-happathon` is now ready to go.

However, prior to hacking on your application, you will want to modify the
`package.json` file to contain your project's information. Do not remove any
items from the `devDependencies` array as all are needed for the build process
to work.

To ensure your setup works, launch grunt:

```sh
$ grunt watch
```

The built files are placed in the `build/` directory by default. Open the
`build/index.html` file in your browser and check it out! Because everything is
compiled, no XHR requests are needed to retrieve templates, so until this needs
to communicate with your backend there is no need to run it from a web server.

`watch` is actually an alias of the `grunt-contrib-watch` that will first run a
partial build before watching for file changes. With this setup, any file that
changes will trigger only those build tasks necessary to bring the app up to
date. For example, when a template file changes, the templates are recompiled
and concatenated, but when a test/spec file changes, only the tests are run.
This allows the watch command to complete in a fraction of the time it would
ordinarily take.

In addition, if you're running a Live Reload plugin in your browser (see below),
you won't even have to refresh to see the changes! When the `watch` task detects
a file change, it will reload the page for you. Sweet.

When you're ready to push your app into production, just run the `compile`
command:

```sh
$ grunt compile
```

This will concatenate and minify your sources and place them by default into the
`bin/` directory. There will only be three files: `index.html`,
`your-app-name.js`, and `your-app-name.css`. All of the vendor dependencies like
Bootstrap styles and AngularJS itself have been added to them for super-easy
deploying. If you use any assets (`src/assets/`) then they will be copied to
`bin/` as is.

Lastly, a complete build is always available by simply running the default
task, which runs `build` and then `compile`:

```sh
$ grunt
```

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the heavily documented build script,
`Gruntfile.js`. But you don't need to do that to be very productive with
`oms-happathon`. What follows in this section is a quick introduction to the
tasks provided and should be plenty to get you started.

The driver of the process is the `delta` multi-task, which watches for file
changes using `grunt-contrib-watch` and executes one of nine tasks when a file
changes:

* `delta:gruntfile` - When `Gruntfile.js` changes, this task runs the linter
  (`jshint`) on that one file and reloads the configuration.
* `delta:assets` - When any file within `src/assets/` changes, all asset files
  are copied to `build/assets/`.
* `delta:html` - When `src/index.html` changes, it is compiled as a Grunt
  template, so script names, etc., are dynamically replaced with the correct
  values configured dynamically by Grunt.
* `delta:less` - When any `*.less` file within `src/` changes, the
  `src/less/main.less` file is linted and copied into
  `build/assets/ng-boilerplate.css`.
* `delta:jssrc` - When any JavaScript file within `src/` that does not end in
  `.spec.js` changes, all JavaScript sources are linted, all unit tests are run,
  and the all source files are re-copied to `build/src`.
* `delta:coffeesrc` - When any `*.coffee` file in `src/` that doesn't match
  `*.spec.coffee` changes, the Coffee scripts are compiled independently into
  `build/src` in a structure mirroring where they were in `src/` so it's easy to
  locate problems. For example, the file
  `src/common/titleService/titleService.coffee` is compiled to
  `build/src/common/titleService/titleService.js`.
* `delta:tpls` - When any `*.tpl.html` file within `src/` changes, all templates
  are put into strings in a JavaScript file (technically two, one for
  `src/common/` and another for `src/app/`) that will add the template to
  AngularJS's
  [`$templateCache`](http://docs.angularjs.org/api/ng.$templateCache) so
  template files are part of the initial JavaScript payload and do not require
  any future XHR.  The template cache files are `build/template-app.js` and
  `build/template-common.js`.
* `delta:jsunit` - When any `*.spec.js` file in `src/` changes, the test files
  are linted and the unit tests are executed.
* `delta:coffeeunit` - When any `*.spec.coffee` file in `src/` changes, the test
  files are linted, compiled their tests executed.

As covered in the previous section, `grunt watch` will execute a full build
up-front and then run any of the aforementioned `delta:*` tasks as needed to
ensure the fastest possible build. So whenever you're working on your project,
start with:

```sh
$ grunt watch
```

And everything will be done automatically!

### Build vs. Compile

To make the build even faster, tasks are placed into two categories: build and
compile. The build tasks (like those we've been discussing) are the minimal
tasks required to run your app during development.

Compile tasks, however, get your app ready for production. The compile tasks
include concatenation, minification, compression, etc. These tasks take a little
bit longer to run and are not at all necessary for development so are not called
automatically during build or watch.

To initiate a full compile, you simply run the default task:

```sh
$ grunt
```

This will perform a build and then a compile. The compiled site - ready for
uploading to the server! - is located in `bin/`, taking a cue from
traditional software development. To test that your full site works as
expected, open the `bin/index.html` file in your browser. Voila!

### Live Reload!

`oms-happathon` also includes [Live Reload](http://livereload.com/), so you no
longer have to refresh your page after making changes! You need a Live Reload
browser plugin for this:

- Chrome - [Chrome Webstore](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)
- Firefox - [Download from Live Reload](http://download.livereload.com/2.0.8/LiveReload-2.0.8.xpi)
- Safari - [Download from Live Reload](http://download.livereload.com/2.0.9/LiveReload-2.0.9.safariextz)
- Internet Explorer - Surely you jest.

Note that if you're using the Chrome version with `file://` URLs (as is the
default with `oms-happathon`) you need to tell Live Reload to allow it. Go to
`Menu -> Tools -> Extensions` and check the "Allow access to file URLs" box next
to the Live Reload plugin.

When you load your page, click the Live Reload icon in your toolbar and
everything should work magically. w00t!

If you'd prefer to not install a browser extension, then you must add the
following to the end of the `body` tag in `index.html`:

```html
<script src="http://localhost:35729/livereload.js"></script>
```

Boom!

### Continuous Integration

## Roadmap

For now, check out [the pilot roadmap](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/about/)


## Contributing
If you're new to open source development, check out jQuery's [Getting Started Contributing](http://contribute.jquery.org/open-source/)

Then check out [Contributing](CONTRIBUTING.md)

<a name="communication"></a>
### Communication

**Chat**

Our IRC channel on freenode is #happathon.  If you're unfamiliar with IRC, use Freenode's webchat.  Go to http://webchat.freenode.net/, pick a nickname, and enter #happathon for the channel, [like so](http://photos1.meetupstatic.com/photos/event/3/8/5/6/highres_305894422.jpeg).  That will connect you to our chat channel.

**Event Coordination**

On [Meetup](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/)

**Application issues/feedback **

Via our [Github Repository](https://github.com/IDCubed/oms-happathon/issues).  Feel free to submit issues if you find bugs or see something that needs doing.  Even better, do it and submit a pull request. :)

### Licensing
By submitting a patch, you agree to license your work under the same license as that used by the project.

### Licensing