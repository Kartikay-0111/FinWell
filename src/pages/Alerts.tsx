
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, Info, CheckCircle, ShoppingCart, UtensilsCrossed, Calendar } from "lucide-react";
import { mockDataService, Alert } from "@/services/mockData";

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning":
      return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    case "info":
      return <Info className="h-4 w-4 text-blue-500" />;
    case "success":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const AlertCard = ({ alert }: { alert: Alert }) => {
  return (
    <Card className={`mb-4 fin-card ${!alert.read ? 'border-l-4 border-l-finOrange' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="h-10 w-10 mr-4">
            <AvatarFallback className={`
              ${alert.type === "warning" ? "bg-amber-500/20 text-amber-500" : ""}
              ${alert.type === "info" ? "bg-blue-500/20 text-blue-500" : ""}
              ${alert.type === "success" ? "bg-green-500/20 text-green-500" : ""}
            `}>
              {getAlertIcon(alert.type)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-medium text-finWhite">{alert.title}</h3>
              <Badge variant="outline" className="text-xs text-finLightGray border-finLightGray/20">
                {new Date(alert.date).toLocaleDateString()}
              </Badge>
            </div>
            <p className="text-finLightGray text-sm">{alert.description}</p>
            <div className="mt-3 flex justify-end space-x-2">
              <Button 
                variant="ghost" 
                size="sm"
                className="text-finLightGray hover:text-finWhite hover:bg-finDarkBlue/50"
              >
                Dismiss
              </Button>
              <Button 
                size="sm"
                className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const SuggestionCard = ({ 
  title, 
  description, 
  icon, 
  action
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  action: string;
}) => {
  return (
    <Card className="fin-card fin-hover-scale mb-4">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <div className="bg-finOrange/10 p-2 rounded-full mr-3">
            {icon}
          </div>
          <h3 className="font-medium text-finWhite">{title}</h3>
        </div>
        <p className="text-finLightGray text-sm mb-3">{description}</p>
        <Button 
          className="w-full bg-finOrange/10 text-finOrange hover:bg-finOrange/20 border border-finOrange/30"
        >
          {action}
        </Button>
      </CardContent>
    </Card>
  );
};

const Alerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const data = mockDataService.getAlerts();
    setAlerts(data);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-finWhite">Alerts & Suggestions</h1>
        <p className="text-finLightGray">Stay on top of your finances with personalized insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Alerts Column */}
        <div className="col-span-1 lg:col-span-2 space-y-4">
          <Card className="fin-card">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl text-finWhite">Financial Alerts</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <ScrollArea className="h-[600px] pr-4">
                {alerts.map((alert) => (
                  <AlertCard key={alert.id} alert={alert} />
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions Column */}
        <div>
          <Card className="fin-card mb-6">
            <CardHeader className="pb-0">
              <CardTitle className="text-xl text-finWhite">Savings Suggestions</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <SuggestionCard 
                title="Amazon Shopping Alert" 
                description="Don't open Amazon today 😅 You've already spent ₹3,000 on shopping this month."
                icon={<ShoppingCart className="h-5 w-5 text-finOrange" />}
                action="View Shopping Analysis"
              />
              
              <SuggestionCard 
                title="Food Delivery Optimization" 
                description="Reduce food delivery by 30% to save ₹2,000 this month. Try meal prepping!"
                icon={<UtensilsCrossed className="h-5 w-5 text-finOrange" />}
                action="See Food Spending Breakdown"
              />
              
              <SuggestionCard 
                title="Upcoming Subscription Renewals" 
                description="3 subscriptions worth ₹1,297 are renewing in the next 7 days."
                icon={<Calendar className="h-5 w-5 text-finOrange" />}
                action="Manage Subscriptions"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Alerts;
