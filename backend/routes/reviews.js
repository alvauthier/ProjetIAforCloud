const express = require('express');
const router = express.Router();
const reviewsCtrl = require('../controllers/reviews');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/:recipeId', reviewsCtrl.addReview);

module.exports = router;