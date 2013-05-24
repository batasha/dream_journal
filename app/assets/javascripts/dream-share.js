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

  function DreamIndexView(el){
    var that = this;
    that.$el = $(el);

    Dream.callbacks.push(function(){
      that.render();
    });
  };

  DreamIndexView.prototype.render = function(){
    var that = this;
    var ul = $("<ul></ul>");
    _.each(Dream.all, function(dream){
      ul.append($("<li></li>").text(dream.title));
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
  };

  DreamFormView.prototype.bind = function(){
    var that = this;

    that.buttonClickHandler = function (){
      that.submit();
    };
    that.$button.click(that.buttonClickHandler);
  };

  DreamFormView.prototype.submit = function(){
    var that = this;

    var newDream = new Dream(null, that.$textField.val(), that.$dateField.val(), that.$textArea.val());
    that.$textField.val("");
    that.$dateField.val("");
    that.$textArea.val("");

    that.callback(newDream);
  };

  return {
    Dream: Dream,
    DreamIndexView: DreamIndexView,
    DreamFormView: DreamFormView
  };

})();
