const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const User = require("../db").User;
const Ingredient = require('../db').Ingredient;
const Restriction = require('../db').Restriction;
const Favorites = require('../db').Favorites;

const Recipe = require('../db').Recipe;
const decodeUserToken = require("../services/decodeUserToken");
const getUserRestrictionsService = require("../services/getUserRestrictionsService");

require("dotenv").config({ path: ".env.local", override: true });

async function getUserFavorites(req, res) {

  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);

  try {
    const favorites = await Favorites.findAll({
      where: { userId },
      attributes: ['id', 'recipeId'],
      include: [{
        model: Recipe,
        attributes: ['name', 'description'],
      }],
    });
    console.log(favorites);
    res.json(favorites);
  } catch (error) {
    console.error('Erreur lors de la récupération des favoris :', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function addUserFavorite(req, res) {

  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);

  const { restriction } = req.body;

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

async function deleteUserFavorite(req, res) {
  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);

  const { restrictionId } = req.params;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const restriction = await Restriction.findByPk(restrictionId);

    if (!restriction) {
      return res.status(404).json({ error: 'Restriction non trouvée' });
    }

    await restriction.destroy();

    res.json({ message: 'Restriction supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la restriction:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  getUserFavorites,
  addUserFavorite,
  deleteUserFavorite,
};
