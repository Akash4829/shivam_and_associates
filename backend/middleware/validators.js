const { body, validationResult } = require('express-validator');

const INDIAN_MOBILE_REGEX = /^(\+91[\-\s]?)?[6-9]\d{9}$/;

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }
  next();
}

const appointmentValidators = [
  body('client_name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').isLength({ max: 255 }),
  body('phone_number')
    .trim()
    .matches(INDIAN_MOBILE_REGEX)
    .withMessage('A valid Indian mobile number is required'),
  body('case_summary')
    .optional({ checkFalsy: true })
    .isLength({ max: 2000 })
    .withMessage('Case summary must not exceed 2000 characters'),
  body('preferred_date')
    .optional({ checkFalsy: true })
    .isISO8601()
    .withMessage('Preferred date must be a valid date'),
  handleValidationErrors,
];

const internshipValidators = [
  body('applicant_name').trim().notEmpty().withMessage('Name is required'),
  body('email').trim().isEmail().withMessage('A valid email is required').isLength({ max: 255 }),
  body('phone_number')
    .trim()
    .matches(INDIAN_MOBILE_REGEX)
    .withMessage('A valid Indian mobile number is required'),
  body('statement')
    .optional({ checkFalsy: true })
    .isLength({ max: 3000 })
    .withMessage('Statement must not exceed 3000 characters'),
  body('college_university').trim().notEmpty().withMessage('College or university is required'),
  body('current_year_semester').trim().notEmpty().withMessage('Year or semester is required'),
  body('areas_of_interest').trim().notEmpty().withMessage('Areas of interest are required'),
  body('cover_letter')
    .optional({ checkFalsy: true })
    .isLength({ max: 3000 })
    .withMessage('Cover letter must not exceed 3000 characters'),
  handleValidationErrors,
];

const INTERNSHIP_STATUSES = ['Pending', 'Shortlisted', 'Approved', 'Rejected'];

const internshipUpdateValidators = [
  body('status')
    .optional()
    .isIn(INTERNSHIP_STATUSES)
    .withMessage(`Status must be one of: ${INTERNSHIP_STATUSES.join(', ')}`),
  body('admin_notes')
    .optional({ nullable: true })
    .isLength({ max: 2000 })
    .withMessage('Admin notes must not exceed 2000 characters'),
  handleValidationErrors,
];

const PASSWORD_RULES = [
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one number')
    .matches(/[^A-Za-z0-9]/)
    .withMessage('Password must contain at least one special character'),
];

const registerValidators = [
  body('full_name').trim().notEmpty().withMessage('Full name is required').isLength({ max: 255 }),
  body('email').trim().isEmail().withMessage('A valid email is required').isLength({ max: 255 }),
  ...PASSWORD_RULES,
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match');
    }
    return true;
  }),
  handleValidationErrors,
];

const loginValidators = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidationErrors,
];

const googleAuthValidators = [
  body('credential').notEmpty().withMessage('Google ID token is required'),
  handleValidationErrors,
];

const forgotPasswordValidators = [
  body('email').trim().isEmail().withMessage('A valid email is required'),
  handleValidationErrors,
];

const resetPasswordValidators = [
  body('token').notEmpty().withMessage('Reset token is required'),
  ...PASSWORD_RULES,
  handleValidationErrors,
];

module.exports = {
  appointmentValidators,
  internshipValidators,
  internshipUpdateValidators,
  registerValidators,
  loginValidators,
  googleAuthValidators,
  forgotPasswordValidators,
  resetPasswordValidators,
  handleValidationErrors,
};
