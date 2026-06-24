import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const protectedPaths = ["/lots/nouveau", "/profil", "/mes-lots"];
  const isProtected = protectedPaths.some((p) => req.nextUrl.pathname.startsWith(p));

  if (!req.auth && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/auth/connexion";
    return NextResponse.redirect(url);
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
