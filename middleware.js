import { NextRequest, NextResponse } from "next/server";
import { useSelector } from "react-redux";
import { store } from "./store/store";

export async function middleware(request) {

  const token = request.cookies.get("token")?.value;

  const pathname = request.nextUrl.pathname;

  const protectedPaths = ["/", "/current-location", "/vehicle-route"];
  const antiProtectedPaths = ["/signin", "/signup"]


  const isPathProtected = protectedPaths?.some((path) => pathname == path);
  const isAntiPathProtected = antiProtectedPaths?.some((path) => pathname == path);

  const response = NextResponse.next();

  // if (pathname === "/") {
  //   return NextResponse.redirect(new URL('/current-location', request.url));
  // }

  // if (isPathProtected) {
  //   if (!token) {
  //     const url = new URL(`/signin`, request.url);
  //     // url.searchParams.set("callbackUrl", pathname);
  //     return NextResponse.redirect(url);
  //   }
  // }

  // if (isAntiPathProtected) {
  //   if (token) {
  //     return NextResponse.redirect(new URL('/', request.url));
  //   }
  // }

  return response
}
// export const config = {
//   matcher: ["/current-location", "/vehicle-route"],
// };