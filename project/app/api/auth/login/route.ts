// frontend/app/api/auth/login/route.ts
// This file handles user login functionality, including password verification and JWT token generation.
// It connects to the database, checks if the user exists, verifies the password, and sets an authentication cookie.
// It returns user data (excluding the password) upon successful login or an error message if login fails.
// It uses bcrypt for password hashing and jwt for token generation.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// Define the User type for database results
interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  created_at: Date;
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Check if user exists. Find user by email
    const [users] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    ) as [User[], any];

    const user = users[0];

    // If user does not exist, return error
    if (!user) {
      db.release();
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // If user exists, verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      db.release();
      return NextResponse.json(
        { message: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Create JWT token for authentication
    const token = jwt.sign(
      { 
        userId: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name
      },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Only sends over HTTPS in production
      sameSite: 'strict',      // Restricts cookie to same-site (not cross-site) requests only
      maxAge: 60 * 60 * 24 * 7, // Cookie expiration time in seconds (7 days)
      path: '/',               // Cookie is available across your entire site
    });
    
    // Release the database connection
    db.release();
    
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      message: 'Login successful',
      user: userWithoutPassword
    });
    
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}