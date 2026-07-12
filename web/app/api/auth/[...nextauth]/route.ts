import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
            console.log("--- OUTGOING STRAPI PAYLOAD CHECK ---");
            console.log("Identifier being sent:", credentials?.email);
            console.log("Password length being sent:", credentials?.password?.length || 0);
            console.log("-------------------------------------");
          // 1. STRAPI IDENTIFIER COMPATIBILITY LAYER
          const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/auth/local`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              identifier: credentials.email, // Strapi mandates 'identifier', not 'email'
              password: credentials.password,
            }),
          });

          const data = await res.json();

          if (!res.ok || !data.jwt) {
            console.log("--- STRAPI AUTH REJECTION DETAILED DEBUG ---");
            console.log("HTTP Status Code returned:", res.status);
            console.log("Full Error Payload from Strapi:", JSON.stringify(data, null, 2));
            console.log("--------------------------------------------");
            console.error("Strapi authentication rejected:", data?.error?.message || "Invalid credentials");
            return null;
          }

          // 2. RETURNING THE RAW OBJECT TO THE JWT CALLBACK
          // NextAuth requires the object returned here to fit its User interface, 
          // but we can append custom fields like the API JWT.
          return {
            id: data.user.id.toString(),
            name: data.user.firstName || data.user.fullName,
            email: data.user.email,
            jwt: data.jwt, // Stash the JWT token here
          };
        } catch (error) {
          console.error("Network runtime failure during authorization:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // 3. PERSIST THE STRAPI JWT TO NEXTAUTH COOKIE
    async jwt({ token, user }) {
      // The 'user' object is only passed the very first time this callback runs after successful login
      if (user) {
        token.id = user.id;
        token.jwt = (user as any).jwt; // Inject the Strapi JWT into the encrypted cookie
      }
      return token;
    },

    // 4. EXPOSE THE DATA TO FRONTEND CLIENTS (like useSession)
    async session({ session, token }) {
      if (session.user) {
        (session as any).id = token.id;
        (session as any).jwt = token.jwt; // Now client components can make authenticated requests to Strapi!
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // Routes auth protection failures smoothly back to your login UI
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };