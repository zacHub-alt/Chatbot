import axios from 'axios';

class HybridChatbot {
    constructor() {
        this.responses = {
            "hi": "Hello! How can I help you today?",
            "how are you": "I'm just a bot, but I'm doing great! How can I assist you?",
            "bye": "Goodbye! Have a great day!",
        };
        this.apiUrl = 'https://openrouter.ai/api/v1/chat/completions'; // OpenRouter API URL
        this.apiKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY; // Use environment variable

        // Log the API key to verify (remove or mask before production)
        console.log('API Key:', this.apiKey);
    }

    getHardCodedResponse(userInput) {
        return this.responses[userInput.toLowerCase()];
    }

    async getLlamaResponse(userInput) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: "meta-llama/llama-3.1-8b-instruct",
                    messages: [{ role: "user", content: userInput }]
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            // Verify response structure and adjust based on actual response format
            return response.data.choices[0]?.message.content || "Sorry, I couldn't generate a response.";
        } catch (error) {
            console.error("Error connecting to OpenRouter API:", error.response ? error.response.data : error.message);
            return "Sorry, there was an error.";
        }
    }

    async getResponse(userInput) {
        if (this.responses[userInput.toLowerCase()]) {
            return this.getHardCodedResponse(userInput);
        } else {
            return await this.getLlamaResponse(userInput);
        }
    }
}

export default HybridChatbot;
