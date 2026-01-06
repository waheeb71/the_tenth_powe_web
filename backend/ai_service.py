import os
from dotenv import load_dotenv
import google.generativeai as genai
from database import AsyncSessionLocal
from models import SiteConfig
from sqlalchemy import select

load_dotenv()

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

DEFAULT_PROMPT = """أنت مساعد ذكي متخصص لشركة 'القوة العاشرة للهندسة والمقاولات'.

معلومات عن الشركة:
- شركة سعودية متخصصة في الهندسة والمقاولات
- تقدم خدمات: الواجهات الزجاجية، الهياكل الفولاذية، تكسية الألمنيوم (الكلادينج)
- تتميز بجودة عالية وخبرة واسعة في المشاريع الكبرى

مهمتك:
1. الإجابة على استفسارات العملاء عن خدمات الشركة
2. تقديم معلومات تقنية عن المشاريع الهندسية
3. مساعدة العملاء في فهم العمليات والتقنيات المستخدمة
4. توجيه العملاء للتواصل مع فريق المبيعات للحصول على عروض أسعار

أسلوب الرد:
- استخدم اللغة العربية الفصحى البسيطة
- كن مهنياً ومفيداً
- قدم إجابات واضحة ومختصرة
- إذا لم تكن متأكداً من شيء، أخبر العميل بالتواصل مع فريق الشركة مباشرة
"""

async def get_ai_prompt() -> str:
    """احصل على البرومبت من قاعدة البيانات أو أرجع الافتراضي"""
    try:
        async with AsyncSessionLocal() as session:
            stmt = select(SiteConfig).where(SiteConfig.key == "ai_prompt")
            result = await session.execute(stmt)
            config = result.scalar_one_or_none()
            
            if config and config.value:
                return config.value
            else:
                # إضافة البرومبت الافتراضي إذا لم يكن موجوداً
                new_config = SiteConfig(
                    key="ai_prompt",
                    value=DEFAULT_PROMPT,
                    type="text",
                    group="ai"
                )
                session.add(new_config)
                await session.commit()
                return DEFAULT_PROMPT
    except Exception as e:
        print(f"Error fetching AI prompt: {e}")
        return DEFAULT_PROMPT

async def chat_with_ai(user_message: str, conversation_history: list = None) -> str:
    """
    دالة للدردشة مع الذكاء الاصطناعي
    
    Args:
        user_message: رسالة المستخدم
        conversation_history: سجل المحادثة السابق (اختياري)
    
    Returns:
        رد الذكاء الاصطناعي
    """
    if not GEMINI_API_KEY:
        return "عذراً، خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة لاحقاً."
    
    try:
        # احصل على البرومبت من قاعدة البيانات
        system_prompt = await get_ai_prompt()
        
        # إعداد النموذج
        model = genai.GenerativeModel(
            model_name='gemini-2.5-flash',
            system_instruction=system_prompt
        )
        
        # بناء المحادثة
        if conversation_history:
            # إذا كان هناك سجل محادثة
            chat = model.start_chat(history=conversation_history)
            response = chat.send_message(user_message)
        else:
            # محادثة جديدة
            response = model.generate_content(user_message)
        
        return response.text
        
    except Exception as e:
        print(f"AI Error: {e}")
        return "عذراً، حدث خطأ أثناء معالجة طلبك. يرجى المحاولة مرة أخرى."
