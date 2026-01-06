from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class SiteConfigBase(BaseModel):
    key: str
    value: str
    type: str = "text"
    group: str = "general"

class SiteConfigCreate(SiteConfigBase):
    pass

class SiteConfig(SiteConfigBase):
    class Config:
        orm_mode = True

class PromotionBase(BaseModel):
    title: str
    description: str
    image_path: Optional[str] = None
    discount_percentage: Optional[int] = None
    is_active: bool = True

class PromotionCreate(PromotionBase):
    pass

class Promotion(PromotionBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class ProjectBase(BaseModel):
    title: str
    category: str
    year: str
    location: str
    image_path: str
    alt_text: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class ServiceBase(BaseModel):
    title: str
    description: str
    image_path: str

class ServiceCreate(ServiceBase):
    pass

class Service(ServiceBase):
    id: int
    created_at: datetime
    class Config:
        orm_mode = True

class MessageBase(BaseModel):
    sender_name: str
    contact_info: str
    content: str

class MessageCreate(MessageBase):
    pass

class Message(MessageBase):
    id: int
    timestamp: datetime
    is_read: bool
    class Config:
        orm_mode = True

# AI Chat Schemas
class ChatMessage(BaseModel):
    message: str
    conversation_history: Optional[List[dict]] = None

class ChatResponse(BaseModel):
    response: str
    success: bool = True
