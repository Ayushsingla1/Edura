"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifySignature = void 0;
const crypto_1 = __importDefault(require("crypto"));
require("dotenv");
require('dotenv').config();
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
console.log(CLERK_WEBHOOK_SECRET);
const verifySignature = (req) => {
    const signature = req.headers["clerk-signature"];
    const rawBody = JSON.stringify(req.body);
    const hmac = crypto_1.default.createHmac("sha256", CLERK_WEBHOOK_SECRET);
    hmac.update(rawBody);
    const expectedSignature = hmac.digest("hex");
    return signature === expectedSignature;
};
exports.verifySignature = verifySignature;
