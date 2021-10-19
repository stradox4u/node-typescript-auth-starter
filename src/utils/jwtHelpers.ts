import jwt from 'jsonwebtoken'

export const generateToken = (payload: object, key: string, expiry: string): string|Error => {
  return jwt.sign({...payload}, key, {expiresIn: expiry})
}

export const decodeToken = (token: string, secret:string): string|jwt.JwtPayload|Error => {
  try {
    const decoded = jwt.verify(token, secret)
    return decoded
  } catch (err) {
    console.log(err)
    throw err
  }
}