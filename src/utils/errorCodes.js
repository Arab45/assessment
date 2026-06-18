// Custom error codes for business rule violations

export const ERROR_CODES = {
  // Slug is already taken
  SL02: 'SL02',
  
  // access_code required for private cards
  AC01: 'AC01',
  
  // access_code on public cards
  AC05: 'AC05',
  
  // Card not found
  NF01: 'NF01',
  
  // Card exists but is draft
  NF02: 'NF02',
  
  // Access code required for private card
  AC03: 'AC03',
  
  // Invalid access code
  AC04: 'AC04',
};

export const ERROR_MESSAGES = {
  [ERROR_CODES.SL02]: 'Slug is already taken',
  [ERROR_CODES.AC01]: 'access_code is required when access_type is private',
  [ERROR_CODES.AC05]: 'access_code can only be set on private cards',
  [ERROR_CODES.NF01]: 'Creator card not found',
  [ERROR_CODES.NF02]: 'Creator card not found',
  [ERROR_CODES.AC03]: 'This card is private. An access code is required',
  [ERROR_CODES.AC04]: 'Invalid access code',
};

export class AppError extends Error {
  constructor(code, message = null, statusCode = 400) {
    super(message || ERROR_MESSAGES[code] || 'An error occurred');
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// export default {
//   ERROR_CODES,
//   ERROR_MESSAGES,
//   AppError,
// };