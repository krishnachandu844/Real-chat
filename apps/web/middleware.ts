import { NextRequest, NextResponse } from "next/server";
export async function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt")?.value;

  const { pathname } = request.nextUrl;
  if (!token && pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/"],
};
