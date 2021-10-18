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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = require('../../models');
exports.default = (input) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPw = yield bcryptjs_1.default.hash(input.password, 12);
        const newUser = yield db.User.create({
            name: input.name,
            email: input.email,
            password: hashedPw
        });
        return newUser;
    }
    catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        return err;
    }
});
