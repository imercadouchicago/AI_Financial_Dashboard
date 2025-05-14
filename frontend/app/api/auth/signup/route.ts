import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  try {
    const { firstName, lastName, email, password } = await request.json();
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Check if email already exists. Find user by email
    const [existingUsers] = await db.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    // If user already exists, return error
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // If user does not exist, hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert new user into database
    const [result] = await db.execute(
      'INSERT INTO users (first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, NOW())',
      [firstName, lastName, email, hashedPassword]
    );

    // Get user id from result
    const userId = result.insertId;
    
    // Create JWT token for authentication
    const token = jwt.sign(
      { 
        userId,
        email,
        firstName,
        lastName
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set cookie
    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    // Return user data (excluding password)
    return NextResponse.json({
      message: 'User created successfully',
      user: {
        id: userId,
        firstName,
        lastName,
        email
      }
    });
    
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 