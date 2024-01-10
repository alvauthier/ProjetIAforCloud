const express = require('express');
const router = express.Router();
const searchCtrl = require('../controllers/search');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.post('/', searchCtrl.search);

module.exports = router;