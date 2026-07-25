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
  Building2,
  Stethoscope,
  FlaskConical,
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
      {/* Top Announcement Banner */}
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
            CareBridge <span className="gradient-heading">AI</span>
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
      <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-center lg:text-left flex flex-col justify-center">
              <div>
                <Badge variant="teal" className="mb-4 px-4 py-1 text-xs font-semibold uppercase tracking-widest gap-1.5 inline-flex items-center">
                  <Sparkles className="h-3.5 w-3.5" /> Next-Gen AI Senior Healthcare Assistant
                </Badge>
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15] text-foreground">
                Smarter Health Care for <br className="hidden sm:inline" />
                <span className="gradient-heading">Seniors & Families</span>
              </h1>

              <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
                CareBridge AI combines voice-activated symptom triage, instant medical report OCR summaries, smart medication reminders, and 24/7 caregiver coordination in one accessible app.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto h-12 px-7 text-sm font-bold bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-2xl shadow-xl shadow-teal-500/25 gap-2">
                    Open Patient Dashboard <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/ai-assistant" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto h-12 px-7 text-sm font-semibold rounded-2xl border-teal-500/30 hover:bg-teal-500/10 gap-2">
                    <Bot className="h-4 w-4 text-teal-600" /> Try AI Symptom Assistant
                  </Button>
                </Link>
              </div>

              {/* Interactive AI Query Box */}
              <div className="mt-8 p-4 rounded-3xl border glass-card shadow-xl text-left max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full bg-teal-500 animate-ping" />
                    <span className="text-[11px] font-bold text-teal-700 dark:text-teal-300 uppercase tracking-wider">
                      Live AI Assistant Teaser
                    </span>
                  </div>
                  <Badge variant="outline" className="gap-1 text-[10px]">
                    <Mic className="h-3 w-3 text-teal-500" /> Voice Ready
                  </Badge>
                </div>

                <form onSubmit={handleDemoSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ask e.g. 'I feel dizzy and skipped my morning pill...'"
                    value={demoQuery}
                    onChange={(e) => setDemoQuery(e.target.value)}
                    className="flex-1 rounded-xl border border-input bg-background/80 px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <Button type="submit" disabled={isAnalyzing} className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl px-4 text-xs">
                    {isAnalyzing ? "Analyzing..." : "Ask AI"}
                  </Button>
                </form>

                {demoResponse && (
                  <div className="mt-3 p-3 rounded-xl bg-teal-500/15 border border-teal-500/30 text-xs text-foreground animate-in fade-in duration-300">
                    <div className="flex items-center gap-2 font-semibold text-teal-700 dark:text-teal-300 mb-1">
                      <Bot className="h-4 w-4" /> AI Healthcare Response:
                    </div>
                    <p className="leading-relaxed">{demoResponse}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-full max-w-md lg:max-w-none rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 dark:border-white/10 group">
                <img
                  src="/images/carebridge_senior_hero.png"
                  alt="Senior Patient using CareBridge AI with Doctor"
                  className="w-full h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Floating Glassmorphism Vitals Overlay */}
                <div className="absolute bottom-5 left-5 right-5 p-3.5 rounded-2xl glass-card border border-white/30 backdrop-blur-md shadow-2xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500 text-white shadow-md">
                      <Activity className="h-4 w-4 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground">Health Score: 88/100</h4>
                      <p className="text-[10px] text-emerald-600 font-semibold">Vitals & Pills Synced Live</p>
                    </div>
                  </div>
                  <Badge variant="teal" className="text-[10px]">Verified</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 border-t border-border/50 text-center">
            <div className="p-3 rounded-2xl bg-card border border-border/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">99.4%</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Medication Adherence</div>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">&lt; 3 Sec</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">OCR Report Summaries</div>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">24/7</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">AI Voice Triage</div>
            </div>
            <div className="p-3 rounded-2xl bg-card border border-border/50">
              <div className="text-2xl sm:text-3xl font-extrabold text-teal-600">100%</div>
              <div className="text-xs text-muted-foreground mt-1 font-medium">Caregiver Syncing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Feature Showcase with Real Medical Images */}
      <section className="py-16 bg-muted/30 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 space-y-16">
          {/* Feature 1: Doctor Telehealth */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 order-2 md:order-1 flex flex-col justify-center space-y-4">
              <div>
                <Badge variant="teal" className="gap-1 inline-flex items-center">
                  <Stethoscope className="h-3.5 w-3.5" /> Clinical Network
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Seamless Doctor & Telehealth Consultations
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Connect directly with board-certified physicians and specialists. Review digital prescriptions, share vital logs in real-time, and schedule virtual video calls without long waiting lines.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" /> Double-booking prevention & automatic calendar sync
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" /> Digital Rx written directly into patient pharmacy queue
                </li>
              </ul>
              <div>
                <Link to="/appointments" className="inline-block pt-2">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold gap-1.5">
                    Book Telehealth Appointment &rarr;
                  </Button>
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 order-1 md:order-2 flex items-center justify-center">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 dark:border-white/10 group">
                <img
                  src="/images/carebridge_doctor_telehealth.png"
                  alt="Doctor Telehealth Consultation"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Doctor Verified
                </div>
              </div>
            </div>
          </div>

          {/* Feature 2: Vision OCR Diagnostic Lab */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-6 flex items-center justify-center">
              <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 dark:border-white/10 group">
                <img
                  src="/images/carebridge_lab_ocr.png"
                  alt="Lab Diagnostic OCR Scanning"
                  className="w-full h-80 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-md px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 shadow-md">
                  <Sparkles className="h-4 w-4 text-cyan-500" /> Google Vision OCR Active
                </div>
              </div>
            </div>

            <div className="md:col-span-6 flex flex-col justify-center space-y-4">
              <div>
                <Badge variant="teal" className="gap-1 inline-flex items-center">
                  <FlaskConical className="h-3.5 w-3.5" /> AI Medical OCR
                </Badge>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                Instant Diagnostic Report Translation
              </h2>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">
                Snap a photo of any printed lab test, blood panel, or radiology summary. CareBridge AI extracts text instantly using computer vision and translates medical jargon into plain senior-friendly summaries.
              </p>
              <ul className="space-y-2 text-xs font-semibold text-foreground pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" /> Flags out-of-range cholesterol, HbA1c, and vitals
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600 shrink-0" /> Side-by-side original scanned sheet & plain English translation
                </li>
              </ul>
              <div>
                <Link to="/medical-reports" className="inline-block pt-2">
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold gap-1.5">
                    Try Medical Report OCR Scanner &rarr;
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-background border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="teal" className="mb-3">
              Comprehensive Suite
            </Badge>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-foreground">
              Everything You Need for Senior Healthcare
            </h2>
            <p className="mt-3 text-muted-foreground text-xs sm:text-sm">
              Designed specifically to be intuitive, accessible, and crystal-clear for patients, doctors, and family caregivers alike.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <Card key={i} hoverable className="p-2 h-full flex flex-col justify-between">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr ${feat.color} text-white shadow-md`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <Badge variant="teal">{feat.badge}</Badge>
                    </div>
                    <CardTitle className="text-lg font-bold">{feat.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="mt-auto">
                    <CardDescription className="text-xs sm:text-sm leading-relaxed">
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
