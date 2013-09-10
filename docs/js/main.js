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



  var markDownContainer={
    $el:$('#markdown-container'), // the container element for rendering the converted markdown;
    // renders the markdown into the markdowncontainer
    convertMarkdownToHTML:function(data, textStatus, jqXHR){
      return marked(data, function (err, content) {
        if (err) return this.failedConversion(jqXHR, textStatus, err);
        return content;
      });
    },
    render:function(data, textStatus, jqXHR){
      this.$el.html( this.convertMarkdownToHTML(data) );
    },
    failedConversion:function(jqXHR, textStatus, err){
      console.log('Markdown render error: (msg,jqXHR)', jqXHR, textStatus, err);
      return '<p class="error">Error rendering markdown. Please check your console.</p>';
    }
  };

  var nav = {
    $el : $('#docs-nav'),
    $navItems : null,
    loadFail: function(jqXHR, textStatus, errorThrown){
      if(!console) return;
      if(!console.error) console.error = console.log;
      markDownContainer.render('<p class="error">Error loading markdown. Please check your console.</p>')
      console.error('Load Error: (jqXHR, textStatus, errorThrown)', jqXHR, textStatus, errorThrown);
    },
    load:function(urlStr){
      $.ajax({
        url:urlStr,
        dataType:'text'
      })
      .done(markDownContainer.renderMarkdown)
      .fail(self.loadFail)
    },
    init:function(){
      var self = this;
      this.$navItems = this.$el.find('li');
      this.$el.on('click','a',function(event){
        event.preventDefault();

        // load the markdown asynchronously when the nav is clicked.
        self.highlightCurrentNavPosition(this);
        // load the markdown
        self.load(this.href);
      })
    },
    highlightCurrentNavPosition:function(linkElem){
      this.$navItems.removeClass('active');
      $(linkElem).closest('li').addClass('active');
    }
  };

  nav.init();
  nav.load('markdowntest.md');
  



  // Using async version of marked


})(jQuery);