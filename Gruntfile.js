module.exports = function ( grunt ) {
  /**
   * Load required Grunt tasks. These are installed based on the versions listed
   * in `package.json` when you do `npm install` in this directory.
   */
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  // grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-recess');
  grunt.loadNpmTasks('grunt-karma');
  // grunt.loadNpmTasks('grunt-ngmin');
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
      requiredFiles:[
        'jquery/jquery.min.js',
        'lodash/dist/lodash.min.js',
        'angular/angular.min.js',
        'angular-bootstrap/ui-bootstrap-tpls.min.js',
        'angular-mocks/angular-mocks.js',
        'angular-touch/angular-touch.min.js',
        'angular-ui-router/release/angular-ui-router.js',
        'angular-gesture/ngGesture/gesture.js',
        'angular-ui-utils/modules/utils.js',
        // 'd3/d3.min.js',
        // 'd3.chart/d3.chart.min.js',
        // 'Faker/Faker.js',
        'restangular/dist/restangular.js'
      ]
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
        root:'dist/',
        app:'<%= compile.dirs.root %>app/',
        assets:'<%= compile.dirs.app %>assets/'
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
      build:{
        options:{
          base:'<%= build.dirs.app %>',
          livereload:true,
          debug:false
          // open:'http://127.0.0.1:8000/'
        }
      },
      compile:{
        options:{
          base:'<%= compile.dirs.app %>',
          livereload:false,
          debug:true,
          keepalive:true
          // open:'http://127.0.0.1:8000/'
        }
      },
    },



    // may be able to use this to install happathon bower plugins them https://npmjs.org/package/grunt-bower-cli


    // `grunt concat` concatenates multiple source files into a single file.
    concat: {

      // temporary, until user object can have plugins installed in db
      // though we will also need to add them via button click.
      temporarily_pre_install_plugins_on_user_via_grunt:{
        src:'<%= src.dirs.plugins %>happathon-engine/mock-backend/people-user-module.js',
        dest:'<%= build.dirs.plugins %>happathon-engine/mock-backend/people-user-module.js',
        options:{
          // cwd:'<%= src.dirs.plugins %>happathon-engine/mock-backend/',
          process:function(content, srcpath){
            var pluginsStr;
            var plugins={};
            grunt.file.expand(
              {debug:false,nonull:true,expand:true},
              grunt.config.get('src.dirs.plugins')+'**/happathon.json'
            ).forEach(function(path,loopIterator,filesArr){
              var configJsonStr = grunt.file.read(path)
              .replace(/^[^{]*/,'') // strip starting lines before {
              .replace(/\s*?\/\/[^\n]+/gi,''); // strip comments
              if(!/\{/.test(configJsonStr)){ // if no JSON object, return
                return;
              }
              var pluginObj=JSON.parse(configJsonStr);
              plugins[pluginObj.name]=pluginObj;
              // pluginsStr+='"'+pluginName+'":'+configJsonStr+',';
            });
            pluginsStr = JSON.stringify(plugins); // convert to string
            pluginsStr = pluginsStr.slice(1).slice(0,-1); // remove the leading and trailing braces
            // console.log('pluginsStr',pluginsStr);
            var newContent = content.replace(/\'add plugin configs here via grunt\'\:\'\'/,pluginsStr);
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

            thirdPartyFiles.forEach(function(filePath){
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
      },

      //`compile_css` concatenates our app and thirdparty js in a single file.
      compile_css: {
        src: '<%= build.dirs.app %>**/*.css',
        dest: '<%= compile.dirs.app %><%= pkg.name %>-<%= pkg.version %>.css'
      },
      //`compile_js` concatenates our app and thirdparty js in a single file.
      compile_js: {
        options: { banner: '<%= banner %>' },
        src:['module.prefix','<%= build.dirs.app %>/*.js', '<%= build.dirs.plugins %>**/*.js','module.suffix'],
        dest: '<%= compile.dirs.app %><%= pkg.name %>-<%= pkg.version %>.js'
      },
      compile_thirdparty_js: {
        nonull:true,
        process:true,
        src:'<%= src.dirs.thirdparty %>**/{<%= src.requiredFiles %>}',
        // grunt.file.expand(grunt.config.get('src.requiredFiles')).forEach(function(path){
        //   return grunt.config.get('src.dirs.thirdparty')+path;
        // }),
        dest:'<%= compile.dirs.app %>thirdparty.js'
      },

      compile_index:{ // adds css and js files to index
        src:'<%= src.dirs.app %>index.html',
        dest:'<%= compile.dirs.app %>index.html',
        options:{
          process:function(content, srcpath){
            // var newJsPath= grunt.file.expand('<%= concat.compile_js.dest');
            // var newCssPath= grunt.file.expand('<%= concat.compile_css.dest');
            return content
            .replace(
              /    <\!-- token_replace_thirdparty_js_here -->/i,
              '    <script type="text/javascript" src="'+grunt.file.expand(grunt.config.get('concat.compile_thirdparty_js.dest'))[0].replace('dist/app/','')+'"></script>\n'
            )
            .replace(
              /    <\!-- token_replace_js_here -->/i,
              '    <script type="text/javascript" src="'+grunt.file.expand(grunt.config.get('concat.compile_js.dest'))[0].replace('dist/app/','')+'"></script>\n'
            )
            .replace(
              /    <\!-- token_replace_css_here -->/i,
              '    <link rel="stylesheet" type="text/css" href="'+ grunt.file.expand(grunt.config.get('concat.compile_css.dest'))[0].replace('dist/app/','') + '" />\n'
            );
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
      options:{
        module:'html_templates_jsfied',
        base:'<%= src.dirs.app %>'// strips the build dir from the template name
      },
      src_tpls_plus_build_tpls_to_js:{
        src:'<%= src.dirs.app %>**/*.tpl.{html,partial}',
        dest:'<%= build.dirs.app %>html_templates_jsfied.js'
      }
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
      src_js: ['<%= src.dirs.app %>**/*.{json,js}', '!<%= src.dirs.thirdparty %>**'],
      built_appjs: '<%= build.dirs.js %>app.js',
      built_html_templates: '<%= build.dirs.app %>html_templates_jsfied.js',
      rootfiles: ['*.{json,js}','*.*rc'], // lints the rootfiles, bower files, etc.
      // built_angular_services: ['<%= build.dirs.app %>**/*-module.js'],
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
        src: [ '<%= src.dirs.app %>app.less' ],
        dest: '<%= build.dirs.css %><%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: false,
          noUnderscores: false,
          noIDs: true,
          zeroUnits: false
        }
      },
      compile: {
        src: [ '<%= src.dirs.app %>app.less' ],
        dest: '<%= build.dirs.css %><%= pkg.name %>-<%= pkg.version %>.css',
        options: {
          compile: true,
          compress: true,
          noUnderscores: false,
          noIDs: true,
          zeroUnits: false
        }
      }
    },

    sync:{
      thirdparty_to_src: {
        files: [{
          cwd: '<%= src.dirs.bower %>',
          src: ['**/*.{js,less,map}','!{happathon,jQuery,node_modules,.git,Gruntfile,gruntfile,gruntFile,bootstrap/js,bootstrap/dist}*/','jQuery/jquery.min.js'],
          dest: '<%= src.dirs.thirdparty %>',
        }]
      },
      thirdparty_to_build:{cwd: '<%= src.dirs.thirdparty %>', src:'<%= src.requiredFiles %>', dest:'<%= build.dirs.thirdparty %>'},
      src_js_css_html_to_build:{cwd: '<%= src.dirs.app %>', src:['**/*.{js,css,html}','!thirdparty/**','!**/*.spec.js'], dest:'<%= build.dirs.app %>'},
      assets:{cwd: '<%= src.dirs.assets %>', src:'**', dest:'<%= build.dirs.assets %>'},
      compile_assets:{cwd: '<%= src.dirs.assets %>', src:'**', dest:'<%= compile.dirs.assets %>'},

    },

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
      rootfiles:{files: ['Gruntfile.js','package.json','bower.json'],tasks:['jshint:rootfiles','build'],options:{cwd:'.'}},
      // compile app's angular dependencies on change
      main_app_module: {files:'app.js', tasks: [/*'concat:dynamically_add_dependencies_to_appjs',*/'jshint:src_js','buildSpec'] },
      angular_modules: {files: ['**/*-module.js','!**/people-user-module.js'], tasks: ['sync:src_js_css_html_to_build','buildSpec'] },
      static_files_excluding_angular_modules:{files: ['**/*.{css,js,html}','!**/*-module.js','!index.html'], tasks: ['sync:src_js_css_html_to_build','buildSpec']},
      preinstall_user_plugins:{files:'plugins/**/people-user-module.js',tasks:['concat:temporarily_pre_install_plugins_on_user_via_grunt','buildSpec']},
      // compile index on change
      index: {files: 'index.html', tasks: ['concat:build_index','buildSpec'] },
      // Recompile template cache on change
      compile_partials_to_tpls: {files: ['**/*.tpl.{html,partial}','plugins/**/happathon.json'], tasks: [
        'html2js',
        'concat:temporarily_pre_install_plugins_on_user_via_grunt',
        'jshint:built_html_templates',
        'buildSpec'
      ]},
      // compile less on change
      appless:{ files: 'app.less', tasks: ['recess:build','buildSpec']},
      bootstrapless:{ files: 'thirdparty/bootstrap/**/*.less', tasks: ['recess:build','buildSpec']},
      // Copy any changed assets
      assets:{files:'assets/**', tasks:['sync:assets','buildSpec']},

    }
  };





  grunt.initConfig( grunt.util._.extend( taskConfig, directoryPaths ) );


  // Initialize the dev setup - it does a clean build before watching for changes
  grunt.registerTask( 'dev', ['build', /*'karma:unit', */'connect:build', 'watch' ]);
  grunt.registerTask( 'devcompile', ['build', /*'karma:unit', */'connect:compile', 'watch' ]);


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
    'jshint:src_js', // lint src js
    'sync:src_js_css_html_to_build', // copy everything over to the build dir, excluding the things already copied
    'concat:temporarily_pre_install_plugins_on_user_via_grunt',
    'html2js', // compile the html templates to js and place them in the build dir
    'jshint:built_html_templates', // and lint them
    'sync:thirdparty_to_build', // copy third party js & css to build
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
    'sync:compile_assets',
    'concat:compile_thirdparty_js',
    'concat:compile_js',
    'concat:compile_css',
    'concat:compile_index',
    // 'uglify'
  ]);

  grunt.registerTask('buildSpec','test That all build files that should exist, do',function(){
    if(!grunt.file.exists('build/app/index.html')) {grunt.fail.fatal('index.html does not exist!');}
    if(!grunt.file.exists('build/app/app.js')) {grunt.fail.fatal('app.js does not exist!');}
    if(!grunt.file.exists('build/app/thirdparty/')) {grunt.fail.fatal('thirdparty directory does not exist!');}
    if(!grunt.file.exists('build/app/plugins/')) {grunt.fail.fatal('plugins directory does not exist!');}
    if(!grunt.file.exists('build/app/html_templates_jsfied.js')) {grunt.fail.fatal('html_templates_jsfied does not exist!');}
    var user=grunt.file.read('build/app/plugins/happathon-engine/mock-backend/people-user-module.js');
    // grunt.log.writeln('user');
    if(user.indexOf('"name":"happathon-form-daily",')<0){
      grunt.fail.fatal('plugins were not added to user!');
    }
    var templateFile=grunt.file.read('build/app/html_templates_jsfied.js');
    if(templateFile.indexOf('plugins/happathon-insight-utils_angular/all-attributes.tpl.partial')<0){
      grunt.fail.fatal('insight-status plugin not added to template cache via html2js!');
    }
  });
};
