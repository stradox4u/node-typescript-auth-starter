"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_jwt_2 = require("passport-jwt");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = require("../../models");
const LocalStrategy = passport_local_1.default.Strategy;
const JwtStrategy = passport_jwt_1.default.Strategy;
passport_1.default.use(new LocalStrategy({
    usernameField: "email",
    passwordField: "password",
}, function (username, password, done) {
    return db.User.findOne({
        where: { email: username },
    })
        .then((user) => {
        if (!user) {
            return done(null, false, { message: "Incorrect email!" });
        }
        return bcryptjs_1.default.compare(password, user.password).then((result) => {
            if (!result) {
                return done(null, false, { message: "Incorrect password!" });
            }
            return done(null, user);
        });
    })
        .catch((err) => {
        return done(err);
    });
}));
passport_1.default.use(new JwtStrategy({
    jwtFromRequest: passport_jwt_2.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.ACCESS_JWT_SECRET,
}, function (jwt_payload, done) {
    return db.User.findOne({
        where: { id: jwt_payload.userId },
    })
        .then((user) => {
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
        }
    })
        .catch((err) => {
        return done(err, false);
    });
}));
exports.default = passport_1.default;
