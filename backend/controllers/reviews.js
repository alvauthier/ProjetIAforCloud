const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Sequelize = require('sequelize');
const User = require("../db").User;
const Review = require('../db').Review;
const decodeUserToken = require("../services/decodeUserToken");
const getUserRestrictionsService = require("../services/getUserRestrictionsService");

require("dotenv").config({ path: ".env.local", override: true });

async function addReview(req, res) {
    console.log(req.params);
    console.log(req.cookies.token);
    const userId = await decodeUserToken(req.cookies.token);
  
    console.log(userId);
    
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ error: 'Utilisateur non trouvé' });
      }

      const newReview = await Review.create({
        userId: userId,
        review: req.body.comment,
        note : req.body.rating,
        recipeId : req.params.recipeId
      });
  
      res.json({ message: 'Commentaire et note enregistrée avec succès', newReview });
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du commentaire et de la note:', error);
      res.status(500).json({ error: 'Erreur serveur' });
    }
  }

module.exports = {
addReview,
};
  