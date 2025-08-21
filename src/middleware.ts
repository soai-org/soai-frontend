import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // If the user is not authenticated, redirect to the login page.
  if (!req.auth) {
    // The original URL is automatically saved as a `callbackUrl` parameter
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }
});

export const config = {
  // Matcher protecting the root and viewer pages
  // This ensures that any access to these paths requires authentication
  // matcher: ["/", "/viewer/:path*"],
};