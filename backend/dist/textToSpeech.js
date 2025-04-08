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
exports.getAudio = void 0;
const { createClient } = require("@deepgram/sdk");
const fs = require("fs");
const deepgram = createClient(process.env.DEEPGRAM_API_KEY);
const getAudio = (_a) => __awaiter(void 0, [_a], void 0, function* ({ text }) {
    // STEP 2: Make a request and configure the request with options (such as model choice, audio configuration, etc.)
    const response = yield deepgram.speak.request({ text }, {
        model: "aura-athena-en",
        encoding: "linear16",
        container: "wav",
    });
    // STEP 3: Get the audio stream and headers from the response
    const stream = yield response.getStream();
    const headers = yield response.getHeaders();
    if (stream) {
        // STEP 4: Convert the stream to an audio buffer
        const buffer = yield getAudioBuffer(stream);
        return buffer;
        // // STEP 5: Write the audio buffer to a file
        // fs.writeFile("output.wav", buffer, (err : any) => {
        //   if (err) {
        //     console.error("Error writing audio to file:", err);
        //   } else {
        //     console.log("Audio file written to output.wav");
        //   }
        // });
    }
    else {
        console.error("Error generating audio:", stream);
    }
    // if (headers) {
    //   console.log("Headers:", headers);
    // }
});
exports.getAudio = getAudio;
// helper function to convert stream to audio buffer
const getAudioBuffer = (response) => __awaiter(void 0, void 0, void 0, function* () {
    const reader = response.getReader();
    const chunks = [];
    while (true) {
        const { done, value } = yield reader.read();
        if (done)
            break;
        chunks.push(value);
    }
    const dataArray = chunks.reduce((acc, chunk) => Uint8Array.from([...acc, ...chunk]), new Uint8Array(0));
    return Buffer.from(dataArray.buffer);
});
