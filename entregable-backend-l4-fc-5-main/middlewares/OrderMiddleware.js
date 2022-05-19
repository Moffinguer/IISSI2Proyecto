'use strict'
const models = require('../models')
const Order = models.Order
const Restaurant = models.Restaurant

const checkOrderOwnership = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId, {
      include: {
        model: Restaurant,
        as: 'restaurant'
      }
    })
    if (req.user.id === order.restaurant.userId) {
      return next()
    } else {
      return res.status(403).send('Not enough privileges. This entity does not belong to you')
    }
  } catch (err) {
    return res.status(404).send(err)
  }
}

const checkOrderCustomer = async (req, res, next) => {
  try {
    const order = await Order.findByPk(req.params.orderId)
    if (req.user.id === order.userId) {
      return next()
    } else {
      return res.status(403).send('It doesnt exist that customer')
    }
  } catch (err) {
    return res.status(404).send(err)
  }
}

const checkOrderVisible = (req, res, next) => {
  if (req.user.userType === 'owner') {
    checkOrderOwnership(req, res, next)
  } else if (req.user.userType === 'customer') {
    checkOrderCustomer(req, res, next)
  }
}

module.exports = {
  checkOrderOwnership: checkOrderOwnership,
  checkOrderCustomer: checkOrderCustomer,
  checkOrderVisible: checkOrderVisible
}
