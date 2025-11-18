import { Shield } from "lucide-react";
import { Button } from "./ui/button";

export const ClientDashboard = () => {
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
          <span className="text-sm text-muted-foreground">
            Client Dashboard
          </span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center py-20">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Your Medical Certificates
          </h1>
          <p className="text-muted-foreground mb-8 text-lg">
            Manage and share your verified medical certificates with complete
            control over what information is disclosed.
          </p>
          <div className="inline-block bg-card border border-border rounded-lg p-8">
            <p className="text-muted-foreground mb-6">
              No certificates yet. Once your doctor issues a certificate, it
              will appear here.
            </p>
            <a href="/">
              <Button variant="outline">Return Home</Button>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
