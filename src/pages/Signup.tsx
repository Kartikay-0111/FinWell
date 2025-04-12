
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/hooks/useAuth";
import { Icons } from "@/components/ui/icons";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signUp(email, password);
    setIsLoading(false);
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    await signInWithGoogle();
    // Note: We don't set isGoogleLoading to false here because the page will redirect
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
            <CardTitle className="text-finWhite">Create an account</CardTitle>
            <CardDescription className="text-finLightGray">
              Enter your details to get started with FinWell
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline"
                className="w-full bg-finDarkBlue border border-finLightGray/30 text-finWhite hover:bg-finDarkBlue/90"
                onClick={handleGoogleSignup}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Sign up with Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-finLightGray/30" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-finDarkBlue px-2 text-finLightGray">
                    Or continue with
                  </span>
                </div>
              </div>
              
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-finWhite">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-finWhite">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                    required
                  />
                  <p className="text-xs text-finLightGray">
                    Password must be at least 8 characters long
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" />
                  <label
                    htmlFor="terms"
                    className="text-sm text-finLightGray leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    I agree to the{" "}
                    <Link to="#" className="text-finOrange hover:underline">
                      Terms of Service
                    </Link>
                    {" "}and{" "}
                    <Link to="#" className="text-finOrange hover:underline">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create account"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-finLightGray">
              Already have an account?{" "}
              <Link to="/login" className="text-finOrange hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <p className="text-xs text-finLightGray">
            &copy; {new Date().getFullYear()} FinWell. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
