const { createClient } = require("@deepgram/sdk");
const fs = require("fs");

const deepgram = createClient(process.env.DEEPGRAM_API_KEY);

export const getAudio = async ({text} : {text : string}) => {
  // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
  const response = await deepgram.speak.request(
    { text },
    {
      model: "aura-athena-en",
      encoding: "linear16",
      container: "wav",
    }
  );

  // STEP 3: Get the audio stream and headers from the response
  const stream = await response.getStream();
  const headers = await response.getHeaders();

  if (stream) {
    // STEP 4: Convert the stream to an audio buffer
    const buffer = await getAudioBuffer(stream);

    return buffer;
    // // STEP 5: Write the audio buffer to a file
    // fs.writeFile("output.wav", buffer, (err : any) => {
    //   if (err) {
    //     console.error("Error writing audio to file:", err);
    //   } else {
    //     console.log("Audio file written to output.wav");
    //   }
    // });
  } else {
    console.error("Error generating audio:", stream);
  }

  // if (headers) {
  //   console.log("Headers:", headers);
  // }
};

// helper function to convert stream to audio buffer
const getAudioBuffer = async (response : any) => {
  const reader = response.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    chunks.push(value);
  }

  const dataArray = chunks.reduce(
    (acc, chunk) => Uint8Array.from([...acc, ...chunk]),
    new Uint8Array(0)
  );

  return Buffer.from(dataArray.buffer);
};