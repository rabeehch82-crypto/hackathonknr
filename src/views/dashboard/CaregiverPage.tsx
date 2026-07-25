import { useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Phone,
  Mail,
  Check,
  Lock,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export function CaregiverPage() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [caregivers, setCaregivers] = useState([
    {
      id: "1",
      name: "Marcus Vance",
      relation: "Son & Primary Guardian",
      phone: "+1 (555) 234-5678",
      email: "marcus.vance@example.com",
      access: { vitals: true, meds: true, emergency: true },
      status: "Active Link",
    },
    {
      id: "2",
      name: "Nurse Maria Rodriguez",
      relation: "Visiting Home Nurse",
      phone: "+1 (555) 987-6543",
      email: "maria.nurse@carebridge.ai",
      access: { vitals: true, meds: true, emergency: false },
      status: "Active Link",
    },
  ]);

  const togglePermission = (id: string, key: "vitals" | "meds" | "emergency") => {
    setCaregivers((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, access: { ...c.access, [key]: !c.access[key] } } : c
      )
    );
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    alert(`Caregiver invitation sent to ${inviteEmail}!`);
    setShowInviteModal(false);
    setInviteEmail("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Users className="h-7 w-7 text-teal-600" /> Caregiver & Family Network
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Granular RLS Access
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Link trusted family or home nurses to share vitals, missed pill alerts, and emergency notifications.
          </p>
        </div>

        <Button
          onClick={() => setShowInviteModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <UserPlus className="h-4 w-4" /> Invite Caregiver
        </Button>
      </div>

      {/* Caregiver Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {caregivers.map((cg) => (
          <Card key={cg.id} hoverable className="p-2 border-teal-500/30">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-teal-500/20 text-teal-700 dark:text-teal-300 font-extrabold flex items-center justify-center text-sm">
                    {cg.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">{cg.name}</h3>
                    <p className="text-xs text-muted-foreground">{cg.relation}</p>
                  </div>
                </div>
                <Badge variant="success">{cg.status}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-2">
              <div className="space-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-teal-600" /> {cg.phone}
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-teal-600" /> {cg.email}
                </div>
              </div>

              {/* Granular Permission Toggles */}
              <div className="pt-3 border-t space-y-2">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                  Granular Data Permissions
                </span>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    onClick={() => togglePermission(cg.id, "vitals")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      cg.access.vitals
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Vitals Log
                  </button>

                  <button
                    onClick={() => togglePermission(cg.id, "meds")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      cg.access.meds
                        ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    Pill History
                  </button>

                  <button
                    onClick={() => togglePermission(cg.id, "emergency")}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      cg.access.emergency
                        ? "bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    SOS Alerts
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite a Caregiver or Family Member"
        description="An invitation email will be sent with secure permission setup link."
      >
        <form onSubmit={handleInvite} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Caregiver Email Address</label>
            <Input
              type="email"
              required
              placeholder="e.g. guardian@example.com"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
            />
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Send Invitation Link
          </Button>
        </form>
      </Modal>
    </div>
  );
}
