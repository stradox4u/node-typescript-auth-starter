import { Router } from "express"

import passport from "../utils/passport"
import { postLogin } from "../controllers/authController"

const router = Router()

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  postLogin
)

export default router
