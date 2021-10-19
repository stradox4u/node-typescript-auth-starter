"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const generateToken = (payload, key, expiry) => {
    return jsonwebtoken_1.default.sign(Object.assign({}, payload), key, { expiresIn: expiry });
};
exports.generateToken = generateToken;
const decodeToken = (token, secret) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        return decoded;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.decodeToken = decodeToken;
