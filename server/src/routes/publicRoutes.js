const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const publicController = require('../controllers/publicController');

// Real-time SSE event stream for both Public Form & Admin Portal
router.get('/events', publicController.sseHandler);

// Public Jobs API (Returns only Open status jobs)
router.get('/jobs', publicController.getPublicJobs);

// Public Candidate Application Submission API (Requires PDF file upload 'cv')
router.post('/applications', upload.single('cv'), publicController.submitPublicApplication);

module.exports = router;
