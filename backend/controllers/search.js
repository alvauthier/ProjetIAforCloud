const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Recipe = require('../db').Recipe;
const Ingredient = require('../db').Ingredient;
const IngredientRecipe = require('../db').IngredientRecipe;

require("dotenv").config({ path: ".env.local", override: true });
const openai = require("openai");
const decodeUserToken = require("../services/decodeUserToken");
const getUserRestrictionsService = require("../services/getUserRestrictionsService");
const { use } = require("../server");

const myopenai = new openai({
  apiKey: process.env.OPENAI_API_KEY
});

async function search(req, res) {
  try {
    if (!req.body?.searchTerm) {
      return res.status(400).json({ error: "Missing parameter" });
    }

    console.log(req.cookies.token);
    const userId = await decodeUserToken(req.cookies.token);

    console.log(userId);

    const userRestrictions = await getUserRestrictionsService(userId);

    console.log(userRestrictions);

    const useSeason = req.body.useSeason;

    let seasonText = '';

    if (useSeason === true )  {
      seasonText = "Prends en compte les saisons pour choisir les recettes";
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

    // console.log('LES RECETTES ICI');
    // console.log(recipes);

    const completions = await myopenai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { "type": "json_object" },
      messages: [
          {
              role: "system",
              content: "Je vais te donner mes recettes stockées dans ma base de données. J'aimerais que tu renvoies les meilleures suggestions possibles avec uniquement le contenu de ma base basées sur la demande de l'utilisateur qui te sera envoyée. Répond juste avec un JSON des ID des recettes classés dans l'ordre de pertinence avec Recettes comme clé, juste ça et rien d'autre. Contenu de la base de données : "+JSON.stringify(recipes)+" Prends en compte les restrictions alimentaires de l'utilisateur pour ne surtout pas inclure un ingrédient interdit dans la recette. Interdit d'inclure un ingrédient interdit, prends bien en compte les allergies ou intolérances, les voici :"+JSON.stringify(userRestrictions)+" "+seasonText,
          },
          {
              role: "user",
              content: req.body.searchTerm,
          }
      ]
    });

    console.log(completions.choices[0].message.content);

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
