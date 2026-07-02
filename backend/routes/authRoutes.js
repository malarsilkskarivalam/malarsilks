const express = require('express');
const router = express.Router();
const { signup, login, getAllUsers, getUserProfile, updateUserProfile, deleteRegisteredUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/signup', signup);
router.post('/login', login);
router.get('/users', getAllUsers);
router.get('/profile/:email', getUserProfile);
router.put('/profile', updateUserProfile);
router.delete('/users/:id', protect, deleteRegisteredUser);

module.exports = router;
