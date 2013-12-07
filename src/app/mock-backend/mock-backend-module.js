angular.module('happathon.mock-backend', [
  'ngMockE2E',
  'happathon.holon',
  'happathon.plugin',
  'restangular'
])

/*Use run() to register work which should be performed when the injector is done loading all modules.*/
.service('tempPluginsObj', ['Restangular', '$q', function (Restangular,$q) {

  var plugin_base = {
    'type': null,
    subtype: null,
    version: null,
    id: 0,
    core_id: 0,
    name_full: '',
    is_user: false,
    description: "default plugin description based loosely on CommonJS packages",
    keywords: ["package", "example"],
    maintainers: [{"name": "Example Name", "email": "example@example.com", "web": "http://www.example.com"} ],
    contributors: [{"name": "Example Anothername", "email": "example2@example.com", "web": "http://www.example.com"} ],
    issues: {"mail": "dev@example.com", "web": "http://www.example.com/issues"},
    licenses: [{"type": "MIT", "url": "http://www.example.org/licenses/mit.html"} ],
    repositories: {"type": "git", "url": "http://hg.example.com/mypackage.git"},
    dependencies:{},
    optional_dependencies:{}
  };

  var plugins = {};

/**
 * HOLONS
 */

  plugins.happathon_holon_base = angular.extend({},plugin_base,{
    id:null,
    type:'holon',
    version: '0.0.1',
    name_first:"default",
    name_last:"default",
    menu_title:"default",
    name_full:'default'
  });

  plugins.happathon_human_example = angular.extend({},plugins.happathon_holon_base,{
    id:0,
    version: "0.0.1",
    subtype:'human',
    name_first:"Adam",
    name_last:"Laughlin",
    name_full:"Adam Laughlin",
    menu_title:"Me",
    is_user:true,


    dependencies:{
      happathon_holon_base:'0.0.1'
    },
    meta:{updatelink:"/holons/0/"},
    required_attributes:{
      name_full:'default_name_full',
      name_first:"default_name_first",
      name_last:"default_name_first",
      menu_title:"default_menu_title",
      is_user:false,
      email:'',
      address1:'',
      address2:'',
      phone_mobile_num:'',
      phone_alt_num:'',
      age:0,
      birth_year:0,
      birth_month:0,
      birth_day:0,
      time_zone:'GMT-5'
    },
    settings:{
      // each installed tab extends these settings
      // each installed tab can also change the default settings of its dependencies
    },
    installed_tabs:{
    }
  });

  plugins.happathon_city_example = angular.extend({},plugins.happathon_holon_base,{
    id:1,
    subtype:'city',
    name_full:"Somerville",
    menu_title:"Somerville",
    meta:{updatelink:"/holons/1/"}
  });



/**
 * INSIGHTS
 */
  // insights should be templates that fill in data already on the human example
  plugins.happathon_insight_base = angular.extend({},plugin_base,{
    type:'insight',
    subtype:null,
    version:'0.0.1',
    dependencies:{},  // renders the different dependencies
  });


  plugins.happathon_histogram_base = {
    type:'insight',
    subtype:'histogram',
    dependencies:{
      // oh cool!  If we use bower internally, we can specify
      // non-happathon dependencies, like d3.js, processing.js, etc.
      happathon_insight_base:'0.0.1'
    },
  };



/**
* CHALLENGES
*/
  plugins.challengeBase = angular.extend({},plugin_base,{

  });
/**
* FORMS
*/
  plugins.forms = angular.extend({},plugin_base,{
    happathon_moment:{
      plugin_type:'form',
      version:'0.0.1',
      extendable:true,
      engine_schema:{
        '/sources':{ // sources are based on device, not app, so that all apps can access the data
          '/someDynamicallyGeneratedUniqueDeviceIdentifierIneedToDetermine':{
            '/questions':{
              'where_are_you':[],
              'what_are_you_doing':[],
              'who_are_you_with':[],
              'how_focused_are_you':[],
              'how_happy_are_you':[]
            }
          }
        }
      },
      primary_key:'user.id or something',
      post_submit_state:'random_insight',
      questions:[ // these map to db columns
        {
          question:'Where are you?',
          type:'checkbox',
          answers:['Indoors','Outdoors','Home','Work','In transit','Public place'],
          others:[],
          persist_others:true,
          delete_others:true,
          other_placement:'append'
        },
        {
          question:'What are you doing?',
          type:'radio',
          answers:['Something','Whittling','Eating Broccoli','Kissing a Llama','Drying my nose off'],
          others:[],
          // when creating others by name, it should probably require specifying a relationship type.
          persist_others:true,
          delete_others:true,
          other_placement:'append'
        },
        {
          question:'Who are you with?',
          type:'radio',
          answers:['Alone','Significant Other','My Children','Other Children','Relatives','Friends','Co-workers','Clients','Strangers'],
          others:[],
          // when creating others by name, it should probably require specifying a relationship type.
          persist_others:true,
          delete_others:true,
          other_placement:'append'
        },
        {
          question:'How focused are you?',
          type:'slider',
          answers:[0,1,2,3,4,5,6,7]
        },
        {
          question:'How happy are you?',
          type:'slider',
          answers:[0,1,2,3,4,5,6,7]
        },
      ]
    },
    happathon_daily:{},
    start:{},
    quarterly:{}
  });

  return plugins;

}])
.service('tabsDynamicData', [function () {

/**
 * TABS (Trusted Application Bundles)
 */

  var TABs = {};

  TABs.happathon_plugin_market_client = { // this should work like bower
    version:'0.0.1',
  };

  TABs.happathon_engine = {
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
    '/sources':{
      // sources are based on device, not app, so that all apps can access the data
      // This section below should be automatically generated from an "engine_schema"
      // property on apps using the engine on this device
      '/someDynamicallyGeneratedUniqueDeviceIdentifierIneedToDetermine':{
        type:"phone",
        resolution:[1200,800],
        make:"samsung",
        model:"galaxy note 2",
        os:"android",
        imei:"1234",
        '/sensors':{
          '/light':[
            {"accuracy":0,"lux":39.0,"timestamp":1384546775.649034}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.963783}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.972311}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.983740}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.969361}, {"accuracy":0,"lux":39.0,"timestamp":1384546778.992323}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.003813}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.012328}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.980824}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.023900}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.032332}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.043805}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.052325}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.063885}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.072470}, {"accuracy":0,"lux":38.0,"timestamp":1384546779.083867}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.989377}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.092448}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.103931}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.112430}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.123884}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.132421}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.143924}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.152462}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.000917}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.163938}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.172456}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.183936}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.192478}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.203996}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.212527}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.224005}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.232508}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.244009}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.252609}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.009422}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.264018}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.272551}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.284057}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.292781}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.304066}, {"accuracy":0,"lux":39.0,"timestamp":1384546779.312619}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.324117}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.332630}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.344131}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.352772}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.364585}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.372772}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.384151}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.392717}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.404187}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.412739}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.424203}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.020868}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.432675}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.444267}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.452742}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.464284}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.472787}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.484253}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.492787}, {"accuracy":0,"lux":39.0,"timestamp":1384546939.924100}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.103835}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.113956}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.124035}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.133960}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.143988}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.154827}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.164003}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.174013}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.184040}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.194033}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.204039}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.214848}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.224101}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.234164}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.244084}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.504264}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.254102}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.264132}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.274974}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.284144}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.294229}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.304207}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.314186}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.324165}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.334969}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.344295}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.354211}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.364170}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.374170}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.384188}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.395045}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.404285}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.414299}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.424274}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.434276}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.444274}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.455038}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.464292}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.474334}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.484341}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.494302}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.504326}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.515176}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.524319}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.534317}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.544329}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.512802}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.554338}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.564394}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.575147}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.584366}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.594383}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.604386}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.614410}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.624439}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.635240}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.644440}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.654510}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.664500}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.674466}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.684465}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.695309}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.704545}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.714554}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.724562}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.734571}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.744533}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.755344}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.764552}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.774601}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.784561}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.794571}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.804648}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.815421}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.824676}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.834730}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.844695}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.029388}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.524281}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.854715}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.864745}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.875508}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.884792}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.894918}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.904786}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.914773}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.924934}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.935577}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.944789}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.954961}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.964811}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.974829}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.984843}, {"accuracy":0,"lux":39.0,"timestamp":1384546940.995629}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.004943}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.014845}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.024968}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.034918}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.044973}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.055619}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.064836}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.074850}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.084850}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.094863}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.104911}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.115712}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.124963}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.134957}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.144939}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.532803}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.154956}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.164991}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.175835}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.184973}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.195142}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.205010}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.215072}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.225115}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.235860}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.245010}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.255027}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.265071}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.275072}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.285093}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.295922}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.305187}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.315131}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.325230}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.335171}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.345164}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.356056}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.365195}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.375222}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.385174}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.395197}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.405199}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.416123}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.425244}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.435264}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.445287}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.455347}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.465342}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.476099}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.485343}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.495359}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.505386}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.515370}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.525430}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.536242}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.545436}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.544318}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.555437}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.565564}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.575490}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.585463}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.596441}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.605529}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.615635}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.625497}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.635522}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.645508}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.656373}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.665530}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.675541}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.685578}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.695615}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.705587}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.716383}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.725587}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.735609}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.745616}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.552830}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.755638}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.765669}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.776476}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.785716}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.795664}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.805737}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.815703}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.825725}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.836506}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.845807}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.855867}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.865728}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.875826}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.885800}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.896626}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.905881}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.915865}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.925874}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.935833}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.945837}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.956664}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.965893}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.975900}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.985923}, {"accuracy":0,"lux":39.0,"timestamp":1384546941.995927}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.005933}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.016721}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.025971}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.036011}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.046021}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.056031}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.066117}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.076869}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.086122}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.096084}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.106078}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.116066}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.126035}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.136800}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.146026}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.564417}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.156012}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.166039}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.176039}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.186106}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.196844}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.206052}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.216082}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.226083}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.236170}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.246209}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.257051}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.266351}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.276238}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.286303}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.296283}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.306291}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.317081}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.326349}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.336262}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.346275}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.356104}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.366109}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.376926}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.386127}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.396186}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.406204}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.416262}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.426239}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.436976}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.446211}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.572863}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.456215}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.466260}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.476282}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.486304}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.497070}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.506294}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.516312}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.526337}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.536268}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.546297}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.557132}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.566326}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.576342}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.586354}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.596369}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.606350}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.617149}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.626421}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.636426}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.646368}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.656419}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.666426}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.677274}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.686456}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.696459}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.706432}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.716443}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.726470}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.737296}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.746517}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.584361}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.756541}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.766533}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.776567}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.786640}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.797431}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.806625}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.816589}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.826571}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.836581}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.846671}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.040873}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.857459}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.866687}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.876719}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.886735}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.896691}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.906780}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.917557}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.926784}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.936792}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.946836}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.956840}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.966803}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.977655}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.986885}, {"accuracy":0,"lux":39.0,"timestamp":1384546942.996837}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.006925}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.016843}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.026882}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.037678}, {"accuracy":0,"lux":39.0,"timestamp":1384546943.046937}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.592889}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.604402}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.612897}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.624408}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.632959}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.644419}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.652958}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.664677}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.672988}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.684485}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.764645}, {"accuracy":0,"lux":37.0,"timestamp":1384546967.604436}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.773120}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.049422}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.784682}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.793172}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.804683}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.813179}, {"accuracy":0,"lux":37.0,"timestamp":1384546779.824702}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.833201}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.844719}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.853135}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.864648}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.873135}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.060948}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.884706}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.893156}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.904688}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.913171}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.924685}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.933185}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.944677}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.953220}, {"accuracy":0,"lux":35.0,"timestamp":1384546779.964685}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.973229}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.069445}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.984718}, {"accuracy":0,"lux":34.0,"timestamp":1384546779.993273}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.004792}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.013297}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.024772}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.033307}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.044786}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.053331}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.064785}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.073316}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.080964}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.084804}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.093336}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.104852}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.113375}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.124872}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.133398}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.144864}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.153497}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.164907}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.173437}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.089518}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.185047}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.193449}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.205814}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.213457}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.224941}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.233486}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.244984}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.253508}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.264998}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.273540}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.101066}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.285003}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.293531}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.305009}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.313547}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.325033}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.333568}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.345048}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.680605}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.109519}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.353584}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.365069}, {"accuracy":0,"lux":31.0,"timestamp":1384547047.717473}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.373606}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.385100}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.393690}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.405153}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.413684}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.425195}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.433751}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.445254}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.453843}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.465309}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.473824}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.120978}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.485273}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.493796}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.505307}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.513807}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.525303}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.533783}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.545309}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.553806}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.565300}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.573826}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.129525}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.585304}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.593829}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.605305}, {"accuracy":0,"lux":34.0,"timestamp":1384546780.613848}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.625345}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.633880}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.645345}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.653918}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.665379}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.673912}, {"accuracy":0,"lux":39.0,"timestamp":1384546775.689142}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.140996}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.685404}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.693939}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.705433}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.713971}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.725425}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.734038}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.745565}, {"accuracy":0,"lux":37.0,"timestamp":1384546780.754092}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.765538}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.774082}, {"accuracy":0,"lux":39.0,"timestamp":1384546776.149533}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.785554}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.794088}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.805564}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.814056}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.825536}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.834059}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.845538}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.854076}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.748096}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.807660}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.817776}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.827807}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.837807}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.847804}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.858636}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.867866}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.877942}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.887950}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.897866}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.907947}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.918656}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.927950}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.937939}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.947929}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.957974}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.967934}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.978779}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.987958}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.865566}, {"accuracy":0,"lux":34.0,"timestamp":1384547087.998006}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.008032}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.018033}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.028054}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.038882}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.048098}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.058087}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.068042}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.078113}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.088094}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.099008}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.108105}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.118129}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.128211}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.138137}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.148174}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.158948}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.168205}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.178257}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.188241}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.198220}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.208203}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.219048}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.228281}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.238240}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.248323}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.258398}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.268336}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.279141}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.288329}, {"accuracy":0,"lux":35.0,"timestamp":1384546780.874111}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.298314}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.308337}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.318404}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.328440}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.339160}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.348409}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.358376}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.368443}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.378412}, {"accuracy":0,"lux":34.0,"timestamp":1384547088.388450}
          ],
          '/battery':[
            {"health":2,"icon-small":17303197,"invalid_charger":0,"level":80,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":273,"timestamp":1384547187.358,"voltage":3983}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":80,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":283,"timestamp":1384547334.426,"voltage":4008}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":82,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":228,"timestamp":1384546800.425,"voltage":4063}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":82,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":228,"timestamp":1384546837.111,"voltage":4063}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":81,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":259,"timestamp":1384546888.565,"voltage":4004}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":79,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":285,"timestamp":1384547633.266,"voltage":4015}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":78,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":272,"timestamp":1384547933.307,"voltage":4026}, {"health":2,"icon-small":17303197,"invalid_charger":0,"level":78,"plugged":0,"present":true,"scale":100,"status":3,"technology":"Li-ion","temperature":287,"timestamp":1384548233.208,"voltage":4005}
          ]
        },
        '/forms':{

        }
      }
    }
  };

  TABs.happathon_app = {
      // engine_schema defines what data the engine should store, and how it should store it
    engine_schema:{
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
    },
    happathon_settings:{
      meta:{
        update_link:'/api/v0/holons/0',
        api_link:'/api/v0/'
      },
      question_forms:{
        moment:{
          base:'happathon_engine.moment',
          additions:'happathon_engine.forms.moment.additions', // gets this data directly from the happathon engine tab
          holons:[],
          locations:[]
        },
        allowed_times:{
          start:'08:30',
          end:'21:30'
        }
      },
      daily:{
        base:'happathon_engine.daily',
        additions:{
          values:['marshmallows','petting animals'],
          holons:[1,2,3],
          locations:[]
        },
        allowed_times:{
          start:'08:30',
          end:'21:30'
        }
      },
      starting:{
        base:'happathon_engine.starting',
        additions:{},
        allowed_times:{
          start:'08:30',
          end:'21:30'
        }
      }
    },
    plugins:{
      holons:[{
        id:1, // somerville
        shared_attributes:['name_first','name_last'],
        visible_in_menu:true
      }],
      insights:{
        time_explorer:{
          version:'0.0.1',
          settings:{},
          required_api_urls:[

          ]
        },
        location_explorer:{
          version:'0.0.1',
          settings:{}
        },
        relationship_explorer:{
          version:'0.0.1',
          settings:{}
        },
        status:{
          version:'0.0.1',
          settings:{}
        },
        values_by_time:{
          version:'0.0.1',
          settings:{}
        }
      },
      challenges:{
        somerville_survey:{
          version:'0.0.1',
          settings:{}
        },
        '2kind':{
          version:'0.0.1',
          settings:{}
        }
      }
    }
  };
  return TABs;
}])



.run(['$httpBackend','tempPluginsObj','tabsDynamicData',function run ($httpBackend, tempPluginsObj, tabsDynamicData) {
  console.log('running backend module');

  $httpBackend.whenGET(/form|insight|challenge|tpl\.html/gi).passThrough();

  $httpBackend.whenGET(/\/api\/v0\/tabs/)
  .respond(function(method, url, data, headers){
    return [200, [tabsDynamicData],{}];
  });

  $httpBackend.whenGET(/\/api\/v0\/plugins/)
  .respond(function(method, url, data, headers){
    return [200, [tempPluginsObj],{}];
  });

  $httpBackend.whenGET(/\/api\/v0\/holons/)
  .respond(function(method, url, data, headers){
    return [200, [tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  });

  $httpBackend.whenPOST(/\/api\/v0\/holons/)
  .respond(function(method, url, data, headers){
    console.log('add holon');
    return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  });

  $httpBackend.whenPUT(/\/api\/v0\/holons/)
    .respond(function(method, url, data, headers){
    return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  });

  $httpBackend.whenDELETE(/\/api\/v0\/holons/)
  .respond(function(method, url, data, headers){
    return [200,[tempPluginsObj.happathon_human_example,tempPluginsObj.happathon_city_example],{}];
  });
}]);

//TODO: add insight and challenge generators

  // $httpBackend.whenGET(/\/api\/holon\/[a-zA-Z]/)
  // .respond(function(method, url, data, headers){
  //   holon = mockData.holon[url.slice(url.lastIndexOf('/')+1)];
  //   console.log('holon',holon);
  //   return holon ? [200,holon,{}] : [404,false,{}];
  // });


