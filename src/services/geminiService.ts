import { GoogleGenerativeAI } from '@google/generative-ai';

interface Message {
  role: 'user' | 'model';
  parts: string;
}

interface ConversationHistory {
  messages: Message[];
}

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private conversationHistory: ConversationHistory;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_GEMINI_API_KEY is not configured');
    }
    
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    this.conversationHistory = { messages: [] };
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
    try {
      // Add user message to history
      this.conversationHistory.messages.push({
        role: 'user',
        parts: userMessage
      });

      const conversationHistoryText = this.formatConversationHistory();
      const prompt = this.getSerinPrompt(conversationHistoryText, userMessage);

      // Generate response
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const responseText = response.text();

      // Add bot response to history
      this.conversationHistory.messages.push({
        role: 'model',
        parts: responseText
      });

      return responseText;
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback response based on language
      const language = this.detectLanguage(userMessage);
      const fallbackMessage = language === 'fr' 
        ? "Désolée, j'ai un petit problème technique. Peux-tu réessayer dans un moment? 😊"
        : "Sorry, I'm having a technical hiccup. Can you try again in a moment? 😊";
      
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