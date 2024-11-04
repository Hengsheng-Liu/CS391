# =========================================== Imports ===========================================

from datetime import datetime
from typing import List
from fastapi import FastAPI, HTTPException, Query, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
import uvicorn
from contextlib import asynccontextmanager

# ======================================== Database Setup ========================================

# Database connection details
DATABASE_URL = "postgresql://p_user:p_password@localhost:5432/product_db"
# Establishing a connection to the database
engine = create_engine(DATABASE_URL)
Base = declarative_base()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ProductDB model for SQLAlchemy
class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    description = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

# Pydantic model for API responses
class Product(BaseModel):
    id: int
    name: str
    price: float
    description: str
    created_at: datetime

    class Config:
        orm_mode = True
class ProductResponse(BaseModel):
    id: int
    name: str
    price: float
    description: str
    created_at: datetime
    class Config:
        orm_mode = True
# Dependency to get a new database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# =========================================== App Setup ===========================================

# Creating a FastAPI instance
app = FastAPI()

# Setting up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================ Routing ============================================

# Root route to test database connection
@app.get("/")
async def root(db: Session = Depends(get_db)):
    try:
        db.execute("SELECT 1")
        return {"message": "Hello World! Database connection is successful."}
    except Exception as error:
        print(error)
        raise HTTPException(status_code=500, detail="Database connection failed.")

# Route to get the count of products
@app.get("/products/count")
async def get_product_count(db: Session = Depends(get_db)):
    count = db.query(ProductDB).count()
    return {"count": count}

# Route to get paginated products
@app.get("/products", response_model=List[Product])
async def get_products(
    page: int = Query(1, ge=1),
    limit: int = Query(10, le=100),
    db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    products = db.query(ProductDB).offset(offset).limit(limit).all()
    return products

# Route to get a product by its ID
@app.get("/products/{product_id}", response_model=Product)
async def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
@app.post("/products", response_model=ProductResponse, status_code=201)
async def create_product(product: Product, db: Session = Depends(get_db)):
    try:
        new_product = ProductDB(**product.model_dump(exclude={"likes"}))
        db.add(new_product)
        db.commit()
        db.refresh(new_product)
        return new_product
    except Exception as error:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create product: {error}")
# ======================================== Run the App ============================================
    
if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

# ================================================================================================
