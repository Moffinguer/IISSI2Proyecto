'use strict'
const UserValidation = require('../controllers/validation/UserValidation')
const UserController = require('../controllers/UserController')
const RestaurantController = require('../controllers/RestaurantController')
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fs = require('fs')
    fs.mkdirSync(process.env.AVATARS_FOLDER, { recursive: true })
    cb(null, process.env.AVATARS_FOLDER)
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString(36).substring(7) + '-' + Date.now() + '.' + file.originalname.split('.').pop())
  }
})
const upload = multer({ storage: storage }).single('file')

module.exports = (options) => {
  const app = options.app
  const middlewares = options.middlewares

  app.route('/users')
    .put(
      middlewares.isLoggedIn,
      upload,
      UserValidation.update(),
      UserController.update)
    .delete(
      middlewares.isLoggedIn,
      UserController.destroy)

  app.route('/users/register')
    .post(
      upload,
      UserValidation.create(),
      UserController.registerCustomer)
  app.route('/users/registerOwner')
    .post(
      upload,
      UserValidation.create(),
      UserController.registerOwner)
  app.route('/users/login')
    .post(
      UserValidation.login(),
      UserController.login)

  app.route('/users/myRestaurants')
    .get(
      middlewares.isLoggedIn,
      middlewares.hasRole('owner'),
      RestaurantController.indexOwner
    )
  app.route('/users/isTokenValid')
    .put(UserController.isTokenValid)

  app.route('/users/:userId')
    .get(
      middlewares.isLoggedIn,
      UserController.show)
}
