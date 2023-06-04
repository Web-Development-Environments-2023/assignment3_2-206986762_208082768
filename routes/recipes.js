var express = require("express");
var router = express.Router();
const recipes_utils = require("./utils/recipes_utils");

//router.get("/", (req, res) => res.send("im here"));



/**
 * This path returns a full details of a recipe by its id.
 */
router.get("/:recipeId", async (req, res, next) => { //done and checked
  try {
    const recipe = await recipes_utils.getRecipeDetails(req.params.recipeId);
    res.send(recipe);
  } 
  catch (error) {
    next(error);
  }
});


/**
 * This path returns the logged in user search of a specific recipes according to his choices.
 */
router.post("/search", async (req, res, next) => { //done and checked
  try {
    const recipes = await recipes_utils.search(req.query.query, req.query.number, req.query.cuisine, req.query.diet, req.query.intolerance, req.query.sort);
    res.send(recipes);
  } 
  catch (error) {
    next(error);
  }
});


/**
 * This path returns 3 random recipes.
 */
router.post("/randomRecipes", async (req, res, next) => { //done and checked
  try {
    const randomRecipes = await recipes_utils.getRandomRecipes();
    res.send(randomRecipes);
  } 
  catch (error) {
    next(error);
  }
});


/**
 * This path add new recipe to the database.
 */
router.post("/createRecipe", async (req, res, next) => {
  try {
    const user_id = req.session.user_id;
    if (!user_id) {
      throw { status: 401, message: "Please Login to add new recipe." };
    }

    // const title = req.body.title;
    // const readyInMinutes = req.body.readyInMinutes;
    // const vegetarian = req.body.vegetarian;
    // const vegan = req.body.vegan;
    // const glutenFree = req.body.glutenFree;
    // const servings = req.body.serving
    // const instructions = req.body.instructions;
    // const ingredients =req.body.ingrediants;
    
    // if(!title || !readyInMinutes || !vegetarian || !vegan || !glutenFree || !servings || !instructions || !ingredients){
    //     throw { status: 400, message: "Bad Request" };
    // }

    await recipes_utils.addNewRecipe(req);
    res.status(201).send("Recipe was added successfully!");
  } 
  catch (error) {
    next(error);
  }
});




module.exports = router;
