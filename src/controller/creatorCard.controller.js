import CreatorCardService from "../service/creatorCard.service.js";
import {
  formatValidationErrors,
  validateCreatorCard,
  validateDeleteRequest,
} from "../validators/creatorCardValidator.js";
import { AppError } from "../utils/errorCodes.js";

class CreatorCardController {
  async create(req, res, next) {
    try {
      const errors = validateCreatorCard(req.body);
      if (errors.length > 0) {
        const formattedError = formatValidationErrors(errors);
        return res.status(400).json(formattedError);
      }

      const card = await CreatorCardService.createCard(req.body);

      return res.status(200).json({
        status: "success",
        message: "Creator Card Created Successfully.",
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  async getPublic(req, res, next) {
    try {
      const { slug } = req.params;
      const { access_code } = req.query;

      const card = await CreatorCardService.getCardBySlugPublic(
        slug,
        access_code,
      );

      return res.status(200).json({
        status: "success",
        message: "Creator Card Retrieved Successfully.",
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { slug } = req.params;

      const errors = validateDeleteRequest(req.body);
      if (errors.length > 0) {
        const formattedError = formatValidationErrors(errors);
        return res.status(400).json(formattedError);
      }

      const { creator_reference } = req.body;
      const card = await CreatorCardService.deleteCard(slug, creator_reference);

      return res.status(200).json({
        status: "success",
        message: "Creator Card Deleted Successfully.",
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CreatorCardController();
