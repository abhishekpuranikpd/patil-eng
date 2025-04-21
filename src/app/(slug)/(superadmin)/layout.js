import { Sidebar } from "../components/sidebar";
import { getCurrentUser } from "@/app/lib/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const user = await getCurrentUser();



  return (
    <div className="flex">
      {/* Show sidebar only if user exists */}
      {user && <Sidebar user={user} />}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
