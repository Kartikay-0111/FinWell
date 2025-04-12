
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { 
  LayoutDashboard, 
  ArrowRightLeft, 
  Target, 
  PieChart, 
  BellRing, 
  Trophy,
  User,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
    { path: "/transactions", label: "Transactions", icon: <ArrowRightLeft className="mr-2 h-4 w-4" /> },
    { path: "/goals", label: "Goals", icon: <Target className="mr-2 h-4 w-4" /> },
    { path: "/reports", label: "Reports", icon: <PieChart className="mr-2 h-4 w-4" /> },
    { path: "/alerts", label: "Alerts", icon: <BellRing className="mr-2 h-4 w-4" /> },
    { path: "/challenges", label: "Challenges", icon: <Trophy className="mr-2 h-4 w-4" /> },
  ];

  const handleLogout = () => {
    localStorage.removeItem("finwell-user");
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-finDarkBlue text-finWhite">
      {/* Mobile sidebar toggle */}
      <button
        className="fixed z-50 top-4 left-4 p-2 rounded-full bg-finDarkBlue md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? (
          <X className="h-6 w-6 text-finWhite" />
        ) : (
          <Menu className="h-6 w-6 text-finWhite" />
        )}
      </button>

      {/* Sidebar */}
      <div
        className={`fixed z-40 inset-y-0 left-0 w-64 bg-finBlack bg-opacity-95 transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-2xl font-bold text-finOrange">FinWell</h1>
            <p className="text-sm text-finLightGray">Financial Wellness Dashboard</p>
          </div>
          <Separator className="bg-finDarkBlue" />

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "bg-finOrange text-finDarkBlue font-medium"
                          : "text-finLightGray hover:bg-finDarkBlue"
                      }`
                    }
                  >
                    {item.icon}
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="p-4 mt-auto">
            <Separator className="bg-finDarkBlue mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-finOrange text-finDarkBlue">AJ</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Aisha Jain</p>
                  <p className="text-xs text-finLightGray">Free Plan</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                className="text-finLightGray hover:text-finWhite hover:bg-finDarkBlue"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64 p-4 md:p-6 overflow-auto">
        <div className="mx-auto max-w-7xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
