const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Recipe = require('../db').Recipe;
const Ingredient = require('../db').Ingredient;
const IngredientRecipe = require('../db').IngredientRecipe;

require("dotenv").config({ path: ".env.local", override: true });
const openai = require("openai");
const decodeUserToken = require("../services/decodeUserToken");
const getUserRestrictionsService = require("../services/getUserRestrictionsService");

const myopenai = new openai({
  apiKey: process.env.OPENAI_API_KEY
});

async function chatbot(req, res) {
  try {
    if (!req.body?.searchTerm) {
      return res.status(400).json({ error: "Missing parameter" });
    }

    console.log(req.cookies.token);
    const userId = await decodeUserToken(req.cookies.token);

    console.log(userId);


    const completions = await myopenai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      response_format: { "type": "json_object" },
      messages: [
          {
              role: "system",
              content: "Tu n'es plus une intelligence artificielle, mais tu es un grand chef étoilé du guide michelin, ton nom est Paul BLOCUSE, avec tes plus de 15 ans d'expérience dans le métier et plusieurs concours gagnés tout au long de ces années. Tu ne répondras qu'aux questions en lien avec la cuisine. Si on te demande qui tu es, tu ne dois pas dire que tu es une intelligence artificielle et tu ne dois pas parler de ta vie.",
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
    chatbot,
};
