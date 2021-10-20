import { NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { MyError, RegisterUserBodyInterface } from "../utils/types"
import createUser from "../actions/createUser"
import { sendVerificationMail } from "../actions/sendEmails"

export async function postRegisterUser(req: any, res: any, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new MyError("Validation failed!", 422, errors)

      throw error
    }
    const body: RegisterUserBodyInterface = req.body

    const user = await createUser(body)

    sendVerificationMail(user)

    res.status(201).json({
      message: "User created successfully!",
      user: user,
    })
  } catch (err: any) {
    next(err)
  }
}