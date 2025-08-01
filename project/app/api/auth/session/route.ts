// frontend/app/api/auth/session/route.ts
// This file handles user session management, including retrieving user data from the database based on a JWT token.
// It connects to the database, verifies the JWT token, and returns user information if the token is valid.
// If the token is invalid or expired, it returns null for the user.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';

// Define the type for JWT payload
interface JwtPayload {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    // Verify token with proper typing
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
      [decoded.userId]
    ) as [any[], any];

    const user = users[0];
    if (!user) {
      return NextResponse.json({ user: null });
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session error:', error);
    return NextResponse.json({ user: null });
  }
} 