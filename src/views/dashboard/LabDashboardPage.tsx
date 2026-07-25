import { useState } from "react";
import {
  FlaskConical,
  FileCode,
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Clock,
  Search,
  Plus,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

export function LabDashboardPage() {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [testName, setTestName] = useState("");

  const samples = [
    { patient: "Eleanor Vance", test: "Lipid Panel & Cholesterol Scan", status: "OCR Analyzed", variant: "success", doctor: "Dr. Sarah Jenkins" },
    { patient: "Arthur Pendelton", test: "HbA1c Glycated Hemoglobin", status: "Processing", variant: "teal", doctor: "Dr. Robert Vance" },
    { patient: "Marcus Thorne", test: "Full Blood Count & CBC", status: "Pending Sample", variant: "warning", doctor: "Dr. Sarah Jenkins" },
  ];

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName) return;
    alert(`Test result for ${testName} uploaded and OCR analyzed!`);
    setShowUploadModal(false);
    setTestName("");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FlaskConical className="h-7 w-7 text-teal-600" /> Apex Diagnostic Labs Portal
            </h1>
            <Badge variant="teal">Lab Staff Portal</Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Diagnostic test queue, OCR medical scanner processing, and report distribution.
          </p>
        </div>

        <Button
          onClick={() => setShowUploadModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <UploadCloud className="h-4 w-4" /> Upload Test Results
        </Button>
      </div>

      {/* Lab Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hoverable className="p-4 border-l-4 border-l-teal-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Tests Processed Today</span>
            <FlaskConical className="h-5 w-5 text-teal-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">24 Reports</div>
          <span className="text-[11px] text-emerald-600 font-medium mt-1 block">100% OCR Auto-Summarized</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Pending Queue</span>
            <Clock className="h-5 w-5 text-cyan-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">5 Samples</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Avg turnaround 45 mins</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Dispatched to Patient</span>
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">19 Dispatched</div>
          <span className="text-[11px] text-muted-foreground mt-1 block">Synced to CareBridge App</span>
        </Card>

        <Card hoverable className="p-4 border-l-4 border-l-rose-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Abnormal Results</span>
            <Sparkles className="h-5 w-5 text-rose-500" />
          </div>
          <div className="mt-2 text-3xl font-extrabold text-foreground">2 Flagged</div>
          <span className="text-[11px] text-rose-600 font-medium mt-1 block">Doctor notified immediately</span>
        </Card>
      </div>

      {/* Sample Queue */}
      <Card className="p-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <FlaskConical className="h-5 w-5 text-teal-600" /> Diagnostic Test Queue
            </CardTitle>

            <Input placeholder="Search sample..." icon={<Search className="h-4 w-4" />} className="w-48 text-xs" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {samples.map((s, idx) => (
            <div key={idx} className="p-4 rounded-2xl border glass-card flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold">{s.patient}</h4>
                  <Badge variant={s.variant as any}>{s.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.test} • Ordered by {s.doctor}</p>
              </div>
              <Button size="sm" className="bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs h-9">
                View OCR Summary
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Upload Test Result Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Diagnostic Test Result"
        description="Scans test sheet and generates plain-language AI translation."
      >
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Patient Name / Sample ID</label>
            <Input
              required
              placeholder="e.g. Eleanor Vance / SMP-908"
              value={testName}
              onChange={(e) => setTestName(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold">Select Test Type</label>
            <select className="w-full h-10 rounded-xl border bg-background px-3 text-sm">
              <option>Lipid Panel & Cholesterol</option>
              <option>HbA1c Glycated Hemoglobin</option>
              <option>Complete Blood Count (CBC)</option>
              <option>Thyroid Profile (TSH)</option>
            </select>
          </div>

          <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11">
            Scan with Vision OCR & Publish Report
          </Button>
        </form>
      </Modal>
    </div>
  );
}
