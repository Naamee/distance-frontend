import { type FormEvent, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { router } from "@/main";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import { useUserStore } from "@/stores/userStore";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const { userLogin, error, loading } = useUserStore();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const submit = async (e: FormEvent) => {
    e.preventDefault();

    const success = await userLogin(formData);

    if (success) {
      router.navigate({ to: "/" });
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
                  autoComplete="current-password"
                  required
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center gap-4">
                  <Checkbox
                    id="terms"
                    checked={formData.remember}
                    onCheckedChange={(checked: boolean) =>
                      setFormData({ ...formData, remember: checked })
                    }
                  />
                  <Label htmlFor="password">Remember Me</Label>
                </div>
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
              Login
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

            {/* divider */}
            <div className="flex items-center my-4 w-full">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="mx-5 text-gray-400 text-sm">OR</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex">
              <span className="content-center text-nowrap">
                Don't have an account?
              </span>
              <Link to="/register">
                <Button
                  variant="link"
                  className="text-amber-500 active:text-amber-600"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
