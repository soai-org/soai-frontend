import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import axios from "@/query/axios";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "ID",
          type: "string",
          placeholder: "ID를 입력하세요.",
        },
        password: { label: "Password", type: "password", placeholder: "*****" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post("/user/login", {
            userId: credentials.email,
            userPassword: credentials.password,
          });

          return { id: "external", accessToken: data };
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user?.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
