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
exports.transcribeUrl = void 0;
require("dotenv");
const sdk_1 = require("@deepgram/sdk");
const transcribeUrl = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const deepgram = (0, sdk_1.createClient)(process.env.DEEPGRAM_API_KEY);
    const { result, error } = yield deepgram.listen.prerecorded.transcribeUrl({
        url,
    }, {
        model: "nova-3",
        smart_format: true,
    });
    if (error)
        throw error;
    if (!error) {
        return result;
    }
});
exports.transcribeUrl = transcribeUrl;
