var router = require('express').Router();
const verifyAuth = require('../authentication/verifyAuth');

const inputValidation = require('../utils/inputVailidation');
const usersController = require('../controllers/usersController');

// signup route
router.post(
  '/signup',
  inputValidation.validateSignup(),
  usersController.signup,
);

// login route
router.post('/login', inputValidation.validateLogin(), usersController.login);

// protected route
router.get('/protected', verifyAuth.isLoggedIn, usersController.protected);

// admin access only route
router.get(
  '/admin-access',
  verifyAuth.isLoggedIn,
  verifyAuth.isAdmin,
  usersController.adminAccess,
);

module.exports = router;
