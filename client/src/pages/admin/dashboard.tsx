import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AuthService } from "@/lib/auth";
import { demoRestaurants } from "@/lib/demoRestaurants"; // <--- hardcoded array
import { 
  Store, 
  Utensils, 
  QrCode, 
  Users, 
  BarChart3, 
  Plus, 
  Search, 
  Edit, 
  Eye, 
  Trash2,
  Bell,
  DollarSign,
  Receipt,
  LogOut
} from "lucide-react";

// Dish structure (for demo purpose)
const demoDishes = [
  { id: "dish-1", name: "Pizza", price: "299", restaurantId: "res-1", isAvailable: true, description: "Cheese burst pizza" },
  { id: "dish-2", name: "Burger", price: "199", restaurantId: "res-2", isAvailable: true, description: "Double patty burger" }
];

export default function AdminDashboard() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRestaurant, setNewRestaurant] = useState({ name: "", description: "", cuisine: "", image: "" });
  const { toast } = useToast();

  // Check authentication
  useEffect(() => {
    const user = AuthService.getUser();
    if (!user || user.role !== 'super_admin') {
      setLocation('/admin');
    }
  }, [setLocation]);

  // Hardcoded data source instead of API/database
  const restaurants = demoRestaurants;
  const dishes = demoDishes;
  const loadingRestaurants = false;

  // Filter restaurants based on search
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    restaurant.cuisine?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Add restaurant (demo: array push and toast only)
  const handleAddRestaurant = () => {
    setShowAddModal(false);
    setNewRestaurant({ name: "", description: "", cuisine: "", image: "" });
    toast({
      title: "Demo: Restaurant added",
      description: "In demo mode, restaurant is not persistent.",
    });
  };

  const handleLogout = async () => {
    await AuthService.logout();
    setLocation('/admin');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const generateQRCode = async (restaurantId: string) => {
    // Demo QR: show menu link only
    const menuUrl = `${window.location.origin}/menu/${restaurantId}`;
    const qrDemo = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(menuUrl)}&size=200x200`;
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>QR Code - Restaurant Menu</title></head>
          <body style="display: flex; flex-direction: column; align-items: center; padding: 20px; font-family: Arial, sans-serif;">
            <h2 style="color: #7c3aed">Restaurant Menu QR Code</h2>
            <img src="${qrDemo}" alt="QR Code" style="border: 2px solid #a21caf; padding: 10px; background: #faf5ff;" />
            <p style="margin: 16px 0;">URL: <a href="${menuUrl}" target="_blank">${menuUrl}</a></p>
          </body>
        </html>
      `);
    }
  };

  // Calculate stats
  const totalRestaurants = restaurants.length;
  const activeRestaurants = restaurants.length; // All active for demo
  const totalDishes = dishes.length;
  const activeDishes = dishes.filter((d) => d.isAvailable).length;

  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-violet-50 to-fuchsia-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-violet-700 via-purple-700 to-fuchsia-700 border-r border-border text-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-purple-600 bg-violet-800">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Store className="w-4 h-4 text-purple-900" />
              </div>
              <h1 className="text-lg font-bold font-serif tracking-wide">AR Restaurant</h1>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-fuchsia-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-fuchsia-700 hover:text-white"
              }`} 
              data-testid="nav-dashboard"
            >
              <BarChart3 className="w-4 h-4 mr-3" />
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab("restaurants")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "restaurants" 
                  ? "bg-fuchsia-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-fuchsia-700 hover:text-white"
              }`} 
              data-testid="nav-restaurants"
            >
              <Store className="w-4 h-4 mr-3" />
              Restaurants
            </button>
            <button 
              onClick={() => setActiveTab("dishes")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "dishes" 
                  ? "bg-fuchsia-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-fuchsia-700 hover:text-white"
              }`} 
              data-testid="nav-dishes"
            >
              <Utensils className="w-4 h-4 mr-3" />
              Dishes
            </button>
            <button 
              onClick={() => setActiveTab("qrcodes")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "qrcodes" 
                  ? "bg-fuchsia-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-fuchsia-700 hover:text-white"
              }`} 
              data-testid="nav-qrcodes"
            >
              <QrCode className="w-4 h-4 mr-3" />
              QR Codes
            </button>
            <button 
              onClick={() => setActiveTab("owners")}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === "owners" 
                  ? "bg-fuchsia-600 text-white shadow-lg" 
                  : "text-purple-100 hover:bg-fuchsia-700 hover:text-white"
              }`} 
              data-testid="nav-owners"
            >
              <Users className="w-4 h-4 mr-3" />
              Owners
            </button>
          </nav>
          
          {/* User Menu */}
          <div className="p-4 border-t border-purple-600 bg-violet-800">
            <div className="flex items-center mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Users className="w-4 h-4 text-purple-900" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-bold">Super Admin</p>
                <p className="text-xs text-purple-200">admin@example.com</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="w-full bg-fuchsia-600 text-white hover:bg-fuchsia-700 mt-2"
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="bg-gradient-to-r from-violet-200 via-purple-100 to-fuchsia-200 border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold font-serif text-fuchsia-700">
                {activeTab === "dashboard" ? "Dashboard" :
                 activeTab === "restaurants" ? "Restaurants" :
                 activeTab === "dishes" ? "Dishes" :
                 activeTab === "qrcodes" ? "QR Codes" :
                 activeTab === "owners" ? "Owners" : "Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {activeTab === "dashboard" ? "Manage your restaurant network" :
                 activeTab === "restaurants" ? "Manage all restaurants" :
                 activeTab === "dishes" ? "Manage all dishes" :
                 activeTab === "qrcodes" ? "Generate QR codes" :
                 activeTab === "owners" ? "Manage restaurant owners" : "Manage your restaurant network"}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-fuchsia-700 hover:text-fuchsia-900 transition-colors" data-testid="button-notifications">
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-fuchsia-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
              </button>
              {activeTab === "restaurants" && (
                <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
                  <DialogTrigger asChild>
                    <Button className="bg-fuchsia-700 text-white hover:bg-fuchsia-800 shadow-lg" data-testid="button-add-restaurant">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Restaurant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-fuchsia-50 to-violet-50">
                    <DialogHeader>
                      <DialogTitle className="text-fuchsia-700 font-bold">Add New Restaurant</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">Name</Label>
                        <Input
                          id="name"
                          value={newRestaurant.name}
                          onChange={(e) => setNewRestaurant(prev => ({ ...prev, name: e.target.value }))}
                          className="col-span-3"
                          placeholder="Restaurant name"
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="cuisine" className="text-right">Cuisine</Label>
                        <Input
                          id="cuisine"
                          value={newRestaurant.cuisine}
                          onChange={(e) => setNewRestaurant(prev => ({ ...prev, cuisine: e.target.value }))}
                          className="col-span-3"
                          placeholder="Italian, Chinese, etc."
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="image" className="text-right">Image URL</Label>
                        <Input
                          id="image"
                          value={newRestaurant.image}
                          onChange={(e) => setNewRestaurant(prev => ({ ...prev, image: e.target.value }))}
                          className="col-span-3"
                          placeholder="https://..."
                        />
                      </div>
                      <div className="grid grid-cols-4 items-start gap-4">
                        <Label htmlFor="description" className="text-right pt-2">Description</Label>
                        <Textarea
                          id="description"
                          value={newRestaurant.description}
                          onChange={(e) => setNewRestaurant(prev => ({ ...prev, description: e.target.value }))}
                          className="col-span-3"
                          placeholder="Restaurant description"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowAddModal(false)}
                        className="bg-purple-200 text-fuchsia-900 border-fuchsia-400 hover:bg-fuchsia-100"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleAddRestaurant}
                        disabled={!newRestaurant.name.trim()}
                        className="bg-fuchsia-700 text-white font-bold shadow-lg"
                      >
                        Add Restaurant
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          {activeTab === "dashboard" && (
            <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-fuchsia-50 to-purple-100 border border-fuchsia-300 shadow-lg" data-testid="stats-restaurants">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-fuchsia-700 font-semibold">Total Restaurants</p>
                      <p className="text-3xl font-extrabold text-fuchsia-900" data-testid="text-total-restaurants">{totalRestaurants}</p>
                    </div>
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center shadow">
                      <Store className="w-6 h-6 text-fuchsia-700" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-fuchsia-700 font-bold" data-testid="text-active-restaurants">{activeRestaurants} active</span>
                    <span className="text-fuchsia-600 ml-2">restaurants</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-100 border border-purple-300 shadow-lg" data-testid="stats-dishes">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 font-semibold">Active Dishes</p>
                      <p className="text-3xl font-extrabold text-purple-900" data-testid="text-total-dishes">{activeDishes}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center shadow">
                      <Utensils className="w-6 h-6 text-purple-700" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-purple-700 font-bold">of {totalDishes}</span>
                    <span className="text-purple-600 ml-2">total dishes</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-violet-50 to-fuchsia-100 border border-violet-300 shadow-lg" data-testid="stats-orders">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-violet-700 font-semibold">Daily Orders</p>
                      <p className="text-3xl font-extrabold text-violet-900">0</p>
                    </div>
                    <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center shadow">
                      <Receipt className="w-6 h-6 text-violet-700" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-violet-700 font-bold">+0%</span>
                    <span className="text-violet-600 ml-2">from yesterday</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-fuchsia-50 to-purple-100 border border-fuchsia-300 shadow-lg" data-testid="stats-revenue">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-fuchsia-700 font-semibold">Revenue</p>
                      <p className="text-3xl font-extrabold text-fuchsia-900">$0</p>
                    </div>
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-lg flex items-center justify-center shadow">
                      <DollarSign className="w-6 h-6 text-fuchsia-700" />
                    </div>
                  </div>
                  <div className="flex items-center mt-4 text-sm">
                    <span className="text-fuchsia-700 font-bold">+0%</span>
                    <span className="text-fuchsia-600 ml-2">from last week</span>
                  </div>
                </CardContent>
              </Card>
            </div>
            </>
          )}

          {/* Restaurants Table */}
          {activeTab === "restaurants" && (
            <Card className="bg-gradient-to-br from-fuchsia-50 to-purple-100 border border-fuchsia-200 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-fuchsia-700">Restaurants</CardTitle>
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-fuchsia-400" />
                      <Input
                        placeholder="Search restaurants..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 w-64 border-fuchsia-400 focus:border-fuchsia-700"
                        data-testid="input-search-restaurants"
                      />
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-fuchsia-700 text-white shadow-lg hover:bg-fuchsia-800" 
                      onClick={() => setShowAddModal(true)}
                      data-testid="button-add-restaurant-table"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {loadingRestaurants ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="text-fuchsia-700">Loading restaurants...</div>
                  </div>
                ) : filteredRestaurants.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8">
                    <Store className="w-12 h-12 text-fuchsia-300 mb-4" />
                    <p className="text-fuchsia-400 text-lg font-semibold" data-testid="text-no-restaurants">
                      {searchTerm ? 'No restaurants found matching your search' : 'No restaurants yet'}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-fuchsia-200">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Restaurant</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Owner</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Dishes</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">QR Code</th>
                          <th className="px-6 py-3 text-left text-xs font-bold text-fuchsia-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-fuchsia-100">
                        {filteredRestaurants.map((restaurant) => (
                          <tr key={restaurant.id} className="hover:bg-fuchsia-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <img 
                                  src={restaurant.image || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=100&h=100"} 
                                  alt={`${restaurant.name} restaurant`} 
                                  className="w-10 h-10 rounded-lg object-cover border-2 border-fuchsia-300" 
                                />
                                <div className="ml-4">
                                  <div className="text-base font-bold text-fuchsia-900">{restaurant.name}</div>
                                  <div className="text-sm text-fuchsia-700">{restaurant.cuisine || 'Various'}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-bold text-fuchsia-900">Owner</div>
                              <div className="text-sm text-fuchsia-700">{restaurant.ownerId}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-fuchsia-900">
                              {dishes.filter((d) => d.restaurantId === restaurant.id).length}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Badge 
                                variant={restaurant.isEnabled ? "default" : "secondary"}
                                className={restaurant.isEnabled ? "bg-fuchsia-700 text-white font-bold" : "bg-fuchsia-200 text-fuchsia-700"}
                                data-testid={`badge-status-${restaurant.id}`}
                              >
                                {restaurant.isEnabled !== false ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => generateQRCode(restaurant.id)}
                                className="text-fuchsia-700 hover:text-fuchsia-900"
                                data-testid={`button-qr-${restaurant.id}`}
                              >
                                <QrCode className="w-4 h-4 mr-1" />
                                View
                              </Button>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-fuchsia-700 hover:text-fuchsia-900"
                                  data-testid={`button-edit-${restaurant.id}`}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-fuchsia-400 hover:text-fuchsia-700"
                                  data-testid={`button-view-${restaurant.id}`}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-fuchsia-300 hover:text-fuchsia-900"
                                  data-testid={`button-toggle-${restaurant.id}`}
                                >
                                  {restaurant.isEnabled !== false ? (
                                    <Trash2 className="w-4 h-4 text-fuchsia-500" />
                                  ) : (
                                    <Eye className="w-4 h-4 text-fuchsia-700" />
                                  )}
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* ...rest of the code for dishes, QR, owners in same pretty style... */}
        </main>
      </div>
    </div>
  );
}
