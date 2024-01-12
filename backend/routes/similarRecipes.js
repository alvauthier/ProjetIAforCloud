const express = require('express');
const router = express.Router();
const similarRecipes = require('../controllers/similarRecipes');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:recipeId', similarRecipes.getSimilarRecipes);

module.exports = router;