import validator from "validator"


/**
 * Validates the creator card creation request
 * Returns an array of validation errors, or empty array if valid
 */
export const validateCreatorCard = (data) => {
  const errors = [];

  // Validate title
  if (!data.title) {
    errors.push({ field: 'title', message: 'title is required' });
  } else if (typeof data.title !== 'string') {
    errors.push({ field: 'title', message: 'title must be a string' });
  } else if (data.title.length < 3 || data.title.length > 100) {
    errors.push({ field: 'title', message: 'title must be between 3 and 100 characters' });
  }

  // Validate description
  if (data.description !== undefined && data.description !== null) {
    if (typeof data.description !== 'string') {
      errors.push({ field: 'description', message: 'description must be a string' });
    } else if (data.description.length > 500) {
      errors.push({ field: 'description', message: 'description must not exceed 500 characters' });
    }
  }

  // Validate slug
  if (data.slug !== undefined && data.slug !== null) {
    if (typeof data.slug !== 'string') {
      errors.push({ field: 'slug', message: 'slug must be a string' });
    } else if (data.slug.length < 5 || data.slug.length > 50) {
      errors.push({ field: 'slug', message: 'slug must be between 5 and 50 characters' });
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.slug)) {
      errors.push({ field: 'slug', message: 'slug must contain only letters, numbers, hyphens, and underscores' });
    }
  }

  // Validate creator_reference
  if (!data.creator_reference) {
    errors.push({ field: 'creator_reference', message: 'creator_reference is required' });
  } else if (typeof data.creator_reference !== 'string') {
    errors.push({ field: 'creator_reference', message: 'creator_reference must be a string' });
  } else if (data.creator_reference.length !== 20) {
    errors.push({ field: 'creator_reference', message: 'creator_reference must be exactly 20 characters' });
  }

  // Validate links
  if (data.links !== undefined && data.links !== null) {
    if (!Array.isArray(data.links)) {
      errors.push({ field: 'links', message: 'links must be an array' });
    } else {
      data.links.forEach((link, index) => {
        if (!link.title) {
          errors.push({ field: `links[${index}].title`, message: 'link title is required' });
        } else if (typeof link.title !== 'string' || link.title.length < 1 || link.title.length > 100) {
          errors.push({ field: `links[${index}].title`, message: 'link title must be between 1 and 100 characters' });
        }

        if (!link.url) {
          errors.push({ field: `links[${index}].url`, message: 'link URL is required' });
        } else if (typeof link.url !== 'string' || link.url.length > 200) {
          errors.push({ field: `links[${index}].url`, message: 'link URL must be a string with max 200 characters' });
        } else if (!link.url.startsWith('http://') && !link.url.startsWith('https://')) {
          errors.push({ field: `links[${index}].url`, message: 'link URL must start with http:// or https://' });
        }
      });
    }
  }

  // Validate service_rates
  if (data.service_rates !== undefined && data.service_rates !== null) {
    if (typeof data.service_rates !== 'object' || Array.isArray(data.service_rates)) {
      errors.push({ field: 'service_rates', message: 'service_rates must be an object' });
    } else {
      const { currency, rates } = data.service_rates;
      
      // Validate currency
      if (!currency) {
        errors.push({ field: 'service_rates.currency', message: 'currency is required' });
      } else if (!['NGN', 'USD', 'GBP', 'GHS'].includes(currency)) {
        errors.push({ field: 'service_rates.currency', message: 'currency must be one of: NGN, USD, GBP, GHS' });
      }

      // Validate rates
      if (!rates || !Array.isArray(rates) || rates.length === 0) {
        errors.push({ field: 'service_rates.rates', message: 'rates must be a non-empty array' });
      } else {
        rates.forEach((rate, index) => {
          if (!rate.name) {
            errors.push({ field: `service_rates.rates[${index}].name`, message: 'rate name is required' });
          } else if (typeof rate.name !== 'string' || rate.name.length < 3 || rate.name.length > 100) {
            errors.push({ field: `service_rates.rates[${index}].name`, message: 'rate name must be between 3 and 100 characters' });
          }

          if (rate.description !== undefined && rate.description !== null) {
            if (typeof rate.description !== 'string' || rate.description.length > 250) {
              errors.push({ field: `service_rates.rates[${index}].description`, message: 'rate description must not exceed 250 characters' });
            }
          }

          if (rate.amount === undefined || rate.amount === null) {
            errors.push({ field: `service_rates.rates[${index}].amount`, message: 'rate amount is required' });
          } else if (typeof rate.amount !== 'number' || !Number.isInteger(rate.amount) || rate.amount < 1) {
            errors.push({ field: `service_rates.rates[${index}].amount`, message: 'rate amount must be a positive integer (minimum 1)' });
          }
        });
      }
    }
  }

  // Validate status
  if (!data.status) {
    errors.push({ field: 'status', message: 'status is required' });
  } else if (!['draft', 'published'].includes(data.status)) {
    errors.push({ field: 'status', message: 'status must be either "draft" or "published"' });
  }

  // Validate access_type
  if (data.access_type !== undefined && data.access_type !== null) {
    if (!['public', 'private'].includes(data.access_type)) {
      errors.push({ field: 'access_type', message: 'access_type must be either "public" or "private"' });
    }
  }

  // Validate access_code
  const accessType = data.access_type || 'public';
  if (accessType === 'private') {
    if (!data.access_code) {
      errors.push({ field: 'access_code', message: 'access_code is required when access_type is private' });
    } else if (typeof data.access_code !== 'string' || !/^[A-Za-z0-9]{6}$/.test(data.access_code)) {
      errors.push({ field: 'access_code', message: 'access_code must be exactly 6 alphanumeric characters' });
    }
  } else if (accessType === 'public' && data.access_code) {
    errors.push({ field: 'access_code', message: 'access_code can only be set on private cards' });
  }

  return errors;
};

// Formats validation errors for API response
 
export const formatValidationErrors = (errors) => {
  if (errors.length === 0) return null;
  
  const messages = errors.map(e => e.message);
  return {
    status: 'error',
    message: messages.join('. '),
    errors: errors
  };
};

// Validates delete request
export const validateDeleteRequest = (data) => {
  const errors = [];

  if (!data.creator_reference) {
    errors.push({ field: 'creator_reference', message: 'creator_reference is required' });
  } else if (typeof data.creator_reference !== 'string') {
    errors.push({ field: 'creator_reference', message: 'creator_reference must be a string' });
  } else if (data.creator_reference.length !== 20) {
    errors.push({ field: 'creator_reference', message: 'creator_reference must be exactly 20 characters' });
  }

  return errors;
};
