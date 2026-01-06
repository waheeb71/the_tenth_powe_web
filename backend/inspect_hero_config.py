import asyncio
import sys
sys.path.insert(0, '.')

async def inspect_hero_group():
    from database import AsyncSessionLocal
    import crud
    import models
    from sqlalchemy import select

    async with AsyncSessionLocal() as session:
        print("Inspecting 'hero' group in SiteConfig...")
        configs = await crud.get_site_config(session, group="hero")
        print(f"Found {len(configs)} entries.")
        for config in configs:
            print(f"Key: '{config.key}', Value: '{config.value}', Type: '{config.type}', Group: '{config.group}'")

        print("\nListing ALL SiteConfig entries just in case:")
        all_configs = await crud.get_site_config(session)
        for config in all_configs:
            print(f"Key: '{config.key}', Group: '{config.group}'")

if __name__ == "__main__":
    asyncio.run(inspect_hero_group())
