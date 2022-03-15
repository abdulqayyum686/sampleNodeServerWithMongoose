const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Administration = require('../models/query')
const saltRounds = 10

// remove c
module.exports.AdministrationsLogin = (req, res, next) => {
  console.log(req.body)
  const { userName, password } = req.body

  Administration.findOne({ userName: userName })
    .exec()
    .then(async (foundObject) => {
      console.log('ali', foundObject)
      if (foundObject) {
        await bcrypt.compare(
          password,
          foundObject.password,
          async (err, newResult) => {
            if (err) {
              return res.status(501).json({ error, err })
            } else {
              if (newResult) {
                const token = jwt.sign(
                  { ...foundObject.toObject(), password: '' },
                  'secret',
                  {
                    expiresIn: '5d',
                  },
                )

                return res.status(200).json({
                  token: token,
                })
              } else {
                return res.status(401).json({
                  message: 'invalid password',
                })
              }
            }
          },
        )
      } else {
        return res.status(404).json({
          message: 'UserName Invalid',
        })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      })
    })
}

module.exports.AdministrationSignup = (req, res, next) => {
  console.log(req.body)
  const { userName, password } = req.body

  Administration.findOne({ userName: userName })
    .exec()
    .then(async (foundObject) => {
      if (foundObject) {
        return res.status(403).json({
          message: 'UserName Already exist',
        })
      } else {
        await bcrypt.hash(password, saltRounds, (err, hash) => {
          if (err) {
            console.log(' error: ', err)
            return res.status(500).json({ error: err })
          } else {
            let newAdmin = new Administration({
              userName: userName,
              password: hash,
              admin: true,
            })

            newAdmin
              .save()
              .then(async (savedObject) => {
                console.log('savedObject', savedObject)

                const token = jwt.sign(
                  { ...savedObject.toObject(), password: '' },
                  'secret',
                  {
                    expiresIn: '5d',
                  },
                )

                return res.status(201).json({
                  message: 'sign up successful',
                  token: token,
                })
              })
              .catch((err) => {
                console.log('Not saved', err)
                res.status(500).json({
                  error: err,
                })
              })
          }
        })
      }
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      })
    })
}

module.exports.getAllOrders = (req, res, next) => {
  console.log('assignDriver', req.body)
  Order.find()
    .populate('customerId')
    .populate('driverId')
    .exec()
    .then((data) => {
      req.io.emit('broadcast', { message: 'Data Sent' })
      return res.status(200).json(data)
    })
    .catch((err) => {
      return res.status(500).json({
        error: err,
      })
    })
}

