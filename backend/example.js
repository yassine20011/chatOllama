
import axios from 'axios';

async function fetchChat() {
  const response = await axios.post('http://localhost:11434/api/chat', {
    model: "llama3.2",
    messages: [{ role: "user", content: "is the earth flat?" }],
  }, { responseType: 'stream' });

  response.data.on('data', (chunk) => {
    const data = chunk.toString().trim();
    if (data) {
      console.log(JSON.parse(data));
    }
  });

  response.data.on('end', () => {
    console.log('Stream ended');
  });
}

fetchChat();
