
import React from 'react';
import { Phone, Mail, Send, MapPin, Loader2, MessageSquare } from 'lucide-react';

const ContactForm: React.FC = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    service: '',
    message: ''
  });
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [phoneError, setPhoneError] = React.useState('');



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidPhone = (phone: string) => {
      return phone.length >= 7 && phone.length <= 15;
    };
    if (!isValidPhone(formData.phone)) {
      setPhoneError('الرجاء إدخال رقم هاتف صحيح');
      return;
    }


    setStatus('loading');
    try {
      const { sendMessage } = await import('../lib/api');

      const serviceNameAR = {
        'Glass Facades': 'الواجهات الزجاجية',
        'Steel Structures': 'الهياكل الفولاذية',
        'Cladding': 'تكسية الألمنيوم (الكلادينج)',
        'Other': 'أخرى'
      }[formData.service] || formData.service;

      await sendMessage({
        sender_name: formData.name,
        contact_info: formData.phone,
        content: `نوع الخدمة: ${serviceNameAR}\nرسالة العميل: ${formData.message}`
      });
      setStatus('success');
      setFormData({ name: '', phone: '', service: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-12 bg-background-dark relative border-t border-border-dark">
      <div className="container mx-auto px-4 md:px-10">
        <div className="bg-surface-dark/50 border border-border-dark rounded-[2.5rem] p-8 md:p-16 flex flex-col lg:flex-row gap-16 items-center shadow-2xl relative overflow-hidden">

          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[100px] pointer-events-none"></div>

          <div className="flex-1 space-y-8 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
              هل لديك مشروع قادم؟
            </h2>
            <p className="text-slate-300 text-xl leading-relaxed max-w-lg">
              دعنا نساعدك في تحويل رؤيتك إلى واقع. فريقنا الهندسي جاهز لتقديم الاستشارات الفنية وعروض الأسعار التفصيلية.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-12">
              <a href="tel:+966532438253" className="flex items-center gap-5 group hover:bg-white/5 p-4 rounded-2xl transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">اتصل بنا مباشرة</span>
                  <span className="text-white font-black text-xl" dir="ltr">+966 532 438 253</span>
                </div>
              </a>
              <a href="mailto:Zjajkryt78@gmail.com" className="flex items-center gap-5 group hover:bg-white/5 p-4 rounded-2xl transition-all cursor-pointer">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400 uppercase font-bold tracking-widest">البريد الإلكتروني</span>
                  <span className="text-white font-black text-lg">Zjajkryt78@gmail.com</span>
                </div>
              </a>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4 mt-8">
              <a
                href="https://wa.me/966532438253"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:-translate-y-1"
              >
                <MessageSquare size={20} />
                <span>تواصل عبر واتساب</span>
              </a>
              <a
                href="tel:+966532438253"
                className="flex-1 bg-surface-dark border border-border-dark hover:border-primary text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:bg-white/5 hover:-translate-y-1"
              >
                <Phone size={20} />
                <span>اتصال هاتفي</span>
              </a>
            </div>
          </div>

          <div className="w-full lg:w-[500px] bg-background-dark p-8 md:p-10 rounded-3xl border border-border-dark/50 shadow-2xl relative z-10">
            <h3 className="text-2xl font-bold text-white mb-8 border-r-4 border-primary pr-4">طلب عرض سعر سريع</h3>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">الاسم الكامل</label>
                <input
                  className="w-full bg-[#15232b] border border-border-dark rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-600"
                  placeholder="الاسم الثلاثي..."
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">رقم الهاتف</label>
                <input
                  className={`w-full bg-[#15232b] border rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 transition-all placeholder:text-slate-600 ${phoneError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                    : 'border-border-dark focus:border-primary focus:ring-primary/20'
                    }`}
                  placeholder="05xxxxxxxx"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={e => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (phoneError) setPhoneError('');
                  }}
                />
                {phoneError && <p className="text-red-500 text-xs mt-2">{phoneError}</p>}
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">نوع الخدمة</label>
                <select
                  className="w-full bg-[#15232b] border border-border-dark rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer"
                  value={formData.service}
                  onChange={e => setFormData({ ...formData, service: e.target.value })}
                >
                  <option value="">اختر الخدمة المطلوبة...</option>
                  <option value="Glass Facades">الواجهات الزجاجية</option>
                  <option value="Steel Structures">الهياكل الفولاذية</option>
                  <option value="Cladding">تكسية الألمنيوم (الكلادينج)</option>
                  <option value="Other">أخرى</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">تفاصيل الطلب</label>
                <textarea
                  className="w-full bg-[#15232b] border border-border-dark rounded-xl px-5 py-4 text-white focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-slate-600 min-h-[120px] resize-none"
                  placeholder="(اختياري)اكتب تفاصيل طلبك هنا..."
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-primary hover:bg-primary-dark text-white font-black py-5 rounded-xl mt-4 transition-all shadow-lg hover:shadow-primary/40 hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 size={20} className="animate-spin" />
                    <span>جاري الإرسال...</span>
                  </>
                ) : status === 'success' ? (
                  <span>تم الإرسال بنجاح! ✅</span>
                ) : (
                  <>
                    <span>إرسال الطلب</span>
                    <Send size={20} className="rtl:rotate-180" />
                  </>
                )}
              </button>
              {status === 'error' && <p className="text-red-500 text-center text-sm">حدث خطأ. حاول مرة أخرى.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
