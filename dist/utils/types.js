"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyError = void 0;
class MyError extends Error {
    constructor(title, statusCode, data) {
        super(title);
        Object.setPrototypeOf(this, MyError);
        this.statusCode = statusCode;
        this.data = data;
        this.title = title;
    }
}
exports.MyError = MyError;
