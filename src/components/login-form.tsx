'use client'

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { login, signup, forgotPassword } from "@/app/login/actions"
import { useState } from "react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  async function handleLogin(formData: FormData) {
    setError(null)
    setMsg(null)
    const result = await login(formData)
    if (result?.error) setError(result.error)
  }

  async function handleSignup(formData: FormData) {
    setError(null)
    setMsg(null)
    const result = await signup(formData)
    if (result?.error) setError(result.error)
  }

  async function handleForgot(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    setError(null)
    setMsg(null)
    const emailInput = document.getElementById("email") as HTMLInputElement
    if (!emailInput || !emailInput.value) {
      setError("Please enter your email to reset password.")
      return
    }
    const formData = new FormData()
    formData.append("email", emailInput.value)
    const result = await forgotPassword(formData)
    if (result?.error) setError(result.error)
    if (result?.success) setMsg(result.success)
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-white text-black shadow-md border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Login to your account</CardTitle>
          <CardDescription className="text-gray-500">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              {error && <div className="text-sm text-red-500 font-medium">{error}</div>}
              {msg && <div className="text-sm text-green-500 font-medium">{msg}</div>}
              <div className="grid gap-2">
                <Label htmlFor="email" className="font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  className="bg-white border-gray-300 text-black placeholder:text-gray-400"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-semibold">Password</Label>
                  <button
                    onClick={handleForgot}
                    className="ml-auto inline-block text-sm text-black hover:underline bg-transparent border-0 p-0"
                  >
                    Forgot your password?
                  </button>
                </div>
                <Input id="password" name="password" type="password" required className="bg-white border-gray-300 text-black" />
              </div>
              <Button formAction={handleLogin} type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                Login
              </Button>
              <Button variant="outline" type="button" className="w-full bg-white text-black border-gray-300 hover:bg-gray-100">
                Login with Google
              </Button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <button formAction={handleSignup} className="text-black underline underline-offset-4 bg-transparent border-0 p-0">
                Sign up
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
