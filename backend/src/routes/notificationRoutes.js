const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { getNotificationSettings, updateNotificationSettings } = require('../controllers/notificationController');

router.use(authMiddleware);

router.get('/', getNotificationSettings);
router.put('/', updateNotificationSettings);

module.exports = router;

