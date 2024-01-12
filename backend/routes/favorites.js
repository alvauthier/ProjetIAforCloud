const express = require('express');
const router = express.Router();
const favoritesCtrl = require('../controllers/favorites');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', favoritesCtrl.getUserFavorites);
router.get('/:recipeId', favoritesCtrl.checkRecipeFavorited);
router.post('/:recipeId', favoritesCtrl.addUserFavorite);
router.delete('/:recipeId', favoritesCtrl.deleteUserFavorite);

module.exports = router;