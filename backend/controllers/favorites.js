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

async function checkRecipeFavorited(req, res) {
  console.log('checkRecipeFavorited');

  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);
  const recipeId = req.params.recipeId;

  try {
    const favorite = await Favorites.findOne({ where: { userId, recipeId } });

    if (favorite) {
      console.log('favorite', favorite);
      res.json({ isFavorited: true });
    } else {
      console.log('favorite not found');
      res.json({ isFavorited: false });
    }
  } catch (error) {
    console.error('Erreur lors de la vérification des favoris :', error);
    res.status(500).json({ error: 'Une erreur est survenue lors de la vérification des favoris' });
  }
}

async function addUserFavorite(req, res) {

  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const newFavorite = await Favorites.create({
      userId: userId,
      recipeId: req.params.recipeId,
    });

    res.json({ message: 'Favoris enregistré avec succès', newFavorite });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement du favoris:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

async function deleteUserFavorite(req, res) {
  console.log(req.cookies.token);
  const userId = await decodeUserToken(req.cookies.token);

  console.log(userId);

  const recipeId = req.params.recipeId;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const favorite = await Favorites.findOne({ where: { userId, recipeId } });

    if (!favorite) {
      return res.status(404).json({ error: 'Favori non trouvé' });
    }

    await favorite.destroy();

    res.json({ message: 'Favori supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du favori:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
}

module.exports = {
  getUserFavorites,
  addUserFavorite,
  deleteUserFavorite,
  checkRecipeFavorited,
};
