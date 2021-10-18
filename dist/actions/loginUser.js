"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtHelpers_1 = require("../utils/jwtHelpers");
const createTokens = (user) => {
    const token = (0, jwtHelpers_1.generateToken)({ userId: user.id }, process.env.ACCESS_JWT_SECRET, "10m");
    const refreshToken = (0, jwtHelpers_1.generateToken)({ userId: user.id }, process.env.REFRESH_JWT_SECRET, "7d");
    return {
        token,
        refreshToken,
    };
};
exports.default = createTokens;
