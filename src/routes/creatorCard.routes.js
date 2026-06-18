import express from "express"
import creatorCardController from "../controller/creatorCard.controller.js";
const router = express.Router();

// POST /creator-cards - Create a new creator card
router.post('/creator-cards', creatorCardController.create);

// GET /creator-cards/:slug - Get a public card by slug
router.get('/creator-cards/:slug', creatorCardController.getPublic);

// DELETE /creator-cards/:slug - Delete a card by slug
router.delete('/creator-cards/:slug', creatorCardController.delete);

export default router;