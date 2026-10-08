import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createClient } from '@/utils/supabase/server'
import { PrismaClient } from '@prisma/client'
import DashboardClient from './DashboardClient'

const prisma = new PrismaClient()

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { transactions: { orderBy: { createdAt: 'desc' } } }
  })

  if (!dbUser || !dbUser.name) {
    redirect('/onboarding')
  }

  return (
    <DashboardClient 
      initialUser={dbUser} 
      initialTransactions={dbUser.transactions} 
    />
  )
}
