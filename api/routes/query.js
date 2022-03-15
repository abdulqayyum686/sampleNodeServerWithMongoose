const express = require('express')
const router = express.Router()
const queryController = require('../controllers/query')

function queryRouter(io) {
  function ioMiddleware(req, res, next) {
    ;(req.io = io), next()
  }
  io.on('connection', (socket) => {
    socket.emit('request', { data: 'Socket connected' })
    socket.on('reply', (data) => {
      console.log('admin routes => ', data)
    })
  })

  router.post(
    '/adminlogin',
    ioMiddleware,
    queryController.AdministrationSignup,
  )
  router.post(
    '/adminsignup',
    ioMiddleware,
    queryController.AdministrationSignup,
  )
  router.get(
    '/getAllOrders',
    ioMiddleware,
    queryController.getAllOrders,
  )
  
  return router
}

let queryRouterFile = {
  router: router,
  queryRouter: queryRouter,
}
module.exports = queryRouterFile
