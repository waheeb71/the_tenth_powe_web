"""
سكريبت لاختبار API endpoint للدردشة مع الذكاء الاصطناعي
"""
import requests
import json

def test_chat_api():
    """اختبار endpoint الدردشة"""
    url = "http://localhost:8000/api/chat"
    
    # رسالة الاختبار
    test_message = {
        "message": "مرحباً، هل يمكنك إخباري عن خدمات شركة القوة العاشرة؟",
        "conversation_history": None
    }
    
    print("🧪 اختبار API endpoint للدردشة...")
    print(f"📨 إرسال الرسالة: {test_message['message']}")
    
    try:
        response = requests.post(url, json=test_message, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            print("\n✅ نجح الاتصال!")
            print(f"🤖 رد الذكاء الاصطناعي:")
            print(f"   {data.get('response', 'لا يوجد رد')}")
            print(f"\n✅ الحالة: {data.get('success', False)}")
            return True
        else:
            print(f"\n❌ فشل الاتصال. Status Code: {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except requests.exceptions.ConnectionError:
        print("\n❌ خطأ في الاتصال: تأكد من تشغيل Backend server على http://localhost:8000")
        return False
    except Exception as e:
        print(f"\n❌ خطأ: {e}")
        return False

if __name__ == "__main__":
    print("="*60)
    print("🚀 اختبار نظام الدردشة المساعد")
    print("="*60)
    
    success = test_chat_api()
    
    print("\n" + "="*60)
    if success:
        print("✅ الاختبار نجح!")
    else:
        print("⚠️ الاختبار فشل - راجع الأخطاء أعلاه")
    print("="*60)
