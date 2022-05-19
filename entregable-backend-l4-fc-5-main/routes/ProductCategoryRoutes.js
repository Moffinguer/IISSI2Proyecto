'use strict'
const models = require('../models')
const ProductCategory = models.ProductCategory

module.exports = (options) => {
  const app = options.app

  app.route('/productCategories')
    .get(async (req, res, next) => {
      try {
        const productCategories = await ProductCategory.findAll()
        res.json(productCategories)
      } catch (err) {
        res.status(500).send(err)
      }
    })
}
