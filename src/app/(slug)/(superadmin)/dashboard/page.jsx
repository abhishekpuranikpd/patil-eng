import { getCurrentUser } from "@/app/lib/session"


export default async function AdminDashboardPage() {
  const  user = await getCurrentUser()

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
          <p className="text-muted-foreground">Welcome back, Admin! Here's an overview of the platform.</p>
        </div>
      </div>

     
    </div>
  )
}

