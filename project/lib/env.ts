// file: frontend/lib/env.ts
export function validateEnv() {
  const requiredEnvVars = ['JWT_SECRET', 'DATABASE_URL']; // Add all required vars
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
} 