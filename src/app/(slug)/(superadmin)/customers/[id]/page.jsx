import { db } from "@/app/lib/db"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, MapPinIcon, PhoneIcon, MailIcon, PlusIcon, FileTextIcon, UserIcon } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const CustomerPage = async ({ params }) => {
  const customerId = params.id


  const customer = await db.customer.findFirst({
    where: { id: customerId },
  })

  const quotations = await db.quotation.findMany({
    where: { customerId },
  })

  if (!customer) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Customer Not Found</CardTitle>
            <CardDescription>The customer you're looking for doesn't exist or has been removed.</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <Button asChild>
              <Link href="/customers">Back to Customers</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      {/* Header with actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{customer.name}</h1>
          <p className="text-muted-foreground">Client ID: {customer.clientId || "Not assigned"}</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/customers/${customerId}/edit`}>Edit Customer</Link>
          </Button>
          <Button asChild>
            <Link href={`/customers/${customerId}/quotations/new`}>
              <PlusIcon className="mr-2 h-4 w-4" />
              New Quotation
            </Link>
          </Button>
        </div>
      </div>

      {/* Customer details and quotations in tabs */}
      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="details">Customer Details</TabsTrigger>
          <TabsTrigger value="quotations">Quotations ({quotations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
              <CardDescription>Detailed information about {customer.name}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Contact Details</h3>
                    <div className="mt-2 space-y-2">
                      {customer.contactPerson && (
                        <div className="flex items-center gap-2">
                          <UserIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.contactPerson}</span>
                        </div>
                      )}
                      {customer.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      {customer.mobile && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.mobile} (Mobile)</span>
                        </div>
                      )}
                      {customer.email && (
                        <div className="flex items-center gap-2">
                          <MailIcon className="h-4 w-4 text-muted-foreground" />
                          <span>{customer.email}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                    <div className="mt-2">
                      <Badge variant={customer.active ? "success" : "destructive"}>
                        {customer.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Address</h3>
                    <div className="mt-2 flex items-start gap-2">
                      <MapPinIcon className="h-4 w-4 text-muted-foreground mt-1" />
                      <div>
                        <p>{customer.address}</p>
                        {customer.city && customer.state && (
                          <p>
                            {customer.city}, {customer.state}
                          </p>
                        )}
                        {customer.country && customer.pincode && (
                          <p>
                            {customer.country}, {customer.pincode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Additional Information</h3>
                    <div className="mt-2 space-y-2">
                      {customer.clientNameType && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Client Type:</span>
                          <span>{customer.clientNameType}</span>
                        </div>
                      )}
                      {customer.trainer && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Trainer:</span>
                          <span>{customer.trainer}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Created:</span>
                        <div className="flex items-center gap-1">
                          <CalendarIcon className="h-3 w-3 text-muted-foreground" />
                          <span>customer.createdAt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quotations" className="pt-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <CardTitle>Quotations</CardTitle>
                  <CardDescription>All quotations for {customer.name}</CardDescription>
                </div>
                <Button asChild size="sm">
                  <Link href={`/customers/${customerId}/quotations`}>
                    <FileTextIcon className="mr-2 h-4 w-4" />
                    View All Quotations
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {quotations.length === 0 ? (
                <div className="text-center py-6">
                  <FileTextIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                  <h3 className="mt-2 text-sm font-semibold">No Quotations</h3>
                  <p className="mt-1 text-sm text-muted-foreground">This customer doesn't have any quotations yet.</p>
                  <div className="mt-6">
                    <Button asChild>
                      <Link href={`/customers/${customerId}/quotations/new`}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        Create New Quotation
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Quotation No</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Contact Person</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quotations.slice(0, 5).map((quotation) => (
                        <TableRow key={quotation.id}>
                          <TableCell className="font-medium">{quotation.quotationNo}</TableCell>
                          {/* <TableCell>{quotation.date}</TableCell> */}
                          <TableCell>{quotation.subject || "N/A"}</TableCell>
                          <TableCell>{quotation.contactPerson || "N/A"}</TableCell>
                          <TableCell className="text-right">
                            <Button asChild variant="ghost" size="sm">
                              <Link href={`/customers/${customerId}/quotations/${quotation.id}`}>View</Link>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {quotations.length > 5 && (
                    <div className="flex justify-center mt-4">
                      <Button asChild variant="outline">
                        <Link href={`/customers/${customerId}/quotations`}>
                          View All {quotations.length} Quotations
                        </Link>
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerPage
