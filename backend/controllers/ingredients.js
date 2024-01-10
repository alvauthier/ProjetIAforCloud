const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// const User = require("../db").User;
const Ingredient = require('../db').Ingredient;

require("dotenv").config({ path: ".env.local", override: true });

async function getIngredients(req, res) {
  try {
    // if (!req.body?.searchTerm) {
    //   return res.status(400).json({ error: "Missing parameter" });
    // }

    // const recipes = await Recipe.findAll({
    //   // include: [{
    //   //   model: Ingredient,
    //   //   through: IngredientRecipe,
    //   // }],
    // });

    // const recipes = await Recipe.findAll({
    //   attributes: ['id', 'name'],
    //   include: [
    //     {
    //       model: Ingredient,
    //       attributes: ['name'],
    //       through: {
    //         model: IngredientRecipe,
    //         attributes: []
    //       }
    //     }
    //   ]
    // })

    const ingredients = await Ingredient.findAll({
      attributes: ['name'],
    })

    // console.log(ingredients);
    // console.log('FIN LISTE INGREDIENTS -------------------');

    // recipes.forEach(recipe => {
    //   console.log(recipe.name);
    //   Post.findAll({
    //     where: {
    //       authorId: 2
    //     }
    //   });
    // });

    // console.log("All recipes :", JSON.stringify(recipes, null, 2));
    // console.log(recipes);

    res.status(200).json({
      ingredients: ingredients,
      
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  getIngredients,
};
