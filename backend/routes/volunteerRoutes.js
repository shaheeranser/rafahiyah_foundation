import express from 'express';
import { createVolunteer, getAllVolunteers, deleteVolunteer } from '../controllers/volunteerController.js';

const router = express.Router();

router.route('/').post(createVolunteer).get(getAllVolunteers);
router.route('/:id').delete(deleteVolunteer);

export default router;
