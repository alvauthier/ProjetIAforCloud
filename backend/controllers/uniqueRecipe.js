const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Recipe = require('../db').Recipe;
const Ingredient = require('../db').Ingredient;
const Review = require('../db').Review;
const IngredientRecipe = require('../db').IngredientRecipe;

require("dotenv").config({ path: ".env.local", override: true });

async function getUniqueRecipe(req, res) {
    const { recipeId } = req.params;

    try {
        const recipes = await Recipe.findByPk(recipeId, {
            attributes: ['id', 'name', 'description', "instructions"],
            include: [
                {
                    model: Ingredient,
                    attributes: ['name', 'unit'],
                    through: {
                        model: IngredientRecipe,
                        attributes: ['quantity']
                    },
  
                },
                {
                    model: Review,
                    attributes: ['id','review', 'note'],
                }
            ]
        })

        res.status(200).json(recipes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


module.exports = {
    getUniqueRecipe,
};
