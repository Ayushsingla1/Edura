import 'dotenv'
import { createClient } from '@deepgram/sdk';

export const transcribeUrl = async (url : string) => {
  const deepgram = createClient(process.env.DEEPGRAM_API_KEY);


  const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
    {
      url,
    },
    {
      model: "nova-3",
      smart_format: true,
    }
  );

  if (error) throw error;
  if (!error){
    return result;
  }
};
