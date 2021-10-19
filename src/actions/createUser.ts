import bcrypt from 'bcryptjs'
import { RegisterUserBodyInterface, UserInterface } from "../utils/types"

const db = require("../../models")

export default async (
  input: RegisterUserBodyInterface
): Promise<UserInterface> => {
  try {
    const hashedPw = await bcrypt.hash(input.password, 12)

    const newUser = await db.User.create({
      name: input.name,
      email: input.email,
      password: hashedPw,
    })

    return newUser
  } catch (err: any) {
    if (!err.statusCode) {
      err.statusCode = 500
    }
    return err
  }
}