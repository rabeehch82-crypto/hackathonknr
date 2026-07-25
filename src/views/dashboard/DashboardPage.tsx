import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  Heart,
  Droplet,
  Wind,
  Plus,
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ArrowUpRight,
  ShieldAlert,
  Bot,
  FileText,
  Pill,
  Volume2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export function DashboardPage() {
  const [showLogVitalModal, setShowLogVitalModal] = useState(false);
  const [vitals, setVitals] = useState({
    heartRate: 72,
    bpSys: 122,
    bpDia: 80,
    glucose: 105,
    spo2: 98,
  });
  const [pillsTaken, setPillsTaken] = useState<{ [key: string]: boolean }>({
    "metformin-8am": true,
    "lisinopril-1pm": false,
    "atorvastatin-8pm": false,
  });

  const [vitalInput, setVitalInput] = useState({
    type: "heartRate",
    val: "",
  });

  const togglePill = (id: string) => {
    setPillsTaken((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleLogVital = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vitalInput.val) return;
    const num = parseInt(vitalInput.val);
    if (vitalInput.type === "heartRate") setVitals((v) => ({ ...v, heartRate: num }));
    if (vitalInput.type === "glucose") setVitals((v) => ({ ...v, glucose: num }));
    if (vitalInput.type === "spo2") setVitals((v) => ({ ...v, spo2: num }));
    setShowLogVitalModal(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Hello, Eleanor Vance 👋
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Senior Care Activated
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Here is your daily health overview, vital logs, and pill schedule.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowLogVitalModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" /> Log Vital
          </Button>
          <Link to="/ai-assistant">
            <Button variant="outline" className="rounded-xl gap-2 border-teal-500/30">
              <Bot className="h-4 w-4 text-teal-600" /> Ask AI Health Assistant
            </Button>
          </Link>
        </div>
      </div>

      {/* Grid Row 1: Health Score Gauge & AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Health Score Gauge */}
        <Card className="p-2 border-teal-500/30 bg-gradient-to-br from-teal-500/10 via-background to-background">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="h-5 w-5 text-teal-600" /> Overall Health Score
              </CardTitle>
              <Badge variant="success">Excellent</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-4 text-center">
            <div className="relative flex items-center justify-center h-32 w-32 rounded-full border-8 border-teal-500/20 bg-teal-500/5 my-2">
              <div className="flex flex-col items-center">
                <span className="text-4xl font-black text-teal-600 dark:text-teal-400">88</span>
                <span className="text-[10px] font-semibold text-muted-foreground uppercase">Out of 100</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 max-w-xs">
              Calculated from vitals stability (92%), pill adherence (85%), and low symptom risk.
            </p>
          </CardContent>
        </Card>

        {/* AI Health Summary Card */}
        <Card className="lg:col-span-2 p-2 border-cyan-500/30">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-500" /> AI Diagnostic Insight
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-xs gap-1 text-teal-600">
                <Volume2 className="h-3.5 w-3.5" /> Read Aloud
              </Button>
            </div>
            <CardDescription className="text-xs">Updated 15 mins ago by OpenAI Health Engine</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-2">
            <div className="p-3.5 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs sm:text-sm text-foreground leading-relaxed">
              "Good morning Eleanor. Your blood pressure (122/80) and fasting glucose (105 mg/dL) are in optimal target ranges. Remember to take your Lisinopril 10mg pill with lunch at 1:00 PM."
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-muted/60 text-xs">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Caregiver Sync</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Connected
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/60 text-xs">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Pill Adherence</span>
                <span className="font-semibold text-teal-600 dark:text-teal-400 mt-0.5 block">100% Yesterday</span>
              </div>
              <div className="p-3 rounded-xl bg-muted/60 text-xs col-span-2 sm:col-span-1">
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Emergency QR</span>
                <span className="font-semibold text-foreground mt-0.5 block">Ready & Active</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Row 2: Vitals Tracker Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-teal-600" /> Vital Metrics
          </h2>
          <span className="text-xs text-muted-foreground">Click 'Log Vital' to update values</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Heart Rate */}
          <Card hoverable className="p-4 border-l-4 border-l-rose-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Heart Rate</span>
              <Heart className="h-5 w-5 text-rose-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{vitals.heartRate}</span>
              <span className="text-xs text-muted-foreground font-medium">BPM</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Badge variant="success">Normal (60-100)</Badge>
              <span className="text-[10px] text-muted-foreground">Log 8:00 AM</span>
            </div>
          </Card>

          {/* Blood Pressure */}
          <Card hoverable className="p-4 border-l-4 border-l-teal-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Blood Pressure</span>
              <Activity className="h-5 w-5 text-teal-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{vitals.bpSys}/{vitals.bpDia}</span>
              <span className="text-xs text-muted-foreground font-medium">mmHg</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Badge variant="teal">Optimal</Badge>
              <span className="text-[10px] text-muted-foreground">Log 8:00 AM</span>
            </div>
          </Card>

          {/* Blood Glucose */}
          <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Blood Glucose</span>
              <Droplet className="h-5 w-5 text-cyan-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{vitals.glucose}</span>
              <span className="text-xs text-muted-foreground font-medium">mg/dL</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Badge variant="success">Fasted Normal</Badge>
              <span className="text-[10px] text-muted-foreground">Log 7:30 AM</span>
            </div>
          </Card>

          {/* SpO2 */}
          <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase">Oxygen (SpO2)</span>
              <Wind className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground">{vitals.spo2}</span>
              <span className="text-xs text-muted-foreground font-medium">%</span>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <Badge variant="success">Excellent</Badge>
              <span className="text-[10px] text-muted-foreground">Log 8:00 AM</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Grid Row 3: Pill Schedule & Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Pill Schedule */}
        <Card className="p-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Pill className="h-5 w-5 text-teal-600" /> Today's Medication Schedule
              </CardTitle>
              <CardDescription className="text-xs">Click checkmark to log dose taken</CardDescription>
            </div>
            <Link to="/medicine-reminder">
              <Button variant="ghost" size="sm" className="text-xs text-teal-600 gap-1">
                View All <ArrowUpRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2.5">
              {/* Pill 1 */}
              <div
                onClick={() => togglePill("metformin-8am")}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  pillsTaken["metformin-8am"]
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-background hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      pillsTaken["metformin-8am"] ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    8 AM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Metformin 500mg</h4>
                    <p className="text-[11px] text-muted-foreground">1 Tablet after breakfast</p>
                  </div>
                </div>
                <Badge variant={pillsTaken["metformin-8am"] ? "success" : "outline"}>
                  {pillsTaken["metformin-8am"] ? "Taken ✅" : "Pending"}
                </Badge>
              </div>

              {/* Pill 2 */}
              <div
                onClick={() => togglePill("lisinopril-1pm")}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  pillsTaken["lisinopril-1pm"]
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-teal-500/10 border-teal-500/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      pillsTaken["lisinopril-1pm"] ? "bg-emerald-500 text-white" : "bg-teal-600 text-white"
                    }`}
                  >
                    1 PM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Lisinopril 10mg</h4>
                    <p className="text-[11px] text-muted-foreground">1 Tablet with lunch</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={pillsTaken["lisinopril-1pm"] ? "ghost" : "default"}
                  className="h-8 text-xs bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {pillsTaken["lisinopril-1pm"] ? "Taken ✅" : "Take Dose"}
                </Button>
              </div>

              {/* Pill 3 */}
              <div
                onClick={() => togglePill("atorvastatin-8pm")}
                className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                  pillsTaken["atorvastatin-8pm"]
                    ? "bg-emerald-500/10 border-emerald-500/30"
                    : "bg-background hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      pillsTaken["atorvastatin-8pm"] ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    8 PM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Atorvastatin 20mg</h4>
                    <p className="text-[11px] text-muted-foreground">1 Tablet before bed</p>
                  </div>
                </div>
                <Badge variant="outline">Scheduled</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Appointments */}
        <Card className="p-2">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-600" /> Upcoming Appointment
              </CardTitle>
              <CardDescription className="text-xs">Next consultation scheduled</CardDescription>
            </div>
            <Link to="/appointments">
              <Button variant="ghost" size="sm" className="text-xs text-teal-600 gap-1">
                Book New <Plus className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-2xl border bg-card glass-card space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm">
                    SJ
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Dr. Sarah Jenkins</h4>
                    <p className="text-xs text-muted-foreground">Cardiology & Hypertension Specialist</p>
                  </div>
                </div>
                <Badge variant="teal">Telehealth</Badge>
              </div>

              <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Calendar className="h-4 w-4 text-teal-600" /> Tomorrow, July 26
                </div>
                <div className="flex items-center gap-1.5 font-medium text-foreground">
                  <Clock className="h-4 w-4 text-teal-600" /> 10:00 AM (30 mins)
                </div>
              </div>

              <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl h-10 gap-2 text-xs">
                Join Virtual Consultation Room
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Log Vital Modal */}
      <Modal
        isOpen={showLogVitalModal}
        onClose={() => setShowLogVitalModal(false)}
        title="Log Vital Measurement"
        description="Select a metric and enter your current reading."
      >
        <form onSubmit={handleLogVital} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Select Vital Metric</label>
            <select
              value={vitalInput.type}
              onChange={(e) => setVitalInput({ ...vitalInput, type: e.target.value })}
              className="w-full h-10 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="heartRate">Heart Rate (BPM)</option>
              <option value="glucose">Blood Glucose (mg/dL)</option>
              <option value="spo2">Oxygen SpO2 (%)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Current Value</label>
            <Input
              type="number"
              required
              placeholder="e.g. 75"
              value={vitalInput.val}
              onChange={(e) => setVitalInput({ ...vitalInput, val: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Save Log Entry
          </Button>
        </form>
      </Modal>
    </div>
  );
}
