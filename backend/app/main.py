from uuid import UUID
from fastapi import FastAPI, HTTPException, Depends, Response, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Site
from app.schemas import SiteResponse, SiteCreate, SiteUpdate


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

# =========================
# 后端测试
# =========================
@app.get("/api/hello")
def hello():
    return {
        "message": "Hello from Website Manager API"
    }

# =========================
# 查询 Site
# =========================
@app.get("/api/sites", response_model = list[SiteResponse])
def get_sites(db: Session = Depends(get_db)):
    statement = (select(Site).order_by(Site.created_at.desc()))
    sites = db.scalars(statement).all()

    return sites

# =========================
# 创建 Site
# =========================
@app.post("/api/sites", response_model = SiteResponse, status_code= 201)
async def create_site(payload: SiteCreate, db: Session = Depends(get_db)):
    existing_site = db.scalar(
        select(Site).where(
            Site.slug == payload.slug
        )
    )

    if existing_site:
        raise HTTPException(
            status_code = 409, #409 Conflict
            detail = "Site slug alredy exists",
        )

    site = Site(
        name = payload.name,
        slug = payload.slug,
    )

    db.add(site)
    db.commit()

    db.refresh(site)

    return site

# =========================
# 删除 Site
# =========================
@app.delete("/api/sites/{site_id}", status_code = status.HTTP_204_NO_CONTENT)
def delete_site(site_id: UUID, db: Session = Depends(get_db)):
    site = db.get(Site, site_id) #查询 Primary Key

    if site is None:
        raise HTTPException(
            status_code = 404, #404 NOT Found
            detail = "Site not found",
        )

    db.delete(site)
    db.commit()

    return Response(
        status_code = status.HTPP_204_NO_CONTENT
    )

# =========================
# 更新 Site
# =========================
@app.patch("/api/sites/{site_id}", response_model = SiteResponse)
def update_site(payload: SiteUpdate, site_id: UUID, db: Session = Depends(get_db)):
    site = db.get(Site, site_id)

    if site is None:
        raise HTTPException(
        status_code = 404, #404 NOT Found
        detail = "Site not found",
    )

    if payload.name is not None : 
        site.name = payload.name

    if payload.slug is not None : 
        site.slug = payload.slug

    if payload.status is not None : 
        site.status = payload.status

    db.commit()

    db.refresh(site)

    return site
