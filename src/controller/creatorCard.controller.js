
import creatorCardService from "../service/creatorCard.service.js";
import { formatValidationErrors, validateCreatorCard, validateDeleteRequest } from "../validators/creatorCardValidator.js";
import { AppError } from "../utils/errorCodes.js";


class CreatorCardController {
  /**
   * Create a new creator card
   */
  async create(req, res, next) {
    try {
      // Validate request body
      const errors = validateCreatorCard(req.body);
      if (errors.length > 0) {
        const formattedError = formatValidationErrors(errors);
        return res.status(400).json(formattedError);
      }

      // Create the card
      const card = await creatorCardService.createCard(req.body);

      // Return success response
      return res.status(200).json({
        status: 'success',
        message: 'Creator Card Created Successfully.',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a public card by slug
   */
  async getPublic(req, res, next) {
    try {
      const { slug } = req.params;
      const { access_code } = req.query;

      const card = await creatorCardService.getCardBySlugPublic(slug, access_code);

      return res.status(200).json({
        status: 'success',
        message: 'Creator Card Retrieved Successfully.',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a card by slug
   */
  async delete(req, res, next) {
    try {
      const { slug } = req.params;
      
      // Validate request body
      const errors = validateDeleteRequest(req.body);
      if (errors.length > 0) {
        const formattedError = formatValidationErrors(errors);
        return res.status(400).json(formattedError);
      }

      const { creator_reference } = req.body;
      const card = await creatorCardService.deleteCard(slug, creator_reference);

      return res.status(200).json({
        status: 'success',
        message: 'Creator Card Deleted Successfully.',
        data: card,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new CreatorCardController();