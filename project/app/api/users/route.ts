// frontend/app/api/users/route.ts
// This file replaces the FastAPI backend functionality for user management
// It handles user creation, retrieval, and authentication verification

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectToDatabase } from '@/lib/db';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2';

// Define the User type for database results
interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  created_at: Date;
}

// Define the type for JWT payload
interface JwtPayload {
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
}

// Helper function to get current user from JWT token
async function getCurrentUser() {
  try {
    const token = cookies().get('auth_token')?.value;
    
    if (!token) {
      return null;
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Get user from database
    const [users] = await db.execute(
      'SELECT id, first_name, last_name, email, created_at FROM users WHERE id = ?',
      [decoded.userId]
    ) as [User[], any];

    const user = users[0];
    db.release();
    return user || null;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

// GET /api/users - Get current user profile
export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return NextResponse.json({
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user profile
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const { firstName, lastName, email } = await request.json();
    
    // Validate input
    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Check if email is already taken by another user
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE email = ? AND id != ?',
      [email, user.id]
    ) as [User[], any];
    
    if (existingUsers.length > 0) {
      db.release();
      return NextResponse.json(
        { message: 'Email already in use' },
        { status: 409 }
      );
    }
    
    // Update user
    await db.execute(
      'UPDATE users SET first_name = ?, last_name = ?, email = ? WHERE id = ?',
      [firstName, lastName, email, user.id]
    );
    
    // Release connection
    db.release();
    
    // Return updated user data
    return NextResponse.json({
      id: user.id,
      first_name: firstName,
      last_name: lastName,
      email: email,
      created_at: user.created_at
    });
  } catch (error) {
    console.error('Update user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete user account
export async function DELETE() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Connect to database
    const db = await connectToDatabase();
    
    // Delete user (this will cascade delete related records if foreign keys are set up properly)
    await db.execute(
      'DELETE FROM users WHERE id = ?',
      [user.id]
    );
    
    // Release connection
    db.release();
    
    // Clear the auth cookie
    cookies().set({
      name: 'auth_token',
      value: '',
      expires: new Date(0),
      path: '/',
    });
    
    return NextResponse.json({
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}