import React from "react";
import RegisterComponent from "../components/compo";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/session";

const Register = () => {
  const user = getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <>
      <RegisterComponent />
    </>
  );
};

export default Register;
