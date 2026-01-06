"""
سكريبت مؤقت لإضافة 8 خدمات تجريبية إلى قاعدة البيانات
Temporary script to seed the database with 8 test services
"""
import asyncio
from database import AsyncSessionLocal, engine
from models import Service, Base

async def seed_services():
    # إنشاء الجداول إذا لم تكن موجودة
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    async with AsyncSessionLocal() as db:
        try:
            # التحقق من عدد الخدمات الحالية
            from sqlalchemy import select
            result = await db.execute(select(Service))
            existing_services = result.scalars().all()
            print(f"عدد الخدمات الحالية: {len(existing_services)}")
            
            # قائمة الخدمات التجريبية
            test_services = [
                {
                    "title": "التصميم المعماري",
                    "description": "نقدم تصاميم معمارية مبتكرة تجمع بين الجمال والوظائف العملية",
                    "icon_name": "Building"
                },
                {
                    "title": "الإنشاءات المدنية",
                    "description": "تنفيذ مشاريع البناء بأعلى معايير الجودة والسلامة",
                    "icon_name": "Construction"
                },
                {
                    "title": "التصميم الداخلي",
                    "description": "تصميم وتنفيذ ديكورات داخلية عصرية وفاخرة",
                    "icon_name": "Layout"
                },
                {
                    "title": "إدارة المشاريع",
                    "description": "إدارة شاملة للمشاريع من التخطيط حتى التسليم",
                    "icon_name": "ClipboardCheck"
                },
                {
                    "title": "الاستشارات الهندسية",
                    "description": "استشارات هندسية متخصصة في جميع مراحل المشروع",
                    "icon_name": "UserCheck"
                },
                {
                    "title": "الصيانة والتشغيل",
                    "description": "خدمات صيانة دورية وتشغيل للمنشآت",
                    "icon_name": "Settings"
                },
                {
                    "title": "التصميم المستدام",
                    "description": "حلول معمارية صديقة للبيئة وموفرة للطاقة",
                    "icon_name": "Leaf"
                },
                {
                    "title": "الإشراف الهندسي",
                    "description": "إشراف هندسي متخصص لضمان جودة التنفيذ",
                    "icon_name": "Eye"
                }
            ]
            
            # إضافة الخدمات
            added_count = 0
            for service_data in test_services:
                service = Service(**service_data)
                db.add(service)
                added_count += 1
                print(f"✅ تمت إضافة: {service_data['title']}")
            
            # حفظ التغييرات
            await db.commit()
            
            # التحقق من العدد النهائي
            result = await db.execute(select(Service))
            all_services = result.scalars().all()
            
            print(f"\n🎉 تم بنجاح! تمت إضافة {added_count} خدمة جديدة")
            print(f"إجمالي الخدمات في قاعدة البيانات: {len(all_services)}")
            
        except Exception as e:
            print(f"❌ حدث خطأ: {e}")
            await db.rollback()
            raise

if __name__ == "__main__":
    print("🚀 بدء إضافة الخدمات التجريبية...")
    print("-" * 50)
    asyncio.run(seed_services())
    print("-" * 50)
    print("✨ انتهى التنفيذ!")
