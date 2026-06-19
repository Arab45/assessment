import express from "express"
import CreatorCardController from "../controller/creatorCard.controller.js";
const router = express.Router();

router.post('/creator-cards', CreatorCardController.create);

router.get('/creator-cards/:slug', CreatorCardController.getPublic);

router.delete('/creator-cards/:slug', CreatorCardController.delete);

export default router;