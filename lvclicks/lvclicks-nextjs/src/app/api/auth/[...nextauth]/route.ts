import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('[Auth] Missing credentials');
            throw new Error('Please enter email and password');
          }

          console.log('[Auth] Attempting to connect to MongoDB...');
          await connectDB();
          console.log('[Auth] Connected to MongoDB successfully');

          console.log('[Auth] Looking for user:', credentials.email);
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.error('[Auth] User not found:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('[Auth] User found, validating password...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.error('[Auth] Invalid password for user:', credentials.email);
            throw new Error('Invalid email or password');
          }

          console.log('[Auth] Authentication successful for:', credentials.email);
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('[Auth] Authorization error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
