'use strict'
const ProductValidation = require('../controllers/validation/ProductValidation')
const ProductController = require('../controllers/ProductController')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs')
    fs.mkdirSync(process.env.PRODUCTS_FOLDER, { recursive: true })
    cb(null, process.env.PRODUCTS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
const upload = multer({ storage: storage }).single('image')

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  app.route('/products')
    .post(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      upload,
      middlewares.checkProductRestaurantOwnership,
      ProductValidation.create(),
      ProductController.create
    )

  app.route('/products/:productId')
    .put(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      upload,
      middlewares.checkProductOwnership,
      ProductValidation.update(),
      ProductController.update
    )
    .delete(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      middlewares.checkProductOwnership,
      ProductController.destroy
    )

  app.route('/products/popular')
    .get(
      ProductController.popular
    )
}
