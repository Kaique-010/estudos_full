
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.routers.clientes import router_router

from app.database import engine, Base

# Cria as tabelas se não existirem
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ERP API",
    description="API de gestão de clientes do sistema ERP.",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Prefixando as rotas com /api para alinhar com o frontend
app.include_router(router_router, prefix="/api")


@app.get("/api/health")
def health_check():
    return {"status": "ok", "service": "fastapi"}


@app.get("/api/health/database")
def database_health():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT version()"))
        return {"database": result.scalar()}
