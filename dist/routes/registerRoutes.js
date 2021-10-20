"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const db = require('../../models');
const registerController_1 = require("../controllers/registerController");
const router = (0, express_1.Router)();
router.post("/user", [
    (0, express_validator_1.body)("name")
        .trim()
        .isString()
        .custom((val, { req }) => {
        if (!val.match(/(\w.+\s).+/i)) {
            throw new Error("Please enter your full name!");
        }
        return true;
    })
        .isLength({ min: 4 })
        .withMessage("Name must be min. 4 characters!")
        .escape(),
    (0, express_validator_1.body)("email")
        .trim()
        .isString()
        .isEmail()
        .normalizeEmail()
        .withMessage("Invalid email!")
        .custom((val, { req }) => {
        return db.User.findOne({
            where: { email: val },
        }).then((user) => {
            if (user) {
                return Promise.reject("Email is already taken!");
            }
        });
    }),
    (0, express_validator_1.body)("password")
        .trim()
        .isString()
        .isLength({ min: 8 })
        .withMessage("Password must be min. 8 characters!"),
    (0, express_validator_1.body)("confirm_password").custom((val, { req }) => {
        if (val !== req.body.password) {
            throw new Error("Passwords do not match!");
        }
        return true;
    }),
], registerController_1.postRegisterUser);
exports.default = router;
