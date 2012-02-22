(function($){
  var Recipe = Backbone.Model.extend({
  });

  var Recipes = Backbone.Collection.extend({
    model: Recipe,
    localStorage: new Store("recipes")
  });

  var RecipeView = Backbone.View.extend({
    tagName: 'tr',

    events: {
    },

    initialize: function(){
      _.bindAll(this, 'render');
    },

    render: function(){
      var template = $('#recipeTemplate').html();
      $(this.el).html(Mustache.render(template, this.model.toJSON()));
      return this;
    }
  });

  var recipes = new Recipes();

  var AddRecipeView = Backbone.View.extend({
    el: "#addRecipe",

    events: {
      "submit form": "saveRecipe"
    },

    initialize: function(){
      _.bindAll(this, 'saveRecipe', 'show', 'hide');
    },

    saveRecipe: function(e){
      e.preventDefault();

      recipes.create({
        name: $("#name", this.el).val(),
        servings: $("#servings", this.el).val(),
        ingredients: $("#ingredients", this.el).val().split("\n")
      });
      this.hide();
    },

    show: function(e){
      $(this.el).removeClass('hide');
    },

    hide: function(e){
      $(this.el).addClass('hide');
    }
  });

  var RecipesView = Backbone.View.extend({
    el: "#recipes",

    events: {
    },

    initialize: function(){
      _.bindAll(this, 'render', 'appendItem');

      recipes.bind('add', this.appendItem);
      recipes.bind('reset', this.addAll, this);
    },

    addAll: function(){
      recipes.each(this.appendItem);
    },

    appendItem: function(recipe){
      var recipeView = new RecipeView({
        model: recipe
      });
      $(this.el).append(recipeView.render().el);
    }
  });

  var AppView = Backbone.View.extend({
    el: "#app",

    events: {
      "click button#add": "add"
    },

    initialize: function(){
      _.bindAll(this, 'add');

      this.recipesView = new RecipesView();
      this.addRecipeView = new AddRecipeView();

      recipes.fetch();
    },

    add: function(){
      this.addRecipeView.show();
    }
  });

  var app = new AppView();

})(jQuery);
