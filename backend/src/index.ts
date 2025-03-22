import { PrismaClient } from "@prisma/client";
import express, { response } from "express"
import cors from "cors"
import middleWare from "./middleware";
import 'dotenv'
import { transcribeUrl } from "./transcribe";
const prisma = new PrismaClient({});
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/v1/add-lecture' , middleWare , async(req,res) => {

    const {url , courseId , description , educatorId } = req.body;

    try{
        const uploaded = await prisma.lecture.create({
            data : {
                url,
                courseId,
                description,
                educatorId,
                transcription : "",
            }
        })
console.log(uploaded);

        res.status(200).json({
            msg : "Lecture uploaded successfully"
        })

    }catch(e){
        console.log(e);
        res.status(501).json({
            msg : `Failed to upload lecture. Try again later`
        })
    }
})

app.get('/api/v1/get-notes',middleWare , async(req,res) => {

    const id = req.query.lectureid! as string;
    try {
        const result = await prisma.lecture.findUnique({
            where : {
                id
            }
        })

        console.log(result);

        if(result?.transcription.length !== 0) {
            res.status(200).json({
                transcription : result?.transcription
            })
            return;
        }

        if(result?.url){
            const response = await transcribeUrl(result?.url);
            console.log("hi there result received")
            console.log(response?.results.channels[0].alternatives[0].transcript)

            const upload = await prisma.lecture.update({
                where : {
                    id
                },
                data : {
                    transcription : response?.results.channels[0].alternatives[0].transcript
                }
            })

            res.status(200).json({
                msg : "transcript generated and saved successfully",
                data : response?.results.channels[0].alternatives[0].transcript
            })
        }


    } catch (e) {
        console.log(e)
        res.status(501).json({
            msg : "Unable to get notes currently",
        })
    }
})

app.get('api/v1/get-course', middleWare,async(req,res) => {
    
    const courseId  = parseInt(req.query.courseId! as string);
    try {
        const result = await prisma.courses.findUnique({
            where : {
                courseId
            },
            include : {
                lectures : true
            }
        })

        console.log(result);

        res.status(200).json({
            lectures : result
        })

    } catch (error) {
        res.status(501).json({
            msg : "Please try again later"
        })
        console.log(error)
    }
})

app.get('/api/v1/get-lecture',middleWare , async(req,res) => {

    const  id  = req.query.id! as string;
    try{
        const result = await prisma.lecture.findUnique({
            where : {
                id
            }
        })
        // console.log(result)
        res.status(200).json({
            url : result?.url,
            courseId : result?.courseId
        })
        
    }catch(e) {
        console.log(e);
        res.status(404).json({
            msg : "Lecture not found"
        })
    }
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
})

