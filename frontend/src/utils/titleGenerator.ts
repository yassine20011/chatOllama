import axios from 'axios';

interface GenerateTitleResponse {
    response: string;
}

export async function generateTitle(conversation: string): Promise<string> {
    try {
        const response = await axios.post('http://localhost:11434/api/generate', {
            model: 'llama3.2',
            prompt: `Summarize the following conversation into a concise title:\n\n${conversation}`
        });

        const responseData: string = response.data;
        const responseLines: string[] = responseData.split('\n');
        const responses: string[] = responseLines
            .filter(line => line)
            .map(line => JSON.parse(line) as GenerateTitleResponse)
            .map(data => data.response);

        const title = responses.join('');
        return title;
    } catch (error) {
        console.error('Error generating title:', error);
        throw error;
    }
}