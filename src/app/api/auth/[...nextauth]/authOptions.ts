import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import prisma from "../../../../../lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  debug: true,
  adapter: PrismaAdapter(prisma),
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
        },
      };
    },
    async signIn({ account }) {

      if (!account || !account.provider || !account.providerAccountId) {
        return false;
      }
      
      const existingAccount = await prisma.account.findUnique({
        where: {
          provider_providerAccountId: {
            provider: account.provider,        
            providerAccountId: account.providerAccountId,  
          },
        },
      });

      if (!existingAccount) {
        return false;  
      }

      return true;  
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

