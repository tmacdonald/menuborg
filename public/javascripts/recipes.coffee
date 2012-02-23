class Recipe extends Backbone.Model
  initialize: ->
    defaults:
      name: ""
      servings: 0,
      ingredients: []

class Recipes extends Backbone.Collection
  model: Recipe
  localStorage: new Store "recipes"

class ItemView extends Backbone.View
  tagName: 'tr'

  initialize: ->
    @template = $('#itemTemplate').html()

  render: ->
    $(@el).html Mustache.render @template, @model.toJSON()
    return @

class AddView extends Backbone.View
  events:
    "submit form": "save"
    
  initialize: ->
    @template = $('#formTemplate').html()

  save: (e) =>
    e.preventDefault()
    ingredients = $('#ingredients', @el).val().split "\n"
    ingredients = _.filter ingredients, (ingredient) -> ingredient
    app.recipes.create {
      name: $('#name', @el).val()
      servings: $('#servings', @el).val()
      ingredients: ingredients
    }, {
      success: ->
        Backbone.history.navigate '', true
    }

  render: (e) =>
    $(@el).html Mustache.render @template, @model.toJSON()
    return @

class EditView extends Backbone.View
  initialize: ->
    @template = $('#formTemplate').html()

  events:
    "submit form": "save"

  save: (e) =>
    e.preventDefault()

    ingredients = $('#ingredient', @el).val().split "\n"
    ingredients = _.filter ingredients, (ingredient) -> ingredient

    @model.save {
      name: $('#name', @el).val()
      servings: $('#servings', @el).val()
      ingredients: ingredients
    }, {
      success: ->
        Backbone.history.navigate '', true
    }

  render: =>
    $(@el).html Mustache.render @template, @model.toJSON()
    @

class DetailsView extends Backbone.View
  initialize: ->
    @template = $('#viewTemplate').html()

  render: (e) =>
    $(@el).html Mustache.render @template, @model.toJSON()
    @

class ListView extends Backbone.View
  initialize: ->
    @template = $('#listTemplate').html()
    @model.bind 'reset', @addAll
  
  addAll: (eventName) =>
    _.each @model.models, (recipe) ->
      recipeView = new ItemView
        model: recipe
      $('#recipes', @el).append recipeView.render().el

  render: () =>
    $(@el).html Mustache.render @template
    return @
  
class AppRouter extends Backbone.Router
  routes:
    "": "list"
    "new": "newForm"
    ":id": "view"
    ":id/edit": "edit"

  list: ->
    @recipes = new Recipes()
    recipesView = new ListView
      model: @recipes
    $('#content').html recipesView.render().el
    @recipes.fetch()

  view: (id) ->
    detailsView = new DetailsView
      model: @recipes.get id
    $('#content').html detailsView.render().el

  newForm: ->
    addView = new AddView
      model: new Recipe()
    $('#content').html addView.render().el

  edit: (id) ->
    editView = new EditView
      model: @recipes.get id
    $('#content').html editView.render().el

app = new AppRouter()
Backbone.history.start()
