const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const User = require("../db").User;
const Ingredient = require('../db').Ingredient;
const Restriction = require('../db').Restriction;

require("dotenv").config({ path: ".env.local", override: true });

async function getUserRestrictions(req, res) {
  const { userId } = req.params;

  try {
    const restrictions = await Restriction.findAll({
      where: { userId },
    });
    res.json(restrictions);
  } catch (error) {
    console.error('Erreur lors de la récupération des restrictions:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function addUserRestrictions(req, res) {
  const { userId, restriction } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const newRestriction = await Restriction.create({
      userId: userId,
      name: restriction
    });

    res.json({ message: 'Restriction enregistrée avec succès', newRestriction });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement de la restriction:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

// async function deleteUserRestrictions(req, res) {
//   console.log('-- Fonction deleteUserRestrictions --');
//   const { userId, ingredientNames } = req.body;

//   try {
//     console.log('Suppression des restrictions de l\'utilisateur', userId, 'pour les ingrédients', ingredientNames)
//     // Trouver les ingredientId correspondants
//     const ingredients = await Ingredient.findAll({
//       where: { name: ingredientNames },
//     });

//     const ingredientIds = ingredients.map((ingredient) => ingredient.id);

//     // Supprimer les restrictions correspondantes
//     await Restriction.destroy({
//       where: {
//         userId,
//         ingredientId: ingredientIds,
//       },
//     });

//     res.json({ message: 'Restrictions supprimées avec succès' });
//   } catch (error) {
//     res.status(500).json({ error: 'Erreur lors de la suppression des restrictions' });
//   }
// }

module.exports = {
  getUserRestrictions,
  addUserRestrictions,
  // deleteUserRestrictions,
};
