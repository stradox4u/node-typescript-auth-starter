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
exports.postRegisterUser = void 0;
const express_validator_1 = require("express-validator");
const createUser_1 = __importDefault(require("../actions/createUser"));
const sendVerificationEmail_1 = __importDefault(require("../actions/sendVerificationEmail"));
function postRegisterUser(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const error = new Error('Validation failed!');
                const errorToThrow = {
                    error,
                    statusCode: 422,
                    data: errors
                };
                throw errorToThrow;
            }
            const body = req.body;
            const user = yield (0, createUser_1.default)(body);
            (0, sendVerificationEmail_1.default)(user);
            res.status(201).json({
                message: 'User created successfully!',
                user: user
            });
        }
        catch (err) {
            next(err);
        }
    });
}
exports.postRegisterUser = postRegisterUser;
