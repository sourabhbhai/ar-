// (Paste this in place of your current admin login page)
import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import { Store, Utensils, Sparkles, ArrowRight, Lock, User } from "lucide-react";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await AuthService.login(username, password);
      if (response.role === 'super_admin') {
        setLocation('/admin/dashboard');
      } else {
        setLocation('/owner/dashboard');
      }
      toast({
        title: "Login successful",
        description: `Welcome back, ${response.username}!`,
      });
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center p-4 relative overflow-hidden">
      {/* ... animated background ... */}
      <div className="w-full max-w-md space-y-8 relative z-10">
        {/* Logo/Header ... */}
        <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-xl" data-testid="login-form">
          <CardHeader className="space-y-1 pb-6 pt-8">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
              Sign In
            </CardTitle>
            <p className="text-gray-600 text-center text-sm">
              Enter your credentials to access the dashboard
            </p>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </Label>
                <Input
                  id="username"
                  data-testid="input-username"
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  data-testid="input-password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 border-2 border-gray-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-200 transition-all duration-200"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-95"
                disabled={isLoading}
                data-testid="button-login"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In
                    <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>
            </form>
            {/* Demo Credentials */}
            <div className="mt-6 p-5 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-purple-200">
              <p className="text-xs text-purple-700 mb-3 font-bold uppercase tracking-wide">Demo Credentials:</p>
              <div className="text-sm space-y-3">
                <div className="p-3 bg-white/80 rounded-lg border border-purple-200">
                  <span className="text-purple-600 font-bold block mb-1">Super Admin:</span>
                  <div className="font-mono text-gray-700">
                    <span className="block">Username: <span className="font-semibold">admin</span></span>
                    <span className="block">Password: <span className="font-semibold">admin1234</span></span>
                  </div>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-purple-200">
                  <span className="text-purple-600 font-bold block mb-1">Restaurant Owner:</span>
                  <div className="font-mono text-gray-700">
                    <span className="block">Username: <span className="font-semibold">owner1</span></span>
                    <span className="block">Password: <span className="font-semibold">ownerpass</span></span>
                  </div>
                </div>
                <div className="p-3 bg-white/80 rounded-lg border border-purple-200">
                  <span className="text-purple-600 font-bold block mb-1">Restaurant Owner:</span>
                  <div className="font-mono text-gray-700">
                    <span className="block">Username: <span className="font-semibold">owner2</span></span>
                    <span className="block">Password: <span className="font-semibold">owner2pass</span></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
