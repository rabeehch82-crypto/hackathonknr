import { useState } from "react";
import { Link } from "react-router-dom";
import {
  HeartPulse,
  Sparkles,
  Bot,
  FileText,
  Pill,
  ShieldAlert,
  Users,
  Calendar,
  ArrowRight,
  CheckCircle2,
  Mic,
  Activity,
  QrCode,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LandingPage() {
  const [demoQuery, setDemoQuery] = useState("");
  const [demoResponse, setDemoResponse] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoQuery.trim()) return;
    setIsAnalyzing(true);
    setDemoResponse(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      setDemoResponse(
        "AI Analysis: Based on your symptoms, your vital signs indicate a mild fatigue pattern. Drink 500ml water, rest, and monitor your blood pressure. Consult Dr. Sarah if symptoms persist."
      );
    }, 1200);
  };

  const featureCards = [
    {
      icon: Bot,
      title: "AI Health Assistant & Voice Triage",
      desc: "Instant senior-friendly symptom assessment powered by GPT-4o with voice input (Whisper) & read-aloud spoken guidance.",
      color: "from-teal-500 to-cyan-500",
      badge: "Voice & Text",
    },
    {
      icon: FileText,
      title: "Medical Report OCR & Summarizer",
      desc: "Upload lab scans or prescriptions. Google Vision OCR extracts text and translates complex medical terms into plain language.",
      color: "from-blue-500 to-indigo-500",
      badge: "OCR Scanner",
    },
    {
      icon: Pill,
      title: "Smart Medication Reminders",
      desc: "Auto-generated pill schedules with adherence ring tracking, audio alerts, and automated notifications for caregivers.",
      color: "from-emerald-500 to-teal-500",
      badge: "Adherence System",
    },
    {
      icon: QrCode,
      title: "Emergency QR Medical ID",
      desc: "Instant emergency card snapshot containing blood group, chronic conditions, and emergency contacts accessible without internet.",
      color: "from-rose-500 to-red-500",
      badge: "Emergency SOS",
    },
    {
      icon: Users,
      title: "Caregiver & Family Network",
      desc: "Grant trusted relatives or nurses granular access to vitals, prescription history, and emergency alerts in real-time.",
      color: "from-purple-500 to-indigo-500",
      badge: "Family Sync",
    },
    {
      icon: Calendar,
      title: "Doctor Directory & Telehealth",
      desc: "Search top specialists, view available slots, and book seamless virtual or in-clinic consultations with double-booking prevention.",
      color: "from-cyan-500 to-blue-500",
      badge: "Instant Booking",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background selection:bg-teal-500/20">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600 text-white text-center py-2 px-4 text-xs font-semibold flex items-center justify-center gap-2">
        <Sparkles className="h-4 w-4 animate-spin" style={{ animationDuration: "5s" }} />
        <span>Senior-Friendly AI Healthcare Coordination Platform — Powered by Supabase & OpenAI</span>
        <Link to="/dashboard" className="underline font-bold hover:text-cyan-200 ml-1">
          Explore Live Demo &rarr;
        </Link>
      </div>

      {/* Header / Nav */}
      <header className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-400 text-white shadow-lg shadow-teal-500/30">
            <HeartPulse className="h-6 w-6 animate-pulse" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-foreground flex items-center gap-1.5">
            CareBridge
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" className="font-medium">
              Log In
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-semibold rounded-xl shadow-md shadow-teal-500/20">
              Launch Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32">
        {/* Glow background blobs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10 text-center max-w-4xl">
          <Badge variant="teal" className="mb-6 px-4 py-1 text-xs font-semibold uppercase tracking-widest gap-1.5">
            <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Senior Healthcare Assistant
          </Badge>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-tight text-foreground">
            Smarter Health Care for <br className="hidden sm:inline" />
            <span className="gradient-heading">Seniors & Families</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            CareBridge AI combines voice-activated symptom triage, instant medical report OCR summaries, smart medication reminders, and 24/7 caregiver coordination in one accessible app.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-13 px-8 text-base font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl shadow-xl shadow-teal-500/25 gap-2">
                Open Patient Dashboard <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/ai-assistant" className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto h-13 px-8 text-base font-semibold rounded-2xl border-teal-500/30 hover:bg-teal-500/10 gap-2">
                <Bot className="h-5 w-5 text-teal-600" /> Try AI Symptom Assistant
              </Button>
            </Link>
          </div>

          {/* Interactive AI Query Box Demo */}
          <div className="mt-14 max-w-2xl mx-auto p-4 sm:p-6 rounded-3xl border glass-card shadow-2xl text-left">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-teal-500 animate-ping" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                  Live AI Health Assistant Demo
                </span>
              </div>
              <Badge variant="outline" className="gap-1 text-[11px]">
                <Mic className="h-3 w-3 text-teal-500" /> Voice Ready
              </Badge>
            </div>

            <form onSubmit={handleDemoSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'I feel lightheaded and skipped my morning blood pressure pill...'"
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className="flex-1 rounded-xl border border-input bg-background/70 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Button type="submit" disabled={isAnalyzing} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-5">
                {isAnalyzing ? "Analyzing..." : "Ask AI"}
              </Button>
            </form>

            {demoResponse && (
              <div className="mt-4 p-4 rounded-xl bg-teal-500/15 border border-teal-500/30 text-sm text-foreground animate-in fade-in duration-300">
                <div className="flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300 mb-1">
                  <Bot className="h-4 w-4" /> AI Healthcare Response:
                </div>
                <p className="leading-relaxed">{demoResponse}</p>
              </div>
            )}
          </div>

          {/* Key Metrics */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-border/50">
            <div>
              <div className="text-3xl font-extrabold text-teal-600">99.4%</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Medication Adherence</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-teal-600">&lt; 3 Sec</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">OCR Report Summaries</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-teal-600">24/7</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">AI Voice Triage</div>
            </div>
            <div>
              <div className="text-3xl font-extrabold text-teal-600">100%</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Caregiver Syncing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-muted/40 border-y border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="teal" className="mb-3">
              Comprehensive Platform
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Everything You Need for Senior Care
            </h2>
            <p className="mt-4 text-muted-foreground">
              Designed specifically to be intuitive, accessible, and crystal-clear for patients and healthcare providers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featureCards.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} hoverable className="p-2">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="teal">{feat.badge}</Badge>
                    </div>
                    <CardTitle className="text-xl">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm leading-relaxed">
                      {feat.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8 bg-card">
        <div className="container mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-bold text-sm">CareBridge AI Platform</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © 2026 CareBridge AI Healthcare. Designed for Hackathon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
