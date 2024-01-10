const express = require('express');
const router = express.Router();
const recipesCtrl = require('../controllers/recipes');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:recipeId', recipesCtrl.getRecipe);

module.exports = router;