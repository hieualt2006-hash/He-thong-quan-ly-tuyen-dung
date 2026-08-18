const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', authController.login);

// POST /api/auth/change-password
router.post('/change-password', authController.changePassword);

// GET /api/auth/users
router.get('/users', authController.getUsers);

// POST /api/auth/users
router.post('/users', authController.createUser);

// DELETE /api/auth/users/:id
router.delete('/users/:id', authController.deleteUser);

module.exports = router;
