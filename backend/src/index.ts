import { PrismaClient } from "@prisma/client";
import express from "express"
import cors from "cors"
import middleWare from "./middleware";

const prisma = new PrismaClient({});
const app = express();

app.use(express.json());
app.use(cors());

app.post('/api/v1/addLecture' , middleWare , async(req,res) => {

    const {url , courseId , description , educatorId } = req.body;

    try{
        const uploaded = await prisma.lecture.create({
            data : {
                url,
                courseId,
                description,
                educatorId,
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


app.get('/api/v1/getLecture',middleWare , (req,res) => {

})



