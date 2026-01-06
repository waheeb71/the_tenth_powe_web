from fastapi import FastAPI, Depends, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import models, schemas, crud, database
import os
from ai_service import chat_with_ai

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Initialization (Create Tables)
@app.on_event("startup")
async def startup():
    async with database.engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

# Static Files
os.makedirs("backend/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="backend/uploads"), name="static")

# Dependencies
async def get_db():
    async with database.AsyncSessionLocal() as session:
        yield session

# API Endpoints
@app.get("/api/content/{group}", response_model=List[schemas.SiteConfig])
async def read_content(group: str, db: AsyncSession = Depends(get_db)):
    return await crud.get_site_config(db, group)

@app.get("/api/content", response_model=List[schemas.SiteConfig])
async def read_all_content(db: AsyncSession = Depends(get_db)):
    return await crud.get_site_config(db)

@app.get("/api/promotions", response_model=List[schemas.Promotion])
async def read_promotions(db: AsyncSession = Depends(get_db)):
    return await crud.get_promotions(db, active_only=True)

@app.get("/api/projects", response_model=List[schemas.Project])
async def read_projects(db: AsyncSession = Depends(get_db)):
    return await crud.get_projects(db)

@app.get("/api/services", response_model=List[schemas.Service])
async def read_services(db: AsyncSession = Depends(get_db)):
    return await crud.get_services(db)

@app.post("/api/contact", response_model=schemas.Message)
async def create_contact_message(message: schemas.MessageCreate, db: AsyncSession = Depends(get_db)):
    # Save to DB
    new_msg = await crud.create_message(db, message)
    
    # Notify Admin
    # Notify Admin
    try:
        from utils import send_telegram_notification
        
        # Determine if it's a quote request or general message
        is_quote = "نوع الخدمة" in message.content or "Service Request" in message.content
        title_emoji = "💰" if is_quote else "🔔"
        title_text = "طلب عرض سعر جديد" if is_quote else "رسالة جديدة من الموقع"
        
        notification_text = (
            f"{title_emoji} <b>{title_text}</b>\n"
            f"👤 <b>الاسم:</b> {new_msg.sender_name}\n"
            f"📱 <b>التواصل:</b> {new_msg.contact_info}\n"
            f"📝 <b>الرسالة:</b>\n{new_msg.content}"
        )
        await send_telegram_notification(notification_text)
    except Exception as e:
        print(f"Warning: Failed to send Telegram notification: {e}")
    
    return new_msg
    
    return new_msg

@app.post("/api/chat", response_model=schemas.ChatResponse)
async def chat_endpoint(chat_message: schemas.ChatMessage):
    """
    نقطة النهاية للدردشة مع الذكاء الاصطناعي
    """
    try:
        response_text = await chat_with_ai(
            user_message=chat_message.message,
            conversation_history=chat_message.conversation_history
        )
        return schemas.ChatResponse(response=response_text, success=True)
    except Exception as e:
        print(f"Chat error: {e}")
        raise HTTPException(status_code=500, detail="حدث خطأ أثناء معالجة طلبك")

