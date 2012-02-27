(function() {
  var AddView, AppRouter, DetailsView, EditView, ItemView, ListView, Recipe, Recipes, recipes,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; },
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Recipe = (function(_super) {

    __extends(Recipe, _super);

    function Recipe() {
      Recipe.__super__.constructor.apply(this, arguments);
    }

    Recipe.prototype.initialize = function() {
      return {
        defaults: {
          name: "",
          servings: 0,
          ingredients: []
        }
      };
    };

    return Recipe;

  })(Backbone.Model);

  Recipes = (function(_super) {

    __extends(Recipes, _super);

    function Recipes() {
      Recipes.__super__.constructor.apply(this, arguments);
    }

    Recipes.prototype.model = Recipe;

    Recipes.prototype.localStorage = new Store("recipes");

    return Recipes;

  })(Backbone.Collection);

  ItemView = (function(_super) {

    __extends(ItemView, _super);

    function ItemView() {
      ItemView.__super__.constructor.apply(this, arguments);
    }

    ItemView.prototype.tagName = 'tr';

    ItemView.prototype.initialize = function() {
      return this.template = $('#itemTemplate').html();
    };

    ItemView.prototype.render = function() {
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    };

    return ItemView;

  })(Backbone.View);

  AddView = (function(_super) {

    __extends(AddView, _super);

    function AddView() {
      this.render = __bind(this.render, this);
      this.save = __bind(this.save, this);
      AddView.__super__.constructor.apply(this, arguments);
    }

    AddView.prototype.events = {
      "submit form": "save"
    };

    AddView.prototype.initialize = function() {
      return this.template = $('#formTemplate').html();
    };

    AddView.prototype.save = function(e) {
      var ingredients;
      e.preventDefault();
      ingredients = $('#ingredients', this.el).val().split("\n");
      ingredients = _.filter(ingredients, function(ingredient) {
        return ingredient;
      });
      return recipes.create({
        name: $('#name', this.el).val(),
        servings: $('#servings', this.el).val(),
        ingredients: ingredients
      }, {
        success: function() {
          return Backbone.history.navigate('', true);
        }
      });
    };

    AddView.prototype.render = function(e) {
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    };

    return AddView;

  })(Backbone.View);

  EditView = (function(_super) {

    __extends(EditView, _super);

    function EditView() {
      this.render = __bind(this.render, this);
      this.save = __bind(this.save, this);
      EditView.__super__.constructor.apply(this, arguments);
    }

    EditView.prototype.initialize = function() {
      return this.template = $('#formTemplate').html();
    };

    EditView.prototype.events = {
      "submit form": "save"
    };

    EditView.prototype.save = function(e) {
      var ingredients;
      e.preventDefault();
      ingredients = $('#ingredients', this.el).val().split("\n");
      ingredients = _.filter(ingredients, function(ingredient) {
        return ingredient;
      });
      return this.model.save({
        name: $('#name', this.el).val(),
        servings: $('#servings', this.el).val(),
        ingredients: ingredients
      }, {
        success: function() {
          return Backbone.history.navigate('', true);
        }
      });
    };

    EditView.prototype.render = function() {
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    };

    return EditView;

  })(Backbone.View);

  DetailsView = (function(_super) {

    __extends(DetailsView, _super);

    function DetailsView() {
      this.render = __bind(this.render, this);
      DetailsView.__super__.constructor.apply(this, arguments);
    }

    DetailsView.prototype.initialize = function() {
      return this.template = $('#viewTemplate').html();
    };

    DetailsView.prototype.render = function(e) {
      $(this.el).html(Mustache.render(this.template, this.model.toJSON()));
      return this;
    };

    return DetailsView;

  })(Backbone.View);

  ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      this.render = __bind(this.render, this);
      this.addAll = __bind(this.addAll, this);
      ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.initialize = function() {
      this.template = $('#listTemplate').html();
      return this.model.bind('reset', this.addAll);
    };

    ListView.prototype.addAll = function(eventName) {
      $('#recipes', this.el).html("");
      return _.each(this.model.models, function(recipe) {
        var recipeView;
        recipeView = new ItemView({
          model: recipe
        });
        return $('#recipes', this.el).append(recipeView.render().el);
      });
    };

    ListView.prototype.render = function() {
      $(this.el).html(Mustache.render(this.template));
      return this;
    };

    return ListView;

  })(Backbone.View);

  AppRouter = (function(_super) {

    __extends(AppRouter, _super);

    function AppRouter() {
      AppRouter.__super__.constructor.apply(this, arguments);
    }

    AppRouter.prototype.routes = {
      "": "list",
      "new": "newForm",
      ":id": "view",
      ":id/edit": "edit"
    };

    AppRouter.prototype.list = function() {
      var recipesView;
      recipesView = new ListView({
        model: recipes
      });
      $('#content').html(recipesView.render().el);
      return recipes.fetch();
    };

    AppRouter.prototype.view = function(id) {
      var detailsView;
      detailsView = new DetailsView({
        model: recipes.get(id)
      });
      return $('#content').html(detailsView.render().el);
    };

    AppRouter.prototype.newForm = function() {
      var addView;
      addView = new AddView({
        model: new Recipe()
      });
      return $('#content').html(addView.render().el);
    };

    AppRouter.prototype.edit = function(id) {
      var editView;
      editView = new EditView({
        model: recipes.get(id)
      });
      return $('#content').html(editView.render().el);
    };

    return AppRouter;

  })(Backbone.Router);

  recipes = new Recipes();

  recipes.fetch({
    success: function() {
      var app;
      app = new AppRouter();
      return Backbone.history.start();
    }
  });

}).call(this);
