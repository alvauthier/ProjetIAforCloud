const express = require('express');
const router = express.Router();
const ingredientsCtrl = require('../controllers/ingredients');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/', ingredientsCtrl.getIngredients);

module.exports = router;