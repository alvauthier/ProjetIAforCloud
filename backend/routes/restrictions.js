const express = require('express');
const router = express.Router();
const restrictionsCtrl = require('../controllers/restrictions');
const auth = require('../middleware/auth');
const authMiddleware = require('../middleware/authMiddleware');


router.get('/:userId', restrictionsCtrl.getUserRestrictions);
router.post('/add/:userId', restrictionsCtrl.addUserRestrictions);
// router.delete('/delete/:userId', restrictionsCtrl.deleteUserRestrictions);

module.exports = router;