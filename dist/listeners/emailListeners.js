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
const events_1 = require("events");
const mail_1 = __importDefault(require("@sendgrid/mail"));
mail_1.default.setApiKey(process.env.SENDGRID_API_KEY);
const sender = process.env.SENDGRID_SENDER_EMAIL;
const eventEmitter = new events_1.EventEmitter();
eventEmitter.on("verifyEmail", (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to: inputs.recipient,
        from: sender,
        templateId: process.env.VERIFY_EMAIL_TEMPLATE_ID,
        dynamicTemplateData: {
            name: inputs.name,
            verifyLink: inputs.verifyLink,
        },
    };
    try {
        const sentMail = yield mail_1.default.send(msg);
        if (sentMail) {
            console.log("Email sent!");
        }
    }
    catch (err) {
        console.log(err);
    }
}));
eventEmitter.on("resetPassword", (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to: inputs.recipient,
        from: sender,
        templateId: process.env.RESET_PASSWORD_TEMPLATE_ID,
        dynamicTemplateData: {
            name: inputs.name,
            resetLink: inputs.resetLink,
        },
    };
    try {
        const sentMail = yield mail_1.default.send(msg);
        if (sentMail) {
            console.log("Email sent!");
        }
    }
    catch (err) {
        console.log(err);
    }
}));
eventEmitter.on("passwordUpdated", (inputs) => __awaiter(void 0, void 0, void 0, function* () {
    const msg = {
        to: inputs.recipient,
        from: sender,
        templateId: process.env.UPDATED_PASSWORD_TEMPLATE_ID,
        dynamicTemplateData: {
            name: inputs.name,
        },
    };
    try {
        const sentMail = yield mail_1.default.send(msg);
        if (sentMail) {
            console.log("Email sent!");
        }
    }
    catch (err) {
        console.log(err);
    }
}));
exports.default = eventEmitter;
