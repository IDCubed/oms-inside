Volunteers
  Need to see something to get started.
  Taking a whole lot more work than expected to get them there.

Mostly newer.  Can't do archiecture.
  Bower
  Plugin architecture.
  Problems similar to:
    What is a TCC and where do we store information about it? is more clear
        Small sqlite database in TCC core.
  In what situations people can find each other
  Who is visible when



https://docs.google.com/document/d/1nIsGD8hBZzxtAUj9Vmxt7dpShjy4JgYDCFzDG7uG_s4/edit#heading=h.beh19m5takri


Basic flows works like this

// user clicks installed plugins in settings page

Insight screen
insights screen shows

PLUGINS LIST PAGE
slides in from left.
user clicks plugins button
user sees two tabs at top - installed and available.  Default is available.
user sees dropdown for plugin types: insights, peoples, algorithms, challenges
app compare's plugin's required data source identifiers to people's available data source identifiers
plugins that require data from source ids not in the users's data store, are greyed out
Add New Plugin Type
Click on an installed Insight
Click on an installed Form
Click on an installed Challenge
Click on an installed People
Click on an installed Algorithm
Click on a market Insight
Click on a market Form
Click on a market Challenge
Click on a market People
Click on a market Algorithm

Plugins may define data sources, and read other data sources

Plugin Spec:
bower.json
{
  plugin_name:'',
  version:'',
  description:'',
  keywords:'',
  ignore:'',
  license:'',
  authors:'',
  homepage:'',
  repository:'',
  private:false,
  dependencies:{
    'some_other_plugin':'0.0.1'
  },
}

happathon.json


INSIGHT PLUGIN
// insight plugin (insights only display existing data)
// user finds a plugin they want from the plugin list
// user clicks to install the plugin
// app installs plugin and dependencies with bower
// app reads its settings from the engine's settings api.
// app adds this plugin to its settings
// app writes this plugin to its "installed_plugins" setting via the engine's settings api
// the settings include
```

```
// app notifies engine of routes
// happathon app checks for dependencies
// clicks happathon app checks for dependencies
// happathon app checks for dependencies





// plugin registers with engine
// plugin provides engine with data schema, default api routes, and
// plugin provides settings schema (with defaults) to engine
// plugin provides api schema to engine
// engine adds api schema to people
// engine adds api customization to people settings
// engine adds default settings to people
// engine adds data storage to people based on schema
// plugin installed

plugin provides an interface for other plugins


1. Example application in browser - no backend - uses sample data
  status - how am I doing?
  data explorer - 2 points by time.

  moment form
  menus
  coloring
  plugins list
  somerville survey
  welcome page - describe value, background, etc.
  // help popups on each page, with do not show checkbox.  In settings, have a button to reset all the "do not show" boxes.
  click through OMS pages (terms and conditions)

  if they want idcubed to be promoted in the app
  if they want idcubed to be promoted in the app

// customized somerville version repository

2. Hooking a backend up to it.
3.

  terms and conditions page
    your data is yours
    you can take your data with you
    you can opt out at any time
    data you've left in the group node will stay there for research purposes
    you data can't be accessed without your knowledge
