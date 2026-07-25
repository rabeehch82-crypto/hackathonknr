import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, User, Stethoscope, Users, ArrowRight, ShieldCheck, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { useAppStore } from "@/store";

export function RegisterPage() {
  const navigate = useNavigate();
  const { setAuth } = useAppStore();
  const [role, setRole] = useState<"patient" | "doctor" | "caregiver" | "hospital_admin">("doctor");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Doctor specific fields
  const [doctorLicense, setDoctorLicense] = useState("");
  const [specialty, setSpecialty] = useState("Cardiology");

  // Hospital specific fields
  const [hospitalName, setHospitalName] = useState("");
  const [city, setCity] = useState("");
  const [license, setLicense] = useState("");
  const [beds, setBeds] = useState("100");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    setTimeout(() => {
      setAuth({
        id: "demo-registered-user",
        email: email || "demo@carebridge.ai",
        name: fullName || "Registered User",
        role: role,
      });

      if (role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (role === "hospital_admin") {
        navigate("/hospital-dashboard");
      } else {
        navigate("/dashboard");
      }
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-cyan-500/20 via-teal-500/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl glass-card relative z-10 border-teal-500/30">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-400 text-white shadow-md shadow-teal-500/30 mb-2">
            <HeartPulse className="h-7 w-7 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create CareBridge Account</CardTitle>
          <CardDescription className="text-sm">
            Join the smart AI health management platform.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Profile Role</label>
            <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted p-1 border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "doctor" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Stethoscope className="h-4 w-4" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "patient" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-4 w-4" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("caregiver")}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "caregiver" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-4 w-4" /> Caregiver
              </button>
              <button
                type="button"
                onClick={() => setRole("hospital_admin")}
                className={`flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "hospital_admin" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Building2 className="h-4 w-4" /> Hospital
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">
                {role === "doctor" ? "Doctor Full Name" : role === "hospital_admin" ? "Admin Full Name" : "Full Name"}
              </label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4" />}
                placeholder={role === "doctor" ? "e.g. Dr. Sarah Jenkins" : "e.g. Eleanor Vance"}
              />
            </div>

            {role === "doctor" && (
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Doctor License ID</label>
                  <Input
                    type="text"
                    required
                    value={doctorLicense}
                    onChange={(e) => setDoctorLicense(e.target.value)}
                    icon={<Award className="h-4 w-4" />}
                    placeholder="DR-2026-8890"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Specialty</label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full h-10 rounded-xl border bg-background px-3 text-xs"
                  >
                    <option>Cardiology</option>
                    <option>Pulmonology</option>
                    <option>Endocrinology</option>
                    <option>General Medicine</option>
                    <option>Neurology</option>
                  </select>
                </div>
              </div>
            )}

            {role === "hospital_admin" && (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-foreground">Hospital Name</label>
                  <Input
                    type="text"
                    required
                    value={hospitalName}
                    onChange={(e) => setHospitalName(e.target.value)}
                    icon={<Building2 className="h-4 w-4" />}
                    placeholder="e.g. CareBridge General Hospital"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">City</label>
                    <Input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-foreground">Capacity (Beds)</label>
                    <Input
                      type="number"
                      required
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Doctor Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder="doctor@carebridge.ai"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Password</label>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
                placeholder="Doctor123!@"
              />
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <span>By signing up, you agree to our Terms of Service and HIPAA Privacy Policy.</span>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-destructive/15 text-destructive text-sm border border-destructive/20">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 gap-2"
            >
              {isLoading ? "Creating Doctor Account..." : "Create Doctor Account"} <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 text-center border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-teal-600 hover:underline">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
