import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-foreground">
        Welcome to HackathonKNR
      </h1>
      <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl">
        This is the initial project structure for the hackathon. It includes Next.js, Tailwind CSS, modular folders, and some placeholder UI.
      </p>
      <div className="mt-10 flex items-center justify-center gap-x-6">
        <Link href="/dashboard">
          <Button size="lg">Get started</Button>
        </Link>
        <Link
          href="https://github.com/rabeehch82-crypto/hackathonknr"
          className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
        >
          View Repository <span aria-hidden="true">→</span>
        </Link>
      </div>
    </div>
  );
}
