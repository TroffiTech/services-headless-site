import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { findUserByEmail, createUser } from "@/server_utils/auth/db";
import { sendWelcomePasswordEmail } from "@/server_utils/mail";

// Helper to generate a random secure password
function generateRandomPassword(length = 12) {
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
  let retVal = "";
  for (let i = 0; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return retVal;
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide email and password");
        }

        const email = credentials.email;
        const password = credentials.password;

        // 1. Verify domain
        if (!email.endsWith("@troffi.ru")) {
          throw new Error("Only @troffi.ru emails are authorized");
        }

        const user = await findUserByEmail(email);

        if (user) {
          // 2. User exists -> Verify password
          const isValid = await bcrypt.compare(password, user.passwordHash);
          if (!isValid) {
            console.log(`❌ Login failed for ${email}. Submitted password: ${password}`);
            throw new Error("Invalid password");
          }
          return {
            id: email,
            email: user.email,
            name: email.split("@")[0],
          };
        } else {
          // 3. User doesn't exist -> Inform user to register
          throw new Error("User not found. Please register your account first.");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        (session.user as any).id = token.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
