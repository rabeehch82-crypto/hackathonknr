import { useState } from "react";
import {
  Stethoscope,
  Users,
  AlertTriangle,
  FileText,
  Plus,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Video,
  Mic,
  PhoneOff,
  Activity,
  Heart,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function DoctorDashboardPage() {
  const [showRxModal, setShowRxModal] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState("Eleanor Vance");
  const [rxForm, setRxForm] = useState({
    medication: "",
    dosage: "",
    instructions: "",
  });

  const patients = [
    {
      name: "Eleanor Vance",
      age: 72,
      risk: "High Priority",
      riskColor: "destructive",
      condition: "Hypertension & Mild Fatigue",
      bp: "142/90",
      time: "10:00 AM Today",
      lastReport: "Blood Lipid Panel (Analyzed by AI)",
    },
    {
      name: "Arthur Pendelton",
      age: 68,
      risk: "Moderate Risk",
      riskColor: "warning",
      condition: "Type 2 Diabetes Glucose Spike",
      bp: "128/82",
      time: "11:30 AM Today",
      lastReport: "HbA1c Lab Scan",
    },
    {
      name: "Marcus Thorne",
      age: 65,
      risk: "Stable",
      riskColor: "success",
      condition: "Post-Op Cardiology Checkup",
      bp: "120/78",
      time: "02:00 PM Today",
      lastReport: "ECG Summary",
    },
  ];

  const handleRxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Prescription for ${selectedPatient} issued successfully!`);
    setShowRxModal(false);
    setRxForm({ medication: "", dosage: "", instructions: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Clinical Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Stethoscope className="h-7 w-7 text-teal-600" /> Dr. Sarah Jenkins Portal
            </h1>
            <Badge variant="teal">Cardiology Specialist</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Clinical patient queue, AI triage alerts, and prescription management.
          </p>
        </div>

        <Button
          onClick={() => setShowRxModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Issue New Prescription
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Today's Appointments</span>
            <Users className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">8 Patients</span>
            <span className="text-xs text-muted-foreground">3 Virtual • 5 In-clinic</span>
          </div>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-rose-600 dark:text-rose-400 uppercase">High Risk Triage</span>
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600 dark:text-rose-400">2 Flagged</span>
            <span className="text-xs text-rose-600/80 font-medium">Requires immediate review</span>
          </div>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">OCR Scans Pending</span>
            <FileText className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">4 Lab Reports</span>
            <span className="text-xs text-muted-foreground">AI Summaries Ready</span>
          </div>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Rx Issued Today</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold">5 Prescriptions</span>
            <span className="text-xs text-emerald-600 font-medium">Synced to pharmacy</span>
          </div>
        </Card>
      </div>

      {/* Patient Queue & Triage Table */}
      <Card className="border-teal-500/20">
        <CardHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" /> Patient Queue & AI Risk Triage
              </CardTitle>
              <CardDescription className="text-xs">
                Prioritized by real-time vital metrics and AI risk score
              </CardDescription>
            </div>

            <div className="relative w-full sm:w-64">
              <Input
                placeholder="Search patient name..."
                icon={<Search className="h-4 w-4" />}
                className="h-9 text-xs"
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          <div className="space-y-3">
            {patients.map((pat, idx) => (
              <div
                key={idx}
                className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl border bg-card/60 hover:bg-muted/50 transition-all glass-card"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-teal-500/10 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center shrink-0 border border-teal-500/20">
                    {pat.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">{pat.name} ({pat.age} yrs)</h4>
                      <Badge variant={pat.riskColor as any}>{pat.risk}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{pat.condition}</p>
                    <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                      <span><strong>BP:</strong> {pat.bp}</span>
                      <span>•</span>
                      <span><strong>Time:</strong> {pat.time}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-teal-600 font-medium">
                        <Sparkles className="h-3 w-3" /> {pat.lastReport}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-center">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedPatient(pat.name);
                      setShowRxModal(true);
                    }}
                    className="h-9 text-xs rounded-xl border-teal-500/30 gap-1.5"
                  >
                    <Plus className="h-3.5 w-3.5 text-teal-600" /> Write Rx
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={() => {
                      setSelectedPatient(pat.name);
                      setShowConsultationModal(true);
                    }}
                    className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-xl gap-1"
                  >
                    Start Consultation <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Telehealth Consultation Modal */}
      <Modal
        isOpen={showConsultationModal}
        onClose={() => setShowConsultationModal(false)}
        title={`Live Telehealth Consultation - ${selectedPatient}`}
        description="Encrypted WebRTC Clinical Room with Real-Time AI Vitals Monitoring."
      >
        <div className="space-y-4">
          <div className="relative h-52 w-full rounded-2xl bg-neutral-900 overflow-hidden flex items-center justify-center border shadow-inner">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />
            <div className="text-center space-y-2 z-10">
              <div className="mx-auto h-16 w-16 rounded-full bg-teal-500/20 border-2 border-teal-400 text-teal-300 flex items-center justify-center animate-pulse">
                <Video className="h-8 w-8" />
              </div>
              <p className="text-white text-sm font-bold">{selectedPatient} is Connected</p>
              <Badge variant="teal" className="gap-1 text-[10px]">
                <Activity className="h-3 w-3 animate-pulse text-emerald-400" /> HD Live Stream Active
              </Badge>
            </div>

            {/* Simulated Vitals HUD */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono bg-black/60 backdrop-blur-md p-2 rounded-xl border border-white/10">
              <span className="flex items-center gap-1 text-rose-400 font-bold">
                <Heart className="h-3.5 w-3.5 animate-pulse" /> 76 BPM
              </span>
              <span className="text-cyan-300">BP 138/86</span>
              <span className="text-emerald-400">SpO2 98%</span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-800 dark:text-teal-200">
            <p className="font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="h-3.5 w-3.5 text-teal-600" /> Clinical AI Assist Summary:
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Patient reports mild fatigue following morning medication. Vitals are within acceptable safe ranges. Recommendation: Review potassium and lipid levels.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => {
                setShowConsultationModal(false);
                setShowRxModal(true);
              }}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11 text-xs gap-1.5"
            >
              <Plus className="h-4 w-4" /> Issue Rx & Notes
            </Button>
            <Button
              variant="destructive"
              onClick={() => setShowConsultationModal(false)}
              className="rounded-xl h-11 text-xs gap-1.5"
            >
              <PhoneOff className="h-4 w-4" /> End Call
            </Button>
          </div>
        </div>
      </Modal>

      {/* Prescription Writer Modal */}
      <Modal
        isOpen={showRxModal}
        onClose={() => setShowRxModal(false)}
        title={`Issue Prescription for ${selectedPatient}`}
        description="Prescription will be digitally signed and synced to the patient's CareBridge App."
      >
        <form onSubmit={handleRxSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Medication Name</label>
            <Input
              required
              placeholder="e.g. Metformin HCl / Lisinopril"
              value={rxForm.medication}
              onChange={(e) => setRxForm({ ...rxForm, medication: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Dosage & Frequency</label>
            <Input
              required
              placeholder="e.g. 500mg - 2 times daily after meals"
              value={rxForm.dosage}
              onChange={(e) => setRxForm({ ...rxForm, dosage: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Special Instructions for Patient</label>
            <textarea
              rows={3}
              placeholder="e.g. Take with plenty of water. Avoid alcohol."
              value={rxForm.instructions}
              onChange={(e) => setRxForm({ ...rxForm, instructions: e.target.value })}
              className="w-full rounded-xl border bg-background p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Sign & Issue Prescription
          </Button>
        </form>
      </Modal>
    </div>
  );
}
