import { GoogleGenAI } from "@google/genai";
import 'dotenv'

require('dotenv').config();

export const generateQuizFromTranscript = async(options : any) => {

    const {transcript, numQuestions = 5} = options;

    console.log(options);

    if (!transcript || !process.env.GEMINI_API_KEY) {
      throw new Error('Transcript and API key are required');
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

    console.log(prompt)
  
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: prompt,
          });
        // console.log(response.text?.substring(7,response.text.length-3));
        //@ts-ignore
        const jsonMatch = response.text?.substring(7,response.text.length-3);
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
            success : true
        };
    } catch (error : any) {
       return {success : false};
    }
}
  
