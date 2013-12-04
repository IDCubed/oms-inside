// providing the holon type data as a service to other modules

angular.module('happathon.holon.base',[
  'happathon.plugin.base'
])
.service('holonBase', ['pluginBase',function (pluginBase) {
  return angular.extend({},pluginBase,{
    type:'holon',
    subtype:null,
    version: null,
    id:0,
    core_id:0,
    name_full:'',
    is_user:false,
    description: "default plugin description, based loosely on CommonJS packages",
    keywords: ["package", "example"],
    maintainers: [
      {"name": "Example Name", "email": "example@example.com", "web": "http://www.example.com"}
    ],
    contributors: [
      {"name": "Example Anothername", "email": "example2@example.com", "web": "http://www.example.com"}
    ],
    issues: {"mail": "dev@example.com", "web": "http://www.example.com/issues"},
    licenses: [
      {"type": "MIT", "url": "http://www.example.org/licenses/mit.html"}
    ],
    repositories: {
      canonical:{"type": "git", "url": "http://hg.example.com/mypackage.git"},
      mirror:{"type": "git", "url": "http://hg.example.com/mypackage.git"}
    },
    dependencies:{},
    optional_dependencies:{}
  });
}]);
