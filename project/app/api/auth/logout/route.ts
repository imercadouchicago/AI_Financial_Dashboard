// frontend/app/api/auth/login/route.ts
// This file handles user login functionality, including password verification and JWT token generation.
// It connects to the database, checks if the user exists, verifies the password, and sets an authentication cookie.
// It returns user data (excluding the password) upon successful login or an error message if login fails.
// It uses bcrypt for password hashing and jwt for token generation.

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    // Clear the auth cookie
    cookies().set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    
    return NextResponse.json({ 
      message: 'Logged out successfully' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}