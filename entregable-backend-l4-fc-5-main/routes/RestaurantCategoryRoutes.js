'use strict'
const models = require('../models')
const RestaurantCategory = models.RestaurantCategory

module.exports = (options) => {
  const app = options.app

  app.route('/restaurantCategories')
    .get(async (req, res, next) => {
      try {
        const restaurantCategories = await RestaurantCategory.findAll()
        res.json(restaurantCategories)
      } catch (err) {
        res.status(500).send(err)
      }
    })
}
