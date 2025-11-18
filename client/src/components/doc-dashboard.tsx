import { Shield } from "lucide-react";
import { CertificateForm } from "./certificate-form";

export const DocDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              LegitSick
            </span>
          </a>
          <span className="text-sm text-muted-foreground">Doctor Portal</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Create Medical Certificate
          </h1>
          <p className="text-muted-foreground">
            Generate a cryptographically verified medical certificate for your
            client
          </p>
        </div>

        <CertificateForm />
      </main>
    </div>
  );
};
