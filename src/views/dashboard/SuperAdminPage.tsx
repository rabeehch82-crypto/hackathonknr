import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Stethoscope,
  Users,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Sparkles,
  BarChart3,
  Activity,
  Plus,
  RefreshCw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function SuperAdminPage() {
  const [showAddDoctorModal, setShowAddDoctorModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialty: "Cardiology",
    hospital: "St. Jude Memorial Hospital",
    license: "",
  });

  const [hospitals, setHospitals] = useState([
    { id: "h1", name: "St. Jude Memorial Hospital", city: "New York, NY", status: "Verified", variant: "success", license: "HOSP-9908" },
    { id: "h2", name: "Metro Care Medical Center", city: "Boston, MA", status: "Pending Verification", variant: "warning", license: "HOSP-7761" },
    { id: "h3", name: "Sun Valley Health Clinic", city: "Phoenix, AZ", status: "Pending Verification", variant: "warning", license: "HOSP-4432" },
  ]);

  const [doctors, setDoctors] = useState([
    { id: "d1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", hospital: "St. Jude Memorial", license: "MD-88402", status: "Verified", variant: "success" },
    { id: "d2", name: "Dr. Alan Grant", specialty: "Pulmonology", hospital: "Metro Care Medical", license: "MD-67210", status: "Pending Credential Review", variant: "warning" },
    { id: "d3", name: "Dr. Lisa Cuddy", specialty: "Endocrinology", hospital: "Sun Valley Health", license: "MD-91024", status: "Pending Credential Review", variant: "warning" },
    { id: "d4", name: "Dr. Robert Vance", specialty: "General Medicine", hospital: "City Health Center", license: "MD-33109", status: "Verified", variant: "success" },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyHospital = (id: string, action: "verify" | "reject") => {
    setHospitals((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              status: action === "verify" ? "Verified" : "Rejected",
              variant: action === "verify" ? "success" : "destructive",
            }
          : h
      )
    );
    showToast(`Hospital ${action === "verify" ? "Verified" : "Rejected"} successfully!`);
  };

  const handleVerifyDoctor = (id: string, action: "verify" | "reject" | "revoke") => {
    setDoctors((prev) =>
      prev.map((d) => {
        if (d.id !== id) return d;
        if (action === "verify") return { ...d, status: "Verified", variant: "success" };
        if (action === "reject") return { ...d, status: "Rejected", variant: "destructive" };
        return { ...d, status: "Pending Credential Review", variant: "warning" };
      })
    );
    const docName = doctors.find((d) => d.id === id)?.name;
    showToast(`${docName} status updated to: ${action.toUpperCase()}`);
  };

  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDoctor.name) return;
    const added = {
      id: "d_" + Date.now(),
      name: newDoctor.name,
      specialty: newDoctor.specialty,
      hospital: newDoctor.hospital,
      license: newDoctor.license || "MD-" + Math.floor(10000 + Math.random() * 90000),
      status: "Pending Credential Review",
      variant: "warning",
    };
    setDoctors((prev) => [added, ...prev]);
    setShowAddDoctorModal(false);
    setNewDoctor({ name: "", specialty: "Cardiology", hospital: "St. Jude Memorial Hospital", license: "" });
    showToast(`${added.name} submitted for credential review!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 p-4 rounded-xl bg-teal-600 text-white font-bold text-xs shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-4 duration-200">
          <Sparkles className="h-4 w-4" /> {toastMessage}
        </div>
      )}

      {/* Super Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-teal-600" /> CareBridge Super Admin Control
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> System Master
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Global healthcare organization verification, doctor credentialing, and security governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowAddDoctorModal(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
          >
            <Plus className="h-4 w-4" /> Submit Doctor for Review
          </Button>
        </div>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Verified Hospitals</span>
            <Building2 className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {hospitals.filter((h) => h.status === "Verified").length} / {hospitals.length} Verified
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {hospitals.filter((h) => h.status === "Pending Verification").length} Pending Verification
          </span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Verified Doctors</span>
            <Stethoscope className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {doctors.filter((d) => d.status === "Verified").length} / {doctors.length} Active
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">
            {doctors.filter((d) => d.status === "Pending Credential Review").length} Pending Credentialing
          </span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Patients</span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">12,450 Seniors</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">99.4% Pill Adherence</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">AI Transactions Today</span>
            <Sparkles className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">3,890 Operations</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">GPT-4o + Vision OCR</span>
        </Card>
      </div>

      {/* Doctor Credential Verification Queue */}
      <Card className="p-2 border-teal-500/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" /> Doctor Credential Verification Queue
              </CardTitle>
              <CardDescription className="text-xs">Verify physician licenses, board certifications, and clinical privileges</CardDescription>
            </div>
            <Button onClick={() => setShowAddDoctorModal(true)} variant="outline" size="sm" className="rounded-xl gap-1 text-xs">
              <Plus className="h-3.5 w-3.5 text-teal-600" /> Add Doctor
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {doctors.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{d.name}</h4>
                    <Badge variant={d.variant as any}>{d.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Specialty: <strong>{d.specialty}</strong> • Hospital: <strong>{d.hospital}</strong> • License: <strong>{d.license}</strong>
                  </p>
                </div>

                {/* Verification Actions */}
                <div className="flex items-center gap-2">
                  {d.status === "Pending Credential Review" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyDoctor(d.id, "verify")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9 font-bold shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Verify Credentials
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyDoctor(d.id, "reject")}
                        className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1.5 h-9"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}

                  {d.status === "Verified" && (
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="gap-1 px-3 py-1 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Practitioner
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVerifyDoctor(d.id, "revoke")}
                        className="text-xs text-muted-foreground hover:text-rose-600 h-8"
                      >
                        Revoke
                      </Button>
                    </div>
                  )}

                  {d.status === "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyDoctor(d.id, "revoke")}
                      className="text-xs rounded-xl h-8 gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Re-evaluate
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Hospital Verification Queue */}
      <Card className="p-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" /> Hospital Verification Requests
              </CardTitle>
              <CardDescription className="text-xs">Verify healthcare facility operating licenses before granting platform access</CardDescription>
            </div>
            <Input placeholder="Search hospital..." icon={<Search className="h-4 w-4" />} className="w-full sm:w-64 text-xs" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {hospitals.map((h) => (
              <div key={h.id} className="p-4 rounded-2xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{h.name}</h4>
                    <Badge variant={h.variant as any}>{h.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.city} • License: {h.license}</p>
                </div>
                {h.status === "Pending Verification" ? (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerifyHospital(h.id, "verify")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9 font-bold shadow-sm"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Approve & Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyHospital(h.id, "reject")}
                      className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1.5 h-9"
                    >
                      <XCircle className="h-4 w-4" /> Reject
                    </Button>
                  </div>
                ) : (
                  <Badge variant={h.variant as any} className="gap-1 px-3 py-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> {h.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Doctor Verification Modal */}
      <Modal
        isOpen={showAddDoctorModal}
        onClose={() => setShowAddDoctorModal(false)}
        title="Submit Doctor Credentials for Verification"
        description="Registers a new physician into the verification pipeline."
      >
        <form onSubmit={handleAddDoctorSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Doctor Full Name</label>
            <Input
              required
              placeholder="e.g. Dr. Alan Grant"
              value={newDoctor.name}
              onChange={(e) => setNewDoctor({ ...newDoctor, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Specialty</label>
            <Input
              required
              placeholder="e.g. Cardiology / Pulmonology"
              value={newDoctor.specialty}
              onChange={(e) => setNewDoctor({ ...newDoctor, specialty: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Medical License Number</label>
            <Input
              placeholder="e.g. MD-67210"
              value={newDoctor.license}
              onChange={(e) => setNewDoctor({ ...newDoctor, license: e.target.value })}
            />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Submit Credentials for Verification
          </Button>
        </form>
      </Modal>
    </div>
  );
}
