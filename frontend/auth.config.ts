import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';

const authConfig = {
  providers: [
    CredentialProvider({
      credentials: {
        name: {
          label: 'Name',
          type: 'text',
          placeholder: 'Enter your trello username'
        }
      },
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: credentials?.name as string // Use the 'name' field for authentication
        };

        // You can implement additional validation here, e.g., check against a database

        if (user) {
          return user; // Return the user if valid
        } else {
          return null; // Reject the login attempt
        }
      }
    })
  ],
  pages: {
    signIn: '/' // Specify your sign-in page route
  },
  trustHost: true,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name; // Save the name in the token
      }
      return token;
    },
    async session({ session, token }) {
      if (token.name) {
        session.user.name = token.name; // Add the name to the session
      }
      return session;
    }
  }
} satisfies NextAuthConfig;

export default authConfig;
