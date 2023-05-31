const axios = require("axios");
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



async function getRecipeDetails(recipe_id) {
    let recipe_info = await getRecipeInformation(recipe_id);
    let { id, title, readyInMinutes, image, aggregateLikes, vegan, vegetarian, glutenFree } = recipe_info.data;

    return {
        id: id,
        title: title,
        readyInMinutes: readyInMinutes,
        image: image,
        popularity: aggregateLikes,
        vegan: vegan,
        vegetarian: vegetarian,
        glutenFree: glutenFree,
        
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



// #####################################################################################################
// ##################################### Export all functions ##########################################


exports.getRecipeDetails = getRecipeDetails;
exports.getRecipesPreview = getRecipesPreview;



