import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false;
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', nextUrl));
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.rol = token.rol as string;
        session.user.sucursal = (token.sucursal as string) || null;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.rol = user.rol;
        token.sucursal = user.sucursal;
      }
      return token;
    }
  },
  providers: [], 
} satisfies NextAuthConfig;
