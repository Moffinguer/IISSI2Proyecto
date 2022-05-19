const { check } = require('express-validator')
const FileValidationHelper = require('./FileValidationHelper')

const maxFileSize = 10000000 // around 10Mb

module.exports = {
  create: () => {
    return [
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.heroImage[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.heroImage[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.logo[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.logo[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('email').isEmail()
    ]
  },

  update: () => {
    return [
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.heroImage[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.heroImage[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.logo[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.logo[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
    ]
  }
}
