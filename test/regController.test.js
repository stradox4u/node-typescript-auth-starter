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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const { postRegisterUser } = require("../dist/controllers/registerController");
const db = require("../models");
describe("Registration Controller", () => {
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.User.destroy({
            truncate: true
        });
    }));
    it("Is able to register a new user", () => __awaiter(void 0, void 0, void 0, function* () {
        const req = {
            body: {
                name: "Test User",
                email: "test@test.com",
                password: "password",
                confirm_password: "password",
            },
        };
        yield postRegisterUser(req, {}, () => { });
        const user = yield db.User.findOne({
            where: { name: 'Test User' }
        });
        (0, chai_1.expect)(user.dataValues.name).to.equal('Test User');
        (0, chai_1.expect)(user.dataValues.email).to.equal('test@test.com');
    }));
});
