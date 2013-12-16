module.exports = function ( grunt ) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-lesslint');



  /**
   * Load in our build configuration file.
   */
  var userConfig = {

    src:{
      dirs:{
        bower:'bower_components/',
        app:'src/app/',
        assets:'<%= src.dirs.app %>assets/',
        thirdparty:'<%= src.dirs.app %>thirdparty/',
        plugins:'<%= src.dirs.app %>plugins/' // created by bowercopy
      },
    /**
     * This is a collection of file patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks. `js` is all project javascript, less tests. `html_templates` contains
     * our reusable components' (`src/dependencies`) template HTML files, while
     * `html_templates` contains the same, but for our app's code. `html` is just our
     * main HTML file, `less` is our main stylesheet, and `unit` contains our
     * app's unit tests.
     */
    // grunt.file.expand({nonull:true}, 'src/app/*.js','bower_components/happathon**/*.js','!/**/*.spec.js')

    },
    /**
     * The `build.dirs` folder is where our projects are compiled during
     * development and the `dirs.compile` folder is where our app resides once it's
     * completely built.
     */
    build:{// build destinations
      // there should be no files listed in build.  Only directories.
      // specific file outputs, like thos in concat:, should specify
      // the output file in it.  That way plugins that depend on it
      // can read directly from it, so the order is clearer.
      dirs:{
        root:'build/',
        app:'<%= build.dirs.root %>app/',
        plugins:'<%= build.dirs.app %>plugins/',
        assets:'<%= build.dirs.app %>assets/',
        js:'<%= build.dirs.app %>js/',
        css:'<%= build.dirs.app %>',
        thirdparty:'<%= build.dirs.app %>thirdparty/'
      }
    },
    compile:{
      dirs:{
        root:'bin/',
        app:'<%= compile.dirs.root %>app/',
        plugins:'<%= compile.dirs.app %>plugins/',
        assets:'<%= compile.dirs.app %>assets/',
        js:'<%= compile.dirs.app %>js/',
        css:'<%= compile.dirs.app %>css/',
        // thirdparty:{ // unneeded since we blend them all into compile.files.css & js
        //   js:'bin/app/thirdparty/js',
        //   css:'bin/app/thirdparty/css'
        // }
      },
      // files:{
      //   js:'<%= compile.dirs.js %><%= pkg.name %>-<%= pkg.version %>.js'
      // }
    },




  };
  var appFileExists=false;
  /**
   * This is the configuration object Grunt uses to give each plugin its
   * instructions.
   */
  var taskConfig = {
    /**
     * We read in our `package.json` file so we can access the package name and
     * version. It's already there, so we don't repeat ourselves here.
     */
    pkg: grunt.file.readJSON("package.json"),

    meta: {
    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the `<%=`
     * pairs are evaluated based on this very configuration object.
     */
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' * Licensed <%= pkg.licenses.type %> <<%= pkg.licenses.url %>>\n' +
        ' */\n'
    },

    changelog: {
    /**
     * Creates a changelog on a new version.
     */
      options: {
        dest: 'CHANGELOG.md',
        template: 'changelog.tpl'
      }
    },

    bump: {
    /**
     * Increments the version number, etc.
     */
      options: {
        files: [
          "package.json",
          "bower.json"
        ],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: [
          "package.json",
          "client/bower.json"
        ],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
    },

    clean: [
    /**
     * The directories to delete when `grunt clean` is executed.
     */
      '<%= build.dirs.root %>',
      '<%= compile.dirs.root %>'
    ],


// TODO consider using grunt-sync or grunt-rsync to pull in remote content
// https://npmjs.org/package/grunt-sync
// with grunt rsync, we might be able to watch the whole source folder for changes to run rsync,
// then watch just the build dir to re-run concats, etc.
    copy: {
    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build.dirs`, and then to copy the assets to `dirs.compile`.
     */
      expand:true,
      happathon_plugins:{
        // may be able to use this to install them https://npmjs.org/package/grunt-bower-cli
        //re-enable this once we convert all plugins to bower packages
        // expand:true,
        // debug:true,
        // nonull:true,
        // flatten:false,
        // cwd:'<%= src.dirs.bower %>', // a.k.a., sourceBasePath
        // src:'happathon*/**',
        // dest:'<%= src.dirs.plugins %>',
      },
      thirdparty_libs:{
        files:[
          // have to specify expand:true in each of these else calling it from sync_bower_components fails
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'jquery/jquery.min.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular/angular.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular-touch/angular-touch.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular-mocks/angular-mocks.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular-bootstrap/ui-bootstrap-tpls.min.js'},
          // {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'bootstrap/less/bootstrap.less'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'bootstrap/dist/css/bootstrap.css'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular-ui-router/release/angular-ui-router.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'angular-ui-utils/modules/route/route.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'lodash/dist/lodash.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'restangular/dist/restangular.js'},
          {expand:true,cwd:'<%= src.dirs.bower %>',dest:'<%= src.dirs.thirdparty %>', src:'Faker/Faker.js'},
        ],
      },
      app:{
        expand: true,
        cwd:'<%= src.dirs.app %>', // change the directory we'll output to
        src: [
          '**/*',
          '!*spec.js', // don't copy
          '!*.less', // copy via grunt-recess
          '!*.tpl.html' // copy via grunt-html2js
        ],
        dest: '<%= build.dirs.app %>',
      },
      // placing this here so we can recopy the changed js files when they change
      // js:{
      //   expand:true,
      //   cwd:'<%= build.dirs.app %>',
      //   src: '<%= copy.app.src %>/**/*.js',
      //   dest: '<%= build.dirs.app %>'
      // },
      happathon_configs_to_angular_services:{
        // requires:['copy:app'],
        options:{
          processContent: function(content, srcpath){
            var dirName = srcpath.match(/.*\/([^\/]+)\/.+$/)[1]+'-config';
            // var dirCamel=dirName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            return '/*jshint indent:false*/\n' +
                  'angular.module("' + dirName +'",[])\n'+
                  '.service("'+dirName +'",function(){\n'+
                  '  return [' + // wrap everything in an array in case file has comments
                  (content || "''") +
                  '][0];\n});\n';
          }
        },
        files:[{
          cwd:'<%= src.dirs.plugins %>',
          src:'**/happathon.json',
          dest:'<%= build.dirs.plugins %>',
          expand:true,
          debug:false,
          nonull:false,
          rename: function(dest, src) {
            // grunt.log.warn('dest,src',dest,src);
            return dest + src.replace(/\.json/,'-config-module.js');
          },
          // options:{
          // }
        }],
      }
    },

    concat: {
    /**
     * `grunt concat` concatenates multiple source files into a single file.
     */

      /**
       * The `build_css` target concatenates compiled CSS and vendor CSS
       * together.
       */
      // compile_css: {
      //   src: '<%= build.dirs.css %>**/*.css',
      //   dest: '<%= compile.dirs.css %><%= pkg.name %>-<%= pkg.version %>.css'
      // },
      /**
       * The `compile_js` target is the concatenation of our application source
       * code and all specified vendor source code into a single file.
       */
      // compile_js: {
      //   options: {
      //     banner: '<%= meta.banner %>'
      //   },
      //   src: [
      //     '<%= build.fileGroups.thirdparty.js %>',
      //     'module.prefix',
      //     '<%= build.fileGroups.js %>',
      //     'module.suffix'
      //   ],
      //   dest: '<%= compile.files.js %>'
      // },
      // for html templates, see html2js

      dynamically_add_dependencies_to_appjs:{
        requires:['copy:app','copy:happathon_configs_to_angular_services'],
        src:'<%= build.dirs.app %>app.js',
        dest:'<%= build.dirs.app %>app.js',
        options:{
          process:function(content, srcpath){
            var appjsFile = content;
            var modulesStr = '';
            var servicesStr = '';
            grunt.file.expand(
              {debug:false,nonull:true,expand:true},
              grunt.config.get('build.dirs.root')+'**/*-module.js'
            ).forEach(function(path,loopIterator,filesArr){
              // grunt.log.warn('path,one,two',path);
              var contents = grunt.file.read(path);
              // get module names from the file
              var matchedModules = contents.match(/angular\.module.*?["'].+?['"]+/g) || [];
              for (var i = 0, L = matchedModules.length; i < L;i++){
                modulesStr += '  ' + matchedModules[i].replace(/angular\.module[^'"]+/gi,'')+',\n';
              }
              //get service names from the file
              var matchedServices = contents.match(/\.service.*?["'].+?['"]+/g)||[];
              for (i = 0, L = matchedServices.length; i < L;i++){
                servicesStr += '\n// '+ matchedServices[i];
              }
            });
            // grunt.log.warn('modulesStr',modulesStr);
// {{concat.dynamically_add_dependencies_to_appjs.modules}}
            var newContent = content.replace(/\/\/\s+\{\{concat.dynamically_add_dependencies_to_appjs.modules\}\}/,modulesStr);
            newContent = newContent.replace(/\{\{concat.dynamically_add_dependencies_to_appjs.services\}\}/,servicesStr);
            return newContent;
          }
        },
      },

      index:{ // adds css and js files to index
        requires:['copy:app'],
        src:'<%= src.dirs.app %>index.html',
        dest:'<%= build.dirs.app %>index.html',
        options:{
          process:function(content, srcpath){
            var cssStr = '\n';
            var jsStr = '\n';
            var thirdpartyStr = '\n';

            // ensure our third party dependencies load in the correct order
            var thirdPartyFiles=grunt.config.get('copy.thirdparty_libs.files');
            // grunt.log.warn('thirdPartyFiles',thirdPartyFiles);
            thirdPartyFiles.forEach(function(file){
              // grunt.log.warn('file',file.src);
              thirdpartyStr+= '\n    <script type="text/javascript" src="thirdparty/'+
              file.src +
              '"></script>';
            });
            // replace index tokens with appropriate css and js files
            grunt.file.expand(
              {nonull:false,debug:false},
              grunt.config.get('build.dirs.app')+'**/*.{css,js}'
            )
            .forEach(function(path) {
              if(path.indexOf('thirdparty')>-1) {
                return;
              }
              var newStr = path.replace(/.*?\/app\//,'');
              if(/js$/.test(path)){
                // grunt.log.warn('path',path);
                jsStr+= '    <script type="text/javascript" src="'+newStr+'"></script>\n';
              } else {
                cssStr+='    <link rel="stylesheet" type="text/css" href="'+ newStr+ '" />\n';
              }
            });

            var newContent = content.replace(/    <\!-- token_replace_thirdparty_js_here -->/i,thirdpartyStr);
            newContent = newContent.replace(/    <\!-- token_replace_css_here -->/i,cssStr);
            newContent = newContent.replace(/    <\!-- token_replace_js_here -->/i,jsStr);
            return newContent;
          }
        }
      }
    },



    jsdoc: {
    /**
     * Compiles source documentation into a web page.
     * For valid tags, see http://usejsdoc.org/#JSDoc3_Tag_Dictionary
     */
      dist : {
        src: ['src/*.js', 'test/*.js'],
        options: {
          destination: 'doc'
        }
      }
    },

    uglify: {
    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */

    /**
     * Minify the sources!
     */
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          src:'<%= concat.compile_js.dest %>',
          dest:'<%= concat.compile_js.dest %>'
        }
      }
    },

    recess: {
    /**
     * `recess` handles our LESS compilation and uglification automatically.
     * Only our `app.less` file is included in compilation; all other files
     * must be imported from this file.
     */
      build: {
        src: [ '<%= src.dirs.app %>**/*.less' ],
        dest: '<%= build.dirs.css %><%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: false,
          noUnderscores: false,
          noIDs: false,
          zeroUnits: false
        }
      },
      // compile: {
      //   src: [ '<%= src.fileGroups.less %>' ],
      //   dest: '<%= compile.files.css %>',
      //   options: {
      //     compile: true,
      //     compress: true,
      //     noUnderscores: false,
      //     noIDs: false,
      //     zeroUnits: false
      //   }
      // }
    },

    jshint: {
    /**
     * `jshint` defines the rules of our linter as well as which files we
     * should check. This file, all javascript sources, and all our unit tests
     * are linted based on the policies listed in `options`. But we can also
     * specify exclusionary patterns by prefixing them with an exclamation
     * point (!); this is useful when code comes from a third party but is
     * nonetheless inside `src/`.
     */
      options:{jshintrc: '.jshintrc'},
      js: [
        '<%= src.dirs.app %>*.js',
        '<%= src.dirs.app %>**/*.js',
        '!<%= src.dirs.thirdparty %>**/*.js'
      ],
      build_appjs: '<%= build.dirs.js %>app.js',
      rootfiles: ['*.{json,js}','*.*rc'] // lints the rootfiles, bower files, etc.
    },


    html2js: {
    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache. This means that the templates too become
     * part of the initial payload as one JavaScript file. Neat!
     */
      options:{
        module:'html_templates_jsfied'
      },
      app: {
        src:  '<%= src.dirs.root %>**/*.tpl.html' ,
        dest: '<%= build.dirs.js %>html_templates_jsfied.js'
      }
    },

    karma: {
    /**
     * The Karma configurations.
     */
      options: {
        configFile: 'karma-config-unit.js'
      },
      unit: {
        runnerPort: 9101,
        background: true
      },
      continuous: {
        singleRun: true,
        background: true
      }
    },

    lesslint:{
      src:['<%= src.dirs.app %>**/*.less','!**/thirdparty/']
    },

    connect:{
    /**
     * The default for ng-boilerplate is viewing files with file:// protocol.
     * To view the built with a web server, we'll include grunt-contrib-connect
     *
     */
      home:{
        options:{
          base:'<%= build.dirs.app %>',
          // directory:'<%= build.dirs.app %>',
          // keepalive:true,
          // port:8000,
          //
          // debug:true,
          livereload:true,
          // open:'http://localhost:8000/'
        }
      }
    },

    delta: {
    /**
     * And for rapid development, we have a watch set up that checks to see if
     * any of the files listed below change, and then to execute the listed
     * tasks when they do. This just saves us from having to type "grunt" into
     * the command-line every time we want to see what we're working on; we can
     * instead just leave "grunt watch" running in a background terminal. Set it
     * and forget it, as Ron Popeil used to tell us.
     *
     * But we don't need the same thing to happen for all the files.
     */
      /**
       * By default, we want the Live Reload to work for all tasks; this is
       * overridden in some tasks (like this file) where browser resources are
       * unaffected. It runs by default on port 35729, which your browser
       * plugin should auto-detect.
       */
      options: {
        livereload: true
      },

      /**
       * When the rootfiles changes, we just want to lint it.
       * Temporarily while working on the build process, rebuild too.
       */
      rootfiles: {
        files: ['*.{json,js}','*.*rc','!karma-config-unit.js'],
        tasks: [
          'jshint:rootfiles',
          // 'copy:thirdparty_libs',
          'build'
        ]
      },

      /**
       * When our JavaScript source files change, we want to run lint them and
       * run our unit tests.
       */
      // js: {
      //   files: [
      //     '<%= src.dirs.app %>*.{js,json}',
      //     '<%= src.dirs.app %>**/*.{js,json}',
      //     '!**/*.spec.js'
      //   ],
      //   tasks: [
      //     'jshint:js',
      //     'karma:unit:run',
      //     // 'copy:js',
      //   ]
      // },
      app:{
        files:[
          '<%= src.dirs.app %>*.{js,json}',
          '<%= src.dirs.app %>**/*.{js,json}',
          '!thirdparty/**/*',
        ],
        tasks:['copy:app']
      },
      // app:{
      //   files{}
      // },
      // /**
      //  * When a JavaScript unit test file changes, we only want to lint it and
      //  * run the unit tests. We don't want to do any live reloading.
      //  */
      // spec: {
      //   files: [
      //     '<%= src.fileGroups.js_spec %>'
      //   ],
      //   tasks: [ 'jshint:test', 'karma:unit:run' ],
      //   options: {
      //     livereload: false
      //   }
      // },


      /**
       * When assets are changed, copy them. Note that this will *not* copy new
       * files, so this is probably not very useful.
       */
      // assets: {
      //   files: '<%= src.dirs.assets %>',
      //   // tasks: [ 'copy:assets' ]
      // },

      /**
       * When index.html changes, we need to compile it.
       */
      index: {
        files: '<%= src.dirs.app %>index.html',
        tasks: [ 'concat:index']
      },
      /**
       * When our templates change, we only rewrite the template cache.
       */
      html_templates: {
        files: '<%= src.dirs.app %>**/*.tpl.html',
        tasks: [ 'html2js' ]
      },

      /**
       * When the CSS files change, we need to compile and minify them.
       */
      less: {
        files: [ '<%= src.dirs.app %>**/*.less' ],
        tasks: [ /*'lesslint',*/'recess:build' ]
      },

    }
  };





  grunt.initConfig( grunt.util._.extend( taskConfig, userConfig ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'watch', [
    'build',
    // 'karma:unit',
    'connect',
    'delta'
  ]);






  /** The default task is to build and compile. */
  grunt.registerTask( 'default', ['build', /*'compile'*/ ]);
  // 'compile'remove this for now.  We're not at a production stage.  We only need build.

  /**
   * The `build` task gets your app ready to run for development and testing.
   * The build phase:
   * lint all files in src.app.js
   * compile less to css
   * copy all js files to build.dirs.app
   */

  grunt.registerTask( 'build', [
    // if this is the first run, it should copy the third party libs to your thirdparty dir
    // grunt.file.exists(grunt.config.get('src.dirs.thirdparty'))?'copy:thirdparty_libs':'clean',
    'clean',
    'sync_bower_components',
    'jshint',
    'html2js',
    // 'lesslint',
    'recess:build',
    'copy:app',

    'copy:happathon_configs_to_angular_services',
    'concat:dynamically_add_dependencies_to_appjs',
    'concat:index',
    // 'karmaconfig',
    // 'karma:continuous'
  ]);

  /**
   * The `compile` task gets your app ready for deployment by concatenating and
   * minifying your code.
   */
  grunt.registerTask( 'compile', [

    'recess:compile',
    'copy:compile_assets',
    'ngmin',
    // 'concat:compile_js',
    'uglify'
  ]);


  // on watch events configure watchers to only run on changed file
  grunt.event.on('watch', function(action, filepath) {
    // filter the event we'll pass to the different watches
    if(/(js|html|hson)$/.test(filepath)){
      grunt.config('copy.app.files', [filepath]);
    }
    // grunt.config('copy.app.src', filepath);
    // grunt.config('jshint.all.src', filepath);
  });



  grunt.registerTask('sync_bower_components', 'copied bower packages to their intended directories', function() {
    // Enqueue "bar" and "baz" tasks, to run after "foo" finishes, in-order.
    // var pluginsDir = grunt.config.get('<%= src.dirs.plugins %>');
    // var pluginsCopied = grunt.file.exists(grunt.config.get('src.dirs.plugins'));

    var thirdPartyLibsCopied = grunt.file.exists(grunt.config.get('src.dirs.thirdparty'));
    if(!thirdPartyLibsCopied) {
      grunt.task.run('copy:thirdparty_libs');
    }
  });
};
