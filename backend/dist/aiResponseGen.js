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
exports.generateAnswer = generateAnswer;
const genai_1 = require("@google/genai");
require("dotenv");
require('dotenv').config();
const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
function generateAnswer(_a) {
    return __awaiter(this, arguments, void 0, function* ({ question }) {
        console.log(question);
        const context = "Suppose you are a teacher, and student is asking you doubts they face , so reply in as simple terms as possible and be clear , reply as if a real lecture is going on currently";
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: `${context} , question is : ${question} and remember the maximum size should be 1800 characters , never ever reply with more than 1800 characters`,
        });
        console.log(response.text);
        return response.text;
    });
}
