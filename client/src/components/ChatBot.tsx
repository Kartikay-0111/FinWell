import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageSquare, X, Send, Sparkles } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useGemini } from "@/hooks/useGemini";
import { generateGeminiPrompt } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const SUGGESTIONS = [
  "How much did I spend this week?",
  "Any subscriptions I should cancel?",
  "What's my largest expense category?",
  "How much did I save this month?",
  "Show me my spending trends",
];

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "👋 Hi there! I'm your FinWell AI assistant. How can I help you with your finances today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const { sendPrompt } = useGemini();

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { data, error } = await supabase
          .from("transactions")
          .select("*")
          .order("transaction_date", { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setTransactions(data);
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  const sendMessage = async (text: string = inputValue) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Send prompt to Gemini and handle response
    setLoading(true);
    try {
      const prompt = generateGeminiPrompt(transactions, text);
      const botResponse = await sendPrompt(prompt);
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        text: "Something went wrong while processing your request. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage();
  };

  if (!isOpen) {
    return (
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full h-12 w-12 p-0 bg-finOrange text-finDarkBlue hover:bg-finOrange/90 shadow-lg"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-scale-in">
      <Card className="w-[350px] md:w-[400px] h-[500px] shadow-xl border-finOrange/20 bg-finDarkBlue">
        <CardHeader className="bg-finDarkBlue border-b border-finOrange/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-finOrange/20 p-2 rounded-full mr-2">
                <Sparkles className="h-5 w-5 text-finOrange" />
              </div>
              <CardTitle className="text-lg text-finWhite">FinWell Assistant</CardTitle>
            </div>
            <Button
              onClick={toggleChat}
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-finLightGray hover:text-finWhite hover:bg-finDarkBlue/50"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0 flex flex-col h-[calc(500px-65px)]">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-finOrange text-finDarkBlue rounded-tr-none"
                      : "bg-finDarkBlue/70 border border-finOrange/10 text-finWhite rounded-tl-none"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="flex items-start mb-1">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-finOrange/20 text-finOrange text-xs">AI</AvatarFallback>
                      </Avatar>
                      <span className="text-xs font-medium text-finOrange">FinWell AI</span>
                    </div>
                  )}
                  <p className={message.sender === "user" ? "text-finDarkBlue" : "text-finWhite"}>
                    {message.text}
                  </p>
                  <div className="text-right mt-1">
                    <span className={`text-xs ${message.sender === "user" ? "text-finDarkBlue/70" : "text-finLightGray"}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Suggestions */}
          {messages.length < 3 && (
            <div className="p-3 border-t border-finOrange/10">
              <p className="text-xs text-finLightGray mb-2">Try asking:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => sendMessage(suggestion)}
                    className="text-xs bg-finDarkBlue/70 text-finLightGray border border-finOrange/20 px-3 py-1 rounded-full hover:bg-finOrange/10 hover:text-finWhite transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t border-finOrange/10 p-3">
            <form onSubmit={handleSubmit} className="flex items-center space-x-2">
              <Input
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 bg-finDarkBlue/70 border-finLightGray/30 text-finWhite"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
                disabled={loading}
              >
                {loading ? <div className="animate-spin h-4 w-4 border-2 border-finDarkBlue border-t-transparent rounded-full" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
