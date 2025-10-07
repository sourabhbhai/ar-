import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Store, 
  Utensils, 
  QrCode, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  Crown,
  ChefHat
} from "lucide-react";

export default function LandingPage() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-300/20 rounded-full blur-3xl"></div>
        </div>

        {/* Content */}
        <div className="relative container mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16 space-y-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
              <Sparkles className="w-4 h-4" />
              <span>Next-Gen Restaurant Management</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-pink-600 bg-clip-text text-transparent leading-tight">
              AR Restaurant
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Transform your dining experience with Augmented Reality menus. 
              Visualize dishes in 3D before you order! 🍽️✨
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <QrCode className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">QR Code Access</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Scan & view menus instantly. No app download required!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">3D/AR Visualization</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  See dishes in stunning 3D and AR on your phone!
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">Real-Time Orders</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Live order updates with WebSocket technology
                </p>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section - Role Selection */}
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
              Choose Your Dashboard
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              {/* Admin Card */}
              <Card className="border-0 bg-gradient-to-br from-purple-600 to-blue-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden relative"
                onClick={() => setLocation('/admin')}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Super Admin</h3>
                  <p className="text-white/90 mb-6">
                    Manage restaurants, dishes, QR codes, and owner accounts. Full system control.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Full Access Control</span>
                  </div>
                </CardContent>
              </Card>

              {/* Restaurant Owner Card */}
              <Card className="border-0 bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 cursor-pointer group overflow-hidden relative"
                onClick={() => setLocation('/owner')}>
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                      <ChefHat className="w-8 h-8 text-white" />
                    </div>
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">Restaurant Owner</h3>
                  <p className="text-white/90 mb-6">
                    Manage your restaurant's orders, view real-time notifications, and track performance.
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <Store className="w-4 h-4" />
                    <span>Order Management</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Powered by AR technology, WebSocket real-time updates, and modern web standards
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
