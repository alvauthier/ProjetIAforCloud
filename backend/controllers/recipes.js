const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const User = require("../db").User;
const Ingredient = require('../db').Ingredient;
const Restriction = require('../db').Restriction;
const Recipe = require('../db').Recipe;

require("dotenv").config({ path: ".env.local", override: true });

async function getRecipe(req, res) {
  const { recipeId } = req.params;

  console.log('-- Fonction getRecipe --');

  try {
    const recipe = await Recipe.findByPk(recipeId);

    if (!recipe) {
      return res.status(404).json({ error: 'Recette non trouvée' });
    }

    return res.status(200).json(recipe);
  } catch (error) {
    console.error('Erreur lors de la récupération de la recette:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  getRecipe,
};
