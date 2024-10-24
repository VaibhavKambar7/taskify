// import { withAuth } from "next-auth/middleware";

// export default withAuth({
//   pages: {
//     signIn: "/auth/login",
//   },
// });

// export const config = {
//   matcher: ["/task/:path*"],
// };

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
// import { withAuth } from "next-auth/middleware";

export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const isAuth = !!token;

  const isAuthPage = req.nextUrl.pathname.startsWith("/auth");

  if (isAuthPage && isAuth) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isAuth && !isAuthPage) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/task/:path*", "/auth/:path*"],
};
