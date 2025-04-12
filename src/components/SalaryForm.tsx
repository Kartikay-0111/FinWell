
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const SalaryForm = () => {
  const [name, setName] = useState<string>('');
  const [dob, setDob] = useState<Date | undefined>(undefined);
  const [salary, setSalary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!name.trim()) {
      toast({
        title: "Name is required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    const numericSalary = parseFloat(salary);
    if (isNaN(numericSalary) || numericSalary <= 0) {
      toast({
        title: "Invalid salary",
        description: "Please enter a valid salary amount.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    const { error } = await updateUserProfile({
      name,
      dob: dob ? dob.toISOString().split('T')[0] : null,
      income: numericSalary
    });
    
    if (!error) {
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated."
      });
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-finDarkBlue p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-finOrange mb-2">FinWell</h1>
          <p className="text-finLightGray">Your financial wellness partner</p>
        </div>
        
        <Card className="bg-finDarkBlue border border-finOrange/20 shadow-xl animate-scale-in">
          <CardHeader>
            <CardTitle className="text-finWhite">Complete Your Profile</CardTitle>
            <CardDescription className="text-finLightGray">
              Please provide some information to help us personalize your experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-finWhite">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob" className="text-finWhite">Date of Birth</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dob"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-finDarkBlue border-finLightGray/30",
                        !dob && "text-finLightGray"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dob ? format(dob, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-finDarkBlue border-finLightGray/30">
                    <Calendar
                      mode="single"
                      selected={dob}
                      onSelect={setDob}
                      initialFocus
                      className="bg-finDarkBlue text-finWhite"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-finWhite">Monthly Salary</Label>
                <Input
                  id="salary"
                  type="number"
                  placeholder="5000"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                  required
                  min="1"
                />
                <p className="text-xs text-finLightGray">
                  This helps us provide personalized financial advice
                </p>
              </div>
              
              <Button
                type="submit"
                className="w-full bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save and Continue"}
              </Button>
            </form>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-xs text-finLightGray">
              Your data is secure and will only be used to improve your experience
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SalaryForm;
