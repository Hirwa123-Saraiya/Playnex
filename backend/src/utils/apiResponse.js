export function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
}

export function errorResponse(res, message = 'An error occurred', statusCode = 400, errors = []) {
  return res.status(statusCode).json({
    success: false,
    data: null,
    message,
    errors
  });
}
