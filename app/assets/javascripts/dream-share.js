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

};