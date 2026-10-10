import { Router } from 'express';
import { createTourney, getTourneys, getTourneyById } from '../controllers/tourneyController';
import { addParticipant, getParticipants } from '../controllers/participantController';
import { generateBracket, getBracket } from '../controllers/bracketController';
import {
    validateTourneyBody,
    loadTourney,
    validateParticipantBody,
    ensureRegistrationOpen
} from '../middleware/tourneyMiddleware';

const router = Router();

router.post('/', validateTourneyBody, createTourney);
router.get('/', getTourneys);
router.get('/:tournamentId', loadTourney, getTourneyById);

router.post('/:tournamentId/participants', loadTourney, validateParticipantBody, ensureRegistrationOpen, addParticipant);
router.get('/:tournamentId/participants', loadTourney, getParticipants);

router.post('/:tournamentId/bracket', loadTourney, generateBracket);
router.get('/:tournamentId/bracket', loadTourney, getBracket);

export default router;
