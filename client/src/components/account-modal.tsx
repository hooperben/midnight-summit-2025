import { useState } from "react";
import { User, Copy, Check, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

interface AccountModalProps {
  address: string;
  onSignOut: () => void;
}

export function AccountModal({ address, onSignOut }: AccountModalProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleSignOut = () => {
    setOpen(false);
    onSignOut();
  };

  const truncateAddress = (addr: string) => {
    if (addr.length <= 20) return addr;
    return `${addr.slice(0, 10)}...${addr.slice(-10)}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <User className="w-4 h-4" />
          Account
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Account</DialogTitle>
          <DialogDescription>
            Your wallet address and account settings
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Wallet Address */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Wallet Address
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 bg-muted rounded-md px-3 py-2 text-sm font-mono break-all">
                {truncateAddress(address)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="shrink-0"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-green-500" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Click the copy button to copy your full address
            </p>
          </div>

          {/* Sign Out Button */}
          <div className="pt-4 border-t border-border">
            <Button
              variant="destructive"
              className="w-full gap-2"
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
