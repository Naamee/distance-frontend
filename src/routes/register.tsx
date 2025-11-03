import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, Circle, CircleCheck } from "lucide-react";
import { useRequestStore } from "@/stores/requests";

export const Route = createFileRoute("/register")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userRegister, error, loading } = useRequestStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [success, setSuccess] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await userRegister(formData);
    if (success) {
      setSuccess(true);
    }

  };

  return (
    <div className="h-screen justify-items-center content-center p-4">
      <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md border border-amber-500">
        <form onSubmit={submit}>
          <CardContent>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  autoComplete="username"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  autoComplete="new-password"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                </div>
                <Input
                  id="confirm-password"
                  type="password"
                  value={formData.confirmPassword}
                  autoComplete="confirm-password"
                  required
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 mt-8">
            <Button
              size="lg"
              type="submit"
              disabled={loading}
              className="w-full font-bold bg-gradient-to-b from-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:from-amber-400 active:to-amber-500 active:mt-1"
            >
              {loading ? <Spinner /> : null}
              Sign Up
            </Button>

            {/* error alert */}
            {error && (
              <Alert variant="destructive">
                <AlertCircleIcon />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <p>{error}</p>
                </AlertDescription>
              </Alert>
            )}

            {/* success alert */}
            {success && (
              <Alert className="border border-lime-500 text-lime-600">
                <CircleCheck />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription className="text-lime-600">
                  <p>Registration successful! You can now log in.</p>
                </AlertDescription>
              </Alert>
            )}

            {/* divider */}
            <div className="flex items-center my-4 w-full">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-5 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex">
              <span className="content-center text-nowrap">
                Have an account?
              </span>
              <Link to="/login">
                <Button
                  variant="link"
                  className="text-amber-500 active:text-amber-600"
                >
                  Log In
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
