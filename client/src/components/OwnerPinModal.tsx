import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, X } from "lucide-react";

interface OwnerPinModalProps {
  isOpen: boolean;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function OwnerPinModal({ isOpen, onSuccess, onCancel }: OwnerPinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const correctPin = import.meta.env.VITE_OWNER_PIN || "1234";

    if (pin === correctPin) {
      setTimeout(() => {
        setLoading(false);
        setPin("");
        onSuccess();
      }, 500);
    } else {
      setTimeout(() => {
        setLoading(false);
        setError("Unauthorized Access: Incorrect PIN");
        setPin("");
      }, 500);
    }
  };

  const handleCancel = () => {
    setPin("");
    setError("");
    onCancel();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md" data-testid="modal-owner-pin">
        <button
          onClick={handleCancel}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          data-testid="button-close-pin-modal"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
        <DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-[#D4AF37]" />
            </div>
            <DialogTitle className="text-2xl font-serif text-center">
              Owner Verification
            </DialogTitle>
            <DialogDescription className="text-center">
              Enter your 4-digit PIN to access the Owner Dashboard
            </DialogDescription>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pin">PIN Code</Label>
            <Input
              id="pin"
              type="password"
              data-testid="input-pin"
              value={pin}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,4}$/.test(value)) {
                  setPin(value);
                  setError("");
                }
              }}
              placeholder="••••"
              maxLength={4}
              className="text-center text-2xl tracking-widest"
              required
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive font-medium" data-testid="text-pin-error">
                {error}
              </p>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="flex-1"
              data-testid="button-cancel-pin"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={pin.length !== 4 || loading}
              className="flex-1 bg-[#D4AF37] hover:bg-[#D4AF37]/90 text-white"
              data-testid="button-submit-pin"
            >
              {loading ? "Verifying..." : "Verify"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
