;(function($){
  "use strict"

  // stub the console in case it isn't available.
  if(!console) console={log:function(){}};
  if(!console.error) console.error = console.log;


  // Set markdown conversion default options (except highlight which has no default)
  marked.setOptions({
    gfm: true,
    // highlight: function (code, lang, callback) {
    //   pygmentize({ lang: lang, format: 'html' }, code, function (err, result) {
    //     if (err) return callback(err);
    //     callback(null, result.toString());
    //   });
    // },
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    langPrefix: 'lang-'
  });


  // the container element for rendering the converted markdown;
  var markDownContainer = {
    $el:$('#markdown-container'), 
    // converts markdown to HTML
    convertMarkdownToHTML:function(data, textStatus, jqXHR){
      return marked(data, function (err, content) {
        if (err) return this.failedConversion(jqXHR, textStatus, err);
        return content === '' ?
          'No content to render.':
          content;
      });
    },
    // renders the markdown into the markdowncontainer
    render:function(data, textStatus, jqXHR){
      markDownContainer.$el.html( markDownContainer.convertMarkdownToHTML(data) );
    },
    // handles conversion errors
    failedConversion:function(jqXHR, textStatus, err){
      console.log('Markdown render error: (msg,jqXHR)', jqXHR, textStatus, err);
      return '<p class="error">Error rendering markdown. Please check your console.</p>';
    }
  };

  // the navigation element to select different documentation parts
  var nav = {
    $el : $('#docs-nav'),
    loadFail: function(jqXHR, textStatus, errorThrown){
      markDownContainer.render('<p class="error">Error loading markdown. Please check your console.</p>');
      console.error('Load Error: (jqXHR, textStatus, errorThrown)', jqXHR, textStatus, errorThrown);
    },
    load:function(urlStr){
      // load the file at an url string and render it
      $.ajax({
        url:urlStr,
        dataType:'text'
      })
      .done(function(data, textStatus, jqXHR){
        nav.highlightCurrentNavPosition(this);
        markDownContainer.render(data, textStatus, jqXHR);
      })
      .fail(this.loadFail);
    },
    init:function(){
      // initialize the navigation
      nav.$el.on('click','a',function(event){
        event.preventDefault();
        // load the resource based on the link's href
        self.load(this.href);
      });
    },
    highlightCurrentNavPosition:function(linkElem){
      // highlight the currently active nav element
      this.$el.find('li').removeClass('active');
      $(linkElem).closest('li').addClass('active');
    }
  };

  // Initialize
  nav.init();
  // load a default page
  nav.load('overview.md');

})(jQuery);