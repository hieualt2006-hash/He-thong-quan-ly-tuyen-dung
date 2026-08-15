const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const upload = require('../middleware/upload');

// Application Routes
router.post('/', upload.single('cv'), applicationController.createApplication);
router.get('/:id', applicationController.getApplicationById);
router.patch('/:id/status', applicationController.updateApplicationStatus);

module.exports = router;
