const User = require('../models/User');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/constants');
const { validationResult } = require('express-validator');
const { successResponse, errorResponse } = require('../utils/httpResponse');

module.exports = {
  // handles /users/signup route
  signup: async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return errorResponse(res, config.httpStatus.UNPROCCECABLE, {
        errors: errors.array(),
      });
    }
    try {
      const newUser = {
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
      };
      const salt = await bcrypt.genSalt();
      const hash = await bcrypt.hash(newUser.password, salt);

      newUser.password = hash;
      const userCreated = await User.create(newUser);
      const { password, ...createdUser } = userCreated._doc;
      return successResponse(res, config.httpStatus.CREATED, {
        data: createdUser,
      });
    } catch (error) {
      return errorResponse(res, config.httpStatus.INTERNAL_SERVER_PROBLEM, {
        erros: { msg: 'Internal server problem' },
      });
    }
  },

  // handles login

  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, config.httpStatus.UNPROCCECABLE, {
        errors: errors.array(),
      });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user)
        return errorResponse(res, config.httpStatus.UNAUTORIZED, {
          errors: {
            msg: 'Invalid username or password',
          },
        });

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch)
        return errorResponse(res, config.httpStatus.UNAUTORIZED, {
          errors: {
            msg: 'Invalid username or password',
          },
        });

      const token = jwt.sign({ id: user._id }, config.jwtSecret);

      return successResponse(res, config.httpStatus.OK, { data: { token } });
    } catch (error) {
      return errorResponse(res, config.httpStatus.INTERNAL_SERVER_PROBLEM, {
        erros: { msg: 'Internal server problem' },
      });
    }
  },
  protected: (req, res) => {
    successResponse(res, config.httpStatus.OK, {
      message: 'You are logged in',
    });
  },
  adminAccess: (req, res) => {
    successResponse(res, config.httpStatus.OK, {
      message: 'Admin access success',
    });
  },
};
