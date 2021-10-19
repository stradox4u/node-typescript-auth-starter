"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patchVerifyEmail = exports.postResendVerificationMail = exports.postLogout = exports.postLogin = void 0;
const sequelize_1 = require("sequelize");
const sendVerificationEmail_1 = __importDefault(require("src/actions/sendVerificationEmail"));
const jwtHelpers_1 = require("src/utils/jwtHelpers");
const db = require("../../models");
const loginUser_1 = __importDefault(require("../actions/loginUser"));
const cookieHelpers_1 = require("../utils/cookieHelpers");
const types_1 = require("../utils/types");
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, refreshToken } = (0, loginUser_1.default)(req.user);
        const expiry = (0, cookieHelpers_1.getExpiry)();
        const user = {
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        };
        res
            .cookie("refresh_cookie", refreshToken, {
            expires: expiry,
            httpOnly: true,
            // sameSite: "None",
            secure: true,
        })
            .status(200)
            .json({
            token: token,
            expires_in: 600000,
            user: user,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
});
exports.postLogin = postLogin;
const postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield db.User.update({
            blacklisted_tokens: sequelize_1.Sequelize.fn("array_append", sequelize_1.Sequelize.col("blacklisted_tokens"), req.cookies.refresh_cookie),
        }, {
            where: { id: req.user.id },
            returning: true,
        });
        if (!user[1][0].dataValues) {
            const error = new types_1.MyError("User not found", 404);
            throw error;
        }
        req.logout();
        res.status(200).json({
            message: "Logged out",
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
});
exports.postLogout = postLogout;
const postResendVerificationMail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, sendVerificationEmail_1.default)(req.user);
        res.status(200).json({
            message: "Verification email resent successfully",
        });
    }
    catch (err) {
        if (!err.statuscode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
});
exports.postResendVerificationMail = postResendVerificationMail;
const patchVerifyEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = req.body.token;
        const decodedToken = (0, jwtHelpers_1.decodeToken)(token, process.env.VERIFY_JWT_SECRET);
        const userId = decodedToken.userId;
        const updatedUser = yield db.User.update({
            email_verified_at: new Date(),
        }, {
            where: { id: userId },
            returning: true,
        });
        if (!updatedUser[1][0].dataValues) {
            const error = new types_1.MyError("Verification failed", 500);
            throw error;
        }
        res.status(200).json({
            message: "Email successfully verified",
            user: updatedUser[1][0].dataValues,
        });
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
        return err;
    }
});
exports.patchVerifyEmail = patchVerifyEmail;
