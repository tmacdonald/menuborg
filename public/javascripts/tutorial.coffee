class ListView extends Backbone.View
  el: $('body')
  initialize: () ->
    this.render
  render: () ->
    $(this.el).append "<ul><li>hello world</li></ul>"

listView = new ListView
