from telegram import Update, ReplyKeyboardMarkup, ReplyKeyboardRemove, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, MessageHandler, filters, ContextTypes, ConversationHandler
import os
import asyncio
from dotenv import load_dotenv
from database import AsyncSessionLocal
from models import SiteConfig, Promotion
from sqlalchemy import select, update, delete

load_dotenv()

TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
OWNER_ID = int(os.getenv("OWNER_ID", 0))

# States
CHOOSING_ACTION, TYPING_CONTENT, ADDING_AD_TITLE, ADDING_AD_DESC, ADDING_AD_IMAGE, ADDING_AD_DISCOUNT, ADDING_PROJ_TITLE, ADDING_PROJ_CAT, ADDING_PROJ_YEAR, ADDING_PROJ_LOC, ADDING_PROJ_IMG, ADDING_SERV_TITLE, ADDING_SERV_DESC, ADDING_SERV_IMG, UPLOADING_IMAGE, SELECTING_IMAGE_KEY, AI_PROMPT_MENU, EDITING_AI_PROMPT = range(18)

async def check_admin(update: Update) -> bool:
    user_id = update.effective_user.id
    if user_id != OWNER_ID:
        await update.message.reply_text("⛔ عذراً، هذا البوت مخصص لمدير الموقع فقط.")
        return False
    return True

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not await check_admin(update): return
    
    keyboard = [
        ["📝 تعديل النصوص", "📢 إدارة الإعلانات"],
        ["🏗️ إدارة المشاريع", "🛠️ إدارة الخدمات"],
        ["🖼️ رفع صور", "👀 معاينة الموقع"],
        ["🤖 برومبت الذكاء الاصطناعي"]
    ]
    await update.message.reply_text(
        "👋 أهلاً بك في لوحة تحكم موقعك.\nاختر ماذا تريد أن تفعل:",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )
    return CHOOSING_ACTION

# --- Content Management ---
async def edit_content_start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("أرسل 'مفتاح' النص الذي تريد تعديله (مثال: hero_title)")
    return TYPING_CONTENT

async def save_content(update: Update, context: ContextTypes.DEFAULT_TYPE):
    key = update.message.text
    if ":" in key:
        k, v = key.split(":", 1)
        async with AsyncSessionLocal() as session:
            stmt = select(SiteConfig).where(SiteConfig.key == k.strip())
            result = await session.execute(stmt)
            obj = result.scalar_one_or_none()
            if obj:
                obj.value = v.strip()
            else:
                session.add(SiteConfig(key=k.strip(), value=v.strip()))
            await session.commit()
        await update.message.reply_text(f"✅ تم تحديث {k} بنجاح!")
    else:
         await update.message.reply_text(f"⚠️ الصيغة خاطئة. أرسل: مفتاح: قيمة")
    return CHOOSING_ACTION

# --- Ads Management ---
async def manage_ads(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [["➕ إضافة إعلان جديد", "❌ حذف إعلان"], ["🔙 رجوع"]]
    await update.message.reply_text("📢 إدارة الإعلانات", reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True))
    return CHOOSING_ACTION

# --- Projects Management --- 
async def manage_projects(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [["➕ إضافة مشروع", "❌ حذف مشروع"], ["🔙 رجوع"]]
    await update.message.reply_text("🏗️ إدارة المشاريع", reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True))
    return CHOOSING_ACTION

async def start_add_proj(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("أرسل اسم المشروع:", reply_markup=ReplyKeyboardRemove())
    return ADDING_PROJ_TITLE

async def receive_proj_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['p_title'] = update.message.text
    await update.message.reply_text("أرسل تصنيف المشروع (مثال: واجهات زجاجية):")
    return ADDING_PROJ_CAT

async def receive_proj_cat(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['p_cat'] = update.message.text
    await update.message.reply_text("أرسل سنة التنفيذ (مثال: 2023):")
    return ADDING_PROJ_YEAR

async def receive_proj_year(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['p_year'] = update.message.text
    await update.message.reply_text("أرسل موقع المشروع (المدينة):")
    return ADDING_PROJ_LOC

async def receive_proj_loc(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['p_loc'] = update.message.text
    await update.message.reply_text("أرسل صورة المشروع:")
    return ADDING_PROJ_IMG

async def receive_proj_img(update: Update, context: ContextTypes.DEFAULT_TYPE):
    photo_file = await update.message.photo[-1].get_file()
    os.makedirs("backend/uploads/projects", exist_ok=True)
    file_path = f"backend/uploads/projects/{photo_file.file_id}.jpg"
    await photo_file.download_to_drive(file_path)
    
    context.user_data['p_img'] = f"/static/projects/{photo_file.file_id}.jpg"
    
    from models import Project
    async with AsyncSessionLocal() as session:
        new_proj = Project(
            title=context.user_data['p_title'],
            category=context.user_data['p_cat'],
            year=context.user_data['p_year'],
            location=context.user_data['p_loc'],
            image_path=context.user_data['p_img']
        )
        session.add(new_proj)
        await session.commit()
    
    await update.message.reply_text("✅ تم إضافة المشروع بنجاح!", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
    return CHOOSING_ACTION

# --- Services Management ---
async def manage_services(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = [["➕ إضافة خدمة", "❌ حذف خدمة"], ["🔙 رجوع"]]
    await update.message.reply_text("🛠️ إدارة الخدمات", reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True))
    return CHOOSING_ACTION

async def start_add_serv(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("أرسل عنوان الخدمة:", reply_markup=ReplyKeyboardRemove())
    return ADDING_SERV_TITLE

async def receive_serv_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['s_title'] = update.message.text
    await update.message.reply_text("أرسل وصف الخدمة:")
    return ADDING_SERV_DESC

async def receive_serv_desc(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['s_desc'] = update.message.text
    await update.message.reply_text("أرسل صورة الخدمة:")
    return ADDING_SERV_IMG

async def receive_serv_img(update: Update, context: ContextTypes.DEFAULT_TYPE):
    photo_file = await update.message.photo[-1].get_file()
    os.makedirs("backend/uploads/services", exist_ok=True)
    file_path = f"backend/uploads/services/{photo_file.file_id}.jpg"
    await photo_file.download_to_drive(file_path)
    
    context.user_data['s_img'] = f"/static/services/{photo_file.file_id}.jpg"

    from models import Service
    async with AsyncSessionLocal() as session:
        new_serv = Service(
            title=context.user_data['s_title'],
            description=context.user_data['s_desc'],
            image_path=context.user_data['s_img']
        )
        session.add(new_serv)
        await session.commit()
    await update.message.reply_text("✅ تم إضافة الخدمة بنجاح!", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
    return CHOOSING_ACTION

# --- Existing Ad Logic ---
async def start_add_ad(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("أرسل عنوان الإعلان:", reply_markup=ReplyKeyboardRemove())
    return ADDING_AD_TITLE

async def receive_ad_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['ad_title'] = update.message.text
    await update.message.reply_text("أرسل وصف الإعلان:")
    return ADDING_AD_DESC

async def receive_ad_desc(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data['ad_desc'] = update.message.text
    await update.message.reply_text("أرسل صورة الإعلان (أو اكتب 'تخطي'):")
    return ADDING_AD_IMAGE

async def receive_ad_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if update.message.photo:
        photo_file = await update.message.photo[-1].get_file()
        os.makedirs("backend/uploads/ads", exist_ok=True)
        file_path = f"backend/uploads/ads/{photo_file.file_id}.jpg"
        await photo_file.download_to_drive(file_path)
        context.user_data['ad_image'] = f"/static/ads/{photo_file.file_id}.jpg"
    else:
        context.user_data['ad_image'] = None
    
    await update.message.reply_text("أرسل نسبة الخصم (رقم فقط) أو 0:")
    return ADDING_AD_DISCOUNT

async def receive_ad_discount(update: Update, context: ContextTypes.DEFAULT_TYPE):
    try:
        discount = int(update.message.text)
    except:
        discount = 0
        
    async with AsyncSessionLocal() as session:
        new_ad = Promotion(
            title=context.user_data['ad_title'],
            description=context.user_data['ad_desc'],
            image_path=context.user_data.get('ad_image'),
            discount_percentage=discount,
            is_active=True
        )
        session.add(new_ad)
        await session.commit()
    
    await update.message.reply_text("✅ تم نشر الإعلان بنجاح!", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
    return CHOOSING_ACTION

async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("تم الإلغاء.", reply_markup=ReplyKeyboardMarkup([["/start"]], resize_keyboard=True))
    return ConversationHandler.END

# --- General Image Upload ---
async def start_upload_image(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("📸 أرسل الصورة التي تريد رفعها:", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
    return UPLOADING_IMAGE

async def receive_image_upload(update: Update, context: ContextTypes.DEFAULT_TYPE):
    if not update.message.photo:
        await update.message.reply_text("⚠️ الرجاء إرسال صورة.")
        return UPLOADING_IMAGE

    photo_file = await update.message.photo[-1].get_file()
    os.makedirs("backend/uploads/general", exist_ok=True)
    file_path = f"backend/uploads/general/{photo_file.file_id}.jpg"
    await photo_file.download_to_drive(file_path)
    
    public_url = f"/static/general/{photo_file.file_id}.jpg"
    context.user_data['uploaded_image_url'] = public_url
    
    # Ask if user wants to use this image for a specific config
    keyboard = [
        ["🏠 خلفية الهيرو (hero_bg)", "❌ لا، فقط رفع"],
        ["🔙 إلغاء"]
    ]
    await update.message.reply_text(
        f"✅ تم الرفع بنجاح!\nالرابط: `{public_url}`\n\nهل تريد تعيين هذه الصورة لشيء محدد؟",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True),
        parse_mode="Markdown"
    )
    return SELECTING_IMAGE_KEY

async def handle_image_key_selection(update: Update, context: ContextTypes.DEFAULT_TYPE):
    choice = update.message.text
    image_url = context.user_data.get('uploaded_image_url')
    
    if choice == "🔙 إلغاء":
        return await start(update, context)
        
    if choice == "❌ لا، فقط رفع":
        await update.message.reply_text("👌 تم حفظ الصورة فقط.", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
        return CHOOSING_ACTION
        
    key_map = {
        "🏠 خلفية الهيرو (hero_bg)": "hero_bg"
    }
    
    db_key = key_map.get(choice)
    if db_key:
        async with AsyncSessionLocal() as session:
            stmt = select(SiteConfig).where(SiteConfig.key == db_key)
            result = await session.execute(stmt)
            obj = result.scalar_one_or_none()
            
            # Determine group based on key
            group = "hero" if "hero" in db_key else "general"
            
            if obj:
                obj.value = image_url
                obj.type = "image"
                obj.group = group
            else:
                session.add(SiteConfig(key=db_key, value=image_url, type="image", group=group))
            await session.commit()
        
        await update.message.reply_text(f"✅ تم تحديث {db_key} بنجاح! (Group: {group})", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
    else:
        await update.message.reply_text("⚠️ خيار غير معروف.", reply_markup=ReplyKeyboardMarkup([["🔙 رجوع"]], resize_keyboard=True))
        
    return CHOOSING_ACTION

# --- Other Features ---
async def preview_site(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("🌍 رابط موقعك:\nhttp://localhost:3000")

# --- AI Prompt Management ---
async def ai_prompt_menu(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """عرض قائمة إدارة البرومبت"""
    keyboard = [
        ["👀 عرض البرومبت الحالي"],
        ["✏️ تعديل البرومبت"],
        ["🔙 رجوع"]
    ]
    await update.message.reply_text(
        "🤖 إدارة برومبت الذكاء الاصطناعي\n\nاختر الإجراء:",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )
    return AI_PROMPT_MENU

async def view_ai_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """عرض البرومبت الحالي"""
    async with AsyncSessionLocal() as session:
        stmt = select(SiteConfig).where(SiteConfig.key == "ai_prompt")
        result = await session.execute(stmt)
        config = result.scalar_one_or_none()
        
        if config and config.value:
            prompt_text = config.value
            # تقسيم الرسالة إذا كانت طويلة
            if len(prompt_text) > 4000:
                chunks = [prompt_text[i:i+4000] for i in range(0, len(prompt_text), 4000)]
                for i, chunk in enumerate(chunks, 1):
                    await update.message.reply_text(
                        f"📝 البرومبت الحالي ({i}/{len(chunks)}):\n\n{chunk}"
                    )
            else:
                await update.message.reply_text(
                    f"📝 البرومبت الحالي:\n\n{prompt_text}"
                )
        else:
            await update.message.reply_text("⚠️ لم يتم العثور على برومبت محفوظ.")
    
    return AI_PROMPT_MENU

async def start_edit_ai_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """بدء تعديل البرومبت"""
    await update.message.reply_text(
        "✏️ أرسل البرومبت الجديد للذكاء الاصطناعي:\n\n"
        "💡 نصائح:\n"
        "- صِف دور الذكاء الاصطناعي بوضوح\n"
        "- أضف معلومات عن الشركة والخدمات\n"
        "- حدد أسلوب الرد المطلوب\n\n"
        "أرسل 'إلغاء' للعودة.",
        reply_markup=ReplyKeyboardRemove()
    )
    return EDITING_AI_PROMPT

async def save_ai_prompt(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """حفظ البرومبت الجديد"""
    new_prompt = update.message.text
    
    if new_prompt.lower() == "إلغاء":
        return await ai_prompt_menu(update, context)
    
    async with AsyncSessionLocal() as session:
        stmt = select(SiteConfig).where(SiteConfig.key == "ai_prompt")
        result = await session.execute(stmt)
        config = result.scalar_one_or_none()
        
        if config:
            config.value = new_prompt
            config.type = "text"
            config.group = "ai"
        else:
            new_config = SiteConfig(
                key="ai_prompt",
                value=new_prompt,
                type="text",
                group="ai"
            )
            session.add(new_config)
        
        await session.commit()
    
    keyboard = [["🔙 رجوع للقائمة الرئيسية"]]
    await update.message.reply_text(
        "✅ تم حفظ البرومبت الجديد بنجاح!\n\n"
        "سيتم استخدامه الآن في جميع المحادثات مع الذكاء الاصطناعي.",
        reply_markup=ReplyKeyboardMarkup(keyboard, resize_keyboard=True)
    )
    return CHOOSING_ACTION

def main():
    if not TOKEN:
        print("Error: TELEGRAM_BOT_TOKEN not found.")
        return

    application = Application.builder().token(TOKEN).build()

    # Ad Conversation
    ad_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("➕ إضافة إعلان جديد"), start_add_ad)],
        states={
            ADDING_AD_TITLE: [MessageHandler(filters.TEXT, receive_ad_title)],
            ADDING_AD_DESC: [MessageHandler(filters.TEXT, receive_ad_desc)],
            ADDING_AD_IMAGE: [MessageHandler(filters.PHOTO | filters.TEXT, receive_ad_image)],
            ADDING_AD_DISCOUNT: [MessageHandler(filters.TEXT, receive_ad_discount)],
        },
        fallbacks=[CommandHandler("cancel", cancel)]
    )

    # Project Conversation
    proj_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("➕ إضافة مشروع"), start_add_proj)],
        states={
            ADDING_PROJ_TITLE: [MessageHandler(filters.TEXT, receive_proj_title)],
            ADDING_PROJ_CAT: [MessageHandler(filters.TEXT, receive_proj_cat)],
            ADDING_PROJ_YEAR: [MessageHandler(filters.TEXT, receive_proj_year)],
            ADDING_PROJ_LOC: [MessageHandler(filters.TEXT, receive_proj_loc)],
            ADDING_PROJ_IMG: [MessageHandler(filters.PHOTO, receive_proj_img)],
        },
        fallbacks=[CommandHandler("cancel", cancel)]
    )

    # Service Conversation
    serv_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("➕ إضافة خدمة"), start_add_serv)],
        states={
            ADDING_SERV_TITLE: [MessageHandler(filters.TEXT, receive_serv_title)],
            ADDING_SERV_DESC: [MessageHandler(filters.TEXT, receive_serv_desc)],
            ADDING_SERV_IMG: [MessageHandler(filters.PHOTO, receive_serv_img)]
        },
        fallbacks=[CommandHandler("cancel", cancel)]
    )

    # Content Editing Conversation
    content_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("📝 تعديل النصوص"), edit_content_start)],
        states={
            TYPING_CONTENT: [MessageHandler(filters.TEXT & ~filters.Regex("🔙 رجوع") & ~filters.COMMAND, save_content)],
        },
        fallbacks=[MessageHandler(filters.Regex("🔙 رجوع"), start), CommandHandler("cancel", cancel)]
    )

    # General Image Upload Conversation
    upload_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("🖼️ رفع صور"), start_upload_image)],
        states={
            UPLOADING_IMAGE: [MessageHandler(filters.PHOTO, receive_image_upload)],
            SELECTING_IMAGE_KEY: [MessageHandler(filters.TEXT, handle_image_key_selection)],
        },
        fallbacks=[MessageHandler(filters.Regex("🔙 رجوع"), start), CommandHandler("cancel", cancel)]
    )

    # AI Prompt Management Conversation
    ai_prompt_conv = ConversationHandler(
        entry_points=[MessageHandler(filters.Regex("🤖 برومبت الذكاء الاصطناعي"), ai_prompt_menu)],
        states={
            AI_PROMPT_MENU: [
                MessageHandler(filters.Regex("👀 عرض البرومبت الحالي"), view_ai_prompt),
                MessageHandler(filters.Regex("✏️ تعديل البرومبت"), start_edit_ai_prompt),
                MessageHandler(filters.Regex("🔙 رجوع"), start),
            ],
            EDITING_AI_PROMPT: [MessageHandler(filters.TEXT & ~filters.COMMAND, save_ai_prompt)],
        },
        fallbacks=[MessageHandler(filters.Regex("🔙 رجوع"), start), CommandHandler("cancel", cancel)]
    )

    application.add_handler(CommandHandler("start", start))
    
    # Menus
    application.add_handler(MessageHandler(filters.Regex("📢 إدارة الإعلانات"), manage_ads))
    application.add_handler(MessageHandler(filters.Regex("🏗️ إدارة المشاريع"), manage_projects))
    application.add_handler(MessageHandler(filters.Regex("🛠️ إدارة الخدمات"), manage_services))
    application.add_handler(MessageHandler(filters.Regex("👀 معاينة الموقع"), preview_site))
    application.add_handler(MessageHandler(filters.Regex("🔙 رجوع"), start))
    
    # Conversations
    application.add_handler(ad_conv)
    application.add_handler(proj_conv)
    application.add_handler(serv_conv)
    application.add_handler(content_conv)
    application.add_handler(upload_conv)
    application.add_handler(ai_prompt_conv)

    print("Bot is running...")
    application.run_polling()

if __name__ == "__main__":
    main()
