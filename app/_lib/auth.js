import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import { createMember, ensureRoleColumn, getUser } from './data-service';
import { supabase } from './supabase';

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
  },
  cookies: {
    pkceCodeVerifier: {
      name: '__Secure-authjs.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
    state: {
      name: '__Secure-authjs.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: true,
      },
    },
  },
  callbacks: {
    async authorized({ auth }) {
      return !!auth?.user;
    },

    async signIn({ user, profile }) {
      try {
        // Ensure the members.role column exists before querying it
        await ensureRoleColumn();

        let existingMember = await getUser(user.email);

        if (!existingMember) {
          const firstName = profile?.given_name || user.name?.split(' ')[0] || '';
          const lastName = profile?.family_name || user.name?.split(' ').slice(1).join(' ') || '';

          existingMember = await createMember({
            first_name: firstName,
            last_name: lastName,
            email: user.email,
            image: user?.image,
          });
        }

        // Look up role directly from members table (SECRET_KEY bypasses RLS)
        const { data: member } = await supabase
          .from('members')
          .select('role')
          .eq('email', user.email)
          .single();

        user.id = existingMember.id;
        user.image = existingMember.image;
        user.role = member?.role || 'customer';
        return true;
      } catch (error) {
        console.error('Error during signIn callback:', error);
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      if (user?.id) {
        token.id = user.id;
        token.role = user.role || 'customer';
      }
      // Allow client-side session updates to sync role changes
      if (trigger === 'update' && session?.role) {
        token.role = session.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
        session.user.role = token.role || 'customer';
      }
      return session;
    },
  },
});
