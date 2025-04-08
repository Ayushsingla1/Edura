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
exports.generateQuizFromTranscript = void 0;
const genai_1 = require("@google/genai");
require("dotenv");
require('dotenv').config();
const generateQuizFromTranscript = (options) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { transcript, numQuestions = 5 } = options;
    console.log(options);
    if (!transcript || !process.env.GEMINI_API_KEY) {
        throw new Error('Transcript and API key are required');
    }
    const ai = new genai_1.GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const cleanedTranscript = transcript
        .replace(/\s+/g, ' ')
        .replace(/\[\d{2}:\d{2}:\d{2}\]/g, '')
        .trim();
    const truncatedTranscript = cleanedTranscript.substring(0, 8000);
    const prompt = `
      Based on the following lecture transcript, generate ${numQuestions} quiz questions.
      Include a mix of multiple-choice, true/false.
      For each question, provide the correct answer and explanation.
      
      TRANSCRIPT:
      ${truncatedTranscript}
      
      FORMAT YOUR RESPONSE AS JSON with the following structure:
      {
        "questions": [
          {
            "question": "Question text here",
            "type": "multiple-choice|true-false",
            "options": ["Option A", "Option B", "Option C", "Option D"], 
            "correctAnswer": "The correct answer",
            "explanation": "Brief explanation of why this is correct"
          }
        ]
      }
    `;
    console.log(prompt);
    try {
        const response = yield ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
        });
        // console.log(response.text?.substring(7,response.text.length-3));
        //@ts-ignore
        const jsonMatch = (_a = response.text) === null || _a === void 0 ? void 0 : _a.substring(7, response.text.length - 3);
        if (!jsonMatch) {
            throw new Error('Could not extract JSON from API response');
        }
        const parsedQuiz = JSON.parse(jsonMatch);
        console.log(parsedQuiz);
        return {
            title: "Generated Lecture Quiz",
            generatedAt: new Date().toISOString(),
            totalQuestions: parsedQuiz.questions.length,
            questions: parsedQuiz.questions,
            success: true
        };
    }
    catch (error) {
        return { success: false };
    }
});
exports.generateQuizFromTranscript = generateQuizFromTranscript;
