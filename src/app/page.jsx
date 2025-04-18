import { ArrowRight, ShieldCheck, Users, HeadsetIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white py-6 border-b">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Patil Engineering</h1>
          <p className="text-gray-500 mt-2">CRM Management System</p>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Patil Engineering </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Select your role to access the system. Each role provides specific features tailored to your
              responsibilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Admin Login Card */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-center">Admin</CardTitle>
                <CardDescription className="text-center">
                  Full system access with reporting and approval capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
              
              </CardContent>
              <CardFooter>
                <Link href="/auth/login" className="w-full">
                  <Button className="w-full">
                    Admin Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Sales Login Card */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-center">Sales</CardTitle>
                <CardDescription className="text-center">
                  Handle inquiries, generate quotations, and manage follow-ups
                </CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
            
              </CardContent>
              <CardFooter>
                <Link href="/login?role=sales" className="w-full">
                  <Button className="w-full">
                    Sales Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>

            {/* Support Login Card */}
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <HeadsetIcon className="h-6 w-6 text-gray-700" />
                </div>
                <CardTitle className="text-center">Support</CardTitle>
                <CardDescription className="text-center">Manage pending cases and post-sales service</CardDescription>
              </CardHeader>
              <CardContent className="text-sm text-gray-600">
               
              </CardContent>
              <CardFooter>
                <Link href="/login?role=support" className="w-full">
                  <Button className="w-full">
                    Support Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>

         
        </div>
      </main>

      <footer className="bg-white py-6 border-t">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-2">
            &copy; {new Date().getFullYear()} Patil Engineering. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Developed by Cloud Booking Software Solutions Pune | Contact: +91-8692805267
          </p>
        </div>
      </footer>
    </div>
  )
}
