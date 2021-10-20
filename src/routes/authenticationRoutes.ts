import { Router } from "express"
import { body } from "express-validator"

import passport from "../utils/passport"
import {
  patchVerifyEmail,
  postLogin,
  postLogout,
  postPasswordReset,
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

router.post(
  "/password/reset",
  [
    body("email")
      .trim()
      .isString()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email!"),
  ],
  postPasswordReset
)

router.patch("/password/reset")

export default router
