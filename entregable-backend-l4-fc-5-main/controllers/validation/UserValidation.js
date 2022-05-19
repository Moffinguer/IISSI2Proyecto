const { check } = require('express-validator')
const FileValidationHelper = require('./FileValidationHelper')

const maxFileSize = 10000000 // around 10Mb

module.exports = {
  create: () => {
    return [
      check('file')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png, svg).'),
      check('file')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('password', 'Password should be at least 3 chars long').isLength({ min: 3 })
    ]
  },

  update: () => {
    return [
      check('file')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png, svg).'),
      check('file')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
    ]
  },

  login: () => {
    return [
      check('email', 'Email is mandatory, parameter missing.').not().isEmpty(),
      check('email', 'Not a valid email.').isEmail(),
      check('password', 'Password is mandatory, parameter missing.').not().isEmpty()
    ]
  }
}
