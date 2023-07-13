require('dotenv').config();

module.exports = {
  jwtSecret: process.env.JWT_SECRET,
  methodNames: {
    signup: 'signup',
  },
  httpStatus: {
    OK: 200,
    CREATED: 201,
    UNAUTORIZED: 401,
    NOT_FOUND: 404,
    UNPROCCECABLE: 422,
    INTERNAL_SERVER_PROBLEM: 500,
  },
};
