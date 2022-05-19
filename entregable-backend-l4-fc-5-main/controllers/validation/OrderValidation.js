const { check } = require('express-validator')
const models = require('../../models')
const Order = models.Order
const Product = models.Product

module.exports = {
  create: () => {
    return [
      check('products')
        .custom((value, { req }) => {
          let res = value !== undefined
          if (res) {
            res = res && value.length > 0
            if (res) {
              for (const product of value) {
                if (product?.quantity === 'undefined' || product.quantity < 1) {
                  return false
                }
              }
            }
          }
          return res
        })
        .withMessage('Order should have products, and all of them with quantity greater than zero'),
      check('products')
        .custom(async (value, { req }) => {
          try {
            for (const product of value) {
              const products = await Product.findByPk(product.productId)
              if (products === null) return Promise.reject(new Error('The product does not exist in the database'))
              if (products.restaurantId !== req.body.restaurantId) return Promise.reject(new Error('The product does not belong to the restaurant'))
            }
            return Promise.resolve('ok')
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  },
  confirm: () => {
    return [
      check('startedAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt']
              })
            if (order.startedAt) {
              return Promise.reject(new Error('The order has already been started'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  },
  send: () => {
    return [
      check('sentAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt', 'sentAt']
              })
            if (!order.startedAt) {
              return Promise.reject(new Error('The order is not started'))
            } else if (order.sentAt) {
              return Promise.reject(new Error('The order has already been sent'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  },
  deliver: () => {
    return [
      check('deliveredAt')
        .custom(async (value, { req }) => {
          try {
            const order = await Order.findByPk(req.params.orderId,
              {
                attributes: ['startedAt', 'sentAt', 'deliveredAt']
              })
            if (!order.startedAt) {
              return Promise.reject(new Error('The order is not started'))
            } else if (!order.sentAt) {
              return Promise.reject(new Error('The order is not sent'))
            } else if (order.deliveredAt) {
              return Promise.reject(new Error('The order has already been delivered'))
            } else {
              return Promise.resolve('ok')
            }
          } catch (err) {
            return Promise.reject(err)
          }
        })
    ]
  }
}
