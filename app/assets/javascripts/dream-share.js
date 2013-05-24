function Dream(id, title, date, entry){
  this.id = id;
  this.title = title;
  this.date = date;
  this.entry = entry;
}

Dream.prototype.save = function(){
  var that = this;

  $.post("/dreams.json", {
    dream: {
      id: that.id,
      title: that.title,
      date: that.date,
      entry: that.entry
    }
  }, function(response) {
    that.id = response.id;
    Dream.all.push(that);

    _(Dream.callbacks).each(function(callback){
      callback();
    });
  });
};

Dream.all = [];
Dream.callbacks = [];
Dream.fetchAll = function(){
  $.getJSON(
    "/dreams.json",
    function(data){
      Dream.all = [];
      _.each(data, function(datum){
        Dream.all.push(new Dream(datum.id, datum.title,
                                 datum.date, datum.entry));
      });

      _.(Dream.callbacks).each(function(callback){
        callback();
      });
    });
};

function DreamsView(el){
  var that = this;
  that.$el = $(el);

  Dream.callbacks.push(function(){
    that.render();
  });
};

DreamsView.prototype.render = function(){
  var that = this;

  var ul = $("<ul></ul>");
  _.each(Dream.all. function(dream){
    ul.append($("<li></li>").text(dream.entry));
  });

  that.$el.html(ul);
};
