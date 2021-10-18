"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExpiry = void 0;
const getExpiry = () => {
    const date = new Date();
    const expiration = new Date(date.setDate(date.getDate() + 7));
    return expiration;
};
exports.getExpiry = getExpiry;
