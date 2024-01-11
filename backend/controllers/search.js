const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Recipe = require('../db').Recipe;
const Ingredient = require('../db').Ingredient;
const IngredientRecipe = require('../db').IngredientRecipe;

require("dotenv").config({ path: ".env.local", override: true });
const openai = require("openai");

const myopenai = new openai({
  apiKey: process.env.OPENAI_API_KEY
});

async function search(req, res) {
  try {
    if (!req.body?.searchTerm) {
      return res.status(400).json({ error: "Missing parameter" });
    }

    const recipes = await Recipe.findAll({
      attributes: ['id', 'name'],
      include: [
        {
          model: Ingredient,
          attributes: ['name'],
          through: {
            model: IngredientRecipe,
            attributes: []
          }
        }
      ]
    })

    const completions = await myopenai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
          {
              role: "system",
              content: "Je vais te donner mes recettes stockées dans ma base de données. J'aimerais que tu renvoies les meilleures suggestions possibles avec uniquement le contenu de ma base basées sur la demande de l'utilisateur qui te sera envoyée. Répond juste avec un JSON des ID des recettes classés dans l'ordre de pertinence avec Recettes comme clé, juste ça et rien d'autre. Contenu de la base de données : "+JSON.stringify(recipes),
          },
          {
              role: "user",
              content: req.body.searchTerm,
          }
      ]
    });

    res.status(201).json({
      responseAI: completions.choices[0].message.content,
      
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


module.exports = {
  search,
};
