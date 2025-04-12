
import { useEffect, useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  ShieldAlert, 
  Laptop, 
  Palmtree, 
  Smartphone, 
  Plus,
  Calendar,
  Target
} from "lucide-react";
import { mockDataService, Goal } from "@/services/mockData";
import { formatCurrency, calculateDaysLeft, calculatePercentage } from "@/lib/utils";

const iconMap: Record<string, React.ReactNode> = {
  ShieldAlert: <ShieldAlert className="h-5 w-5 text-finOrange" />,
  Laptop: <Laptop className="h-5 w-5 text-finOrange" />,
  Palmtree: <Palmtree className="h-5 w-5 text-finOrange" />,
  Smartphone: <Smartphone className="h-5 w-5 text-finOrange" />,
};

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    const data = mockDataService.getGoals();
    setGoals(data);
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-finWhite">Financial Goals</h1>
          <p className="text-finLightGray">Track and manage your savings goals</p>
        </div>
        <Button className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90">
          <Plus className="h-4 w-4 mr-2" /> Add New Goal
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const daysLeft = calculateDaysLeft(goal.targetDate);
          const progressPercentage = calculatePercentage(goal.currentAmount, goal.targetAmount);
          const dailyAmount = daysLeft > 0 
            ? Math.ceil((goal.targetAmount - goal.currentAmount) / daysLeft) 
            : 0;

          return (
            <Card key={goal.id} className="fin-card fin-hover-scale">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-finWhite">{goal.name}</CardTitle>
                    <CardDescription className="text-finLightGray">
                      Created on {new Date(goal.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <div className="bg-finOrange/10 p-3 rounded-full">
                    {iconMap[goal.icon] || <Target className="h-5 w-5 text-finOrange" />}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm text-finLightGray">
                  <span>Progress</span>
                  <span>{progressPercentage}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2 bg-finDarkBlue" />
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-finDarkBlue/50 p-3 rounded-lg">
                    <p className="text-finLightGray mb-1">Current</p>
                    <p className="text-finWhite font-medium">{formatCurrency(goal.currentAmount)}</p>
                  </div>
                  <div className="bg-finDarkBlue/50 p-3 rounded-lg">
                    <p className="text-finLightGray mb-1">Target</p>
                    <p className="text-finWhite font-medium">{formatCurrency(goal.targetAmount)}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-finLightGray">
                    <Calendar className="h-4 w-4 mr-1" />
                    <span>{daysLeft} days left</span>
                  </div>
                  <div className="text-finOrange">
                    {dailyAmount > 0 ? `Save ${formatCurrency(dailyAmount)}/day` : 'Goal completed!'}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <Button variant="outline" className="w-full border-finOrange/20 text-finOrange hover:bg-finOrange/10 hover:text-finWhite">
                  Add Funds
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Goals;
