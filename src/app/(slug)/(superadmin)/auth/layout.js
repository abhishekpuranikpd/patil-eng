import { getCurrentUser } from "@/app/lib/session"
import Link from "next/link"

import { redirect } from "next/navigation"



export default async function AuthLayout({ children }) {
 
  const user = await getCurrentUser();
 
   // If user is logged in, send them to the dashboard
   if (user) {
    redirect("/dashboard");
  }

  return (
    <>
      <div></div>
      <div className="">{children}</div>
    </>
  )
}