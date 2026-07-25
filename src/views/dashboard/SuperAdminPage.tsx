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
  FileText,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export function SuperAdminPage() {
  const [hospitals, setHospitals] = useState([
    { id: "h1", name: "St. Jude Memorial Hospital", city: "New York, NY", status: "Verified", variant: "success", license: "HOSP-9908" },
    { id: "h2", name: "Metro Care Medical Center", city: "Boston, MA", status: "Pending Verification", variant: "warning", license: "HOSP-7761" },
    { id: "h3", name: "Sun Valley Health Clinic", city: "Phoenix, AZ", status: "Pending Verification", variant: "warning", license: "HOSP-4432" },
  ]);

  const [doctors, setDoctors] = useState([
    { id: "d1", name: "Dr. Sarah Jenkins", specialty: "Cardiology", hospital: "St. Jude Memorial", status: "Verified", variant: "success" },
    { id: "d2", name: "Dr. Alan Grant", specialty: "Pulmonology", hospital: "Metro Care", status: "Pending Credential Review", variant: "warning" },
    { id: "d3", name: "Dr. Lisa Cuddy", specialty: "Endocrinology", hospital: "Sun Valley", status: "Pending Credential Review", variant: "warning" },
  ]);

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
  };

  const handleVerifyDoctor = (id: string, action: "verify" | "reject") => {
    setDoctors((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: action === "verify" ? "Verified" : "Rejected",
              variant: action === "verify" ? "success" : "destructive",
            }
          : d
      )
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
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

        <Badge variant="success" className="px-4 py-2 text-xs font-bold gap-1.5 self-start sm:self-auto">
          <Activity className="h-4 w-4" /> System Health: 100% Operational
        </Badge>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Verified Hospitals</span>
            <Building2 className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">14 Organizations</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">2 Pending Verifications</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Active Doctors</span>
            <Stethoscope className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">148 Physicians</div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">2 Credentials Pending</span>
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

      {/* Hospital Verification Queue */}
      <Card className="p-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" /> Hospital Verification Requests
              </CardTitle>
              <CardDescription className="text-xs">Verify healthcare licenses before granting platform access</CardDescription>
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
                    <h4 className="text-sm font-bold">{h.name}</h4>
                    <Badge variant={h.variant as any}>{h.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{h.city} • License: {h.license}</p>
                </div>
                {h.status === "Pending Verification" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerifyHospital(h.id, "verify")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1 h-9"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Approve & Verify
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyHospital(h.id, "reject")}
                      className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1 h-9"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Doctor Credentialing Queue */}
      <Card className="p-2">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-teal-600" /> Doctor Credential Review
              </CardTitle>
              <CardDescription className="text-xs">Medical board registration and specialty verification</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {doctors.map((d) => (
              <div key={d.id} className="p-4 rounded-2xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold">{d.name}</h4>
                    <Badge variant={d.variant as any}>{d.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{d.specialty} • {d.hospital}</p>
                </div>
                {d.status === "Pending Credential Review" && (
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleVerifyDoctor(d.id, "verify")}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1 h-9"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5" /> Confirm Credentials
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyDoctor(d.id, "reject")}
                      className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1 h-9"
                    >
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
