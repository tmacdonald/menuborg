(function($){
  var Recipe = Backbone.Model.extend({
    defaults: {
      name: "",
      servings: 0,
      ingredients: []
    }
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

  var AddRecipeView = Backbone.View.extend({
    tagName: "div",

    template: $('#formTemplate').html(),

    events: {
      "submit form": "save"
    },

    initialize: function(){
      _.bindAll(this, 'save', 'render');
    },

    save: function(e){
      e.preventDefault();

      var ingredients = $('#ingredients', this.el).val().split("\n");
      ingredients = _.filter(ingredients, function(ingredient) { return ingredient; });

      app.recipes.create({
        name: $("#name", this.el).val(),
        servings: $("#servings", this.el).val(),
        ingredients: ingredients
      }, {
        success: function(){
          Backbone.history.navigate('', true);
        }
      });

    },

    render: function(e){
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    }
  });

  var EditView = Backbone.View.extend({
    template: $('#formTemplate').html(),

    events: {
      "submit form": "save"
    },

    initialize: function(){
      _.bindAll(this, 'save', 'render');
    },

    save: function(e){
      e.preventDefault();

      var ingredients = $('#ingredients', this.el).val().split("\n");
      ingredients = _.filter(ingredients, function(ingredient) { return ingredient; });
      this.model.save({
        name: $("#name", this.el).val(),
        servings: $("#servings", this.el).val(),
        ingredients: ingredients
      },
      {
        success: function(){
          Backbone.history.navigate('', true);
        }
      });
    },

    render: function(e){
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    }
  });

  var DetailsView = Backbone.View.extend({
    tagName: "div",

    template: $('#viewRecipeTemplate').html(),

    render: function(e){
      var data = this.model.toJSON();
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    }
  });

  var RecipesView = Backbone.View.extend({
    tagName: 'div',

    template: $('#recipeListTemplate').html(),

    initialize: function(){
      this.model.bind("reset", this.addAll, this);
    },

    addAll: function(eventName){
      _.each(this.model.models, function(recipe){
        $('#recipes', this.el).append(new RecipeView({model: recipe}).render().el);
      }, this);
    },

    render: function(eventName){
      $(this.el).html(Mustache.render(this.template, {}));
      return this;
    }
  });

  var AppRouter = Backbone.Router.extend({
    routes: {
      "": "list",
      "new": "newForm",
      ":id": "view",
      ":id/edit": "edit",
    },

    initialize: function(){
    },

    list: function(){
      this.recipes = new Recipes();
      this.recipesView = new RecipesView({model: this.recipes});
      $('#content').html(this.recipesView.render().el);
      this.recipes.fetch();
    },

    newForm: function(){
      this.addRecipeView = new AddRecipeView({model: new Recipe()});
      $('#content').html(this.addRecipeView.render().el);
    },

    view: function(id){
      this.recipeDetailsView = new DetailsView({model: this.recipes.get(id)});
      $('#content').html(this.recipeDetailsView.render().el);
    },

    edit: function(id){
      this.editView = new EditView({model: this.recipes.get(id)});
      $('#content').html(this.editView.render().el);
    },
  });

  var app = new AppRouter();
  Backbone.history.start();

})(jQuery);
