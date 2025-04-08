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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = __importDefault(require("./middleware"));
require("dotenv");
const transcribe_1 = require("./transcribe");
const svix_1 = require("svix");
const ethers_1 = require("ethers");
const contractDetails_1 = require("./contractDetails");
const prismaClient_1 = require("./prismaClient");
const handler_1 = require("./handler");
const aiResponseGen_1 = require("./aiResponseGen");
const textToSpeech_1 = require("./textToSpeech");
const quizGenerations_1 = require("./quizGenerations");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
const provider = new ethers_1.ethers.JsonRpcProvider("https://rpc.open-campus-codex.gelato.digital");
const contract = new ethers_1.ethers.Contract(contractDetails_1.contractAddress, contractDetails_1.ABI, provider);
const wallet = new ethers_1.ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract2 = new ethers_1.ethers.Contract(contractDetails_1.contractAddress, contractDetails_1.ABI, wallet);
let lastCheckedBlock;
function pollEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        if (!lastCheckedBlock)
            lastCheckedBlock = yield provider.getBlockNumber();
        try {
            const currentBlock = yield provider.getBlockNumber();
            if (lastCheckedBlock === currentBlock)
                return;
            const courseCreatedLogs = yield provider.getLogs(Object.assign(Object.assign({ address: contractDetails_1.contractAddress }, contract.filters.CourseCreated()), { fromBlock: lastCheckedBlock + 1, toBlock: currentBlock }));
            if (courseCreatedLogs) {
                for (const log of courseCreatedLogs) {
                    const parsed = contract.interface.parseLog(log);
                    console.log(parsed);
                    console.log(parsed === null || parsed === void 0 ? void 0 : parsed.args);
                    if (parsed && parsed.name === 'CourseCreated') {
                        const { name, courseId, educatorName, createdAt, courseCreator } = parsed.args;
                        console.log("📘 CourseCreated:", {
                            name,
                            courseId: Number(courseId),
                            educatorName,
                            createdAt,
                            courseCreator,
                        });
                        yield (0, handler_1.createCourse)({
                            courseId: Number(courseId),
                            name,
                            courseCreator,
                            educatorName,
                        });
                    }
                }
            }
            // --- CoursePurchased ---
            const purchasedLogs = yield provider.getLogs(Object.assign(Object.assign({}, contract.filters.CoursePurchased()), { fromBlock: lastCheckedBlock + 1, toBlock: currentBlock }));
            // console.log(purchasedLogs);
            if (purchasedLogs) {
                for (const log of purchasedLogs) {
                    const parsed = contract.interface.parseLog(log);
                    console.log(parsed);
                    if (parsed && parsed.name === 'CoursePurchased') {
                        const { purchaser, courseId, courseCreator, amount } = parsed.args;
                        console.log("💸 CoursePurchased:", {
                            purchaser,
                            courseId: Number(courseId),
                            courseCreator,
                            amount: Number(amount),
                        });
                        yield (0, handler_1.CoursePurchased)({
                            purchaser,
                            courseId: Number(courseId),
                            courseCreator,
                            amount: Number(amount),
                        });
                    }
                }
            }
            lastCheckedBlock = currentBlock;
        }
        catch (error) {
            console.error("Polling error:", error);
        }
    });
}
setInterval(pollEvents, 10000);
app.post('/api/v1/add-lecture', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { url, courseId, description, educatorId, name } = req.body;
    try {
        const uploaded = yield prismaClient_1.prisma.lecture.create({
            data: {
                url,
                courseId,
                description,
                educatorId,
                name
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
    const id = req.query.id;
    try {
        const result = yield prismaClient_1.prisma.lecture.findUnique({
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
            const upload = yield prismaClient_1.prisma.lecture.update({
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
app.get('/api/v1/get-course-lectures', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req);
    const courseId = parseInt(req.query.courseId);
    console.log(courseId);
    try {
        const result = yield prismaClient_1.prisma.courses.findUnique({
            where: {
                courseId
            },
            include: {
                lectures: true
            }
        });
        console.log(result);
        res.status(200).json({
            lectures: result === null || result === void 0 ? void 0 : result.lectures
        });
    }
    catch (error) {
        res.status(501).json({
            msg: "Please try again later"
        });
        console.log(error);
    }
}));
app.post('/api/v1/speech', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { question } = yield req.body;
        console.log(question);
        // Generate text response
        const textResponse = yield (0, aiResponseGen_1.generateAnswer)({ question });
        if (textResponse === undefined) {
            res.status(501).json({
                msg: "error unable to process currently"
            });
            return;
        }
        // Generate audio from text
        const audioBuffer = yield (0, textToSpeech_1.getAudio)({ text: textResponse });
        console.log(audioBuffer);
        // Convert audio buffer to base64 for JSON response
        //@ts-ignore
        const audioBase64 = audioBuffer.toString('base64');
        // Send both text and audio in JSON response
        res.status(200).json({
            text: textResponse,
            audio: audioBase64,
            audioContentType: 'audio/wav'
        });
    }
    catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
}));
app.get('/api/v1/get-lecture', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    try {
        const result = yield prismaClient_1.prisma.lecture.findUnique({
            where: {
                id
            },
            include: {
                course: true
            }
        });
        res.status(200).json({
            lecture: Object.assign({}, result)
        });
    }
    catch (e) {
        console.log(e);
        res.status(404).json({
            msg: "Lecture not found"
        });
    }
}));
app.post("/webhook/clerk", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const headers = req.headers;
    const body = JSON.stringify(payload);
    console.log(headers);
    const svix_id = headers['svix-id'];
    const svix_timestamp = headers['svix-timestamp'];
    const svix_signature = headers['svix-signature'];
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        });
    }
    const wh = new svix_1.Webhook(CLERK_WEBHOOK_SECRET);
    let evt;
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        });
    }
    catch (err) {
        console.error("Webhook verification failed:", err);
        return res.status(400).json({ error: "Invalid signature" });
    }
    try {
        if (evt.type === "user.created") {
            const result = yield prismaClient_1.prisma.user.create({
                data: {
                    id: evt.data.web3_wallets[0].web3_wallet
                }
            });
            res.status(200).json({ received: true, result });
        }
    }
    catch (e) {
        console.log(e);
        res.status(501).json({
            msg: "user unable to create"
        });
    }
}));
app.post('/api/v1/get-quiz', middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transcript } = req.body;
    const result = yield (0, quizGenerations_1.generateQuizFromTranscript)({ transcript });
    console.log(result);
    if (result.success) {
        res.status(200).json(result);
        return;
    }
    else {
        res.status(501).json({
            msg: "Unable to laod currently"
        });
    }
}));
app.get('api/v1/verify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userAddress } = req.query;
        const result = yield contract2.unlockAmount(userAddress);
        console.log(result);
        res.status(200).json({ result });
        return;
    }
    catch (error) {
        console.log(error);
        res.status(501).json({
            msg: "Error while verifying"
        });
        return;
    }
}));
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
