import { getCurrentUser } from "@/app/lib/session"
import Link from "next/link"

import { redirect } from "next/navigation"



export default async function AuthLayout({ children }) {
 
 
  return (
    <>
      <div></div>
      <div className="">{children}</div>
    </>
  )
}