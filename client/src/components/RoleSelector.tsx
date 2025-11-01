import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, User } from "lucide-react";

interface RoleSelectorProps {
  isOpen: boolean;
  onSelect: (role: "owner" | "customer") => void;
}

export default function RoleSelector({ isOpen, onSelect }: RoleSelectorProps) {
  const [selectedRole, setSelectedRole] = useState<"owner" | "customer" | null>(null);

  const handleConfirm = () => {
    if (selectedRole) {
      onSelect(selectedRole);
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent className="sm:max-w-md" data-testid="modal-role-selector">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">
            Choose Your Role
          </DialogTitle>
          <DialogDescription className="text-center">
            Select how you'd like to use Gourmet Haven
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Card
            className={`p-6 cursor-pointer hover-elevate active-elevate-2 transition-all ${
              selectedRole === "customer" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedRole("customer")}
            data-testid="card-role-customer"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Customer</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Browse and enjoy our menu
                </p>
              </div>
            </div>
          </Card>

          <Card
            className={`p-6 cursor-pointer hover-elevate active-elevate-2 transition-all ${
              selectedRole === "owner" ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedRole("owner")}
            data-testid="card-role-owner"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Store className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Owner</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Manage your restaurant
                </p>
              </div>
            </div>
          </Card>
        </div>
        <Button
          onClick={handleConfirm}
          disabled={!selectedRole}
          className="w-full"
          data-testid="button-confirm-role"
        >
          Continue as {selectedRole === "customer" ? "Customer" : selectedRole === "owner" ? "Owner" : "..."}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
