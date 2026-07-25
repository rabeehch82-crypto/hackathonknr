import { useState } from "react";
import {
  Building2,
  Users,
  BedDouble,
  Siren,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function HospitalDashboardPage() {
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [patientName, setPatientName] = useState("");

  const departments = [
    { name: "Emergency & Trauma", bedsTotal: 25, bedsOcc: 21, status: "High Capacity", variant: "warning" },
    { name: "Intensive Care Unit (ICU)", bedsTotal: 15, bedsOcc: 14, status: "Critical", variant: "destructive" },
    { name: "Cardiology Ward", bedsTotal: 30, bedsOcc: 18, status: "Stable", variant: "success" },
    { name: "General Medicine", bedsTotal: 50, bedsOcc: 32, status: "Optimal", variant: "teal" },
  ];

  const admissions = [
    { name: "Eleanor Vance", age: 72, dept: "Cardiology Ward", bed: "C-104", priority: "High Priority", time: "10:15 AM Today" },
    { name: "Arthur Pendelton", age: 68, dept: "ICU Unit", bed: "ICU-05", priority: "Critical", time: "08:30 AM Today" },
    { name: "Clara Oswald", age: 61, dept: "Emergency Room", bed: "ER-02", priority: "Moderate", time: "11:00 AM Today" },
  ];

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;
    alert(`Patient ${patientName} admitted successfully!`);
    setShowAdmitModal(false);
    setPatientName("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hospital Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Building2 className="h-7 w-7 text-teal-600" /> St. Jude Memorial Hospital Admin
            </h1>
            <Badge variant="teal">Hospital Management</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time bed occupancy, emergency room triage, and patient admission registry.
          </p>
        </div>

        <Button
          onClick={() => setShowAdmitModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Admit New Patient
        </Button>
      </div>

      {/* Hospital Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Bed Occupancy Rate</span>
            <BedDouble className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">85 / 120</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">70.8% Occupied • 35 Free</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">ER Triage Queue</span>
            <Siren className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">6 Patients</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">2 Critical Triage Cases</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">On-Duty Doctors</span>
            <Users className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">18 Physicians</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Across 6 Departments</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Discharges Today</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">12 Completed</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Bed Turnover Ready</span>
        </Card>
      </div>

      {/* Ward Status & Admission Registry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Ward Status */}
        <Card className="p-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BedDouble className="h-5 w-5 text-teal-600" /> Ward Bed Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {departments.map((dept, idx) => (
              <div key={idx} className="p-3 rounded-xl border bg-card space-y-1">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{dept.name}</span>
                  <Badge variant={dept.variant as any}>{dept.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Beds: {dept.bedsOcc} / {dept.bedsTotal} occupied
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Admission Queue */}
        <Card className="lg:col-span-2 p-2">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" /> Recent Inpatient Admissions
              </CardTitle>

              <Input placeholder="Search patient..." icon={<Search className="h-4 w-4" />} className="w-48 text-xs" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {admissions.map((adm, idx) => (
              <div key={idx} className="p-4 rounded-2xl border glass-card flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{adm.name} ({adm.age} yrs)</h4>
                    <Badge variant={adm.priority === "Critical" ? "destructive" : "teal"}>{adm.priority}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{adm.dept} • Bed {adm.bed}</p>
                </div>
                <span className="text-xs text-muted-foreground">{adm.time}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Admit Patient Modal */}
      <Modal
        isOpen={showAdmitModal}
        onClose={() => setShowAdmitModal(false)}
        title="Admit Inpatient"
        description="Register a new patient into hospital ward."
      >
        <form onSubmit={handleAdmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Patient Full Name</label>
            <Input
              required
              placeholder="e.g. John Doe"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Department Ward</label>
            <select className="w-full h-10 rounded-xl border bg-background px-3 text-sm">
              <option>Emergency & Trauma</option>
              <option>Intensive Care Unit (ICU)</option>
              <option>Cardiology Ward</option>
              <option>General Medicine</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Confirm Admission & Assign Bed
          </Button>
        </form>
      </Modal>
    </div>
  );
}
