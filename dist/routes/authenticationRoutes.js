"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("../utils/passport"));
const authController_1 = require("../controllers/authController");
const router = (0, express_1.Router)();
router.post("/login", passport_1.default.authenticate("local", { session: false }), authController_1.postLogin);
exports.default = router;
