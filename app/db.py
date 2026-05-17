from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import DB_CONFIG

DATABASE_URL = (
    f"postgresql+psycopg://"
    f"{DB_CONFIG['user']}:{DB_CONFIG['password']}"
    f"@{DB_CONFIG['host']}:{DB_CONFIG['port']}"
    f"/{DB_CONFIG['database']}"
)

engine = create_engine(
    DATABASE_URL,

    # verifica conexão morta automaticamente
    pool_pre_ping=True,

    # recicla conexões antigas
    pool_recycle=300,

    # evita travar infinito
    connect_args={
        "connect_timeout": 1
    }
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

def get_session():
    return SessionLocal()