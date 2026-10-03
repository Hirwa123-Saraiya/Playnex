export function errorHandler(err, req, res, next) {
  console.error('[Error Handler]:', err);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors: err.errors || []
  });
}
