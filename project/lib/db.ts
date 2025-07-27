// frontend/lib/db.ts
// Enhanced database configuration with connection pooling and better error handling
import mysql from 'mysql2/promise';

let connectionPool: mysql.Pool | null = null;

// Change the return type to PoolConnection instead of Connection
export async function connectToDatabase(): Promise<mysql.PoolConnection> {
  // Create connection pool if it doesn't exist
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'finance_tracker',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Get a connection from the pool
  const connection = await connectionPool.getConnection();
  return connection;
}

// Helper function to initialize database tables
export async function initializeDatabase() {
  try {
    const connection = await connectToDatabase();
    
    // Create users table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email),
        INDEX idx_created_at (created_at)
      )
    `);
    
    // Create bank_accounts table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        account_name VARCHAR(100) NOT NULL,
        account_type VARCHAR(50) NOT NULL,
        balance DECIMAL(15, 2) DEFAULT 0.00,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_account_type (account_type)
      )
    `);
    
    // Create subscriptions table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        service_name VARCHAR(100) NOT NULL,
        cost DECIMAL(10, 2) NOT NULL,
        billing_cycle VARCHAR(20) NOT NULL,
        next_billing_date DATE NOT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        INDEX idx_user_id (user_id),
        INDEX idx_next_billing_date (next_billing_date),
        INDEX idx_is_active (is_active)
      )
    `);
    
    console.log('Database tables initialized successfully');
    connection.release();
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}

// Helper function to close all database connections
export async function closeDatabaseConnections() {
  if (connectionPool) {
    await connectionPool.end();
    connectionPool = null;
  }
}

// Environment variable validation
export function validateDatabaseConfig() {
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}