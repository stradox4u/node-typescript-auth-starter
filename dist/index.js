"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('dotenv').config();
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("./utils/passport"));
const database_1 = __importDefault(require("./utils/database"));
const registerRoutes_1 = __importDefault(require("./routes/registerRoutes"));
const port = process.env.APP_PORT;
const routePrefix = '/api/v1';
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    methods: 'GET,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type,Authorization'
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use(passport_1.default.initialize());
app.use(`${routePrefix}/register`, registerRoutes_1.default);
app.use((error, req, res, next) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({
        message,
        data
    });
});
const checkDbConn = () => {
    return database_1.default.authenticate()
        .then((connection) => {
        console.log('Connection to database successful!');
    })
        .catch((err) => {
        console.log('Unable to connect to database!');
    });
};
checkDbConn();
app.listen(port);
