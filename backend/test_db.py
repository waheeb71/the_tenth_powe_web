"""
Test backend database operations using existing modules
"""
import asyncio
import sys
sys.path.insert(0, '.')

async def test_database_operations():
    """Test database connection and CRUD operations"""
    from database import AsyncSessionLocal, engine, Base
    from sqlalchemy import text
    import models
    import crud
    import schemas
    
    print("=" * 60)
    print("Testing Database Connection")
    print("=" * 60)
    
    try:
        # Create tables
        async with engine.begin() as conn:
            print("\n1. Creating tables...")
            await conn.run_sync(Base.metadata.create_all)
            print("   ✓ Tables created/verified")
        
        # Test connection
        async with AsyncSessionLocal() as session:
            print("\n2. Testing connection...")
            result = await session.execute(text("SELECT 1"))
            print("   ✓ Database connection working")
            
            # Get projects
            print("\n3. Testing CRUD operations...")
            print("\n   Projects:")
            projects = await crud.get_projects(session)
            print(f"   - Found {len(projects)} projects")
            for p in projects:
                print(f"     * {p.title} ({p.category}, {p.year})")
            
            # Get services
            print("\n   Services:")
            services = await crud.get_services(session)
            print(f"   - Found {len(services)} services")
            for s in services:
                print(f"     * {s.title}")
            
            # Get promotions
            print("\n   Promotions:")
            promotions = await crud.get_promotions(session)
            print(f"   - Found {len(promotions)} promotions")
            for promo in promotions:
                print(f"     * {promo.title}")
            
            # Get site config
            print("\n   Site Config:")
            configs = await crud.get_site_config(session)
            print(f"   - Found {len(configs)} config items")
            for config in configs:
                print(f"     * {config.key} = {config.value[:50]}...")
        
        print("\n" + "=" * 60)
        print("✓ All database tests passed!")
        print("=" * 60)
        
    except Exception as e:
        print("\n" + "=" * 60)
        print("✗ Database test failed!")
        print("=" * 60)
        print(f"Error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_database_operations())
