import os

def validate_env():
    required_env_vars = ['JWT_SECRET', 'DATABASE_URL']  # Add all required vars
    
    missing_vars = [var for var in required_env_vars if os.environ.get(var) is None]
    
    if missing_vars:
        raise ValueError(f"Missing required environment variables: {', '.join(missing_vars)}") 