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
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = __importDefault(require("./middleware"));
require("dotenv");
const transcribe_1 = require("./transcribe");
const prisma = new client_1.PrismaClient({});
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.post('/api/v1/add-lecture', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, courseId, description, educatorId } = req.body;
    try {
        const uploaded = yield prisma.lecture.create({
            data: {
                url,
                courseId,
                description,
                educatorId,
                transcription: "",
            }
        });
        console.log(uploaded);
        res.status(200).json({
            msg: "Lecture uploaded successfully"
        });
    }
    catch (e) {
        console.log(e);
        res.status(501).json({
            msg: `Failed to upload lecture. Try again later`
        });
    }
}));
app.get('/api/v1/get-notes', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.lectureid;
    try {
        const result = yield prisma.lecture.findUnique({
            where: {
                id
            }
        });
        console.log(result);
        if ((result === null || result === void 0 ? void 0 : result.transcription.length) !== 0) {
            res.status(200).json({
                transcription: result === null || result === void 0 ? void 0 : result.transcription
            });
            return;
        }
        if (result === null || result === void 0 ? void 0 : result.url) {
            const response = yield (0, transcribe_1.transcribeUrl)(result === null || result === void 0 ? void 0 : result.url);
            console.log("hi there result received");
            console.log(response === null || response === void 0 ? void 0 : response.results.channels[0].alternatives[0].transcript);
            const upload = yield prisma.lecture.update({
                where: {
                    id
                },
                data: {
                    transcription: response === null || response === void 0 ? void 0 : response.results.channels[0].alternatives[0].transcript
                }
            });
            res.status(200).json({
                msg: "transcript generated and saved successfully",
                data: response === null || response === void 0 ? void 0 : response.results.channels[0].alternatives[0].transcript
            });
        }
    }
    catch (e) {
        console.log(e);
        res.status(501).json({
            msg: "Unable to get notes currently",
        });
    }
}));
app.get('api/v1/get-course', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courseId = parseInt(req.query.courseId);
    try {
        const result = yield prisma.courses.findUnique({
            where: {
                courseId
            },
            include: {
                lectures: true
            }
        });
        console.log(result);
        res.status(200).json({
            lectures: result
        });
    }
    catch (error) {
        res.status(501).json({
            msg: "Please try again later"
        });
        console.log(error);
    }
}));
app.get('/api/v1/get-lecture', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const result = yield prisma.lecture.findUnique({
            where: {
                id
            }
        });
        // console.log(result)
        res.status(200).json({
            url: result === null || result === void 0 ? void 0 : result.url,
            courseId: result === null || result === void 0 ? void 0 : result.courseId
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({
            msg: "Lecture not found"
        });
    }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
