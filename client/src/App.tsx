import "./App.css";
import "./types/midnight"; // Load global type declarations
import { Button } from "./components/ui/button";
import { FileCheck, Shield, Lock } from "lucide-react";
import { useWallet } from "./contexts/wallet-context";
import { useIsDoctor } from "./hooks/use-is-doctor";
import { DocDashboard } from "./components/doc-dashboard";
import { ClientDashboard } from "./components/client-dashboard";

function App() {
  const { isConnected, walletAddress, isConnecting, connect, error } =
    useWallet();
  const { data: isDoctor, isLoading: isDoctorLoading } =
    useIsDoctor(walletAddress);

  // Show dashboards when connected
  if (isConnected && walletAddress) {
    // Loading state while checking doctor status
    if (isDoctorLoading) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <Shield className="w-16 h-16 text-primary mx-auto mb-4 animate-pulse" />
            <p className="text-lg text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }

    // Show appropriate dashboard based on doctor status
    return isDoctor ? <DocDashboard /> : <ClientDashboard />;
  }

  // Landing page (not connected)
  return (
    <div className="min-h-screen bg-background text-left">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              LegitSick
            </span>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-foreground leading-tight text-balance">
                Cryptographically Verified Medical Certificates
              </h1>
              <p className="text-xl text-muted-foreground mt-6 leading-relaxed text-balance">
                Generate tamper-proof medical certificates with granular
                disclosure control. Share only what matters with complete
                cryptographic verification.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground">
                  End-to-end encrypted verification
                </span>
              </div>
              <div className="flex items-center gap-3">
                <FileCheck className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground">
                  Selective information sharing
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary shrink-0" />
                <span className="text-foreground">Blockchain-ready proofs</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 pt-4">
              <div className="flex gap-4">
                <Button size="lg" onClick={connect} disabled={isConnecting}>
                  {isConnecting ? "Connecting..." : "Connect Wallet"}
                </Button>
              </div>
              {error && <p className="text-sm text-red-500">Error: {error}</p>}
            </div>
          </div>

          {/* Right Visual */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full aspect-square max-w-md">
              {/* Animated gradient cards */}
              <div className="absolute inset-0 bg-linear-to-br from-primary/10 to-accent/10 rounded-3xl blur-3xl" />

              {/* Certificate cards */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-80">
                  {/* Back card */}
                  <div className="absolute inset-0 bg-card border border-border rounded-2xl shadow-lg transform rotate-12 translate-y-4" />

                  {/* Front card */}
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-primary/10 border border-border rounded-2xl shadow-2xl p-8 flex flex-col justify-between">
                    <div>
                      <Shield className="w-12 h-12 text-primary mb-4" />
                      <h3 className="text-xl font-bold text-foreground">
                        Medical Certificate
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Verified & Secure
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-xs text-muted-foreground">
                          Cryptographically signed
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-xs text-muted-foreground">
                          Tamper-proof proof
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-xs text-muted-foreground">
                          You control disclosure
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 pt-20 border-t border-border">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">100%</div>
            <p className="text-muted-foreground">Cryptographically Verified</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">Zero</div>
            <p className="text-muted-foreground">Unnecessary Data Shared</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">Instant</div>
            <p className="text-muted-foreground">Proof Verification</p>
          </div>
        </div>
      </main>

      <div className="flex w-full justify-center">
        <p>
          powered by <a href="https://midnight.network">midnight.network</a>
        </p>
      </div>
    </div>
  );
}

export default App;
