from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Site
from app.schemas import SiteResponse


app = FastAPI()


origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def hello():
    return {
        "message": "Hello from Website Manager API"
    }

@app.get("/api/sites", response_model = list[SiteResponse])
def get_sites(db: Session = Depends(get_db)):
    statement = (select(Site).order_by(Site.created_at.desc()))
    sites = db.scalars(statement).all()

    return sites