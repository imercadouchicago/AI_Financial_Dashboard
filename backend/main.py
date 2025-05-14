from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from datetime import datetime, timezone
import os
import jwt
from dotenv import load_dotenv
import uvicorn
from utils.env_validator import validate_env

# Load environment variables
load_dotenv()

# Validate environment variables exist
validate_env()

# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost/finance_tracker")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"

# Model
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.now(timezone.utc))
    
    bank_accounts = relationship("BankAccount", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")

# Create table
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserBase(BaseModel):
    '''Data shared between the client and the server'''
    first_name: str
    last_name: str
    email: str

class UserCreate(UserBase):
    '''Data to create a new user'''
    password: str

class UserResponse(UserBase):
    '''Data to return to the client'''
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Dependency
def get_db():
    '''Dependency to get a database session'''
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication
def get_current_user(token: str, db: Session = Depends(get_db)):
    '''Authentication to get the current user'''
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Verify user is authenticated
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: int = payload.get("userId")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
    
    # Verify user exists in database
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception

    # Return full user object
    return user

# FastAPI app
app = FastAPI(title="Finance Tracker API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to Finance Tracker API"}


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 