import React, { Suspense } from "react";
import AdminPasswordReset from "./client";


export default function PasswordReset() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
     <AdminPasswordReset/>
    </Suspense>
  );
}
