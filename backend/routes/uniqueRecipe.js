const express = require('express');
const router = express.Router();
const uniqueRecipeCtrl = require('../controllers/uniqueRecipe');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:recipeId', uniqueRecipeCtrl.getUniqueRecipe);

module.exports = router;