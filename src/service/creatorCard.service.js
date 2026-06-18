import CreatorCard from "../models/CreatorCard.js";
import { generateUniqueSlug, isSlugTaken } from "../utils/slugGenerator.js";
import { AppError, ERROR_CODES, ERROR_MESSAGES } from "../utils/errorCodes.js";


class CreatorCardService {
  /**
   * Create a new creator card
   */
  async createCard(data) {
    // Handle slug auto-generation
    let slug = data.slug;
    if (!slug) {
      slug = await generateUniqueSlug(data.title);
    } else {
      // Check if provided slug is already taken
      const slugExists = await isSlugTaken(slug);
      if (slugExists) {
        throw new AppError(ERROR_CODES.SL02, 'Slug is already taken', 400);
      }
    }

    // Set default access_type if not provided
    const accessType = data.access_type || 'public';
    const accessCode = accessType === 'private' ? data.access_code : null;

    const cardData = {
      title: data.title,
      description: data.description || '',
      slug: slug,
      creator_reference: data.creator_reference,
      links: data.links || [],
      service_rates: data.service_rates || null,
      status: data.status,
      access_type: accessType,
      access_code: accessCode,
      deleted: null,
    };

    // Validate access_code conditions
    if (accessType === 'private' && !accessCode) {
      throw new AppError(ERROR_CODES.AC01, 'access_code is required when access_type is private', 400);
    }
    
    if (accessType === 'public' && data.access_code) {
      throw new AppError(ERROR_CODES.AC05, 'access_code can only be set on private cards', 400);
    }

    const card = new CreatorCard(cardData);
    await card.save();

    return card.toJSON();
  }

  /**
   * Get a public card by slug
   */
  async getCardBySlugPublic(slug, accessCode = null) {
    // Find the card
    const card = await CreatorCard.findOne({ 
      slug, 
      deleted: null 
    });

    if (!card) {
      throw new AppError(ERROR_CODES.NF01, 'Creator card not found', 404);
    }

    // Check if card is draft
    if (card.status === 'draft') {
      throw new AppError(ERROR_CODES.NF02, 'Creator card not found', 404);
    }

    // Check access control for private cards
    if (card.access_type === 'private') {
      if (!accessCode) {
        throw new AppError(ERROR_CODES.AC03, 'This card is private. An access code is required', 403);
      }
      
      if (card.access_code !== accessCode) {
        throw new AppError(ERROR_CODES.AC04, 'Invalid access code', 403);
      }
    }

    // Return card without access_code
    const cardJSON = card.toJSON();
    delete cardJSON.access_code;
    
    return cardJSON;
  }

  /**
   * Delete a card by slug
   */
  async deleteCard(slug, creatorReference) {
    // Find the card
    const card = await CreatorCard.findOne({ 
      slug, 
      deleted: null 
    });

    if (!card) {
      throw new AppError(ERROR_CODES.NF01, 'Creator card not found', 404);
    }

    // Verify creator_reference
    if (card.creator_reference !== creatorReference) {
      throw new AppError(ERROR_CODES.NF01, 'Creator card not found', 404);
    }

    // Soft delete
    card.deleted = Date.now();
    card.updated = Date.now();
    await card.save();

    return card.toJSON();
  }
}

export default new CreatorCardService();