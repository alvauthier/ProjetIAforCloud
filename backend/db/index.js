const connection = require("./db");
const fs = require("fs");
const path = require("path");
const favorites = require("./models/favorites");

const db = {connection};

const files = fs.readdirSync(path.join(__dirname, "models")); 

files.forEach((file) => {
  const model = require(path.join(__dirname, "models", file))(connection);

  db[model.name] = model;

});

const User = db.User;
const Ingredient = db.Ingredient;
const Fridge = db.Fridge;
const FridgeContent = db.FridgeContent;
const IngredientRecipe = db.IngredientRecipe;
const Recipe = db.Recipe;
const Review = db.Review;
const Restriction = db.Restriction;
const Favorites = db.Favorites;

User.hasMany(Restriction, {
  foreignKey: "userId",
});

Restriction.belongsTo(User, {
  foreignKey: "userId",
});

User.hasMany(Review, {
  foreignKey: "userId",
});

Review.belongsTo(User, {
  foreignKey: "userId",
});

Recipe.hasMany(Review, {
  foreignKey: "recipeId",
});

Review.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

User.hasOne(Favorites, {
  foreignKey: "userId",
});

Favorites.belongsTo(User, {
  foreignKey: "userId",
});

Recipe.hasMany(Favorites, {
  foreignKey: "recipeId",
});

Favorites.belongsTo(Recipe, {
  foreignKey: "recipeId",
});

User.hasOne(Fridge, {
  foreignKey: "userId",
});

Fridge.belongsTo(User, {
  foreignKey: "userId",
});

Fridge.hasMany(FridgeContent, {
  foreignKey: "fridgeId",
});

FridgeContent.belongsTo(Fridge, {
  foreignKey: "fridgeId",
});

FridgeContent.belongsTo(Ingredient, {
  foreignKey: "ingredientId",
});

// Recipe.hasMany(IngredientRecipe, {
//   foreignKey: "recipeId",
// });

Recipe.belongsToMany(Ingredient, {
  through: 'IngredientRecipe',
  foreignKey: "recipeId",
});

// IngredientRecipe.belongsTo(Recipe, {
//   foreignKey: "recipeId",
// });

// Ingredient.hasMany(IngredientRecipe, {
//   foreignKey: "ingredientId",
// });

Ingredient.belongsToMany(Recipe, {
  through: 'IngredientRecipe',
  foreignKey: "ingredientId",
});

// IngredientRecipe.belongsTo(Ingredient, {
//   foreignKey: "ingredientId",
// });


module.exports = db;
