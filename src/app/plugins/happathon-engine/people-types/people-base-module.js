angular.module( 'happathon-engine.people-base', [
  'happathon-plugin-generator'
])
.service('happathon-engine.people-base', ['happathonJsonBase', function (happathonJsonBase) {
  return angular.extend({},happathonJsonBase,{
    id:null,
    core_id:null,
    type:'people',
    subtype:'default',
    version: '0.0.1',
    user_shared_apis:[],
    people_shared_apis:[],
    user_shared_datasources:[],
    people_shared_datasources:[],
    settings:{
      // each installed tab extends these settings
      // each installed tab can also change the default settings of its dependencies
    },
    installed_tabs:{

    }
  });
}]);


// copied from previous types module;

// providing the people type data as a service to other modules
/*
ngular.module('happathon.people.types',[
  'happathon.people.base'
])
.service('peopleCity', ['peopleBase',function (peopleBase) {
  return angular.extend({},peopleBase,{
    type:'people',
    subtype:'city',
    name_first:"default_name_first",
    name_last:"default_name_first",
    menu_title:"default_menu_title",
    is_user:false,
    providedData:[],
    email:'',
    address1:'',
    address2:'',
    phone_mobile_num:'',
    phone_alt_num:''
  });
}])

ervice('peopleHuman', ['peopleBase',function (peopleBase) {
  return angular.extend({},peopleBase,{
    type:'people',
    subtype:'human',
    version: "0.0.1",
    persona_id:0,
    core_id:0,
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
    optional_attributes:{},
    required_tabs:{
      happathon_engine_data:'0.0.1',
      happathon_plugin_market:'0.0.1'
    },
    installed_tabs:{
      happathon_engine:{},
      happathon_plugin_repo:{},
      happathon_app:{
        version:'0.0.1',
        happathon_engine_data:{
          sensors:{
            gps:{
              identifier:"foo_identifier_1",
              name:"default_accelerometer",
              source:"phone",
              source_make:"samsung",
              source_model:"galaxy",
              source_os:"android",
              imei:"",
              data:{}
            },
            accelerometer:{
              identifier:"foo_identifier_2",
              name:"default_gps",
              source:"phone",
              source_make:"samsung",
              source_model:"galaxy",
              source_os:"android",
              imei:"",
              data:{}
            }
          }
        },
        happathon_settings:{
          meta:{
            update_link:'/api/v0/people/0'
          },
          question_forms:{
            moment:{
              base:'happathon_engine.moment',
              additions:{
                people:[],
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
                people:[1,2,3],
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
            people:[{
              id:1, // somerville
              shared_attributes:['name_first','name_last'],
              visible_in_menu:true
            }],
            insights:{
              time_explorer:{
                version:'0.0.1',
                settings:{}
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
        }
      }
    }
  });

}]);
*/