import { Router } from 'express'
import { body } from 'express-validator'

const db = require('../../models')

import { postRegisterUser } from '../controllers/registerController'
import { UserType } from "../utils/types"

const router = Router()

router.post(
  "/user",
  [
    body("name")
      .trim()
      .isString()
      .custom((val, { req }) => {
        if (!val.match(/(\w.+\s).+/i)) {
          throw new Error("Please enter your full name!")
        }
        return true
      })
      .isLength({ min: 4 })
      .withMessage("Name must be min. 4 characters!")
      .escape(),
    body("email")
      .trim()
      .isString()
      .isEmail()
      .normalizeEmail()
      .withMessage("Invalid email!")
      .custom((val, { req }) => {
        return db.User.findOne({
          where: { email: val },
        }).then((user: UserType) => {
          if (user) {
            return Promise.reject("Email is already taken!")
          }
        })
      }),
    body("password")
      .trim()
      .isString()
      .isLength({ min: 8 })
      .withMessage("Password must be min. 8 characters!"),
    body("confirm_password").custom((val, { req }) => {
      if (val !== req.body.password) {
        throw new Error("Passwords do not match!")
      }
      return true
    }),
  ],
  postRegisterUser
)

export default router