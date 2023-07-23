const DButils = require("./DButils");

async function markAsFavorite(user_id, recipe_id) {
  await DButils.execQuery(
    `INSERT INTO favorite_recipes VALUES (${user_id},${recipe_id})`
  );
}

async function getFavoriteRecipes(user_id) {
  const recipes_id = await DButils.execQuery(
    `SELECT recipe_id FROM favorite_recipes WHERE user_id=${user_id}`
  );
  return recipes_id;
}

async function getMyRecipes(user_id) {
    const myRecipes = await DButils.execQuery(`SELECT * FROM recipes WHERE user_id=${user_id}`);
    return myRecipes;
}

async function getMyRecipe(user_id, recipe_id) {
    const myRecipe = await DButils.execQuery(`SELECT * FROM recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`);
    return myRecipe;
}

async function markAsFamilyRecipe(
  recipe_id,
  user_id,
  owner,
  whenToPrepare,
  title,
  readyInMin,
  vegetarian,
  vegan,
  glutenFree,
  image,
  instructions,
  ingredients
) {
  await DButils.execQuery(
    `INSERT INTO family_recipes VALUES (${recipe_id},${user_id},'${owner}','${whenToPrepare}','${title}',${readyInMin},${vegetarian},${vegan},${glutenFree},${image},'${instructions}','${JSON.stringify(
      ingredients
    )}')`
  );
}

async function getMyFamilyRecipes(user_id) {
  const myFamilyRecipes = await DButils.execQuery(
    `SELECT * FROM family_recipes WHERE user_id = ${user_id}`
  );
  return myFamilyRecipes;
}

async function getFamilyRecipe(user_id, recipe_id) {
  const familyRecipe = await DButils.execQuery(`SELECT * FROM family_recipes WHERE user_id = ${user_id} AND recipe_id = ${recipe_id}`);
  return familyRecipe;
}

async function markAsWatched(user_id, recipe_id) {
  const checkRecipes = await DButils.execQuery(
    `SELECT COUNT(*) FROM last_watched_recipes WHERE user_id=${user_id} AND recipe_id=${recipe_id}`
  );
  if (checkRecipes[0]["COUNT(*)"] == 0) {
    await DButils.execQuery(
      `INSERT INTO last_watched_recipes VALUES ('${user_id}',${recipe_id}, NOW())`
    );
  } else {
    await DButils.execQuery(
      `UPDATE last_watched_recipes SET date = NOW() WHERE user_id=${user_id} AND recipe_id=${recipe_id}`
    );
  }
}

async function getLastWatchedRecipes(user_id) {
  const lastWatchedRecipes = await DButils.execQuery(
    `SELECT recipe_id FROM last_watched_recipes WHERE user_id = ${user_id} ORDER BY date DESC LIMIT 3`
  );
  return lastWatchedRecipes;
}

// #####################################################################################################
// ##################################### Export all functions ##########################################

exports.markAsFavorite = markAsFavorite;
exports.getFavoriteRecipes = getFavoriteRecipes;
exports.getMyRecipes = getMyRecipes;
exports.getMyRecipe = getMyRecipe;
exports.markAsFamilyRecipe = markAsFamilyRecipe;
exports.getMyFamilyRecipes = getMyFamilyRecipes;
exports.getFamilyRecipe = getFamilyRecipe;
exports.markAsWatched = markAsWatched;
exports.getLastWatchedRecipes = getLastWatchedRecipes;
