import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Store, User } from "lucide-react";

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: "owner" | "customer") => void;
  mode: "login" | "signup";
}

export default function RoleSelectionModal({ isOpen, onClose, onSelectRole, mode }: RoleSelectionModalProps) {
  const handleRoleSelect = (role: "owner" | "customer") => {
    localStorage.setItem("selectedRole", role);
    onSelectRole(role);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-role-selection">
        <DialogHeader>
          <DialogTitle className="text-2xl font-serif text-center">
            Choose Your Role
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "login" ? "Select your role to log in" : "Select how you'd like to use Gourmet Haven"}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Card
            className="p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-[#D4AF37]"
            onClick={() => handleRoleSelect("customer")}
            data-testid="card-role-customer"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <User className="w-8 h-8 text-[#D4AF37]" />
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
            className="p-6 cursor-pointer hover:shadow-lg hover:scale-105 transition-all border-2 border-transparent hover:border-[#D4AF37]"
            onClick={() => handleRoleSelect("owner")}
            data-testid="card-role-owner"
          >
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="w-16 h-16 rounded-full bg-[#D4AF37]/10 flex items-center justify-center">
                <Store className="w-8 h-8 text-[#D4AF37]" />
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
      </DialogContent>
    </Dialog>
  );
}
