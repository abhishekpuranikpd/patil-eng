import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/app/lib/db";


export async function PUT({params}) {
    const id = parama.userid
    try {
        // Parse incoming request JSON
        const {  name, email, password, role, permissions } = await request.json();

        // Validate input fields
        if (!id || (!name && !email && !password && !role && !permissions)) {
            return NextResponse.json(
                { error: "ID and at least one field to update are required" },
                { status: 400 }
            );
        }

        // Find the user by ID
        const existingUser = await db.user.findUnique({ where: { id } });
        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Prepare updated fields
        const updateData = {};

        if (name) updateData.name = name;
        if (email) {
            // Ensure the new email is not already registered
            const emailInUse = await db.user.findUnique({ where: { email } });
            if (emailInUse && emailInUse.id !== id) {
                return NextResponse.json(
                    { error: "Email is already in use by another user" },
                    { status: 400 }
                );
            }
            updateData.email = email;
        }
        if (password) {
            // Hash the new password
            updateData.password = await bcrypt.hash(password, 10);
        }
        if (role) {
            updateData.role = role;

            // Ensure SUPERADMIN role has permissions
            if (role === "SUPERADMIN" && (!permissions || permissions.length === 0)) {
                return NextResponse.json(
                    { error: "SUPERADMIN must have at least one permission" },
                    { status: 400 }
                );
            }
        }
        if (permissions) {
            // Validate and set permissions
            updateData.permissions = {
                set: permissions, // Prisma syntax to update array fields
            };
        }

        // Update the user in the database
        const updatedUser = await db.user.update({
            where: { id },
            data: updateData,
        });

        // Return success response
        return NextResponse.json(
            { result: "User Updated Successfully", updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
