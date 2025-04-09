

export const connectToDeepgram = (setTranscript : any,deepgramSocket : any) => {
    const socket = new WebSocket(
      `wss://api.deepgram.com/v1/listen?punctuate=true`,
      ['token', 'bea715311202763a4b468812ff9a8529e5790229']
    );
    deepgramSocket.current = socket;

    socket.onopen = () => {
      console.log('✅ Connected to Deepgram');

      navigator.mediaDevices.getUserMedia({ audio: true }).then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
            socket.send(event.data);
          }
        };

        mediaRecorder.start(250);
      });
    };

    socket.onmessage = (msg) => {
      const data = JSON.parse(msg.data);
      if (data.channel && data.channel.alternatives[0]) {
        const text = data.channel.alternatives[0].transcript;
        if (text && !text.includes('[noise]')) {
          console.log('Transcript:', text);
          setTranscript(text);
        }
      }
    };

    socket.onclose = () => console.log('🔌 Deepgram connection closed.');
    socket.onerror = (err) => console.error('WebSocket error:', err);
  };



export const getAIResponseAudio = async (transcript : string,setIsTeacherSpeaking : any,setChatHistory : any) => {
    try {
        const response = await fetch(`${process.env.VITE_BACKEND_URL}/api/v1/speech`, {
          method: 'POST',
          body: JSON.stringify({ question: transcript }),
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        const data = await response.json();
        
        const textAnswer = data.text;
        console.log('Text response:', textAnswer);
      
        const binaryString = atob(data.audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        // Create blob and audio element
        const blob = new Blob([bytes], { type: data.audioContentType });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        const newMessage = {
            isUser: false,
            message: textAnswer,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }

        setChatHistory((prev : any) => {
            return [...prev,newMessage]
        })

        setIsTeacherSpeaking(true)
        audio.play();
        // setIsTeacherSpeaking(false);
        
        audio.onended = () => {
          URL.revokeObjectURL(url);
          setIsTeacherSpeaking(false);
        };

      } catch (error) {
        console.error('TTS fetch error:', error);
      }
};