import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

#Gets the connection url to the database
DATABASE_URL = os.getenv("DATABASE_URL")

#creates the actual connection to the supabase via the url
engine = create_engine(DATABASE_URL)

#Explicitly say save to database and SQLAlchemy wont automatically sync changes mid session
SessionLocal = sessionmaker(autocommit = False, autoflush = False, bind = engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()