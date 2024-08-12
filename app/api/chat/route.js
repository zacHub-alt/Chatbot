import HybridChatbot from '../../lib/HybridChatbot';

const bot = new HybridChatbot();

export async function POST(req) {
    try {
        const { messages } = await req.json();
        const userInput = messages[messages.length - 1]?.content;

        if (!userInput) {
            return new Response('No user input provided', { status: 400 });
        }

        const response = await bot.getResponse(userInput);
        return new Response(response, { status: 200 });
    } catch (error) {
        console.error('Error handling request:', error);
        return new Response('Internal Server Error', { status: 500 });
    }
}
