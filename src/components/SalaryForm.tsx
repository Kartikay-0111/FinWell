
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

const SalaryForm = () => {
  const [salary, setSalary] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateSalary } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const numericSalary = parseFloat(salary);
    if (isNaN(numericSalary) || numericSalary <= 0) {
      setIsLoading(false);
      return;
    }
    
    const { error } = await updateSalary(numericSalary);
    
    if (!error) {
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
              Please enter your monthly salary to help us personalize your experience
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  This information helps us provide personalized financial advice
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
