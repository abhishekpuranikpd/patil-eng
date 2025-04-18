"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams


export default function AdminPasswordReset() {
  const [newPassword, setNewPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [token, setToken] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams(); // Use this to get query params
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const queryToken = searchParams.get("token"); // Extract the token
    if (queryToken) {
      setToken(queryToken);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (!token) {
      alert("Token is missing. Please ensure you accessed the link correctly.");
      return;
    }
    try {
      const response = await fetch("/api/jobseeker/register/resetpassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      const data = await response.json();
      alert(data.message);
      router.push("/auth/login");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
     
      <div className="flex min-h-screen flex-col px-6 mt-64 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="text-center text-2xl font-bold tracking-tight text-[#243460]">
            Reset Your Password
          </h2>
        </div>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 pl-4 text-[#243460]">
                New Password
              </label>
              <div className="mt-2 relative">
                <input
                  id="password"
                  name="password"
                  type={isPasswordVisible ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  placeholder="Enter new password"
                  className="block w-full rounded-xl border-0 pl-2 py-1.5 text-[#243460] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  {isPasswordVisible ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div>
            <button
                type="submit"
                disabled={isLoading}
                className={`flex w-full justify-center rounded-xl px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm ${
                  isLoading
                    ? "bg-indigo-300 cursor-not-allowed"
                    : "bg-indigo-600 hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                }`}
              >
                {isLoading ? "Processing..." : "Request Password Reset"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
