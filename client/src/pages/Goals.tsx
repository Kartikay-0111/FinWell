
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  ShieldAlert, 
  Laptop, 
  Palmtree, 
  Smartphone, 
  Plus,
  Calendar,
  Target,
  Briefcase,
  Home,
  Plane,
  GraduationCap,
  Car,
  HeartPulse,
  PiggyBank
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

type Goal = {
  id: string;
  user_id: string;
  target_amount: number;
  current_amount: number;
  target_date: string | null;
  description: string | null;
  type: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
};

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const calculateDaysLeft = (targetDate: string | null): number => {
  if (!targetDate) return 0;
  
  const today = new Date();
  const target = new Date(targetDate);
  const timeDiff = target.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  
  return Math.max(0, daysDiff);
};

const calculatePercentage = (current: number, target: number): number => {
  if (target === 0) return 0;
  const percentage = (current / target) * 100;
  return Math.min(100, Math.round(percentage));
};

const iconMap: Record<string, React.ReactNode> = {
  emergency: <ShieldAlert className="h-5 w-5 text-finOrange" />,
  electronics: <Laptop className="h-5 w-5 text-finOrange" />,
  vacation: <Palmtree className="h-5 w-5 text-finOrange" />,
  gadgets: <Smartphone className="h-5 w-5 text-finOrange" />,
  career: <Briefcase className="h-5 w-5 text-finOrange" />,
  home: <Home className="h-5 w-5 text-finOrange" />,
  travel: <Plane className="h-5 w-5 text-finOrange" />,
  education: <GraduationCap className="h-5 w-5 text-finOrange" />,
  vehicle: <Car className="h-5 w-5 text-finOrange" />,
  health: <HeartPulse className="h-5 w-5 text-finOrange" />,
  savings: <PiggyBank className="h-5 w-5 text-finOrange" />,
};

const goalTypes = [
  { value: "emergency", label: "Emergency Fund" },
  { value: "savings", label: "Savings" },
  { value: "vacation", label: "Vacation" },
  { value: "home", label: "Home Purchase" },
  { value: "vehicle", label: "Vehicle" },
  { value: "education", label: "Education" },
  { value: "electronics", label: "Electronics" },
  { value: "gadgets", label: "Gadgets" },
  { value: "travel", label: "Travel" },
  { value: "career", label: "Career" },
  { value: "health", label: "Health" },
];

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    type: "",
    targetAmount: "",
    currentAmount: "0",
    targetDate: ""
  });
  
  const { toast } = useToast();

  useEffect(() => {
    fetchGoals();
  }, []);
  
  const fetchGoals = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      if (data) {
        setGoals(data);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching goals",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (value: string) => {
    setNewGoal(prev => ({ ...prev, type: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newGoal.name || !newGoal.targetAmount || !newGoal.type) {
      toast({
        title: "Missing required fields",
        description: "Please fill all the required fields.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const goalData = {
        description: newGoal.description,
        type: newGoal.type,
        target_amount: parseFloat(newGoal.targetAmount),
        current_amount: parseFloat(newGoal.currentAmount || "0"),
        target_date: newGoal.targetDate || null,
        is_completed: false
      };
      
      const { error, data } = await supabase
        .from('goals')
        .insert([goalData])
        .select();
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Goal created",
        description: "Your financial goal has been created successfully."
      });
      
      // Reset form and close dialog
      setNewGoal({
        name: "",
        description: "",
        type: "",
        targetAmount: "",
        currentAmount: "0",
        targetDate: ""
      });
      
      setIsDialogOpen(false);
      
      // Refresh goals
      fetchGoals();
      
    } catch (error: any) {
      toast({
        title: "Error creating goal",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleAddFunds = async (goalId: string, currentAmount: number, targetAmount: number) => {
    try {
      // For simplicity, we'll add 10% of the remaining amount or $100, whichever is less
      const remaining = targetAmount - currentAmount;
      const addAmount = Math.min(remaining, Math.min(remaining * 0.1, 100));
      
      if (addAmount <= 0) {
        toast({
          title: "Goal already complete",
          description: "This goal has already reached its target amount."
        });
        return;
      }
      
      const newAmount = currentAmount + addAmount;
      const isCompleted = newAmount >= targetAmount;
      
      const { error } = await supabase
        .from('goals')
        .update({
          current_amount: newAmount,
          is_completed: isCompleted,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);
        
      if (error) {
        throw error;
      }
      
      toast({
        title: "Funds added",
        description: `Added ${formatCurrency(addAmount)} to your goal.`
      });
      
      // Refresh goals
      fetchGoals();
      
    } catch (error: any) {
      toast({
        title: "Error adding funds",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-finWhite">Financial Goals</h1>
          <p className="text-finLightGray">Track and manage your savings goals</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90">
              <Plus className="h-4 w-4 mr-2" /> Add New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-finDarkBlue border-finOrange/20 text-finWhite">
            <DialogHeader>
              <DialogTitle>Create New Goal</DialogTitle>
              <DialogDescription className="text-finLightGray">
                Set a new financial goal to track your progress.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name" className="text-finWhite">Goal Name</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="e.g. Emergency Fund"
                    value={newGoal.name}
                    onChange={handleInputChange}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type" className="text-finWhite">Goal Type</Label>
                  <Select
                    value={newGoal.type}
                    onValueChange={handleSelectChange}
                    required
                  >
                    <SelectTrigger className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                      <SelectValue placeholder="Select a goal type" />
                    </SelectTrigger>
                    <SelectContent className="bg-finDarkBlue border-finLightGray/30 text-finWhite">
                      {goalTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description" className="text-finWhite">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your goal..."
                    value={newGoal.description}
                    onChange={handleInputChange}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="targetAmount" className="text-finWhite">Target Amount</Label>
                    <Input
                      id="targetAmount"
                      name="targetAmount"
                      type="number"
                      placeholder="1000"
                      value={newGoal.targetAmount}
                      onChange={handleInputChange}
                      className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                      min="1"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="currentAmount" className="text-finWhite">Current Amount</Label>
                    <Input
                      id="currentAmount"
                      name="currentAmount"
                      type="number"
                      placeholder="0"
                      value={newGoal.currentAmount}
                      onChange={handleInputChange}
                      className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="targetDate" className="text-finWhite">Target Date (Optional)</Label>
                  <Input
                    id="targetDate"
                    name="targetDate"
                    type="date"
                    value={newGoal.targetDate}
                    onChange={handleInputChange}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-finLightGray/30 text-finLightGray hover:text-finWhite"
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90">
                  Create Goal
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin h-8 w-8 border-4 border-finOrange border-t-transparent rounded-full" />
        </div>
      ) : goals.length === 0 ? (
        <Card className="fin-card p-10 text-center">
          <div className="flex flex-col items-center">
            <Target className="h-16 w-16 text-finOrange/50 mb-4" />
            <h3 className="text-xl font-medium text-finWhite mb-2">No Goals Yet</h3>
            <p className="text-finLightGray mb-6">
              Start by creating your first financial goal to track your progress.
            </p>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              className="bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
            >
              <Plus className="h-4 w-4 mr-2" /> Create First Goal
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const daysLeft = goal.target_date ? calculateDaysLeft(goal.target_date) : 0;
            const progressPercentage = calculatePercentage(goal.current_amount, goal.target_amount);
            const dailyAmount = daysLeft > 0 
              ? Math.ceil((goal.target_amount - goal.current_amount) / daysLeft) 
              : 0;

            return (
              <Card key={goal.id} className="fin-card fin-hover-scale">
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-finWhite">{goal.description}</CardTitle>
                      <CardDescription className="text-finLightGray">
                        Created on {new Date(goal.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <div className="bg-finOrange/10 p-3 rounded-full">
                      {goal.type && iconMap[goal.type] ? iconMap[goal.type] : <Target className="h-5 w-5 text-finOrange" />}
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
                      <p className="text-finWhite font-medium">{formatCurrency(goal.current_amount)}</p>
                    </div>
                    <div className="bg-finDarkBlue/50 p-3 rounded-lg">
                      <p className="text-finLightGray mb-1">Target</p>
                      <p className="text-finWhite font-medium">{formatCurrency(goal.target_amount)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-finLightGray">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>{goal.target_date ? `${daysLeft} days left` : 'No deadline'}</span>
                    </div>
                    <div className="text-finOrange">
                      {goal.is_completed ? 
                        'Goal completed!' : 
                        dailyAmount > 0 ? `Save ${formatCurrency(dailyAmount)}/day` : 'Almost there!'}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    className="w-full border-finOrange/20 text-finOrange hover:bg-finOrange/10 hover:text-finWhite"
                    onClick={() => handleAddFunds(goal.id, goal.current_amount, goal.target_amount)}
                    disabled={goal.is_completed}
                  >
                    {goal.is_completed ? 'Goal Completed' : 'Add Funds'}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Goals;
