import { NextFunction } from 'express'
import { validationResult } from 'express-validator'

import { errorType, registerUserBody } from '../utils/types'
import createUser from '../actions/createUser'
import sendVerificationMail from '../actions/sendVerificationEmail'

export async function postRegisterUser(req: any, res: any, next: NextFunction) {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed!')
      const errorToThrow: errorType = {
        error,
        statusCode: 422,
        data: errors
      }
      throw errorToThrow
    }
    const body: registerUserBody = req.body

    const user = await createUser(body)

    sendVerificationMail(user)

    res.status(201).json({
      message: 'User created successfully!',
      user: user
    })
  } catch (err: any) {
    next(err)
  }
}