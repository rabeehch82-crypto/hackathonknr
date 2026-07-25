import { useState } from "react";
import {
  Settings as SettingsIcon,
  QrCode,
  Printer,
  Download,
  Eye,
  Volume2,
  ShieldCheck,
  Smartphone,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/Badge";
import { useAppStore } from "@/store";

export function SettingsPage() {
  const { user } = useAppStore();
  const isPatient = (user?.role || "patient") === "patient";

  const [fontSize, setFontSize] = useState("large");
  const [highContrast, setHighContrast] = useState(false);
  const [voiceSpeed, setVoiceSpeed] = useState("normal");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
              <SettingsIcon className="h-7 w-7 text-teal-600" /> Account Settings
            </h1>
            <Badge variant="teal" className="gap-1">
              <Sparkles className="h-3 w-3" /> Senior Accessibility Controls
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your {isPatient ? "Emergency Medical ID QR code, " : ""}accessibility preferences, and account security.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Emergency Medical QR Card - Exclusively for Patients */}
        {isPatient && (
        <Card className="p-4 border-rose-500/40 bg-gradient-to-br from-rose-500/10 via-card to-card">
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2 text-rose-700 dark:text-rose-300">
                <QrCode className="h-5 w-5" /> Emergency Medical ID QR
              </CardTitle>
              <Badge variant="destructive">Scannable 24/7</Badge>
            </div>
            <CardDescription className="text-xs">
              First responders can scan this QR code to view your critical medical history without login.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-2xl bg-card border glass-card">
              {/* Simulated QR Code Box */}
              <div className="h-36 w-36 bg-white p-3 rounded-2xl border flex flex-col items-center justify-center shrink-0 shadow-md">
                <div className="grid grid-cols-5 gap-1.5 w-full h-full p-1 bg-neutral-900 rounded-lg">
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-neutral-900"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-neutral-900"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-neutral-900"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                  <div className="bg-white rounded-xs"></div>
                </div>
              </div>

              <div className="space-y-2 text-xs w-full">
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Patient Name</span>
                  <span className="font-bold text-sm text-foreground">Eleanor Vance (Age 72)</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Blood Group</span>
                    <span className="font-bold text-rose-600 dark:text-rose-400">O Positive (O+)</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Allergies</span>
                    <span className="font-bold text-amber-600 dark:text-amber-400">Penicillin</span>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Emergency Contact</span>
                  <span className="font-semibold text-foreground">Marcus Vance (Son): +1 (555) 234-5678</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => alert("Printing Emergency QR ID Card...")}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-xl h-11 gap-2 text-xs"
              >
                <Printer className="h-4 w-4" /> Print Medical ID Card
              </Button>
              <Button variant="outline" className="rounded-xl h-11 gap-2 text-xs">
                <Download className="h-4 w-4" /> Save PNG
              </Button>
            </div>
          </CardContent>
        </Card>
        )}

        {/* Accessibility & Voice Settings */}
        <Card className="p-4 border-teal-500/30">
          <CardHeader className="pb-3 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <Eye className="h-5 w-5 text-teal-600" /> Senior Accessibility Preferences
            </CardTitle>
            <CardDescription className="text-xs">
              Customize display contrast, text sizing, and voice feedback speed.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-4">
            {/* Font Sizing */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground">Text Display Size</label>
              <div className="grid grid-cols-3 gap-2">
                {["normal", "large", "extra-large"].map((size) => (
                  <button
                    key={size}
                    onClick={() => setFontSize(size)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                      fontSize === size
                        ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                        : "bg-background border-border hover:border-teal-500"
                    }`}
                  >
                    {size.replace("-", " ")}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/60 border">
              <div>
                <span className="text-xs font-bold text-foreground block">High Contrast Mode</span>
                <span className="text-[11px] text-muted-foreground">Enhance text legibility for visual impairments</span>
              </div>
              <button
                onClick={() => setHighContrast(!highContrast)}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                  highContrast ? "bg-teal-600" : "bg-muted-foreground/30"
                }`}
              >
                <div
                  className={`h-5 w-5 rounded-full bg-white transition-transform ${
                    highContrast ? "translate-x-6" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Voice Assistant Speed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Volume2 className="h-4 w-4 text-teal-600" /> Voice Read-Aloud Speed
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["slow", "normal", "fast"].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setVoiceSpeed(spd)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold capitalize border transition-all ${
                      voiceSpeed === spd
                        ? "bg-teal-600 text-white border-teal-600 shadow-xs"
                        : "bg-background border-border hover:border-teal-500"
                    }`}
                  >
                    {spd}
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
