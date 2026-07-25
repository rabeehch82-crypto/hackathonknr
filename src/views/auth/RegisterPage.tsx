import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, User, Stethoscope, Users, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";

export function RegisterPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor" | "caregiver">("patient");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "doctor") {
      navigate("/doctor-dashboard");
    } else {
      navigate("/dashboard");
    }
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
            <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 border text-xs font-semibold">
              <button
                type="button"
                onClick={() => setRole("patient")}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "patient" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User className="h-3.5 w-3.5" /> Patient
              </button>
              <button
                type="button"
                onClick={() => setRole("doctor")}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "doctor" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Stethoscope className="h-3.5 w-3.5" /> Doctor
              </button>
              <button
                type="button"
                onClick={() => setRole("caregiver")}
                className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                  role === "caregiver" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Users className="h-3.5 w-3.5" /> Caregiver
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name</label>
              <Input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                icon={<User className="h-4 w-4" />}
                placeholder="e.g. Eleanor Vance"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder="name@example.com"
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
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-teal-600 mt-0.5 shrink-0" />
              <span>By signing up, you agree to our Terms of Service and HIPAA Privacy Policy.</span>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 gap-2"
            >
              Create Account <ArrowRight className="h-4 w-4" />
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
