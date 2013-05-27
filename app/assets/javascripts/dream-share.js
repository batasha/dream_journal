var DS = (function() {
  function Dream(id, title, date, entry){
    this.id = id;
    this.title = title;
    this.date = date;
    this.entry = entry;
  }

  Dream.prototype.save = function(){
    var that = this;

    $.post(
      "/dreams.json",
      {
        dream: {

          title: that.title,
          date: that.date,
          entry: that.entry
        }
      },
      function(response) {
        that.id = response.id;
        Dream.all.push(that);

        _(Dream.callbacks).each(function(callback){
          callback();
        });
      }
    );

  };

  Dream.all = [];
  Dream.callbacks = [];

  Dream.fetchAll = function(){
    $.getJSON(
      "/dreams.json",
      function(data){
        Dream.all = [];
        _.each(data, function(dream){
          Dream.all.push(new Dream(dream.id, dream.title,
                                   dream.date, dream.entry));
        });

        _(Dream.callbacks).each(function(callback){
          callback();
        });
      });
  };

  Dream.find = function(id){										// REV: oh, makes sense.
    for(var i = 0; i < Dream.all.length; i++){
      if(Dream.all[i].id == id){
        return Dream.all[i]
      }
    }
  }

  function DreamIndexView(el, refreshButton){
    var that = this;
    that.$el = $(el);
    that.$button = $(refreshButton);

    Dream.callbacks.push(function(){
      that.render();
    });
  };

  DreamIndexView.prototype.bind = function(){
    var that = this;

    that.buttonClickHandler = function(){
      Dream.fetchAll();
    };
    that.$button.click(that.buttonClickHandler);
  };

  DreamIndexView.prototype.render = function(){
    var that = this;
    var ul = $("<ul></ul>");
    _.each(Dream.all, function(dream){
      ul.append($("<li></li>").text(dream.title).attr("data-id", dream.id));
    });

    that.$el.empty();
    that.$el.append(ul);
  };

  function DreamFormView(textField, dateField, textArea, button, callback){
    this.$textField = $(textField);
    this.$dateField = $(dateField);
    this.$textArea = $(textArea);
    this.$button = $(button);
    this.callback = callback;

    var that = this;

    Dream.callbacks.push(function(){
      that.$button.removeAttr('disabled');
      that.$textField.val("");
      that.$dateField.val("");
      that.$textArea.val("");
    });
  };

  DreamFormView.prototype.bind = function(){
    var that = this;

    that.buttonClickHandler = function (){
      that.submit();
      that.$button.attr('disabled', 'disabled');
    };
    that.$button.click(that.buttonClickHandler);
  };

  DreamFormView.prototype.submit = function(){
    var that = this;

    var newDream = new Dream(null, that.$textField.val(), that.$dateField.val(), that.$textArea.val());


    that.callback(newDream);
  };

  function DreamView(dreamEl, el){
    this.$dreamEl = $(dreamEl);
    this.$el = $(el);
    this.dream = Dream.find(this.$dreamEl.attr("data-id"));   // REV: ah, this is the part I was missing. 
																															// now I see.
    this.$el.empty();
    this.$el.append($("<p></p>").text(this.dream.date));
    this.$el.append($("<p></p>").text(this.dream.entry));

  };

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    DreamFormView: DreamFormView,
    DreamView: DreamView

  };

})();
