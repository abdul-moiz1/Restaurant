import Navbar from "../Navbar";

export default function NavbarExample() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Logged out state:</p>
        <Navbar />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Logged in as Customer:</p>
        <Navbar
          user={{ email: "customer@example.com", role: "customer" }}
          onLogout={() => console.log("Logout clicked")}
        />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Logged in as Owner:</p>
        <Navbar
          user={{ email: "owner@example.com", role: "owner" }}
          onLogout={() => console.log("Logout clicked")}
        />
      </div>
    </div>
  );
}
