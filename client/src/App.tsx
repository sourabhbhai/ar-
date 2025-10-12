import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AdminDashboard from "@/pages/admin/dashboard";
import AdminLogin from "@/pages/admin/login";
import OwnerDashboard from "@/pages/owner/dashboard";
import OwnerLogin from "@/pages/owner/login";
import CustomerMenu from "@/pages/customer/menu";
import LandingPage from "@/pages/landingpage";
import { AuthService, User } from "./lib/auth";
import { useEffect, useState } from "react";

function Router() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      const u = await AuthService.getCurrentUser();
      setUser(u);
      setLoading(false);
    }
    init();
  }, []);

  if (loading) return <div>Loading...</div>;

  // Dev login page override
  if (!user) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Dev Login</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            const username = (e.currentTarget.username as HTMLInputElement).value;
            const password = (e.currentTarget.password as HTMLInputElement).value;
            try {
              const u = await AuthService.login(username, password);
              setUser(u);
            } catch (err: any) {
              alert(err.message || "Login failed");
            }
          }}
        >
          <input name="username" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <button type="submit">Login</button>
        </form>
        <div style={{ marginTop: 12 }}>
          <strong>Available dev accounts:</strong>
          <ul>
            <li>admin / admin1234</li>
            <li>owner1 / ownerpass</li>
            <li>owner2 / owner2pass</li>
          </ul>
        </div>
      </div>
    );
  }

  // Render dashboard based on role
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      {user.role === "super_admin" && (
        <>
          <Route path="/admin" component={AdminLogin} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
        </>
      )}
      {user.role === "restaurant_owner" && (
        <>
          <Route path="/owner" component={OwnerLogin} />
          <Route path="/owner/dashboard" component={OwnerDashboard} />
        </>
      )}
      <Route path="/menu/:restaurantId" component={CustomerMenu} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
