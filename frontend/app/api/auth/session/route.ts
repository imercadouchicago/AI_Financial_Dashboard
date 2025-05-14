import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '@/lib/db';

export async function GET() {
  try {
    // Get token from cookies
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT id, first_name, last_name, email FROM users WHERE id = ?',
      [decoded.userId]
    );
    
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