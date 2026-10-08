'use server'

import { PrismaClient } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

const prisma = new PrismaClient()

export async function saveTransaction(data: any) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  if (data.id) {
    await prisma.transaction.update({
      where: { id: data.id },
      data: { ...data, user_id: undefined, id: undefined }
    })
  } else {
    await prisma.transaction.create({
      data: { ...data, user_id: user.id }
    })
  }
  revalidatePath('/dashboard')
}

export async function deleteTransaction(id: string) {
  await prisma.transaction.delete({ where: { id } })
  revalidatePath('/dashboard')
}

export async function updateGoal(goal: number) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: user.id },
    data: { personalGoal: goal }
  })
  revalidatePath('/dashboard')
}

export async function updateName(name: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error("Unauthorized")

  await prisma.user.update({
    where: { id: user.id },
    data: { name }
  })
  revalidatePath('/dashboard')
}
