import { useState } from "react";
import {
  Pill,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  PackageCheck,
  AlertTriangle,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function PharmacyDashboardPage() {
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [rxPatient, setRxPatient] = useState("");

  const queue = [
    { patient: "Eleanor Vance", drug: "Metformin 500mg (60 Tabs)", status: "Ready to Dispense", variant: "success", doctor: "Dr. Robert Vance" },
    { patient: "Arthur Pendelton", drug: "Lisinopril 10mg (30 Tabs)", status: "Fulfilling", variant: "teal", doctor: "Dr. Sarah Jenkins" },
    { patient: "Marcus Thorne", drug: "Atorvastatin 20mg (30 Tabs)", status: "Pending Stock Verification", variant: "warning", doctor: "Dr. Sarah Jenkins" },
  ];

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxPatient) return;
    alert(`Prescription for ${rxPatient} dispenced & auto-reminders generated!`);
    setShowDispenseModal(false);
    setRxPatient("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Pill className="h-7 w-7 text-teal-600" /> CareBridge Central Pharmacy
            </h1>
            <Badge variant="teal">Pharmacy Staff Portal</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Prescription fulfillment queue, inventory stock tracking, and automated patient pill setup.
          </p>
        </div>

        <Button
          onClick={() => setShowDispenseModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <PackageCheck className="h-4 w-4" /> Dispense Prescription
        </Button>
      </div>

      {/* Pharmacy Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Dispensed Today</span>
            <PackageCheck className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">38 Prescriptions</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">Synced to Patient App</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Fulfillment Queue</span>
            <Clock className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">7 Orders</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">3 Ready for Pickup / Delivery</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Auto-Refill Requests</span>
            <Sparkles className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">14 Refills</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Auto-triggered by adherence</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Low Stock Alerts</span>
            <AlertTriangle className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">2 Medications</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Restock order placed</span>
        </Card>
      </div>

      {/* Prescription Dispensing Queue */}
      <Card className="p-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-5 w-5 text-teal-600" /> Digital Prescription Fulfillment Queue
            </CardTitle>

            <Input placeholder="Search patient or drug..." icon={<Search className="h-4 w-4" />} className="w-48 text-xs" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {queue.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border glass-card flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">{item.patient}</h4>
                  <Badge variant={item.variant as any}>{item.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{item.drug} • Doctor: {item.doctor}</p>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs h-9">
                Dispense & Sync
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Dispense Modal */}
      <Modal
        isOpen={showDispenseModal}
        onClose={() => setShowDispenseModal(false)}
        title="Dispense Prescription Order"
        description="Syncs bottle barcode & creates automatic pill reminders on patient's phone."
      >
        <form onSubmit={handleDispense} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Patient Name</label>
            <Input
              required
              placeholder="e.g. Eleanor Vance"
              value={rxPatient}
              onChange={(e) => setRxPatient(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Rx License Code</label>
            <Input required placeholder="e.g. RX-2026-8890" />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Fulfill & Notify Patient / Caregiver
          </Button>
        </form>
      </Modal>
    </div>
  );
}
