import { useState } from "react";
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  User,
  ShieldAlert,
  CheckCircle2,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
  triage?: "self_care" | "see_doctor" | "emergency";
}

export function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hello Eleanor! I am your CareBridge AI Health Assistant. How can I help you today? You can type a question or press the microphone icon to speak.",
      time: "10:00 AM",
    },
    {
      id: "2",
      sender: "user",
      text: "I felt a bit dizzy after taking my morning blood pressure pill.",
      time: "10:01 AM",
    },
    {
      id: "3",
      sender: "ai",
      text: "Dizziness after taking blood pressure medication (like Lisinopril) can occur if your blood pressure drops quickly when standing up (orthostatic hypotension). Please sit down, drink a glass of water, and avoid sudden movements. If the dizziness is severe or accompanied by chest pain, activate Emergency SOS immediately.",
      time: "10:01 AM",
      triage: "self_care",
    },
  ]);

  const [inputMsg, setInputMsg] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const quickPrompts = [
    "What are common side effects of Metformin?",
    "Explain my latest cholesterol lab report",
    "Should I take aspirin with my medication?",
    "I have a slight headache and stiff neck",
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputMsg;
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMsg("");
    setIsThinking(true);

    setTimeout(() => {
      setIsThinking(false);
      let aiText = "Thank you for sharing that. Based on your medical profile, I recommend monitoring your symptoms for the next 2 hours. If you feel any worsening, I can connect you directly with Dr. Sarah Jenkins.";
      let triage: "self_care" | "see_doctor" | "emergency" = "self_care";

      if (text.toLowerCase().includes("headache") || text.toLowerCase().includes("pain")) {
        aiText = "Headaches can be related to blood pressure changes. Please rest in a quiet, dark room, hydrate well, and measure your BP now.";
        triage = "see_doctor";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: "ai",
          text: aiText,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          triage,
        },
      ]);
    }, 1200);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Bot className="h-7 w-7 text-teal-600" /> AI Health Assistant
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> GPT-4o Medical Engine
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Voice-enabled symptom triage, drug interactions, and medical query explanations.
          </p>
        </div>

        <Button
          variant={isRecording ? "destructive" : "outline"}
          onClick={() => setIsRecording(!isRecording)}
          className="rounded-xl gap-2 h-10 border-teal-500/30"
        >
          {isRecording ? <MicOff className="h-4 w-4 animate-pulse" /> : <Mic className="h-4 w-4 text-teal-600" />}
          {isRecording ? "Listening..." : "Voice Input"}
        </Button>
      </div>

      {/* Main Chat Interface */}
      <Card className="p-0 border-teal-500/30 glass-card flex flex-col h-[600px]">
        {/* Chat Feed */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              <div
                className={`h-9 w-9 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold ${
                  msg.sender === "user"
                    ? "bg-teal-600 shadow-md"
                    : "bg-gradient-to-tr from-cyan-600 to-teal-500 shadow-md"
                }`}
              >
                {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              <div className={`max-w-lg space-y-2 ${msg.sender === "user" ? "items-end text-right" : "items-start"}`}>
                <div
                  className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-teal-600 text-white rounded-tr-xs"
                      : "bg-card border text-foreground rounded-tl-xs shadow-xs"
                  }`}
                >
                  {msg.text}
                </div>

                {msg.triage && (
                  <div className="flex items-center gap-2 pt-1">
                    {msg.triage === "self_care" && (
                      <Badge variant="success" className="gap-1 text-[11px]">
                        <CheckCircle2 className="h-3 w-3" /> Triage: Self-Care & Monitor
                      </Badge>
                    )}
                    {msg.triage === "see_doctor" && (
                      <Badge variant="warning" className="gap-1 text-[11px]">
                        <HelpCircle className="h-3 w-3" /> Triage: Consult Doctor
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] gap-1 text-muted-foreground hover:text-foreground">
                      <Volume2 className="h-3 w-3" /> Read Aloud
                    </Button>
                  </div>
                )}
                <span className="text-[10px] text-muted-foreground block">{msg.time}</span>
              </div>
            </div>
          ))}

          {isThinking && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground italic p-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-teal-600" /> AI Assistant is analyzing...
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 border-t bg-muted/30 flex gap-2 overflow-x-auto">
          {quickPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="text-xs px-3 py-1.5 rounded-full bg-background border hover:border-teal-500/40 text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Form */}
        <div className="p-3 border-t bg-card">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <Input
              placeholder="Ask any health or medication question..."
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              className="flex-1 rounded-xl h-11 text-sm"
            />
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl h-11 px-5 font-bold gap-2"
            >
              Send <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
