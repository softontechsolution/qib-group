import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Keep the existing NextAuth session structure and Strapi authentication source.
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Reject incomplete submissions before contacting Strapi.
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

          // Fail closed if the backend URL is not configured.
          if (!strapiUrl) {
            return null;
          }

          const response = await fetch(`${strapiUrl}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              // Strapi's local authentication endpoint expects "identifier".
              identifier: credentials.email.trim(),
              password: credentials.password,
            }),
          });

          const data = await response.json();

          // Strapi's first-login guard must prevent flagged accounts from
          // receiving a JWT through this normal login endpoint.
          if (!response.ok || !data?.jwt || !data?.user?.id) {
            // Do not log passwords, tokens, or full authentication responses.
            return null;
          }

          // Preserve the existing user and agent fields used by the frontend.
          return {
            id: String(data.user.id),
            name:
              data.user.firstName ||
              data.user.fullName ||
              data.user.username ||
              data.user.email,
            email: data.user.email,
            jwt: data.jwt,
            isAgent: data.user.isAgent || false,
            agentId: data.user.agentId || null,
          };
        } catch {
          // Keep authentication failures generic and avoid logging credentials.
          return null;
        }
      },
    }),
  ],

  callbacks: {
    // Store the Strapi token and existing account fields in NextAuth's JWT.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.jwt = (user as any).jwt;
        token.isAgent = (user as any).isAgent;
        token.agentId = (user as any).agentId;
      }

      return token;
    },

    // Preserve the session fields consumed by existing authenticated pages.
    async session({ session, token }) {
      if (session.user) {
        (session as any).id = token.id;
        (session as any).jwt = token.jwt;
        (session as any).user.isAgent = token.isAgent;
        (session as any).user.agentId = token.agentId;
      }

      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
