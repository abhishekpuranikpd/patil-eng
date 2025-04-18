import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify, SignJWT } from "jose";

const secretKey = process.env.JWT_SECRET || "your-secure-secret"; // Use a secure key in production
const key = new TextEncoder().encode(secretKey);

// Function to encrypt payload and generate JWT
export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d") // Token expires in 30 days
    .sign(key);
}

// Function to decrypt JWT and retrieve payload
export async function decrypt(input) {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

// Function to log out user and clear session
export async function logout() {
  const res = NextResponse.next();
  res.cookies.set("session", "", {
    expires: new Date(0), // Expire the cookie immediately
    path: "/", // Ensure the cookie is cleared across all paths
    httpOnly: true, // Secure the cookie
    secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
  });
  res.headers.set("Cache-Control", "no-store"); // Disable caching
  return res;
}

// Function to get the current session
export async function getSession() {
  try {
    const sessionCookie = cookies().get("session")?.value;
    if (!sessionCookie) {
      return null; // No session exists
    }
    // Decrypt the session token to get the payload
    return await decrypt(sessionCookie);
  } catch (error) {
    // If there's an error (e.g., invalid or expired token), clear the session
    console.error("Session decryption error:", error);
    cookies().set("session", "", { expires: new Date(0), path: "/" });
    return null;
  }
}

// Function to update the session, refreshing it
export async function updateSession(request) {
  try {
    const sessionCookie = request.cookies.get("session")?.value;
    if (!sessionCookie) {
      return null;
    }

    // Decrypt the session token to get the session payload
    const sessionPayload = await decrypt(sessionCookie);

    // Refresh session expiration time (extend it for another 4 hours)
    const newExpiration = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now
    sessionPayload.expires = newExpiration;

    const res = NextResponse.next();
    res.cookies.set("session", await encrypt(sessionPayload), {
      httpOnly: true,
      expires: newExpiration,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res; // Return the updated session response
  } catch (error) {
    // Clear the session on error (invalid token, etc.)
    const res = NextResponse.next();
    res.cookies.set("session", "", { expires: new Date(0), path: "/" });
    return res;
  }
}

// Function to log in a user and handle session
export async function loginUser(request, payload) {
  try {
    // Create a new session token for the user
    const sessionToken = await encrypt(payload);

    const res = NextResponse.next();
    res.cookies.set("session", sessionToken, {
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days expiration
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict", // Protect against CSRF
    });

    res.headers.set("Cache-Control", "no-store"); // Prevent caching
    return res;
  } catch (error) {
    console.error("Login error:", error);
    // Handle errors appropriately (e.g., return error response)
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
