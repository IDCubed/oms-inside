# [Inside: Because What's Inside is What Matters](https://github.com/IDCubed/oms-inside) [![Build Status](https://travis-ci.org/IDCubed/oms-inside.png?branch=master)](https://travis-ci.org/IDCubed/oms-inside)

***

note: This project is no longer affiliated with The Happathon Project, and is not under active development.

## Quick Start

[Install Node.js](http://nodejs.org/) and then:

```sh
(Note: on Windows, you can ignore the "sudo" part)
$ git clone git@github.com:IDCubed/oms-inside.git    # copy repo to your computer
$ cd oms-inside    # change to inside directory
$ sudo npm -g install grunt-cli karma bower    # installs grunt-cli,karma,bower
$ sudo npm install    # installs node dependencies in a /node_modules/ directory
$ bower install    # installs js/css dependencies in your /bower_components/ directory
$ grunt dev   # starts the dev environment
```
After typing ```grunt dev```, you should see the unit test runner open a new Chrome browser window.
Click [http://localhost:8000](http://localhost:8000) to open the application in your default browser.

And Boom!  You're set up to hack on any of the project's HTML/JavaScript/AngularJS code.  Making changes to those files in the src/ directory will also reload your page automatically.  Happy hacking!

## Inside: Because What's Inside is What Matters

This project's purpose is to advance progress in the mental measurement space in order to complement society's current external metrics with a new breed of measurements based on thought, emotion, learning, well-being, and other internal aspects, so that we may all live more satisfying, healthier lives.

### The Problem:
Our society's current metrics are based on external measures like products produced and students educated.  While cutting edge a thousand years ago, or even twenty years ago, external metrics oversimplify today's diverse, mobile, networked societies.  Take education for example, where the "common core" evaluates teacher effectiveness based on test scores, while ignoring whether students are reaching their potential, or thinking flexibly and creatively about problems, or even growing to enjoy learning.  Or consider the economy, where national GDP increases with antidepressant drug sales, oil spills, and crime.

### The Alternative:
Modern sensor technologies and machine learning enable complementary metrics that more deeply reflect our humanity.  Imagine a common core based on metrics like 90% of students learning at or above 90% of their potential each day, or where teachers are evaluated by the percent of students that emotionally loved learning more this year.  Consider a world where the success of a nation depends on it's people's resilience, creativity, peacefulness and happiness, not just the pace at which they consume its resources.

### The Tech:
At present, Inside is an an open source, free, customizable platform for Data Scientists, Researchers, Quantified Selfers, and Companies to collectively experiment with past and present mental life data contributed by many individuals and groups.  It's initially designed to run on mobile phones since many of us carry them.  Eventually it will extend to other platforms.

## Audience

### For Researchers:
Add your own groups.  Run your own studies.  Include your own surveys.  Get bonus past and present sensor data, including the data collected from other studies.

### For Quantified Selfers:
Know yourself better through data that provides new perspectives on your subjective experience.  Learn with others by creating your own groups, forms, and data mashups with family, friends, colleagues, other QSers... anyone.  Build, share, and mash up algorithms, visualizations, and data sources with others in the community.  Even monetize the data you've collected.  Again, all for free.  This project is by QSers for QSers.

### For Companies:
Collect, mine, and visualize data via plugins without the development and maintenance costs of creating a full sensor data platform.  Build on community-contributed plugins and eventually create both free and paid versions.  (Want that functionality sooner?  You can help make it happen!)

## Philosophy

**Unique solutions. Common plumbing**
Solutions, perspectives, insights, are what make a difference.  The authentication architecture or button click code adds no value for end users.  So we're commoditizing the valueless, mundane parts of apps while while providing developers a fast, easy, common platform for creating and distributing internal measurement applications.

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

All plugin directories (those starting with ```inside-```) contain a ```inside.json``` file that defines the plugin configuration.  It will have differences depending on the type of plugin.  The different plugin types, and their JSON structure are defined in the [inside.json spec](https://docs.google.com/document/d/10c_P2pixt1jjV0sPP86JDx1RAvLwvfJpFYM7ISh3Pls/edit#).

Plugins central to the app cannot be removed, but community-contributed plugins may be added and removed as desired.

### Overall Directory Structure

At a high level, the structure looks roughly like this:

note: This directory structure is outdated due to project changes.  I'll update it as soon as I get the repo's files all updated, and names changed. See [#49](https://github.com/IDCubed/oms-inside/issues/49)- Adam
```
oms-inside/
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
  |  |- inside-android/ // contains all code that runs on android
  |  |- app/ // the inside app
  |  |  |- app-utils-module.js // utilities for app.js
  |  |  |- app.js // routing, rendering, and plugin control
  |  |  |- app.less // app-wide styles
  |  |  |- app.spec.js // tests for app.js
  |  |  |- assets/
  |  |  |  |- <static files>  // images, fonts, etc.
  |  |  |- index.html // the main html file that contains all our views
  |  |  |- left-menu.tpl.html  // template for the left nav (plugins) menu
  |  |  |- right-menu.tpl.html  // template for the right nav (settings) menu
  |  |  |- thirdparty/  //third party libs
  |  |  |- top-nav.tpl.html  // template for the top nav bar
  |  |  |- plugins/
  |  |  |  |- inside-api-app_angular/
  |  |  |  |  |- api-app_angular-module.js // wraps the raw data api for angular-specific performance improvements
  |  |  |  |  |- inside.json // (these will be in every directory. We won't take up space with them below this)
  |  |  |  |- inside-challenge-2kind/  // initial campaign
  |  |  |  |- inside-challenge-inside-research/ // provides json for starting questions
  |  |  |  |- inside-challenge-somerville-happiness-research/ // somerville happiness survey
  |  |  |  |- inside-challenge-utils_angular/ // angular-specific templates for challenges to reference
  |  |  |  |- inside-engine/ // the engine is required for any inside app.  It takes care of user data,
                                // authentication, settings management, and any other CRUD operations
                                // it doesn't belong in plugins since it's a separate app from the inside app
                                // putting it here for mocking until we implement it in the backend
  |  |  |  |  |- engine-module.js // temporary angular module to mock the engine
  |  |  |  |  |- assets/
  |  |  |  |  |  |- <static files>
  |  |  |  |  |- mock-backend/
  |  |  |  |  |  |- mock-backend-module.js // provides raw data CRUD interface to all API plugins
  |  |  |  |  |  |- mock-backend-spec.js // unit tests for the above
  |  |  |  |  |  |- people-user-module.js // temporary angular module to load the user object - this should be in db
  |  |  |  |- inside-insight-explorer/ // explorers let you explore various aspects of your data
  |  |  |  |- inside-insight-status/ // people (individual or group) status dashboard
  |  |  |  |- inside-insight-utils_angular/ // angular-specific templates for insight plugins to reference
  |  |  |  |- inside-org_customization-somerville/ // somerville customizations
  |  |  |  |- inside-people-xxxx/ // eventually discoverable people (groups & individuals) will be listed as
                                     // installable plugins.  for now they're hard coded into
                                     // inside-engine/mock-backend/people-user-module.js

```

### Detailed Installation

This section provides a little more detailed understanding of what goes into
getting `oms-inside` up and running. Though `oms-inside` is really simple
to use, it might help to have an understanding of the tools involved here, like
Node.js and Grunt and Bower. If you're completely new to highly organized,
modern JavaScript development, take a few short minutes to read [this overview
of the tools](tools.md) before continuing with this section.

Okay, ready to go? Here it is:

`oms-inside` uses [Grunt](http://gruntjs.org) as its build system, so
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
$ git clone git@github.com:IDCubed/oms-inside.git oms-inside
$ cd oms-inside
```

And then install the remaining build dependencies locally:

```sh
$ npm install
```

This will read the `dependencies` (empty by default) and the `devDependencies`
(which contains our build requirements) from `package.json` and install
everything needed into a folder called `node_modules/`.

There are many Bower packages used by `oms-inside`, like Twitter Bootstrap
and Angular UI, which are listed in `bower.js`. To install them into the
`bower_components/` directory, simply run:

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

Technically, `oms-inside` is now ready to go.

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
`oms-inside`. What follows in this section is a quick introduction to the
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

We're currently using Travis-CI for integration.

## Roadmap

[Our Roadmap](ROADMAP.md)


## Contributing
If you're new to open source development, check out jQuery's [Getting Started Contributing](http://contribute.jquery.org/open-source/)

Then check out [Contributing](CONTRIBUTING.md)

<a name="communication"></a>
### Communication

**Chat**

We're currently using the #oms channel on freenode.  If you're unfamiliar with IRC, use Freenode's webchat.  Go to http://webchat.freenode.net/, pick a nickname, and enter #oms for the channel, [like so](http://photos1.meetupstatic.com/photos/event/3/8/5/6/highres_305894422.jpeg).  That will connect you to our chat channel.

**Event Coordination**

On [Meetup](http://www.meetup.com/Hacking-Somerville-Happiness/)

**Application issues/feedback **

Via our [Github Repository](https://github.com/IDCubed/oms-inside/issues).  Feel free to submit issues if you find bugs or see something that needs doing.  Even better, do it and submit a pull request. :)

### Licensing
By submitting a patch, you agree to license your work under the same license as that used by the project.
