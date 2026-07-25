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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function DoctorDashboardPage() {
  const [showRxModal, setShowRxModal] = useState(false);
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
          <div className="mt-2 text-3xl font-extrabold text-foreground">8 Patients</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">3 Virtual • 5 In-clinic</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">High Risk Triage</span>
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">2 Flagged</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Requires immediate review</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">OCR Scans Pending</span>
            <FileText className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">4 Lab Reports</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">AI Summaries Ready</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Rx Issued Today</span>
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">5 Prescriptions</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Synced to pharmacy</span>
        </Card>
      </div>

      {/* Patient Queue & Clinical Triage */}
      <Card className="p-2">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-teal-600" /> Patient Queue & AI Risk Triage
              </CardTitle>
              <CardDescription className="text-xs">Prioritized by real-time vital metrics and AI risk score</CardDescription>
            </div>
            <Input
              placeholder="Search patient name..."
              icon={<Search className="h-4 w-4" />}
              className="w-full sm:w-64 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {patients.map((pat, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl border bg-card hover:border-teal-500/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card"
              >
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-teal-500/15 text-teal-700 dark:text-teal-300 font-bold flex items-center justify-center text-sm shrink-0">
                    {pat.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-foreground">{pat.name} ({pat.age} yrs)</h4>
                      <Badge variant={pat.riskColor as any}>{pat.risk}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{pat.condition}</p>
                    <div className="flex items-center gap-4 text-[11px] text-muted-foreground mt-2">
                      <span>BP: <strong>{pat.bp}</strong></span>
                      <span>Time: <strong>{pat.time}</strong></span>
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
                  <Button size="sm" className="h-9 text-xs bg-teal-600 hover:bg-teal-700 text-white rounded-xl gap-1">
                    Start Consultation <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
