const successResponse = (res, data, message = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message
  });
};

const errorResponse = (res, message, statusCode = 500) => {
  return res.status(statusCode).json({
    success: false,
    message
  });
};

module.exports = {
  successResponse,
  errorResponse
};