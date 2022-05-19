const { check } = require('express-validator')
const models = require('../../models')
const FileValidationHelper = require('./FileValidationHelper')

const Product = models.Product

const maxFileSize = 10000000 // around 10Mb

module.exports = {
  create: () => {
    return [
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB')
    ]
  },

  update: () => {
    return [
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('restaurantId')
        .custom(async (value, { req }) => {
          try {
            const product = await Product.findByPk(req.params.productId,
              {
                attributes: ['restaurantId']
              })
            // eslint-disable-next-line eqeqeq
            if (product.restaurantId != value) {
              return Promise.reject(new Error('The restaurantId cannot be modified'))
            } else { return Promise.resolve() }
          } catch (err) {
            return Promise.reject(new Error(err))
          }
        })
    ]
  }
}
