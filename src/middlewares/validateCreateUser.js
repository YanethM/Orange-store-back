const { check, validationResult } = require('express-validator');

const createUserValidator = [
  // Define validation rules for required fields
  check('fullname').notEmpty().withMessage('Full name is required'),
  check('first_surname').notEmpty().withMessage('First surname is required'),
  check('second_surname').notEmpty().withMessage('Second surname is required'),
  check('identification').notEmpty().withMessage('Identification is required'),
  check('email').isEmail().withMessage('Invalid email format'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
];

const validateCreateUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = { createUserValidator, validateCreateUser };
