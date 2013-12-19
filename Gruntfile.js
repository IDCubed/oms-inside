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
  grunt.loadNpmTasks("grunt-sync");



    /**
     * directoryPaths is a collection of directory patterns that refer to our app code (the
     * stuff in `src/`). These file paths are used in the configuration of
     * build tasks.
     */
  var directoryPaths = {
    src:{
      dirs:{
        bower:'bower_components/',
        app:'src/app/',
        assets:'<%= src.dirs.app %>assets/',
        thirdparty:'<%= src.dirs.app %>thirdparty/',
        plugins:'<%= src.dirs.app %>plugins/' // created by bowercopy
      },
      requiredFiles:{
        cwd:'<%= src.dirs.app %>thirdparty/',
        files:[
          'jquery/jquery.min.js',
          'lodash/dist/lodash.min.js',
          'angular/angular.js',
          'angular-bootstrap/ui-bootstrap-tpls.min.js',
          'angular-mocks/angular-mocks.js',
          'angular-touch/angular-touch.min.js',
          'angular-ui-router/release/angular-ui-router.js',
          'angular-gesture/ngGesture/gesture.js',
          'angular-ui-utils/modules/utils.js',
          'd3/d3.min.js',
          'd3.chart/d3.chart.min.js',
          'Faker/Faker.js',
          'restangular/dist/restangular.js'
        ]
      },

    },
    /**
     * The `build.dirs` folder is where our projects are compiled during
     * development and the `dirs.compile` folder is where our app resides once it's
     * completely built.
     */
    build:{// build destinations
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
    compile:{ // compile destinations
      dirs:{
        root:'bin/',
        app:'<%= compile.dirs.root %>app/',
        plugins:'<%= compile.dirs.app %>plugins/',
        assets:'<%= compile.dirs.app %>assets/',
        js:'<%= compile.dirs.app %>js/',
        css:'<%= compile.dirs.app %>css/',
      },
    },
  };


  // configurations for all the tasks run in this gruntfile
  var taskConfig = {

    // Get the app version from `package.json` to stay DRY
    pkg: grunt.file.readJSON("package.json"),

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
      ' */\n',

    bump: {
    /**
     * Increments the version number, etc.
     */
      options: {
        files: ["package.json", "bower.json"],
        commit: false,
        commitMessage: 'chore(release): v%VERSION%',
        commitFiles: ["package.json", "client/bower.json"],
        createTag: false,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin'
      }
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


    clean: [
    /**
     * The directories to delete when `grunt clean` is executed.
     */
      '<%= build.dirs.root %>',
      '<%= compile.dirs.root %>'
    ],



    connect:{ // lightweight web server to view the app!
      home:{
        options:{
          base:'<%= build.dirs.app %>',
          livereload:true,
          debug:true
          // open:'http://127.0.0.1:8000/'
        }
      }
    },



    copy: {
    /**
     * The `copy` task just copies files from A to B. We use it here to copy
     * our project assets (images, fonts, etc.) and javascripts into
     * `build.dirs`, and then to copy the assets to `dirs.compile`.
     // */
     //  expand:true,
     //  happathon_plugins:{
     //    // may be able to use this to install them https://npmjs.org/package/grunt-bower-cli
     //    //re-enable this once we convert all plugins to bower packages
     //    // expand:true,
     //    // debug:true,
     //    // nonull:true,
     //    // flatten:false,
     //    // cwd:'<%= src.dirs.bower %>', // a.k.a., sourceBasePath
     //    // src:'happathon*/**',
     //    // dest:'<%= src.dirs.plugins %>',
     //  },
     //
     //
     //  convert the plugin config json files to angular services
     //  TODO: Instead of doing this, it would be simpler to just read the json files and provide them through an api
      happathon_configs_to_angular_services:{
        options:{
          // requires:['sync:build_appjs'],
          processContent: function(content, srcpath){
            grunt.log.writeln('srcpath',srcpath);
            var dirName = srcpath.match(/.*\/([^\/]+)\/.+$/)[1]+'-config';
            // var dirCamel=dirName.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
            return '/*jshint indent:false*/\n' +
                  'angular.module("' + dirName +'",[])\n'+
                  '.service("'+dirName +'",function(){\n'+
                  '  return [' + // wrap everything in an array in case file has comments
                  (content || "''") +
                  '][0];\n});\n';
          },
          // spawn:false
        },
        files:[{
          cwd:'<%= src.dirs.plugins %>',
          src:'**/happathon.json',
          dest:'<%= build.dirs.plugins %>',
          expand:true,
          debug:false,
          nonull:false,
          rename: function(dest, src) {
            grunt.log.writeln('dest,src',dest,src);
            return dest + src.replace(/\.json/,'-config-module.js');
          }
        }],
      }
    },


    // `grunt concat` concatenates multiple source files into a single file.
    concat: {
      //`compile_css` concatenates our app and thirdparty js in a single file.
      compile_css: {
        src: '<%= build.dirs.css %>**/*.css',
        dest: '<%= compile.dirs.css %><%= pkg.name %>-<%= pkg.version %>.css'
      },
      //`compile_js` concatenates our app and thirdparty js in a single file.
      compile_js: {
        options: { banner: '<%= banner %>' },
        src:['module.prefix', '<%= src.requiredFiles %>','<%= build.dirs.js %>', 'module.suffix'],
        dest: '<%= compile.dirs.js %><%= pkg.name %>-<%= pkg.version %>.js'
      },

      dynamically_add_dependencies_to_appjs:{
        src:'<%= src.dirs.app %>app.js',
        dest:'<%= build.dirs.app %>app.js',
        options:{
          process:function(content, srcpath){
            var appjsFile = content;
            var modulesStr = '';
            var servicesStr = '';
            grunt.file.expand(
              {debug:false,nonull:true,expand:true},
              grunt.config.get('build.dirs.plugins')+'**/*.js'
            ).forEach(function(path,loopIterator,filesArr){
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
            var newContent = content.replace(/\/\/\s+\{\{concat.dynamically_add_dependencies_to_appjs.modules\}\}/,modulesStr);
            newContent = newContent.replace(/\{\{concat.dynamically_add_dependencies_to_appjs.services\}\}/,servicesStr);
            return newContent;
          }
        },
      },

      build_index:{ // adds css and js files to index
        src:'<%= src.dirs.app %>index.html',
        dest:'<%= build.dirs.app %>index.html',
        options:{
          process:function(content, srcpath){
            var cssStr = '\n';
            var jsStr = '\n';
            var thirdpartyStr = '\n';

            // ensure our third party dependencies load in the correct order
            var thirdPartyFiles=grunt.config.get('src.requiredFiles');
            thirdPartyFiles.files.forEach(function(filePath){
              grunt.log.writeln('file',filePath);
              thirdpartyStr+= '\n    <script type="text/javascript" src="thirdparty/'+
              filePath +
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
                // grunt.log.writeln('path',path);
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


    /**
     * HTML2JS is a Grunt plugin that takes all of your template files and
     * places them into JavaScript files as strings that are added to
     * AngularJS's template cache, so all the html templates join the initial
     * js payload as one JavaScript file.
     */
    html2js: {
      options:{module:'html_templates_jsfied'},
      app:{src:['<%= src.dirs.app %>*.tpl.html','<%= src.dirs.plugins %>**/*.tpl.html'], dest:'<%= build.dirs.js %>html_templates_jsfied.js'}
    },



    /**
     * Compiles source documentation into a web page.
     * For valid tags, see http://usejsdoc.org/#JSDoc3_Tag_Dictionary
     */
    jsdoc: {
      dist : {
        src: ['src/*.js', 'test/*.js'],
        options: {
          destination: 'doc'
        }
      }
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
      src_appjs: ['<%= src.dirs.app %>**/*.js', '!<%= src.dirs.thirdparty %>**'],
      built_appjs: '<%= build.dirs.js %>app.js',
      built_html_templates: '<%= build.dirs.js %>html_templates_jsfied.js',
      rootfiles: ['*.{json,js}','*.*rc'], // lints the rootfiles, bower files, etc.
      built_angular_services: ['<%= build.dirs.app %>**/*-module.js'],
    },


    // Karma configurations.
    karma: {
      options: {configFile: 'karma-config-unit.js'},
      unit: {runnerPort: 9101, background: true },
      continuous: {singleRun: true, background: true }
    },

    recess: {
    /**
     * `recess` for LESS files concatenates, converts to CSS, copies, and optionally minifies them;
     * Only our `app.less` file is included in compilation; all other files
     * must be imported from this file.
     */
      build: {
        src: [ '<%= src.dirs.app %>app.less','<%= src.dirs.thirdparty %>bootstrap/less/bootstrap.less' ],
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


    sync:{
      thirdparty_to_src: {
        files: [{
          cwd: '<%= src.dirs.bower %>',
          src: ['**/*.{js,less,map}','!{happathon,jQuery,node_modules,.git,Gruntfile,gruntfile,gruntFile,bootstrap/js,bootstrap/dist}*/','jQuery/jquery.min.js'],
          dest: '<%= src.dirs.thirdparty %>',
        }]
      },
      thirdparty_to_build:{cwd: '<%= src.dirs.thirdparty %>', src:'**/*.{js,css}', dest:'<%= build.dirs.thirdparty %>'},
      build_app: {cwd: '<%= src.dirs.app %>', src:['**/*.js','!thirdparty/**','!**/*.spec.js'], dest:'<%= build.dirs.app %>'},
      assets:{cwd: '<%= src.dirs.assets %>', src:'**', dest:'<%= build.dirs.assets %>'}
    },
    /**
     * `ng-min` annotates the sources before minifying. That is, it allows us
     * to code without the array syntax.
     */
    /** Minify the sources! */
    uglify: {
      options: {banner: '<%= banner %>'},
      files: {src:'<%= concat.compile_js.dest %>', dest:'<%= concat.compile_js.dest %>'}
    },


    watch: {
     // watches files to see if they change and runs the tasks specified below
     // when they do, automating the build process each time a file is saved.
     // NOTE: These only run on CHANGED files, not creations/deletions
      options: {
        cwd:'<%= src.dirs.app %>', // set a default source dir...
        livereload: true, // and automatically reload the browser when files change
      },

      // /**
      //  * When a JavaScript unit test file changes, we only want to lint it and
      //  * run the unit tests. We don't want to do any live reloading.
      //  */
      // spec: { files: '<%= **/*.spec.js %>', tasks: [ 'jshint:test', 'karma:unit:run' ], },
      // When the rootfiles change, lint them.
      rootfiles:{files: ['Gruntfile.js','package.json','bower.json'],tasks:['jshint:rootfiles','buildSpec'],options:{cwd:'.'}},
      // compile app's angular dependencies on change
      main_app_module: {files:'app.js', tasks: ['concat:dynamically_add_dependencies_to_appjs','jshint:built_appjs','buildSpec'] },
      angular_modules: {files: ['**/*-module.js'], tasks: ['sync:build_app','jshint:built_angular_services','buildSpec'] },
      static_files_excluding_angular_modules:{files: ['**/*.{css,js}','!**/*-module.js'], tasks: ['sync:build_app','buildSpec']},
      // compile index on change
      index: {files: 'index.html', tasks: ['concat:build_index','buildSpec'] },
      // Recompile template cache on change
      html_templates: {files: '**/*.tpl.html', tasks: ['html2js','buildSpec'] },
      // compile less on change
      appless:{ files: 'app.less', tasks: ['recess:build','buildSpec']},
      bootstrapless:{ files: 'thirdparty/bootstrap/**/*.less', tasks: ['recess:build','buildSpec']},
      // Copy any changed assets
      assets:{files:'assets/**', tasks:['sync:assets','buildSpec']},

    }
  };





  grunt.initConfig( grunt.util._.extend( taskConfig, directoryPaths ) );

  /**
   * In order to make it safe to just compile or copy *only* what was changed,
   * we need to ensure we are starting from a clean, fresh build. So we rename
   * the `watch` task to `delta` (that's why the configuration var above is
   * `delta`) and then add a new task called `watch` that does a clean build
   * before watching for changes.
   */
  // grunt.renameTask( 'watch', 'delta' );
  grunt.registerTask( 'init', ['build', /*'karma:unit', */'connect', 'watch' ]);


  /** The default task is to build and compile. */
  grunt.registerTask( 'default', ['build', /*'compile'*/ ]);
  // 'compile'remove this for now.  We're not at a production stage.  We only need build.

  /**
   * The `build` task gets sets up the app for development and testing.
   */

  grunt.registerTask( 'build', [
    // if this is the first run, it should copy the third party libs to your thirdparty dir
    !grunt.file.exists(grunt.config.get('src.dirs.thirdparty'))? // does the thirdparty directory exist in src?
      'sync:thirdparty_to_src': // nope, create it and populate with fresh bower components
      'clean', // otherwise we're working with an existing install.  Wipe out the build dir for a fresh one.
    'html2js', // compile the html templates to js and place them in the build dir
    'jshint:built_html_templates', // and lint them
    'jshint:src_appjs', // lint src js
    'copy:happathon_configs_to_angular_services', // copy the happathon configs to build as angular services
    'jshint:built_angular_services', // and lint them
    'sync:build_app', // copy everything over to the build dir, excluding the things already copied
    'sync:thirdparty_to_build', // copy third party js & css to build
    // 'concat:dynamically_add_dependencies_to_appjs', // automatically add all angular service and module dependencies for us
    'recess:build', // compile our less to css and copy it to the build dir
    'sync:assets', // along with assets
    'concat:build_index', // build our index file with all its dependencies
    'buildSpec'
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

  grunt.registerTask('buildSpec','test That all build files that should exist, do',function(){
    if(!grunt.file.exists('build/app/index.html')) {grunt.fail.fatal('index.html does not exist!');}
    if(!grunt.file.exists('build/app/app.js')) {grunt.fail.fatal('app.js does not exist!');}
    if(!grunt.file.exists('build/app/thirdparty/')) {grunt.fail.fatal('thirdparty directory does not exist!');}
    if(!grunt.file.exists('build/app/plugins/')) {grunt.fail.fatal('plugins directory does not exist!');}
    if(!grunt.file.exists('build/app/js/html_templates_jsfied.js')) {grunt.fail.fatal('html_templates_jsfied does not exist!');}
  });
};
