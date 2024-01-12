const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const User = require("../db").User;
const Ingredient = require('../db').Ingredient;
const IngredientRecipe = require('../db').IngredientRecipe;
const Restriction = require('../db').Restriction;
const Recipe = require('../db').Recipe;

const openai = require("openai");

require("dotenv").config({ path: ".env.local", override: true });

const myopenai = new openai({
  apiKey: process.env.OPENAI_API_KEY
});

async function getShoppingList(req, res) {
  console.log('-- Fonction getShoppingList --')
  try {
    const recipeId = req.params.recipeId;

    const recipe = await Recipe.findByPk(recipeId, {
      attributes: ['id', 'name', 'description', "instructions"],
      include: [
          {
              model: Ingredient,
              attributes: ['name', 'unit'],
              through: {
                  model: IngredientRecipe,
                  attributes: ['quantity']
              },
          }
      ]
  })

  console.log(recipe);

    const completions = await myopenai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      // response_format: { "type": "json_object" },
      messages: [
          {
              role: "system",
              content: "Je vais te donner ma recette. J'aimerais que tu me génère une liste de course. Répond juste avec un texte qui sera la liste de course directement, ne parle pas plus, ne dit rien de plus, juste ça et rien d'autre. La recette : "+JSON.stringify(recipe),
              // content: "Répète exactement ce que je t'envoie"+JSON.stringify(recipe),
          },
      ]
    });

    console.log('reponse de IA');
    console.log(completions.choices[0].message.content);

    res.status(201).json({
      responseAI: completions.choices[0].message.content,
      
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getShoppingList,
};
