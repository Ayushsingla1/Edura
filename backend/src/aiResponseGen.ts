import { GoogleGenAI } from "@google/genai";
import 'dotenv'

require('dotenv').config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateAnswer({question} : {question : string}) {

    console.log(question);
  
    const context = "Suppose you are a teacher, and student is asking you doubts they face , so reply in as simple terms as possible and be clear , reply as if a real lecture is going on currently"
    const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: `${context} , question is : ${question} and remember the maximum size should be 1800 characters , never ever reply with more than 1800 characters`,
  });
  console.log(response.text);

  return response.text;
}
