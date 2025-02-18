// backend/routes/businessRoutes.js
import express from 'express';
import {
  registerBusiness,
  authBusiness,
} from '../controllers/businessController.js';

const router = express.Router();

// Register a new business
router.post('/register', registerBusiness);

// Authenticate a business
router.post('/login', authBusiness);

export default router;