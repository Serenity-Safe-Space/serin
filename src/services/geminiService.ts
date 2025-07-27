import { GoogleGenerativeAI } from '@google/generative-ai';
import { logEnvironmentInfo } from '@/utils/environmentDebug';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

interface ConversationHistory {
  messages: Message[];
}

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: unknown = null;
  private conversationHistory: ConversationHistory;
  private isInitialized: boolean = false;
  private initializationError: string | null = null;

  constructor() {
    console.log('GeminiService: Constructor called');
    this.conversationHistory = { messages: [] };
    this.initialize();
  }

  private initialize() {
    try {
      // Enhanced environment debugging
      const envInfo = logEnvironmentInfo('GeminiService Initialization');
      
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      
      if (!apiKey) {
        this.initializationError = 'VITE_GEMINI_API_KEY is not configured. Please check Vercel environment variables.';
        console.error('GeminiService:', this.initializationError);
        console.log('GeminiService: Available environment variables:', Object.keys(import.meta.env));
        return;
      }
      
      if (apiKey.length < 20) {
        this.initializationError = 'VITE_GEMINI_API_KEY appears to be invalid (too short). Please check the key value.';
        console.error('GeminiService:', this.initializationError);
        return;
      }
      
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      this.isInitialized = true;
      console.log('GeminiService: Successfully initialized with model gemini-1.5-flash');
    } catch (error) {
      this.initializationError = `Error during initialization: ${error.message}`;
      console.error('GeminiService: Error during initialization:', error);
    }
  }

  private getSerinPrompt(history: string, currentMessage: string): string {
    return `You are Serin, an authentic friend who has experienced similar situations with toxic relationships. You speak naturally, wisely, and kindly.

If the user's current message is in English, respond in English.
If the user's current message is in French, respond in French.

NEW conversation (empty history):
- Single message (English): "Hey, I'm here for you 🤗"
- Single message (French): "Coucou, je suis là pour toi 🤗"

ONGOING Conversation:
- React spontaneously but thoughtfully
- No introductory phrases or greetings
- Avoid repeating what the person says
- Adjust your reactions based on severity:

For ordinary/non-serious situations:
- Remain neutral and kind
- Help put things into perspective if needed
- Avoid excessive reactions
- Don't push towards extreme decisions
Examples (English):
- "Yeah, I totally get the disappointment..."
- "Guys aren't always great at that stuff 😅"
- "It's okay to feel annoyed"
Examples (French):
- "Ah oui je comprends la déception..."
- "Les mecs sont pas toujours doués hein 😅"
- "C'est normal d'être énervée"

For signs of violence/toxicity:
- You can be more direct and protective:
- "He's seriously crossing the line"
- "That's definitely not normal behavior"
- "You're right, you shouldn't put up with that"
- Speak clearly: "That's outright abuse"
- Naturally mention resources (English): "By the way, you can reach out to a helpline; it's free and anonymous"
- Naturally mention resources (French): "Tu peux appeler le 3919 au fait, c'est gratuit et anonyme"
- Advise to keep evidence: "Messages, records—those are all evidence"
- Encourage not staying isolated

Conversation style:
- Talk like real life
- Use emojis naturally according to your mood
- Share your personal opinion wisely
- Stay direct but thoughtful
- Use everyday language
- React with appropriate emotion
- Show genuine understanding

Absolutely avoid:
- Systematic questions in each message
- Therapeutic or professional tone
- Lengthy psychological analyses
- Terms like "sweetie," "honey"
- Repetitive response patterns
- Clinical validations ("I understand that you feel...")
- Excessive reactions to minor situations
- Radical advice without serious reason

Preferred approach:
- Spontaneous but measured reactions
- Simple and direct language
- Authentic friend-like support
- Practical suggestions when appropriate
- Varied response lengths
- Sharing similar experiences
- Differentiating between real issues and temporary annoyances

Previous Conversation:
${history}

Current Situation:
${currentMessage}`;
  }

  private detectLanguage(text: string): 'en' | 'fr' {
    // Simple language detection - could be enhanced with a proper library
    const frenchWords = ['je', 'tu', 'il', 'elle', 'nous', 'vous', 'ils', 'elles', 'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'et', 'ou', 'mais', 'donc', 'car', 'ni', 'or'];
    const lowerText = text.toLowerCase();
    const frenchCount = frenchWords.filter(word => lowerText.includes(word)).length;
    
    return frenchCount > 2 ? 'fr' : 'en';
  }

  private formatConversationHistory(): string {
    if (this.conversationHistory.messages.length === 0) {
      return '(Empty conversation - this is the first message)';
    }

    return this.conversationHistory.messages
      .map((msg, index) => {
        const speaker = msg.role === 'user' ? 'User' : 'Serin';
        return `${speaker}: ${msg.parts}`;
      })
      .join('\n');
  }

  async sendMessage(userMessage: string): Promise<string> {
    console.log('GeminiService.sendMessage: Starting with message:', userMessage);
    
    // Check if service is properly initialized
    if (!this.isInitialized || !this.model) {
      console.error('GeminiService: Service not initialized:', this.initializationError);
      const language = this.detectLanguage(userMessage);
      const errorMessage = language === 'fr' 
        ? "Désolée, je ne peux pas répondre pour le moment. Le service n'est pas configuré correctement. 😔"
        : "Sorry, I can't respond right now. The service isn't configured properly. 😔";
      return errorMessage;
    }
    
    try {
      // Add user message to history
      this.conversationHistory.messages.push({
        role: 'user',
        parts: userMessage
      });
      console.log('GeminiService: Added user message to history. Total messages:', this.conversationHistory.messages.length);

      const conversationHistoryText = this.formatConversationHistory();
      const prompt = this.getSerinPrompt(conversationHistoryText, userMessage);
      console.log('GeminiService: Generated prompt length:', prompt.length);

      // Generate response
      console.log('GeminiService: Calling Gemini API...');
      const result = await (this.model as any).generateContent(prompt);
      console.log('GeminiService: Received result from API');
      
      const response = await result.response;
      const responseText = response.text();
      console.log('GeminiService: Response text length:', responseText.length);

      // Add bot response to history
      this.conversationHistory.messages.push({
        role: 'model',
        parts: responseText
      });
      console.log('GeminiService: Added bot response to history');

      return responseText;
    } catch (error) {
      console.error('GeminiService: Detailed error:', {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText,
        stack: error?.stack,
        error: error
      });
      
      // Fallback response based on language
      const language = this.detectLanguage(userMessage);
      const fallbackMessage = language === 'fr' 
        ? "Désolée, j'ai un petit problème technique. Peux-tu réessayer dans un moment? 😊"
        : "Sorry, I'm having a technical hiccup. Can you try again in a moment? 😊";
      
      console.log('GeminiService: Returning fallback message in', language);
      return fallbackMessage;
    }
  }

  getInitialMessage(): string {
    // Return the initial greeting - language will be determined by user's first message
    return "Hey, I'm here for you 🤗";
  }

  clearHistory(): void {
    this.conversationHistory = { messages: [] };
  }

  getConversationLength(): number {
    return this.conversationHistory.messages.filter(msg => msg.role === 'user').length;
  }
}

// Export a singleton instance
export const geminiService = new GeminiService();
export default geminiService;