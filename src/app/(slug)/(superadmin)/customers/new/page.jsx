import React from "react";
import CreateCustomerPage from "../components/new-cust";
import { db } from "@/app/lib/db";

const NewCustomerPage = async () => {
  const salesPersons = await db.user.findMany({
    where: { role: "SALES" },
  });

  return (
    <div>
      <CreateCustomerPage salesPersonsdata={salesPersons} />
    </div>
  );
};

export default NewCustomerPage;
