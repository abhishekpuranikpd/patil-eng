"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Updated Permission Enum
const Permission = {
  MANAGE_EMPLOYER: "MANAGE_EMPLOYER",
  MANAGE_JOB: "MANAGE_JOB",
  MANAGE_JOBSEEKER: "MANAGE_JOBSEEKER",
  MANAGE_ADMIN: "MANAGE_ADMIN",
  VIEW_EMPLOYER: "VIEW_EMPLOYER",
  VIEW_JOB: "VIEW_JOB",
  VIEW_JOBSEEKER: "VIEW_JOBSEEKER",
  VIEW_ANALYTICS: "VIEW_ANALYTICS",
};

const EditAdminClient = ({ data, adminId }) => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("ADMIN"); // Default role
  const [permissions, setPermissions] = useState([]); // Default empty permissions
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Find the admin data based on the adminId
  useEffect(() => {
    const admin = data.find((admin) => admin.id === adminId);
    
    if (admin) {
      setName(admin.name || "");
      setEmail(admin.email || "");
      setPassword(""); // Password should remain empty for editing
      setRole(admin.role || "ADMIN");
      setPermissions(admin.permissions || []); // Set permissions to match the selected admin
    }
  }, [data, adminId]);

  // Handle permission checkbox change
  const handlePermissionChange = (e) => {
    const { value, checked } = e.target;
    setPermissions((prevPermissions) => {
      if (checked) {
        // Add the permission if it's checked
        return [...prevPermissions, value];
      } else {
        // Remove the permission if it's unchecked
        return prevPermissions.filter((permission) => permission !== value);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/register/${adminId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role, permissions }),
      });

      if (!res.ok) {
        throw new Error("Failed to update the admin account");
      }

      const data = await res.json();
      alert("Account Updated");
      router.push("/profile");
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col justify-center sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full md:max-w-4xl p-2 rounded-xl">
        <h2 className="text-center text-2xl font-semibold text-[#243460] mb-6">
          Update Admin Account
        </h2>

        <form className="space-y-6" noValidate onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-[#243460]"
              >
                Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                  className="block w-full rounded-xl border-2 border-gray-300 py-2 px-4 text-[#243460] shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-[#243460]"
              >
                Email Address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="block w-full rounded-xl border-2 border-gray-300 py-2 px-4 text-[#243460] shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#243460]"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="*****"
                className="block w-full rounded-xl border-2 border-gray-300 py-2 px-4 text-[#243460] shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Role Selection */}
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-[#243460]"
            >
              Role
            </label>
            <select
              id="role"
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="block w-full rounded-xl border-2 border-gray-300 py-2 px-4 text-[#243460] shadow-sm focus:ring-2 focus:ring-indigo-600 focus:outline-none"
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPERADMIN">Super Admin</option>
            </select>
          </div>

          {/* Permission Selection */}
          <div>
            <label className="block text-sm font-medium text-[#243460]">
              Permissions
            </label>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(Permission).map((permissionKey) => (
                <div key={permissionKey} className="flex items-center">
                  <input
                    type="checkbox"
                    id={permissionKey}
                    value={Permission[permissionKey]}
                    onChange={handlePermissionChange}
                    checked={permissions.includes(Permission[permissionKey])}
                    className="mr-2"
                  />
                  <label
                    htmlFor={permissionKey}
                    className="text-sm text-[#243460]"
                  >
                    {Permission[permissionKey].replace(/_/g, " ")}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditAdminClient;
