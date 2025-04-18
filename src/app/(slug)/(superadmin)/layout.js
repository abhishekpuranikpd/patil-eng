
import { SessionProvider } from "next-auth/react";
import { Sidebar } from "../components/sidebar";
import { getCurrentUser } from "@/app/lib/session";

export default async function DashboardLayout({ children  }) {
  const user = await getCurrentUser()
  return (
    <div className="flex">
 <Sidebar user={user} />
      <main className="flex-1 p-4"> {children}</main>
    </div>
  );
}
