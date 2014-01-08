# [The H(app)athon Project](https://github.com/IDCubed/oms-happathon) [![Build Status](https://travis-ci.org/IDCubed/oms-happathon.png?branch=master)](https://travis-ci.org/IDCubed/oms-happathon)

***

## Quick Start

[Install Node.js](http://nodejs.org/) and then:

```sh
(Note: on Windows, you can ignore the "sudo" part)
$ git clone git@github.com:IDCubed/oms-happathon.git    # copy repo to your computer
$ cd oms-happathon    # change to happathon directory
$ sudo npm -g install grunt-cli karma bower    # installs grunt-cli,karma,bower
$ sudo npm install    # installs node dependencies in a /node_modules/ directory
$ bower install    # installs js/css dependencies in your /bower_components/ directory
$ grunt dev   # starts the dev environment
```
After typing ```grunt dev```, you should see the unit test runner open a new Chrome browser window.
Click http://localhost:8000 to open the application in your default browser.

And Boom!  You're set up to hack on any of the project's HTML/JavaScript/AngularJS code.  Making changes to those files in the src/ directory will also reload your page automatically.  Happy hacking!

##What next?

For issues to get started on, check out our [issues page](issues).  If you don't see one that interests you, ask!  There are other things not on that list.

We're currently looking for:
- Data Visualizers to make well-being insights intuitive
- Android developer(s) to display html app in webview, set up notifications, and integrate sensor library
- iPhone developer(s) for the same
- UI Developers (HTML/JavaScript/CSS/Angular)
- UX designers to make the app is useful and enjoyable
- Beta Testers: To Beta test the app when it's ready, join the [Beta Testers Google Group](https://groups.google.com/forum/#!forum/happathon).

Learn more about or the project in general at [Meetup](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/about/), and tech in particular by reading on below.

To ask questions, check out our [Communication Channels](#communication) or join one of the [Meetups](http://www.meetup.com/The-Happathon-Project-Hacking-Somerville-Happiness/).


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
- Nearly everything is a plugin so it's easy to extend the app's functionality
- Plugin creators need not learn the UI framework (e.g. angular) to contribute
- Migrate to different front-ends without changing the plugins
- The build system should integrate plugins into the UI automatically.
- *Encourages* test-driven development. It's the only way to code.
- Unit tests alongside the code they are testing. (End-to-end tests are separate)
- A directory structure that is cogent, meaningful to new team members, and
  supporting of the above points.
- Well-documented, to show new developers *why* things are set up the way they
  are.  If you see something that's unclear, please submit a pull request if
  you understand it, or open an issue if you don't.
- Errors shouldn't just tell you what broke.  They should tell you how to fix it.

## Learn

### Plugins

\* Note: All plugins will eventually be separate git repositories. They're placed a plugins directory to encourage modularity and act as if they were installed.

All plugin directories (those starting with ```happathon-```) contain a ```happathon.json``` file that defines the plugin configuration.  It will have differences depending on the type of plugin.  The different plugin types, and their JSON structure are defined in the [happathon.json spec](https://docs.google.com/document/d/10c_P2pixt1jjV0sPP86JDx1RAvLwvfJpFYM7ISh3Pls/edit#).

Plugins central to the app cannot be removed, but community-contributed plugins may be added and removed as desired.

### Overall Directory Structure

At a high level, the structure looks roughly like this:

```
oms-happathon/
  |- eslint.json // file syntax checking
  |- bower_components/ // all thirdparty libraries before they get copied to src/app/thirdparty
  |- bower.json // bower dependencies stored in bower_components
  |- build/ // our development files
  |- dist/ // our production files
  |- e2e-tests/ // mocha + chai code to test user scenarios involving multiple screens
  |- Gruntfile.js // build and testing configuration
  |- module.prefix // prefix of to wrap compiled/minified js in a self-executing anonymous function
  |- module.suffix // suffix to go with the prefix
  |- package.json // node package dependencies
  |- travis.yml // enables continuous integration via TravisCI
  |- src/ // contains all the raw source files
  |  |- happathon-android/ // contains all code that runs on android
  |  |- assets/
  |  |  |- <static files>
  |  |- app/ // the happathon app
  |  |  |- index.html
  |  |  |- app.js // routing, rendering, and plugin control
  |  |  |- app.less // app-wide styles
  |  |  |- app.spec.js // tests for app.js
  |  |  |- people-module.js // handles people display
  |  |  |- people-spec.js
  |  |  |- insight-base.tpl.html
  |  |  |- plugin-list.tpl.html
  |  |  |- plugin-adding-instructions.tpl.html  // instructions for how to add a plugin
  |  |  |- mock-backend-module.js
  |  |  |- settings-config-module.js // provides app specific settings schema with default for the engine to store
  |  |  |- people-type-base-module.js // contains the base people json for new people types to extend
  |  |  |- plugins/
  |  |  |  |- happathon-api-app_angular/
  |  |  |  |  |- api-app_angular-module.js // wraps the raw data api for angular-specific performance improvements
  |  |  |  |  |- happathon.json // (these will be in every directory. We won't take up space with them below this)
  |  |  |  |- happathon-challenge-2kind/  // initial campaign
  |  |  |  |- happathon-challenge-happathon-research/ // provides json for starting questions
  |  |  |  |- happathon-challenge-somerville-happiness-research/ // somerville happiness survey
  |  |  |  |- happathon-challenge-utils_angular/ // angular-specific templates for challenges to reference
  |  |  |  |- happathon-engine/ // the engine is required for any happathon app.  It takes care of user data,
                                // authentication, settings management, and any other CRUD operations
                                // it doesn't belong in plugins since it's a separate app from the happathon app
                                // putting it here for mocking until we implement it in the backend
  |  |  |  |  |- engine-module.js // temporary angular module to mock the engine
  |  |  |  |  |- assets/
  |  |  |  |  |  |- <static files>
  |  |  |  |  |- mock-backend/
  |  |  |  |  |  |- mock-backend-module.js // provides raw data CRUD interface to all API plugins
  |  |  |  |  |  |- mock-backend-spec.js // unit tests for the above
  |  |  |  |  |  |- people-user-module.js // temporary angular module to load the user object - this should be in db
  |  |  |  |- happathon-insight-explorer/ // explorers let you explore various aspects of your data
  |  |  |  |- happathon-insight-status/ // people (individual or group) status dashboard
  |  |  |  |- happathon-insight-utils_angular/ // angular-specific templates for insight plugins to reference
  |  |  |  |- happathon-org_customization-somerville/ // somerville customizations
  |  |  |  |- happathon-people-xxxx/ // eventually discoverable people (groups & individuals) will be listed as
                                     // installable plugins.  for now they're hard coded into
                                     // happathon-engine/mock-backend/people-user-module.js

```

What follows is a brief description of each entry, but most directories contain
their own `README.md` file with additional documentation, so browse around to
learn more.

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

If you're on Linux then throw `sudo` in front of that command.

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
$ grunt dev
```

For a deeper look at the build process, read the thoroughly commented Gruntfile.js.
The built files are placed in the `build/` directory by default.

When you're ready to push your app into production, just run `grunt` by itself:

```sh
$ grunt
```

This will build, concatenate and minify your sources and place them by default into the
`dist/` directory.

### The Build System

The best way to learn about the build system is by familiarizing yourself with
Grunt and then reading through the heavily documented build script,
`Gruntfile.js`. But you don't need to do that to be very productive with
`oms-happathon`. What follows in this section is a quick introduction to the
tasks provided and should be plenty to get you started.  TODO, generate this from the
Gruntfile.js 'build' section comments

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
uploading to the server! - is located in `dist/`. To test that your full site works as
expected, open the same url as for build - ```http://localhost:8000``` in your browser. Voila!

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