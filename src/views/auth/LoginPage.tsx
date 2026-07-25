import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, User, Stethoscope, Users, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<"patient" | "doctor" | "caregiver">("patient");
  const [email, setEmail] = useState("patient@carebridge.ai");
  const [password, setPassword] = useState("Password123!");

  const handleDemoLogin = (selectedRole: "patient" | "doctor" | "caregiver") => {
    setRole(selectedRole);
    if (selectedRole === "patient") {
      setEmail("patient@carebridge.ai");
    } else if (selectedRole === "doctor") {
      setEmail("doctor@carebridge.ai");
    } else {
      setEmail("caregiver@carebridge.ai");
    }
  };

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
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl glass-card relative z-10 border-teal-500/30">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-400 text-white shadow-md shadow-teal-500/30 mb-2">
            <HeartPulse className="h-7 w-7 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign In to CareBridge AI</CardTitle>
          <CardDescription className="text-sm">
            Access your personalized health records, AI assistant, and appointments.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Role selector tabs */}
          <div className="grid grid-cols-3 gap-1 rounded-xl bg-muted p-1 border text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleDemoLogin("patient")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                role === "patient" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-3.5 w-3.5" /> Patient
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("doctor")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                role === "doctor" ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Stethoscope className="h-3.5 w-3.5" /> Doctor
            </button>
            <button
              type="button"
              onClick={() => handleDemoLogin("caregiver")}
              className={`flex items-center justify-center gap-1 py-2 rounded-lg transition-all ${
                role === "caregiver" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-3.5 w-3.5" /> Caregiver
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address</label>
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<Mail className="h-4 w-4" />}
                placeholder="name@carebridge.ai"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">Password</label>
                <a href="#" className="text-xs text-teal-600 hover:underline">Forgot password?</a>
              </div>
              <Input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="h-4 w-4" />}
              />
            </div>

            {/* Quick Demo Pre-fill Badge */}
            <div className="p-3 rounded-xl bg-teal-500/10 border border-teal-500/20 text-xs text-teal-700 dark:text-teal-300 flex items-center justify-between">
              <span className="flex items-center gap-1.5 font-medium">
                <Sparkles className="h-3.5 w-3.5" /> Demo login pre-filled
              </span>
              <Badge variant="teal" className="text-[10px]">Password123!</Badge>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white font-bold rounded-xl shadow-lg shadow-teal-500/25 gap-2"
            >
              Sign In <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3 text-center border-t pt-4">
          <p className="text-xs text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-teal-600 hover:underline">
              Create an Account
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
