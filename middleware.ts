import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const protectedRoutes = ["/services", "/services/error", "services/succsess"];
const publicRoutes = ["/"];

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const isAuthenticated = (await cookies()).get("authenticated")?.value === "true";

    if (isProtectedRoute && !isAuthenticated)
        return NextResponse.redirect(new URL("/", request.nextUrl));

    if (isPublicRoute && isAuthenticated && !request.nextUrl.pathname.startsWith("/services")) {
        return NextResponse.redirect(new URL("/services", request.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
