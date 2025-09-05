import express from 'express';
import { Signup, Login, Logout, updateUserProfile, getAllUsers, deleteUser, CheckAuth, GetOneUser } from '../controllers/auth.control.js';
import { verifyAdminToken } from '../middleware/verifyAdminToken.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/signup', Signup);
router.post('/login', Login);
router.post('/logout', Logout);
router.put('/updateUserProfile/:id', updateUserProfile);

// get all users
router.get('/getAllUsers', verifyAdminToken, getAllUsers);

// get all users
router.get('/getOneUser/:id', verifyAdminToken, GetOneUser);

// delete user
router.delete('/deleteUser/:id', verifyAdminToken, deleteUser);

// check Auth
router.get('/checkAuth', verifyToken, CheckAuth);

// check admin auth
router.get('/checkAdminAuth', verifyAdminToken, CheckAuth);

export default router;
