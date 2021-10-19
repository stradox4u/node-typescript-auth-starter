const db = require("../../models")
import { decodeToken } from "../utils/jwtHelpers"

export default async () => {
  const allUsers = await db.User.findAll()

  allUsers.forEach(async (user: any) => {
    const filtered: string[] = user.blacklisted_tokens.filter(
      (token: string | null) => token !== null
    )
    filtered!.forEach((token: string, index: number) => {
      try {
        const decodedToken = decodeToken(token, process.env.REFRESH_JWT_SECRET!)
        if (decodedToken) {
          return
        }
      } catch (err: any) {
        if (err.message === "jwt expired") {
          filtered!.splice(index, 1)
        }
      }
    })
    user.blacklisted_tokens = filtered
    await user.save()
    console.log(user.blacklisted_tokens)
  })
}
