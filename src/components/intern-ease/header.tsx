import { LogoIcon } from "./icons";

export function Header() {
  return (
    <header className="py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-3">
          <LogoIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            InternEase
          </h1>
        </div>
        <p className="mt-2 text-lg text-muted-foreground">
          Generate personalized cover letters, emails, and optimized resumes for your dream internship.
        </p>
      </div>
    </header>
  );
}
