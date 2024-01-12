const express = require('express');
const router = express.Router();
const accompaniments = require('../controllers/accompaniments');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:recipeId', accompaniments.getAccompaniments);

module.exports = router;