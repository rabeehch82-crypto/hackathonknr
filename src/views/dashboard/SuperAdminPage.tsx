import { useState } from "react";
import {
  ShieldCheck,
  Building2,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  Activity,
  Plus,
  RefreshCw,
  MapPin,
  FileCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function SuperAdminPage() {
  const [showAddHospitalModal, setShowAddHospitalModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [newHospital, setNewHospital] = useState({
    name: "",
    city: "",
    license: "",
    beds: "100",
  });

  const [hospitals, setHospitals] = useState([
    { id: "h1", name: "St. Jude Memorial Hospital", city: "New York, NY", status: "Verified", variant: "success", license: "HOSP-9908", beds: 120 },
    { id: "h2", name: "Metro Care Medical Center", city: "Boston, MA", status: "Pending Verification", variant: "warning", license: "HOSP-7761", beds: 250 },
    { id: "h3", name: "Sun Valley Health Clinic", city: "Phoenix, AZ", status: "Pending Verification", variant: "warning", license: "HOSP-4432", beds: 80 },
    { id: "h4", name: "Apex Specialty Surgical Center", city: "Chicago, IL", status: "Verified", variant: "success", license: "HOSP-1102", beds: 150 },
    { id: "h5", name: "Green Valley Community Hospital", city: "Seattle, WA", status: "Pending Verification", variant: "warning", license: "HOSP-5590", beds: 95 },
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleVerifyHospital = (id: string, action: "verify" | "reject" | "revoke") => {
    setHospitals((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h;
        if (action === "verify") return { ...h, status: "Verified", variant: "success" };
        if (action === "reject") return { ...h, status: "Rejected", variant: "destructive" };
        return { ...h, status: "Pending Verification", variant: "warning" };
      })
    );
    const hospName = hospitals.find((h) => h.id === id)?.name;
    showToast(`${hospName} status updated to: ${action.toUpperCase()}`);
  };

  const handleAddHospitalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHospital.name || !newHospital.city) return;
    const added = {
      id: "h_" + Date.now(),
      name: newHospital.name,
      city: newHospital.city,
      license: newHospital.license || "HOSP-" + Math.floor(1000 + Math.random() * 9000),
      beds: parseInt(newHospital.beds) || 100,
      status: "Pending Verification",
      variant: "warning",
    };
    setHospitals((prev) => [added, ...prev]);
    setShowAddHospitalModal(false);
    setNewHospital({ name: "", city: "", license: "", beds: "100" });
    showToast(`${added.name} registered for Super Admin verification!`);
  };

  const filteredHospitals = hospitals.filter(
    (h) =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.license.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              <ShieldCheck className="h-7 w-7 text-teal-600" /> Super Admin — Hospital Verification Portal
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> System Master
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Review, verify, and grant platform access to registered hospitals, medical centers, and clinics.
          </p>
        </div>

        <Button
          onClick={() => setShowAddHospitalModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Register New Hospital
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Verified Hospitals</span>
            <Building2 className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {hospitals.filter((h) => h.status === "Verified").length} / {hospitals.length}
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Active on Platform</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pending Verifications</span>
            <FileCheck className="h-5 w-5 text-amber-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {hospitals.filter((h) => h.status === "Pending Verification").length} Hospitals
          </div>
          <span className="text-[11px] text-amber-600 font-medium mt-1 block">Awaiting Admin License Review</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Total Hospital Beds</span>
            <Users className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">
            {hospitals.reduce((sum, h) => sum + h.beds, 0)} Beds
          </div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Across all registered centers</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Platform Security</span>
            <Activity className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">100% Secure</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">HIPAA / Supabase RLS Active</span>
        </Card>
      </div>

      {/* Hospital License Verification Directory */}
      <Card className="p-2 border-teal-500/30">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-teal-600" /> Hospital Verification & License Approval
              </CardTitle>
              <CardDescription className="text-xs">
                Inspect medical facility credentials and approve platform access
              </CardDescription>
            </div>
            <Input
              placeholder="Search hospital name, city, or license..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="h-4 w-4" />}
              className="w-full sm:w-72 text-xs"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {filteredHospitals.map((h) => (
              <div
                key={h.id}
                className="p-4 rounded-2xl border glass-card flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-foreground">{h.name}</h4>
                    <Badge variant={h.variant as any}>{h.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-teal-600" /> {h.city}
                    </span>
                    • License ID: <strong>{h.license}</strong> • Capacity: <strong>{h.beds} Beds</strong>
                  </p>
                </div>

                {/* Verification Actions */}
                <div className="flex items-center gap-2">
                  {h.status === "Pending Verification" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleVerifyHospital(h.id, "verify")}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs gap-1.5 h-9 font-bold shadow-sm"
                      >
                        <CheckCircle2 className="h-4 w-4" /> Approve & Verify Hospital
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleVerifyHospital(h.id, "reject")}
                        className="border-rose-500/40 text-rose-600 hover:bg-rose-500/10 rounded-xl text-xs gap-1.5 h-9"
                      >
                        <XCircle className="h-4 w-4" /> Reject
                      </Button>
                    </>
                  )}

                  {h.status === "Verified" && (
                    <div className="flex items-center gap-2">
                      <Badge variant="success" className="gap-1 px-3 py-1 text-xs">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Verified Institution
                      </Badge>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleVerifyHospital(h.id, "revoke")}
                        className="text-xs text-muted-foreground hover:text-rose-600 h-8"
                      >
                        Revoke Access
                      </Button>
                    </div>
                  )}

                  {h.status === "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerifyHospital(h.id, "revoke")}
                      className="text-xs rounded-xl h-8 gap-1"
                    >
                      <RefreshCw className="h-3 w-3" /> Re-evaluate License
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Register New Hospital Modal */}
      <Modal
        isOpen={showAddHospitalModal}
        onClose={() => setShowAddHospitalModal(false)}
        title="Register Hospital for Super Admin Verification"
        description="Submits a healthcare facility for license verification."
      >
        <form onSubmit={handleAddHospitalSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Hospital / Clinic Full Name</label>
            <Input
              required
              placeholder="e.g. Metro Health Medical Center"
              value={newHospital.name}
              onChange={(e) => setNewHospital({ ...newHospital, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">City & State Location</label>
            <Input
              required
              placeholder="e.g. Boston, MA"
              value={newHospital.city}
              onChange={(e) => setNewHospital({ ...newHospital, city: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">License Number</label>
              <Input
                placeholder="e.g. HOSP-7761"
                value={newHospital.license}
                onChange={(e) => setNewHospital({ ...newHospital, license: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold">Bed Capacity</label>
              <Input
                type="number"
                placeholder="100"
                value={newHospital.beds}
                onChange={(e) => setNewHospital({ ...newHospital, beds: e.target.value })}
              />
            </div>
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Submit Hospital for Verification
          </Button>
        </form>
      </Modal>
    </div>
  );
}
