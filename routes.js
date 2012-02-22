
/*
 * GET home page.
 */

module.exports = function(app){
  app.get('/', function(req, res){
    res.render('index', { title: 'Menuborg' });
  });

  app.get('/recipes', function(req,res){
    res.render('recipes/index', { title: 'Recipes' });
  });
};
