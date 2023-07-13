const jsonResponse = (res, statusCode, data) =>
  res.status(statusCode).json({ ...data });

const errorResponse = (res, statusCode, errors) =>
  jsonResponse(res, statusCode, errors);

const successResponse = (res, statusCode, data) =>
  jsonResponse(res, statusCode, data);

module.exports = { errorResponse, successResponse };
