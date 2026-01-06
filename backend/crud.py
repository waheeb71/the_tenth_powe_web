from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
import models, schemas

# Site Config
async def get_site_config(db: AsyncSession, group: str = None):
    query = select(models.SiteConfig)
    if group:
        query = query.filter(models.SiteConfig.group == group)
    result = await db.execute(query)
    return result.scalars().all()

async def update_site_config(db: AsyncSession, config: schemas.SiteConfigCreate):
    query = select(models.SiteConfig).filter(models.SiteConfig.key == config.key)
    result = await db.execute(query)
    existing_config = result.scalar_one_or_none()
    
    if existing_config:
        existing_config.value = config.value
        existing_config.type = config.type
        existing_config.group = config.group
    else:
        new_config = models.SiteConfig(**config.dict())
        db.add(new_config)
    
    await db.commit()
    return config

# Promotions
async def get_promotions(db: AsyncSession, active_only: bool = True):
    query = select(models.Promotion)
    if active_only:
        query = query.filter(models.Promotion.is_active == True)
    result = await db.execute(query)
    return result.scalars().all()

async def create_promotion(db: AsyncSession, promotion: schemas.PromotionCreate):
    db_promotion = models.Promotion(**promotion.dict())
    db.add(db_promotion)
    await db.commit()
    await db.refresh(db_promotion)
    return db_promotion

# Projects
async def get_projects(db: AsyncSession):
    query = select(models.Project).order_by(models.Project.id.desc())
    result = await db.execute(query)
    return result.scalars().all()

async def create_project(db: AsyncSession, project: schemas.ProjectCreate):
    db_obj = models.Project(**project.dict())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

# Services
async def get_services(db: AsyncSession):
    query = select(models.Service).order_by(models.Service.id)
    result = await db.execute(query)
    return result.scalars().all()

async def create_service(db: AsyncSession, service: schemas.ServiceCreate):
    db_obj = models.Service(**service.dict())
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj

# Messages
async def create_message(db: AsyncSession, message: schemas.MessageCreate):
    db_message = models.Message(**message.dict())
    db.add(db_message)
    await db.commit()
    await db.refresh(db_message)
    return db_message
