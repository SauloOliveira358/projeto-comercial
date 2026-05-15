from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from flask import abort
from app.config import DB_CONFIG
from sqlalchemy import text # Importe o text

DATABASE_URL = (
f"postgresql+psycopg://"
f"{DB_CONFIG['user']}:{DB_CONFIG['password']}"
f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}"
f"/{DB_CONFIG['database']}"
)

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_session():
 return SessionLocal()



