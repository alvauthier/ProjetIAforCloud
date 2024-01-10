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

async function deleteUserRestrictions(req, res) {
  const { userId, restrictionId } = req.params;

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
  getUserRestrictions,
  addUserRestrictions,
  deleteUserRestrictions,
};
