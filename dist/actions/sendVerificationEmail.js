"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationMail = void 0;
const emailListeners_1 = __importDefault(require("../listeners/emailListeners"));
const jwtHelpers_1 = require("../utils/jwtHelpers");
const sendVerificationMail = (user) => {
    try {
        const token = (0, jwtHelpers_1.generateToken)({ userId: user.id }, process.env.VERIFY_JWT_SECRET, "10m");
        const verifyUrl = `${process.env.APP_FRONTEND_URL}/verify/email/?token=${token}`;
        emailListeners_1.default.emit("verifyEmail", {
            recipient: user.email,
            verifyLink: verifyUrl,
            name: user.name,
        });
    }
    catch (err) {
        throw err;
    }
};
exports.sendVerificationMail = sendVerificationMail;
