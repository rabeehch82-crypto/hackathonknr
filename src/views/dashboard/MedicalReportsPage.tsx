import { useState } from "react";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Eye,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Tag,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";

export function MedicalReportsPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [selectedReport, setSelectedReport] = useState(0);

  const reports = [
    {
      title: "Comprehensive Blood Lipid Panel",
      date: "July 24, 2026",
      type: "Lab Report",
      doctor: "Dr. Sarah Jenkins",
      ocrText: "Total Cholesterol: 185 mg/dL (Normal < 200). HDL: 58 mg/dL. LDL: 105 mg/dL. Triglycerides: 110 mg/dL.",
      aiSummary:
        "Your cholesterol levels are healthy! Total cholesterol (185) and HDL 'good' cholesterol (58) are in optimal ranges. LDL 'bad' cholesterol is well-controlled by your current Atorvastatin 20mg medication.",
      status: "Normal",
      statusVariant: "success",
    },
    {
      title: "ECG & Heart Rhythm Scan",
      date: "July 12, 2026",
      type: "Cardiology",
      doctor: "Dr. Sarah Jenkins",
      ocrText: "Sinus rhythm with average HR 72 bpm. PR interval 160ms. QRS duration 90ms. No ST-segment elevation.",
      aiSummary:
        "Normal heart rhythm with no signs of arrhythmia or arterial blockage. Your heart electrical conductivity is functioning normally.",
      status: "Normal",
      statusVariant: "success",
    },
    {
      title: "HbA1c Glycated Hemoglobin Test",
      date: "June 28, 2026",
      type: "Endocrinology",
      doctor: "Dr. Robert Vance",
      ocrText: "HbA1c: 6.4% (Pre-diabetes/Controlled Diabetes range). Estimated Average Glucose (eAG): 137 mg/dL.",
      aiSummary:
        "Your 3-month average blood sugar is 6.4%, showing excellent control under Metformin 500mg. Continue low-glycemic dietary habits.",
      status: "Controlled",
      statusVariant: "teal",
    },
  ];

  const handleSimulatedUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert("New Medical Report uploaded and processed by Google Vision OCR + GPT-4o!");
    }, 1500);
  };

  const active = reports[selectedReport];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <FileText className="h-7 w-7 text-teal-600" /> Medical Reports & OCR AI Summarizer
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Vision OCR + GPT-4o
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Upload medical scans. Our AI extracts text and translates complex medical jargon into clear explanations.
          </p>
        </div>

        <Button
          onClick={handleSimulatedUpload}
          disabled={isUploading}
          className="bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl gap-2 shadow-md"
        >
          <UploadCloud className="h-4 w-4" />
          {isUploading ? "Scanning Document..." : "Upload New Report"}
        </Button>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report List Column */}
        <div className="space-y-3">
          <h2 className="text-base font-bold text-foreground flex items-center gap-2 mb-2">
            <Tag className="h-4 w-4 text-teal-600" /> Archived Medical Records
          </h2>
          {reports.map((rep, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedReport(idx)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                selectedReport === idx
                  ? "bg-teal-500/15 border-teal-500/40 shadow-xs"
                  : "bg-card hover:border-teal-500/30"
              }`}
            >
              <div className="flex items-center justify-between">
                <Badge variant={rep.statusVariant as any}>{rep.status}</Badge>
                <span className="text-[11px] text-muted-foreground">{rep.date}</span>
              </div>
              <h3 className="text-sm font-bold text-foreground mt-2">{rep.title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{rep.doctor} • {rep.type}</p>
            </div>
          ))}
        </div>

        {/* OCR & AI Summary Viewer */}
        <Card className="lg:col-span-2 p-2 border-teal-500/30">
          <CardHeader className="pb-3 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{active.title}</CardTitle>
                <CardDescription className="text-xs">
                  {active.type} • Prescribed by {active.doctor} ({active.date})
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" className="rounded-xl gap-1.5 text-xs">
                <Download className="h-3.5 w-3.5" /> Download Summary PDF
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* AI Plain-Language Explanation */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-500/10 via-cyan-500/10 to-transparent border border-teal-500/30 space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-teal-700 dark:text-teal-300">
                <Sparkles className="h-4 w-4 text-teal-500" /> AI Plain-Language Translation
              </div>
              <p className="text-sm text-foreground leading-relaxed">{active.aiSummary}</p>
            </div>

            {/* Extracted Raw OCR Text */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <FileCode className="h-4 w-4 text-teal-600" /> Extracted OCR Text (Google Cloud Vision)
              </h4>
              <div className="p-4 rounded-2xl bg-muted/60 border font-mono text-xs text-foreground leading-relaxed">
                {active.ocrText}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
