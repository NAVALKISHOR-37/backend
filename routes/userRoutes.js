const express = require('express');
const { getUsers, createUser, getUserById, updateUserById, deleteUserById } = require('../controllers/userController');

const router = express.Router();

// Routes for user operations
router.get('/', getUsers); // Get all users
router.post('/', createUser); // Create a new user
router.get('/:id', getUserById); // Get user by ID
router.put('/:id', updateUserById); // Update user by ID
router.delete('/:id', deleteUserById); // Delete user by ID

module.exports = router;
