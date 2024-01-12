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

async function getAccompaniments(req, res) {
    const { recipeId } = req.params;
    try {
        // const userId = await decodeUserToken(req.cookies.token);
        //
        // const userRestrictions = await getUserRestrictionsService(userId);

        const referenceRecipe = await Recipe.findByPk(recipeId, {
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
            model: "gpt-3.5-turbo-1106",
            messages: [
                {
                    role: "system",
                    content: "Je vais te donner une recette et tu me renverra une boisson avec le sépage si la boisson est un vin et un dessert. Les accompagnements devront être pertinents pour la recette. Répond juste avec texte un conseillant les accompagnements. Voici la recete"+JSON.stringify(referenceRecipe),
                },
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
    getAccompaniments,
};
