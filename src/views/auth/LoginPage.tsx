import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HeartPulse, Mail, Lock, User, Stethoscope, Users, Building2, FlaskConical, Pill, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { createClient } from "@/lib/supabase/client";

export function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState<string>("patient");
  const [email, setEmail] = useState("patient@carebridge.ai");
  const [password, setPassword] = useState("Password123!");

  const roles = [
    { id: "patient", label: "Patient", icon: User, route: "/dashboard" },
    { id: "doctor", label: "Doctor", icon: Stethoscope, route: "/doctor-dashboard" },
    { id: "caregiver", label: "Caregiver", icon: Users, route: "/caregiver" },
    { id: "hospital", label: "Hospital", icon: Building2, route: "/hospital-dashboard" },
    { id: "lab", label: "Lab", icon: FlaskConical, route: "/lab-dashboard" },
    { id: "pharmacy", label: "Pharmacy", icon: Pill, route: "/pharmacy-dashboard" },
  ];

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const handleSelectRole = (roleId: string) => {
    setRole(roleId);
    if (roleId === "patient") setEmail("patient@carebridge.ai");
    else if (roleId === "doctor") setEmail("doctor@carebridge.ai");
    else if (roleId === "caregiver") setEmail("caregiver@carebridge.ai");
    else if (roleId === "hospital") setEmail("hospital@carebridge.ai");
    else if (roleId === "lab") setEmail("lab@carebridge.ai");
    else if (roleId === "pharmacy") setEmail("pharmacy@carebridge.ai");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (signInError) throw signInError;
      
      if (data?.user) {
        // Fetch profile to verify role and hospital verification status
        const { data: profile } = await supabase
          .from('profiles')
          .select('role, id')
          .eq('id', data.user.id)
          .single();
          
        if (profile?.role === 'hospital_admin') {
          const { data: staff } = await supabase
            .from('hospital_staff')
            .select('hospital_id')
            .eq('profile_id', profile.id)
            .single();
            
          if (staff) {
            const { data: hospital } = await supabase
              .from('hospitals')
              .select('status')
              .eq('id', staff.hospital_id)
              .single();
              
            if (hospital && hospital.status !== 'Verified') {
              await supabase.auth.signOut();
              throw new Error("Your hospital registration is currently pending verification from the Super Admin.");
            }
          }
        }
      }

      const roleObj = roles.find((r) => r.id === role);
      navigate(roleObj ? roleObj.route : "/dashboard");
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] bg-gradient-to-tr from-teal-500/20 via-cyan-500/20 to-transparent blur-[120px] rounded-full pointer-events-none" />

      <Card className="w-full max-w-md shadow-2xl glass-card relative z-10 border-teal-500/30">
        <CardHeader className="space-y-2 text-center pb-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 to-cyan-400 text-white shadow-md shadow-teal-500/30 mb-2">
            <HeartPulse className="h-7 w-7 animate-pulse" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Sign In to CareBridge AI</CardTitle>
          <CardDescription className="text-sm">
            Access your healthcare portal, AI assistant, and records.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* 6 Role Selection Grid */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Select Account Role</label>
            <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-muted p-1 border text-xs font-semibold">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = role === r.id;
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => handleSelectRole(r.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all text-xs ${
                      isSelected ? "bg-teal-600 text-white shadow-xs" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{r.label}</span>
                  </button>
                );
              })}
            </div>
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
                <Sparkles className="h-3.5 w-3.5" /> Demo credentials pre-filled
              </span>
              <Badge variant="teal" className="text-[10px]">Password123!</Badge>
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
              {isLoading ? "Signing In..." : `Sign In to ${roles.find((r) => r.id === role)?.label} Portal`} <ArrowRight className="h-4 w-4" />
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
