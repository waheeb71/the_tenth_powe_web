from sqlalchemy import Column, Integer, String, Boolean, Text, DateTime
from sqlalchemy.sql import func
from database import Base

class SiteConfig(Base):
    __tablename__ = "site_config"
    
    key = Column(String, primary_key=True, index=True)
    value = Column(Text)
    type = Column(String, default="text") # text, image, number, boolean
    group = Column(String, index=True) # e.g. "hero", "contact", "ai"

class Promotion(Base):
    __tablename__ = "promotions"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    image_path = Column(String, nullable=True)
    discount_percentage = Column(Integer, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    category = Column(String)
    year = Column(String)
    location = Column(String)
    image_path = Column(String)
    alt_text = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image_path = Column(String) 
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    sender_name = Column(String)
    contact_info = Column(String) # Phone or Email
    content = Column(Text)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    is_read = Column(Boolean, default=False)
