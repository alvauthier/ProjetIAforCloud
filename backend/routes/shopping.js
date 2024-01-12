const express = require('express');
const router = express.Router();
const shoppingCtrl = require('../controllers/shopping');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:recipeId', shoppingCtrl.getShoppingList);

module.exports = router;