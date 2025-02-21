import express from 'express';
import { createEvent,updateEvent } from '../controllers/eventController.js';
import { payForEvent } from '../controllers/eventPaymentController.js';

const router = express.Router();

router.post('/createEvent', createEvent);
router.put('/updateEvent/:eventId', updateEvent);
// POST endpoint to handle payment for an event pass
router.post('/:eventId/pay', payForEvent);

export default router;
