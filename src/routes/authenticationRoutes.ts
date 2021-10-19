import { Router } from "express"

import passport from "../utils/passport"
import {
  patchVerifyEmail,
  postLogin,
  postLogout,
  postResendVerificationMail,
} from "../controllers/authController"
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

router.post(
  "/verify/resend/:userId",
  passport.authenticate("jwt", { session: false }),
  isOwner,
  postResendVerificationMail
)

router.patch("/verify/email", patchVerifyEmail)

export default router
