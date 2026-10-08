import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function OnboardingPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if already onboarded
  const existingUser = await prisma.user.findUnique({
    where: { id: user.id }
  })

  if (existingUser?.name) {
    redirect('/dashboard')
  }

  async function completeOnboarding(formData: FormData) {
    "use server"
    const name = formData.get("name") as string
    const goal = parseFloat(formData.get("goal") as string)

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const db = new PrismaClient()
    await db.user.upsert({
      where: { id: user.id },
      update: { name, personalGoal: goal },
      create: {
        id: user.id,
        email: user.email!,
        name,
        personalGoal: goal,
      }
    })

    redirect('/dashboard')
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-md">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Welcome!</CardTitle>
            <CardDescription>
              Let's set up your profile before you start.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={completeOnboarding} className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" required placeholder="John Doe" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="goal">Monthly Personal Goal (INR)</Label>
                <Input id="goal" name="goal" type="number" required placeholder="50000" />
              </div>
              <Button type="submit" className="w-full">
                Complete Setup
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
