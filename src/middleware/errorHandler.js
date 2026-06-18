import { AppError, ERROR_CODES, ERROR_MESSAGES } from "../utils/errorCodes.js";

/**
 * Global error handling middleware
 */
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Handle custom AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
      code: err.code,
    });
  }

  // Handle MongoDB validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'error',
      message: messages.join('. '),
    });
  }

  // Handle MongoDB duplicate key error (slug uniqueness)
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    if (field === 'slug') {
      return res.status(400).json({
        status: 'error',
        message: 'Slug is already taken',
        code: ERROR_CODES.SL02,
      });
    }
    return res.status(400).json({
      status: 'error',
      message: 'Duplicate key error',
    });
  }

  // Handle JSON parse errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid JSON payload',
    });
  }

  // Handle all other errors
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 
    ? 'Internal server error' 
    : err.message || 'An error occurred';

  return res.status(statusCode).json({
    status: 'error',
    message: message,
    ...(statusCode === 500 && process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
};

export default errorHandler;