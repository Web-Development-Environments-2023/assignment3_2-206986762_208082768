var express = require("express");
var router = express.Router();
const DButils = require("./utils/DButils");
const user_utils = require("./utils/user_utils");
const recipe_utils = require("./utils/recipes_utils");
const { body } = require("express-validator");



/**
 * Authenticate all incoming requests by middleware.
 */
router.use(async function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users").then((users) => {
      if (users.find((x) => x.user_id === req.session.user_id)) {
        req.user_id = req.session.user_id;
        next();
      }

    }).catch(err => next(err));
  } 

  else {
    res.sendStatus(401);
  }

});


/**
 * This path gets body with recipeId and save this recipe in the favorites list of the logged-in user.
 */
router.post('/favorites', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsFavorite(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as favorite.");
  } 
  catch(error){
    next(error);
  }

});


/**
 * This path returns the favorites recipes that were saved by the logged-in user.
 */
router.get('/favorites', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getFavoriteRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } 
  catch(error){
    next(error); 
  }
  
});


/**
 * This path returns all the recipes that were saved by the logged-in user.
 */
router.get('/myAllRecipes', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please Login to view your recipes." };
    }

    const recipes = await user_utils.getMyRecipes(user_id);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }

});


/**
 * This path returns specific user recipe by its id.
 */
router.get('/myAllRecipes/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please Login to view your recipe." };
    }
    const recipe = await user_utils.getMyRecipe(user_id, req.params.recipeId);
    res.status(200).send(recipe);
  }
  catch(error){
    next(error);
  }
});


/**
 * This path add a recipe that were viewed by the logged-in user to the watched list.
 */
router.post('/lastWatchedRecipes', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    const recipe_id = req.body.recipeId;
    await user_utils.markAsWatched(user_id,recipe_id);
    res.status(200).send("The Recipe successfully saved as viewed.");
  } 
  catch(error){
    next(error);
  }

});


/**
 * This path returns last 3 whatched recipes that were viewed by the logged-in user.
 */
router.get('/lastWatchedRecipes', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    const recipes_id = await user_utils.getLastWatchedRecipes(user_id);
    let recipes_id_array = [];
    recipes_id.map((element) => recipes_id_array.push(element.recipe_id)); //extracting the recipe ids into array
    const results = await recipe_utils.getRecipesPreview(recipes_id_array);
    res.status(200).send(results);
  } 
  catch(error){
    next(error); 
  }

});


/**
 * This path add a family recipe by the logged-in user to the family list.
 */
router.post('/familyRecipes', async (req,res,next) => { //done and checked
  try{
    const recipe_id = req.body.recipe_id;
    const user_id = req.session.user_id;
    const owner = req.body.owner;
    const whenToPrepare = req.body.whenToPrepare;
    const title = req.body.title;
    const readyInMin = req.body.readyInMin;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const glutenFree = req.body.glutenFree;
    const image = req.body.image;
    const instructions = req.body.instructions;
    const ingredients = req.body.ingredients;
    await user_utils.markAsFamilyRecipe(recipe_id,user_id,owner,whenToPrepare,title,readyInMin,vegetarian,vegan,glutenFree,image,instructions,ingredients);
    res.status(200).send("The Recipe successfully saved as family recipe.");
  } 
  catch(error){
    next(error);
  }

});


/**
 * This path returns all the family recipes that were saved by the logged-in user.
 */
router.get('/familyRecipes', async (req,res,next) => { //done and checked
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please Login to view your family recipes." };
    }
    const recipes = await user_utils.getMyFamilyRecipes(user_id);
    res.status(200).send(recipes);
  }
  catch(error){
    next(error);
  }
});


/**
 * This path returns specific family recipe by its id.
 */
router.get('/familyRecipes/:recipeId', async (req,res,next) => {
  try{
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please Login to view your family recipe." };
    }
    const recipe = await user_utils.getFamilyRecipe(user_id, req.params.recipeId);
    res.status(200).send(recipe);
  }
  catch(error){
    next(error);
  }
});




module.exports = router;