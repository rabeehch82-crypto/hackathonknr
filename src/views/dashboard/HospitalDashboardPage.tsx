import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  BedDouble,
  Siren,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Stethoscope,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { useNavigate } from "react-router-dom";
export function HospitalDashboardPage() {
  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [patientName, setPatientName] = useState("");
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isVerified, setIsVerified] = useState(true);
  const [hospitalInfo, setHospitalInfo] = useState<any>({
    name: "St. Jude Medical Center",
    city: "San Francisco, CA",
    license_number: "HOSP-2026-9812",
    beds: 120,
    status: "Verified",
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    // Demo mode: pre-verified hospital portal
    setIsVerified(true);
    setIsVerifying(false);
  }, []);

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

  const [staffDoctors, setStaffDoctors] = useState([
    { id: "sd1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", status: "Hospital Verified", variant: "success" },
    { id: "sd2", name: "Dr. Alan Grant", specialty: "Pulmonology", status: "Pending Verification", variant: "warning" },
    { id: "sd3", name: "Dr. Lisa Cuddy", specialty: "Endocrinology", status: "Pending Verification", variant: "warning" },
  ]);

  const handleVerifyStaff = (id: string, action: "verify" | "reject") => {
    setStaffDoctors((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: action === "verify" ? "Hospital Verified" : "Rejected",
              variant: action === "verify" ? "success" : "destructive",
            }
          : d
      )
    );
  };

  const handleAdmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName) return;
    alert(`Patient ${patientName} admitted successfully!`);
    setShowAdmitModal(false);
    setPatientName("");
  };

  if (isVerifying) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
        <p className="text-muted-foreground font-semibold">Verifying credentials...</p>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="flex flex-col min-h-[60vh] items-center justify-center p-4">
        <Card className="w-full max-w-md border-amber-500/30 bg-amber-500/5 shadow-xl glass-card text-center">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20 text-amber-600">
              <Clock className="h-8 w-8" />
            </div>
            <CardTitle className="text-xl">Registration Pending</CardTitle>
            <CardDescription className="text-sm">
              Your hospital registration ({hospitalInfo?.name || "Unknown"}) is currently pending verification from the Super Admin.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              You will gain full access to the Hospital Dashboard, Bed Management, and Staff Credentialing once your license is approved.
            </p>
            <Button 
              variant="outline" 
              className="w-full border-amber-500/30 text-amber-700 hover:bg-amber-500/10 gap-2"
              onClick={() => navigate("/login")}
            >
              Sign Out for Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            Real-time bed occupancy, emergency room triage, and physician staff credentialing.
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
            <Stethoscope className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {staffDoctors.filter((d) => d.status === "Hospital Verified").length} / {staffDoctors.length} Staff
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {staffDoctors.filter((d) => d.status === "Pending Verification").length} Pending Verification
          </span>
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

      {/* Hospital Staff Doctor Verification */}
      <Card className="p-2 border-teal-500/30">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" /> Hospital Staff Doctor Verification
              </CardTitle>
              <CardDescription className="text-xs">Approve attending physicians and grant hospital EMR permissions</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {staffDoctors.map((doc) => (
              <div key={doc.id} className="p-4 rounded-2xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{doc.name}</h4>
                    <Badge variant={doc.variant as any}>{doc.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">Department: <strong>{doc.specialty}</strong></p>
                </div>

                <div className="flex items-center gap-2">
                  {doc.status === "Pending Verification" ? (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyStaff(doc.id, "verify")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9 font-bold shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Verify Hospital Credentials
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyStaff(doc.id, "reject")}
                        className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1.5 h-9"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  ) : (
                    <Badge variant="success" className="gap-1 px-3 py-1 text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Verified Staff
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
