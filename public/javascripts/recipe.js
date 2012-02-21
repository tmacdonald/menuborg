(function() {
  var Recipe, Recipes,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  Recipe = (function(_super) {

    __extends(Recipe, _super);

    function Recipe() {
      Recipe.__super__.constructor.apply(this, arguments);
    }

    return Recipe;

  })(Backbone.Model);

  Recipes = (function(_super) {

    __extends(Recipes, _super);

    function Recipes() {
      Recipes.__super__.constructor.apply(this, arguments);
    }

    return Recipes;

  })(Backbone.Collection);

}).call(this);
