const express = require('express');
const router = express.Router();
const favoritesCtrl = require('../controllers/favorites');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', favoritesCtrl.getUserFavorites);

module.exports = router;