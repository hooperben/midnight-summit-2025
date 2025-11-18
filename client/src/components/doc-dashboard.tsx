import { useState } from "react";
import { Shield, FileCheck, UserPlus } from "lucide-react";
import { CertificateForm } from "./certificate-form";
import { AccountModal } from "./account-modal";
import { useWallet } from "@/contexts/wallet-context";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

export const DocDashboard = () => {
  const { walletAddress, disconnect } = useWallet();
  const [isFormOpen, setIsFormOpen] = useState(false);

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
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Doctor Portal</span>
            {walletAddress && (
              <AccountModal address={walletAddress} onSignOut={disconnect} />
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Doctor Portal
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your medical certificates and client information
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Issue New Certificate Card */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <FileCheck className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">
                  Issue New Certificate
                </CardTitle>
                <CardDescription>
                  Create a cryptographically verified medical certificate for
                  your client
                </CardDescription>
              </div>
              <Button
                size="lg"
                className="w-full"
                onClick={() => setIsFormOpen(true)}
              >
                Create Certificate
              </Button>
            </CardHeader>
          </Card>

          {/* Add Client Card */}
          <Card className="opacity-60">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <UserPlus className="w-6 h-6 text-muted-foreground" />
              </div>
              <div>
                <CardTitle className="text-xl mb-2">Add Client</CardTitle>
                <CardDescription>
                  Register a new client to your practice
                </CardDescription>
              </div>
              <Button size="lg" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardHeader>
          </Card>
        </div>
      </main>

      {/* Certificate Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Medical Certificate</DialogTitle>
            <DialogDescription>
              Generate a cryptographically verified medical certificate for your
              client
            </DialogDescription>
          </DialogHeader>
          <CertificateForm />
        </DialogContent>
      </Dialog>
    </div>
  );
};
