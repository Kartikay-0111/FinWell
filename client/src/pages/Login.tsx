
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { Icons } from "@/components/ui/icons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await signIn(email, password);
    setIsLoading(false);
  };

  const handleGoogleLogin = async () => {
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
            <CardTitle className="text-finWhite">Login</CardTitle>
            <CardDescription className="text-finLightGray">
              Enter your credentials to access your dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-4">
              <Button 
                variant="outline"
                className="w-full bg-finDarkBlue border border-finLightGray/30 text-finWhite hover:bg-finDarkBlue/90"
                onClick={handleGoogleLogin}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Icons.google className="mr-2 h-4 w-4" />
                )}
                Sign in with Google
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
              
              <form onSubmit={handleLogin} className="space-y-4">
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
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-finWhite">Password</Label>
                    <Link to="#" className="text-xs text-finOrange hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-finDarkBlue border-finLightGray/30 text-finWhite"
                    required
                  />
                </div>
                
                <Button
                  type="submit"
                  className="w-full bg-finOrange text-finDarkBlue hover:bg-finOrange/90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <p className="text-sm text-finLightGray">
              Don't have an account?{" "}
              <Link to="/signup" className="text-finOrange hover:underline">
                Sign up
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

export default Login;
