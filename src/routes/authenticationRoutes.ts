import { Router } from "express"

import passport from "../utils/passport"
import { postLogin, postLogout } from "../controllers/authController"
import isOwner from "../middleware/isOwner"

const router = Router()

router.post(
  "/login",
  passport.authenticate("local", { session: false }),
  postLogin
)

router.post(
  "/logout/:userId",
  passport.authenticate("jwt", { session: false }),
  isOwner,
  postLogout
)

export default router
