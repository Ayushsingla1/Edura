import express from "express"
import cors from "cors"
import middleWare from "./middleware";
import 'dotenv'
import { transcribeUrl } from "./transcribe";
import { Webhook } from "svix";
import { ethers } from "ethers"
import { contractAddress, ABI } from "./contractDetails";
import { prisma } from "./prismaClient";
import { CoursePurchased, createCourse } from "./handler";
import { generateAnswer } from "./aiResponseGen";
import { getAudio } from "./textToSpeech";
import { generateQuizFromTranscript } from "./quizGenerations";

const app = express();
app.use(express.json());
app.use(cors());

const CLERK_WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
const provider = new ethers.JsonRpcProvider("https://rpc.open-campus-codex.gelato.digital");

const contract = new ethers.Contract(contractAddress, ABI, provider);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || "", provider);
const contract2 = new ethers.Contract(contractAddress, ABI, wallet);

let lastCheckedBlock: any;
async function pollEvents() {
    if (!lastCheckedBlock) lastCheckedBlock = await provider.getBlockNumber();
    try {
        const currentBlock = await provider.getBlockNumber();

        if (lastCheckedBlock === currentBlock) return;
        const courseCreatedLogs = await provider.getLogs({
            address : contractAddress,
            ...contract.filters.CourseCreated(),
            fromBlock: lastCheckedBlock + 1,
            toBlock: currentBlock,
        });
        if (courseCreatedLogs) {
            for (const log of courseCreatedLogs) {
                const parsed = contract.interface.parseLog(log);
                console.log(parsed);
                console.log(parsed?.args);
                if (parsed && parsed.name === 'CourseCreated') {
                    const { name, courseId, educatorName, createdAt, courseCreator } = parsed.args;
                    console.log("📘 CourseCreated:", {
                        name,
                        courseId: Number(courseId),
                        educatorName,
                        createdAt,
                        courseCreator,
                    });

                    await createCourse({
                        courseId: Number(courseId),
                        name,
                        courseCreator,
                        educatorName,
                    });
                }
            }
        }
        // --- CoursePurchased ---

        const purchasedLogs = await provider.getLogs({
            ...contract.filters.CoursePurchased(),
            fromBlock: lastCheckedBlock + 1,
            toBlock: currentBlock,
        });

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

                    await CoursePurchased({
                        purchaser,
                        courseId: Number(courseId),
                        courseCreator,
                        amount: Number(amount),
                    });
                }
            }
        }
        lastCheckedBlock = currentBlock;
    } catch (error) {
        console.error("Polling error:", error);
    }
}
setInterval(pollEvents, 10_000);

app.post('/api/v1/add-lecture', middleWare, async (req, res) => {

    const { url, courseId, description, educatorId, name } = req.body;

    try {
        const uploaded = await prisma.lecture.create({
            data: {
                url,
                courseId,
                description,
                educatorId,
                name
            }
        })
        console.log(uploaded);

        res.status(200).json({
            msg: "Lecture uploaded successfully"
        })

    } catch (e) {
        console.log(e);
        res.status(501).json({
            msg: `Failed to upload lecture. Try again later`
        })
    }
})

app.get('/api/v1/get-notes', middleWare, async (req, res) => {
    const id = req.query.id! as string;
    try {
        const result = await prisma.lecture.findUnique({
            where: {
                id
            }
        })

        console.log(result);

        if (result?.transcription.length !== 0) {
            res.status(200).json({
                transcription: result?.transcription
            })
            return;
        }

        if (result?.url) {
            const response = await transcribeUrl(result?.url);
            console.log("hi there result received")
            console.log(response?.results.channels[0].alternatives[0].transcript)

            const upload = await prisma.lecture.update({
                where: {
                    id
                },
                data: {
                    transcription: response?.results.channels[0].alternatives[0].transcript
                }
            })

            res.status(200).json({
                msg: "transcript generated and saved successfully",
                data: response?.results.channels[0].alternatives[0].transcript
            })
        }
    } catch (e) {
        console.log(e)
        res.status(501).json({
            msg: "Unable to get notes currently",
        })
    }
})

app.get('/api/v1/get-course-lectures', middleWare, async (req, res) => {

    console.log(req);
    const courseId = parseInt(req.query.courseId! as string);
    console.log(courseId)
    try {
        const result = await prisma.courses.findUnique({
            where: {
                courseId
            },
            include: {
                lectures: true
            }
        })

        console.log(result);

        res.status(200).json({
            lectures: result?.lectures
        })

    } catch (error) {
        res.status(501).json({
            msg: "Please try again later"
        })
        console.log(error)
    }
})

app.post('/api/v1/speech', async (req, res) => {
    try {
        console.log(req.body);
        const { question } = await req.body;
        console.log(question);

        // Generate text response
        const textResponse = await generateAnswer({ question });

        if (textResponse === undefined) {
            res.status(501).json({
                msg: "error unable to process currently"
            });
            return;
        }

        // Generate audio from text
        const audioBuffer = await getAudio({ text: textResponse });
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
    } catch (error: any) {
        console.error('Error processing request:', error);
        res.status(500).json({
            msg: "Internal server error",
            error: error.message
        });
    }
});

app.get('/api/v1/get-lecture', middleWare, async (req, res) => {

    const id = req.query.id! as string;
    try {
        const result = await prisma.lecture.findUnique({
            where: {
                id
            },
            include: {
                course: true
            }
        })
        res.status(200).json({
            lecture: { ...result }
        })

    } catch (e) {
        console.log(e);
        res.status(404).json({
            msg: "Lecture not found"
        })
    }
})

app.post("/webhook/clerk", async (req: any, res: any) => {
    const payload = req.body;
    const headers = req.headers;

    const body = JSON.stringify(payload);

    console.log(headers)

    const svix_id = headers['svix-id']
    const svix_timestamp = headers['svix-timestamp']
    const svix_signature = headers['svix-signature']

    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error: Missing Svix headers', {
            status: 400,
        })
    }

    const wh = new Webhook(CLERK_WEBHOOK_SECRET);

    let evt: any;
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        })
    } catch (err) {
        console.error("Webhook verification failed:", err);
        return res.status(400).json({ error: "Invalid signature" });
    }

    try {
        if (evt.type === "user.created") {
            const result = await prisma.user.create({
                data: {
                    id: (evt.data.web3_wallets[0].web3_wallet as string)
                }
            })
            res.status(200).json({ received: true, result });
        }
    } catch (e) {
        console.log(e);
        res.status(501).json({
            msg: "user unable to create"
        })
    }
});

app.post('/api/v1/get-quiz', middleWare, async (req, res) => {

    const { transcript } = req.body;
    const result = await generateQuizFromTranscript({ transcript });

    console.log(result);

    if (result.success) {
        res.status(200).json(result);
        return;
    }
    else {
        res.status(501).json({
            msg: "Unable to laod currently"
        })
    }
})

app.get('api/v1/verify', async (req, res) => {
    try {
        const { userAddress } = req.query;
        const result = await contract2.unlockAmount(userAddress);
        console.log(result);
        res.status(200).json({ result });
        return;
    } catch (error) {
        console.log(error);
        res.status(501).json({
            msg : "Error while verifying"
        })
        return;
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

