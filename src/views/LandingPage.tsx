import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function LandingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
        Welcome to CareBridge AI
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
        Advanced healthcare assistant and management system powered by AI.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link to="/dashboard">
          <Button size="lg">Get started</Button>
        </Link>
      </div>
    </div>
  );
}
