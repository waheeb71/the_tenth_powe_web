import asyncio
import sys
sys.path.insert(0, '.')

async def count_config():
    from database import AsyncSessionLocal
    import models
    from sqlalchemy import select, func

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(func.count(models.SiteConfig.key)))
        count = result.scalar()
        print(f"Total SiteConfig entries: {count}")
        
        if count > 0:
            result = await session.execute(select(models.SiteConfig))
            rows = result.scalars().all()
            for r in rows:
                print(f"Key: {r.key}, Group: {r.group}")

if __name__ == "__main__":
    asyncio.run(count_config())
