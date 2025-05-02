"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  Home,
  Users,
  FileText,
  Package,
  BarChart,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Sidebar items
const sidebarItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES", "SUPPORT"],
  },
  {
    label: "Customers",
    href: "/customers",
    icon: <Users className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES"],
  },
  {
    label: "Inquiries",
    href: "/inquiry",
    icon: <FileText className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES", "SUPPORT"],
  },

  {
    label: "Quotations",
    href: "/quotations",
    icon: <Package className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES"],
  },
  {
    label: "Products",
    href: "/product",
    icon: <Package className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES"],
  },
  // {
  //   label: "Orders",
  //   href: "/orders",
  //   icon: <Package className="w-4 h-4" />,
  //   roles: ["SUPERADMIN", "ADMIN"],
  // },

  // {
  //   label: "Reports",
  //   href: "/reports",
  //   icon: <BarChart className="w-4 h-4" />,
  //   roles: ["SUPERADMIN", "ADMIN"],
  // },
  {
    label: "Team",
    href: "/team",
    icon: <Users className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN"],
  },
  {
    label: "Logout",
    href: "#",
    icon: <LogOut className="w-4 h-4" />,
    roles: ["SUPERADMIN", "ADMIN", "SALES", "SUPPORT"],
    logout: true,
  },
];

export function Sidebar({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const role = user?.role;

  const filteredItems = sidebarItems.filter(
    (item) => role && item.roles.includes(role)
  );

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white z-50 fixed w-full top-0 left-0">
     
        <h1 className="text-lg font-semibold">Patil Engineering</h1>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}>
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Sidebar and Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <TooltipProvider delayDuration={300}>
        <aside
          className={cn(
            "fixed md:static top-0 left-0 h-full bg-white border-r shadow-sm z-40 transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
            isCollapsed ? "md:w-16" : "w-64"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            {!isCollapsed && <div className="text-xl font-bold">Patil Engineering</div>}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1 rounded-md hover:bg-gray-100 transition-colors ml-auto"
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          <ScrollArea className="h-[calc(100vh-4rem)]">
            <nav
              className={cn(
                "flex flex-col space-y-1 p-2",
                isCollapsed ? "items-center" : ""
              )}
            >
              {filteredItems.map((item) =>
                item.logout ? (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => signOut()}
                        className={cn(
                          "flex items-center rounded-md text-sm font-medium text-muted-foreground hover:bg-muted hover:text-primary transition-colors",
                          isCollapsed ? "justify-center w-10 h-10 p-0" : "w-full px-3 py-2"
                        )}
                      >
                        {item.icon}
                        {!isCollapsed && <span className="ml-2">{item.label}</span>}
                      </button>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ) : (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        onClick={() => {
                          if (window.innerWidth < 768) setSidebarOpen(false);
                        }}
                        className={cn(
                          "flex items-center rounded-md text-sm font-medium transition-all",
                          pathname === item.href
                            ? "bg-muted text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-primary",
                          isCollapsed
                            ? "justify-center w-10 h-10 p-0"
                            : "w-full px-3 py-2"
                        )}
                      >
                        {item.icon}
                        {!isCollapsed && <span className="ml-2">{item.label}</span>}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                )
              )}
            </nav>
          </ScrollArea>
        </aside>
      </TooltipProvider>
    </>
  );
}
