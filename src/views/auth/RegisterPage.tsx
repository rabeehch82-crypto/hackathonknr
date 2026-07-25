import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function RegisterPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
            Create an account
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action="#" method="POST">
          {/* form fields */}
          <Button type="button" className="w-full">
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
