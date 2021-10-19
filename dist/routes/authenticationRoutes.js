"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../utils/passport"));
const authController_1 = require("../controllers/authController");
const isOwner_1 = __importDefault(require("../middleware/isOwner"));
const router = (0, express_1.Router)();
router.post("/login", passport_1.default.authenticate("local", { session: false }), authController_1.postLogin);
router.post("/logout/:userId", passport_1.default.authenticate("jwt", { session: false }), isOwner_1.default, authController_1.postLogout);
router.post("/verify/resend/:userId", passport_1.default.authenticate("jwt", { session: false }), isOwner_1.default, authController_1.postResendVerificationMail);
router.patch("/verify/email", authController_1.patchVerifyEmail);
exports.default = router;
