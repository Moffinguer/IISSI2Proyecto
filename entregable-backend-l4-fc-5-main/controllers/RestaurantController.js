'use strict'
const models = require('../models')
const Restaurant = models.Restaurant
const Product = models.Product
const RestaurantCategory = models.RestaurantCategory
const ProductCategory = models.ProductCategory
const { validationResult } = require('express-validator')

exports.index = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId'],
        include:
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      },
        order: [[{ model: RestaurantCategory, as: 'restaurantCategory' }, 'name', 'ASC']]
      }
    )
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.indexOwner = async function (req, res) {
  try {
    const restaurants = await Restaurant.findAll(
      {
        attributes: ['id', 'name', 'description', 'address', 'postalCode', 'url', 'shippingCosts', 'averageServiceMinutes', 'email', 'phone', 'logo', 'heroImage', 'status', 'restaurantCategoryId'],
        where: { userId: req.user.id }
      })
    res.json(restaurants)
  } catch (err) {
    res.status(500).send(err)
  }
}

exports.create = async function (req, res) {
  const err = validationResult(req)

  if (err.errors.length > 0) {
    res.status(422).send(err)
  } else {
    const newRestaurant = Restaurant.build(req.body)
    newRestaurant.userId = req.user.id // usuario actualmente autenticado

    if (typeof req.files?.heroImage !== 'undefined') {
      newRestaurant.heroImage = req.files.heroImage[0].path
    }
    if (typeof req.files?.logo !== 'undefined') {
      newRestaurant.logo = req.files.logo[0].path
    }
    try {
      const restaurant = await newRestaurant.save()
      res.json(restaurant)
    } catch (err) {
      if (err.name.includes('ValidationError')) {
        res.status(422).send(err)
      } else {
        res.status(500).send(err)
      }
    }
  }
}

exports.show = async function (req, res) {
  // Only returns PUBLIC information of restaurants
  try {
    const restaurant = await Restaurant.findByPk(req.params.restaurantId, {
      attributes: { exclude: ['userId'] },
      include: [{
        model: Product,
        as: 'products',
        order: [['order', 'ASC']],
        include: { model: ProductCategory, as: 'productCategory' }
      },
      {
        model: RestaurantCategory,
        as: 'restaurantCategory'
      }]
    }
    )
    res.json(restaurant)
  } catch (err) {
    res.status(404).send(err)
  }
}

exports.update = async function (req, res) {
  const err = validationResult(req)
  if (err.errors.length > 0) {
    res.status(422).send(err)
  } else {
    if (typeof req.files?.heroImage !== 'undefined') {
      req.body.heroImage = req.files.heroImage[0].path
    }
    if (typeof req.files?.logo !== 'undefined') {
      req.body.logo = req.files.logo[0].path
    }
    try {
      await Restaurant.update(req.body, { where: { id: req.params.restaurantId } })
      const updatedRestaurant = await Restaurant.findByPk(req.params.restaurantId)
      res.json(updatedRestaurant)
    } catch (err) {
      res.status(404).send(err)
    }
  }
}

exports.destroy = async function (req, res) {
  try {
    const result = await Restaurant.destroy({ where: { id: req.params.restaurantId } })
    let message = ''
    if (result === 1) {
      message = 'Sucessfuly deleted.'
    } else {
      message = 'Could not delete restaurant.'
    }
    res.json(message)
  } catch (err) {
    res.status(500).send(err)
  }
}
