import { useState } from "react";
import {
  Pill,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertCircle,
  Bell,
  Trash2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";

export function MedicineReminderPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [meds, setMeds] = useState([
    {
      id: "1",
      name: "Metformin HCl",
      dosage: "500 mg",
      time: "08:00 AM",
      frequency: "Daily after breakfast",
      taken: true,
      category: "Morning",
    },
    {
      id: "2",
      name: "Lisinopril",
      dosage: "10 mg",
      time: "01:00 PM",
      frequency: "Daily with lunch",
      taken: false,
      category: "Afternoon",
    },
    {
      id: "3",
      name: "Atorvastatin",
      dosage: "20 mg",
      time: "08:00 PM",
      frequency: "Daily before sleep",
      taken: false,
      category: "Evening",
    },
  ]);

  const [newForm, setNewForm] = useState({ name: "", dosage: "", time: "08:00 AM" });

  const toggleDose = (id: string) => {
    setMeds((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );
  };

  const handleAddMed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.name) return;
    setMeds((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newForm.name,
        dosage: newForm.dosage || "1 Tablet",
        time: newForm.time,
        frequency: "Daily schedule",
        taken: false,
        category: "Custom",
      },
    ]);
    setShowAddModal(false);
    setNewForm({ name: "", dosage: "", time: "08:00 AM" });
  };

  const takenCount = meds.filter((m) => m.taken).length;
  const adherencePercent = Math.round((takenCount / meds.length) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <Pill className="h-7 w-7 text-teal-600" /> Pill & Medication Reminders
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Auto-Scheduler Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Track dose compliance, set audio alarms, and sync reminders with family caregivers.
          </p>
        </div>

        <Button
          onClick={() => setShowAddModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <Plus className="h-4 w-4" /> Add New Medication
        </Button>
      </div>

      {/* Adherence Header Card */}
      <Card className="p-4 border-teal-500/30 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-transparent">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase text-teal-700 dark:text-teal-300">
              Today's Adherence Rate
            </span>
            <h2 className="text-2xl font-extrabold text-foreground mt-0.5">
              {adherencePercent}% Doses Completed
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              {takenCount} of {meds.length} pills taken today.
            </p>
          </div>
          <div className="w-full md:w-64 space-y-1.5">
            <Progress value={adherencePercent} />
            <span className="text-[10px] text-muted-foreground text-right block">Target: 100% Daily</span>
          </div>
        </div>
      </Card>

      {/* Timeline Dose Cards */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-foreground">Scheduled Dose Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {meds.map((m) => (
            <Card
              key={m.id}
              hoverable
              className={`p-4 border transition-all ${
                m.taken ? "border-emerald-500/40 bg-emerald-500/10" : "border-teal-500/30"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <Badge variant={m.taken ? "success" : "teal"}>{m.time}</Badge>
                <Badge variant="outline">{m.category}</Badge>
              </div>

              <h4 className="text-base font-bold text-foreground">{m.name}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{m.dosage} • {m.frequency}</p>

              <div className="mt-4 pt-3 border-t flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground">
                  {m.taken ? "Logged Dose" : "Pending Dose"}
                </span>
                <Button
                  size="sm"
                  variant={m.taken ? "ghost" : "default"}
                  onClick={() => toggleDose(m.id)}
                  className={`h-8 text-xs rounded-xl ${
                    m.taken ? "text-emerald-600 font-bold" : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                >
                  {m.taken ? "Taken ✅" : "Mark Taken"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Add Medication Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Add New Medication"
        description="Auto-generates daily reminder alarms."
      >
        <form onSubmit={handleAddMed} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Medication Name</label>
            <Input
              required
              placeholder="e.g. Aspirin / Atorvastatin"
              value={newForm.name}
              onChange={(e) => setNewForm({ ...newForm, name: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Dosage</label>
            <Input
              placeholder="e.g. 10mg / 1 Tablet"
              value={newForm.dosage}
              onChange={(e) => setNewForm({ ...newForm, dosage: e.target.value })}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Scheduled Time</label>
            <select
              value={newForm.time}
              onChange={(e) => setNewForm({ ...newForm, time: e.target.value })}
              className="w-full h-10 rounded-xl border bg-background px-3 text-sm"
            >
              <option value="08:00 AM">08:00 AM (Morning)</option>
              <option value="01:00 PM">01:00 PM (Afternoon)</option>
              <option value="08:00 PM">08:00 PM (Evening)</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Save & Enable Alarm
          </Button>
        </form>
      </Modal>
    </div>
  );
}
