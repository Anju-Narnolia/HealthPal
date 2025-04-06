
import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  isLoading?: boolean;
}

interface ConversationHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

// Backup keyword-based responses
const responsesMap: Record<string, string> = {
  fever: "It might be a viral infection. Drink fluids and rest.",
  headache: "Could be due to stress or dehydration. Try relaxing and drink water.",
  cough: "You might be developing a cold. Keep warm and drink warm fluids.",
  stomach: "Could be indigestion. Avoid oily food and stay hydrated.",
  pain: "If the pain persists for more than a day, consider consulting a doctor.",
  tired: "Fatigue can be due to stress or lack of sleep. Try to get proper rest.",
  dizzy: "Dizziness might be caused by dehydration or low blood pressure.",
  nausea: "Drink water and eat bland foods. Avoid spicy or oily meals.",
  allergies: "Try to identify and avoid allergens. Antihistamines may help with symptoms.",
  cold: "Rest, stay hydrated, and consider over-the-counter cold medications if needed."
};

// Together AI API key
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY || "tgp_v1_aRixPiAcgbaA3z76FCdzLbg5sN_8o0YZWt65lf_-ClA";

// Together AI API model
const MODEL_ID = "mistralai/Mistral-7B-Instruct-v0.2"; // Medical knowledge capable model

// Common symptoms suggestions
const symptomSuggestions = [
  "I have a fever",
  "My head hurts",
  "I'm having trouble sleeping",
  "I feel dizzy",
  "I have a cough",
  "My stomach hurts",
  "I feel nauseous",
  "My joints ache",
  "I have a rash"
];

const HealthChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: 'Hi! I\'m your Med-Buddy. Tell me your symptoms or ask anything about health. Remember that I can provide general guidance but not professional medical advice.',
      sender: 'bot'
    }
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationHistory[]>([
    {
      role: 'system',
      content: 'You are Med-Buddy, a helpful and compassionate medical assistant. Provide relevant health information, but always remind users to consult healthcare professionals for serious concerns. Keep responses concise and easy to understand. Focus on being supportive and educational while acknowledging your limitations as an AI assistant.'
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Use effect to hide suggestions after first interaction
  useEffect(() => {
    if (messages.length > 1) {
      setShowSuggestions(false);
    }
  }, [messages.length]);

  // Function to fetch response from Together AI API
  const fetchTogetherAIResponse = async (query: string): Promise<string> => {
    try {
      // Add user query to conversation history
      const updatedHistory: ConversationHistory[] = [
        ...conversationHistory,
        { role: 'user' as const, content: query }
      ];
      
      const response = await fetch(
        "https://api.together.xyz/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${TOGETHER_API_KEY}`
          },
          body: JSON.stringify({
            model: MODEL_ID,
            messages: updatedHistory,
            temperature: 0.7,
            max_tokens: 500
          })
        }
      );

      if (!response.ok) {
        throw new Error('Failed to get response from Together AI API');
      }

      const result = await response.json();
      const assistantResponse = result.choices?.[0]?.message?.content || '';
      
      // Update conversation history with assistant's response
      if (assistantResponse) {
        setConversationHistory([
          ...updatedHistory,
          { role: 'assistant' as const, content: assistantResponse }
        ]);
      }
      
      return assistantResponse || generateKeywordResponse(query.toLowerCase());
    } catch (error) {
      console.error('Error using Together AI API:', error);
      // Fallback to keyword-based response
      return generateKeywordResponse(query.toLowerCase());
    }
  };

  // Function to generate response based on keywords (fallback)
  const generateKeywordResponse = (text: string): string => {
    // Check if any keywords from the responses map are in the user's message
    const matchedKeyword = Object.keys(responsesMap).find(keyword => 
      text.includes(keyword)
    );
    
    if (matchedKeyword) {
      return responsesMap[matchedKeyword];
    }
    
    // Default fallback response
    return "I'm still learning! Please consult a doctor for serious symptoms. Remember that I'm not a substitute for professional medical advice.";
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    // Add user message to chat
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user'
    };
    
    // Add typing indicator
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: '',
      sender: 'bot',
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInput('');
    setIsProcessing(true);
    
    try {
      // Get response from Together AI
      const botResponse = await fetchTogetherAIResponse(input);
      
      // Replace loading message with actual response
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading ? {
            id: msg.id,
            text: botResponse,
            sender: 'bot',
            isLoading: false
          } : msg
        )
      );
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Replace loading with fallback response on error
      setMessages(prev => 
        prev.map(msg => 
          msg.isLoading ? {
            id: msg.id,
            text: "Sorry, I'm having trouble connecting. Please try again later.",
            sender: 'bot',
            isLoading: false
          } : msg
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  // Clear chat history
  const clearChat = () => {
    setMessages([
      {
        id: 1,
        text: 'Hi! I\'m your Med-Buddy. Tell me your symptoms or ask anything about health. Remember that I can provide general guidance but not professional medical advice.',
        sender: 'bot'
      }
    ]);
    setConversationHistory([
      {
        role: 'system',
        content: 'You are Med-Buddy, a helpful and compassionate medical assistant. Provide relevant health information, but always remind users to consult healthcare professionals for serious concerns. Keep responses concise and easy to understand. Focus on being supportive and educational while acknowledging your limitations as an AI assistant.'
      }
    ]);
    setShowSuggestions(true);
  };

  // Loading dots animation for typing indicator
  const LoadingDots = () => (
    <div className="flex space-x-1 items-center">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
    </div>
  );

  return (
    <div className="fixed bottom-10 right-10 z-50">
      {/* Chatbot button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary/80 hover:bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg transition-all duration-300 transform hover:scale-105"
        aria-label="Toggle chatbot"
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
      </button>

      {/* Chatbot dialog */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-lg shadow-xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out max-h-[600px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3 className="font-medium text-lg">Health-Buddy</h3>
            </div>
            <div className="flex items-center">
              <button 
                onClick={clearChat} 
                className="text-white hover:text-gray-200 mr-3 text-sm"
                title="Clear chat history"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white hover:text-gray-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Messages area */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 max-h-96">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-3 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`px-4 py-2 rounded-lg max-w-[85%] ${
                    message.sender === 'user' 
                      ? 'bg-primary/80 text-white rounded-br-none shadow-md' 
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-200'
                  }`}
                >
                  {message.isLoading ? <LoadingDots /> : message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Suggested prompts */}
          {showSuggestions && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs text-gray-500 mb-2">Try asking about:</p>
              <div className="flex flex-wrap gap-2 mb-2">
                {symptomSuggestions.slice(0, 5).map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-2 rounded-full transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Input area */}
          <div className="border-t border-gray-200 p-3 flex items-center bg-white">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your symptoms or question..."
              className="flex-1 border border-gray-300 rounded-l-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              disabled={isProcessing}
            />
            <button
              onClick={handleSend}
              disabled={isProcessing || !input.trim()}
              className="bg-primary/80 hover:bg-primary text-white rounded-r-full py-2 px-4 font-medium disabled:opacity-50 transition-colors"
            >
              {isProcessing ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Disclaimer */}
          <div className="bg-gray-100 px-3 py-2 text-xs text-gray-500 text-center">
            This chatbot provides general information only, not medical advice.
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthChatbot;
