const axios = require("axios");
const DButils = require("./DButils");
const api_domain = "https://api.spoonacular.com/recipes";



/**
 * Get recipes list from spooncular response and extract the relevant recipe data for preview
 * @param {*} recipes_info 
 */
async function getRecipeInformation(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/information`, {
        params: {
            includeNutrition: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getAnalyzedInstructions(recipe_id) {
    return await axios.get(`${api_domain}/${recipe_id}/analyzedInstructions`, {
        params: {
            stepBreakdown: false,
            apiKey: process.env.spooncular_apiKey
        }
    });
}


async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let Ainstructions = await getAnalyzedInstructions(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree, extendedIngredients, instructions } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        extendedIngredients: extendedIngredients,
        instructions: instructions,
        analyzedInstructions: Ainstructions.data
    }
}


async function getRecipesPreview( recipes_id_array ){
    let recipesPreview = []
    for (const recipe_id of recipes_id_array) {
        let recipe_preview = await getRecipeDetails(recipe_id)
        recipesPreview.push(recipe_preview)
    }
    return recipesPreview
}


async function search(query, number = 5, cuisine, diet, intolerance, sort){
    //preparing the serach URL
    let url = `${api_domain}/complexSearch/?query=${query}&number=${number}&instructionsRequired=true&addRecipeInformation=true`
    if(cuisine !== undefined){
        url = url + `&cuisine=${cuisine}`
    }

    if(diet !== undefined){
        url = url + `&diet=${diet}`
    }

    if(intolerance !== undefined){
        url = url + `&intolerance=${intolerance}`
    }

    if(sort !== undefined){
        url = url + `&sort=${sort}`
    }

    //extracting the recipes
    const response = await axios.get(url,{
        
        params: {
            apiKey: process.env.spooncular_apiKey
        }
    });

    const searchRecipes = response.data["results"]
    let recipes = []
    for (let i = 0; i < searchRecipes.length; i++){
        recipes.push(await getRecipeDetails(searchRecipes[i].id))
    }

    return recipes.slice(0,number)
}


async function getRandomRecipes(){
    const response = await axios.get(`${api_domain}/random?number=3&apiKey=${process.env.spooncular_apiKey}`)

    const searchRecipes = response.data["recipes"]
    let recipes = []
    for (let i = 0; i < searchRecipes.length; i++){
        recipes.push(await getRecipeDetails(searchRecipes[i].id))
    }

    return recipes.slice(0,3)
}


async function addNewRecipe(req) {
    const user_id = req.session.user_id;
    const title = req.body.title;
    const readyInMinutes = req.body.readyInMinutes;
    const vegetarian = req.body.vegetarian;
    const vegan = req.body.vegan;
    const glutenFree = req.body.glutenFree;
    const servings = req.body.servings;
    const instructions = req.body.instructions;
    const ingredients = req.body.ingredients;
    const image = req.body.image;
  
    await DButils.execQuery(`
      INSERT INTO recipes (
        user_id, title, readyInMinutes, vegetarian, vegan, glutenFree, servings, instructions, ingredients, image
      ) VALUES (
        ${user_id},
        '${title}',
        ${readyInMinutes},
        ${vegetarian},
        ${vegan},
        ${glutenFree},
        ${servings},
        '${instructions}',
        '${JSON.stringify(ingredients)}',
        '${image}' 
      )
    `);
  }
  



// #####################################################################################################
// ##################################### Export all functions ##########################################


exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;
exports.search = search;
exports.getRandomRecipes = getRandomRecipes;
exports.addNewRecipe = addNewRecipe;