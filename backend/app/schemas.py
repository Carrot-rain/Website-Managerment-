from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class SiteResponse(BaseModel):
    id: UUID
    name: str
    slug: str
    status: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True
    )