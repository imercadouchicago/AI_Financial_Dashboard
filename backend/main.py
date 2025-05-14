from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Float, ForeignKey, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import os
import jwt
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database setup
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL", "mysql+pymysql://root:@localhost/finance_tracker")
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# JWT settings
JWT_SECRET = os.getenv("JWT_SECRET", "your-secret-key")
ALGORITHM = "HS256"

# Models
class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bank_accounts = relationship("BankAccount", back_populates="user")
    subscriptions = relationship("Subscription", back_populates="user")

class BankAccount(Base):
    __tablename__ = "bank_accounts"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    account_name = Column(String(100), nullable=False)
    account_type = Column(String(50), nullable=False)
    institution = Column(String(100), nullable=False)
    account_number = Column(String(50), nullable=False)
    balance = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="bank_accounts")
    transactions = relationship("Transaction", back_populates="bank_account")

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    bank_account_id = Column(Integer, ForeignKey("bank_accounts.id"), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String(255))
    category = Column(String(100))
    transaction_date = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    bank_account = relationship("BankAccount", back_populates="transactions")

class Subscription(Base):
    __tablename__ = "subscriptions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    billing_cycle = Column(String(50), nullable=False)  # monthly, yearly, etc.
    next_billing_date = Column(DateTime, nullable=False)
    category = Column(String(100))
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="subscriptions")

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class UserBase(BaseModel):
    first_name: str
    last_name: str
    email: str

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class BankAccountBase(BaseModel):
    account_name: str
    account_type: str
    institution: str
    account_number: str
    balance: float = 0.0

class BankAccountCreate(BankAccountBase):
    pass

class BankAccountResponse(BankAccountBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class TransactionBase(BaseModel):
    amount: float
    description: Optional[str] = None
    category: Optional[str] = None
    transaction_date: datetime

class TransactionCreate(TransactionBase):
    pass

class TransactionResponse(TransactionBase):
    id: int
    bank_account_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

class SubscriptionBase(BaseModel):
    name: str
    amount: float
    billing_cycle: str
    next_billing_date: datetime
    category: Optional[str] = None
    active: bool = True

class SubscriptionCreate(SubscriptionBase):
    pass

class SubscriptionResponse(SubscriptionBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        orm_mode = True

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication
def get_current_user(token: str, db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
        user_id: int = payload.get("userId")
        if user_id is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
        
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

# Subscription routes
@app.post("/subscriptions/", response_model=SubscriptionResponse)
def create_subscription(
    subscription: SubscriptionCreate,
    token: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(token, db)
    db_subscription = Subscription(**subscription.dict(), user_id=current_user.id)
    db.add(db_subscription)
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

@app.get("/subscriptions/", response_model=List[SubscriptionResponse])
def read_subscriptions(token: str, db: Session = Depends(get_db)):
    current_user = get_current_user(token, db)
    return db.query(Subscription).filter(Subscription.user_id == current_user.id).all()

@app.get("/subscriptions/{subscription_id}", response_model=SubscriptionResponse)
def read_subscription(subscription_id: int, token: str, db: Session = Depends(get_db)):
    current_user = get_current_user(token, db)
    subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    return subscription

@app.put("/subscriptions/{subscription_id}", response_model=SubscriptionResponse)
def update_subscription(
    subscription_id: int,
    subscription: SubscriptionCreate,
    token: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(token, db)
    db_subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if db_subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    for key, value in subscription.dict().items():
        setattr(db_subscription, key, value)
    
    db.commit()
    db.refresh(db_subscription)
    return db_subscription

@app.delete("/subscriptions/{subscription_id}")
def delete_subscription(subscription_id: int, token: str, db: Session = Depends(get_db)):
    current_user = get_current_user(token, db)
    db_subscription = db.query(Subscription).filter(
        Subscription.id == subscription_id,
        Subscription.user_id == current_user.id
    ).first()
    
    if db_subscription is None:
        raise HTTPException(status_code=404, detail="Subscription not found")
    
    db.delete(db_subscription)
    db.commit()
    return {"message": "Subscription deleted successfully"}

# Bank account routes
@app.post("/bank-accounts/", response_model=BankAccountResponse)
def create_bank_account(
    bank_account: BankAccountCreate,
    token: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(token, db)
    db_bank_account = BankAccount(**bank_account.dict(), user_id=current_user.id)
    db.add(db_bank_account)
    db.commit()
    db.refresh(db_bank_account)
    return db_bank_account

@app.get("/bank-accounts/", response_model=List[BankAccountResponse])
def read_bank_accounts(token: str, db: Session = Depends(get_db)):
    current_user = get_current_user(token, db)
    return db.query(BankAccount).filter(BankAccount.user_id == current_user.id).all()

# Transaction routes
@app.post("/transactions/", response_model=TransactionResponse)
def create_transaction(
    transaction: TransactionCreate,
    bank_account_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(token, db)
    
    # Verify bank account belongs to user
    bank_account = db.query(BankAccount).filter(
        BankAccount.id == bank_account_id,
        BankAccount.user_id == current_user.id
    ).first()
    
    if bank_account is None:
        raise HTTPException(status_code=404, detail="Bank account not found")
    
    db_transaction = Transaction(**transaction.dict(), bank_account_id=bank_account_id)
    db.add(db_transaction)
    db.commit()
    db.refresh(db_transaction)
    return db_transaction

@app.get("/transactions/", response_model=List[TransactionResponse])
def read_transactions(
    bank_account_id: int,
    token: str,
    db: Session = Depends(get_db)
):
    current_user = get_current_user(token, db)
    
    # Verify bank account belongs to user
    bank_account = db.query(BankAccount).filter(
        BankAccount.id == bank_account_id,
        BankAccount.user_id == current_user.id
    ).first()
    
    if bank_account is None:
        raise HTTPException(status_code=404, detail="Bank account not found")
    
    return db.query(Transaction).filter(Transaction.bank_account_id == bank_account_id).all()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 