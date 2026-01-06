
import React from 'react';
import { Triangle, Twitter, Facebook, Instagram, Linkedin, MapPin, Send, Phone } from 'lucide-react';
const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0b1418] border-t border-border-dark pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-16 mb-12 md:mb-16 text-center md:text-right">
          {/* Brand */}
          <div className="space-y-6 flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center text-primary">
                <Triangle className="w-6 h-6 fill-current" />
              </div>
              <span className="text-2xl font-black">القوة العاشرة</span>
            </div>
            <p className="text-slate-400 text-base leading-relaxed max-w-sm mx-auto md:mx-0">
              شريكك الموثوق في مشاريع الزجاج والإنشاءات الكبرى. نلتزم بالدقة، الجودة، والابتكار لتحقيق أفضل المعايير المعمارية.
            </p>
            <div className="flex gap-4 flex-wrap justify-center md:justify-start w-full">
              <a href="https://www.facebook.com/share/1B76d6yTDp/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/ZJJ4021" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://t.me/Ponamoha" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="Telegram">
                <Send size={18} />
              </a>
              <a href="https://wa.me/966532438253" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="WhatsApp">
                <Phone size={18} />
              </a>
              <a href="https://www.snapchat.com/add/zjjskryt24" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="Snapchat">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="text-current"
                >
                  <path d="M12.003 2c-4.321 0-7.79 3.585-7.79 8.01 0 2.228 1.134 4.225 3.016 5.617.208.154.275.437.201.696-.134.469-.328 1.489-.783 2.296-.28.497-.04.78.36.866 1.432.306 2.457.65 2.924 1.547.28.536 1.258 1.055 2.072 1.055.814 0 1.791-.519 2.072-1.055.467-.897 1.492-1.241 2.923-1.547.4-.086.64-.37.361-.866-.455-.807-.65-1.827-.783-2.296-.074-.259-.007-.542.201-.696 1.882-1.392 3.016-3.389 3.016-5.617 0-4.425-3.469-8.01-7.79-8.01" />
                </svg>
              </a>
              <a href="https://www.tiktok.com/@user0532438253" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-white/5 active:scale-95" title="TikTok">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="none"
                  className="text-current"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white text-lg font-bold mb-6 md:mb-8 relative inline-block md:block after:content-[''] after:absolute after:bottom-[-8px] after:right-1/2 after:translate-x-1/2 md:after:translate-x-0 md:after:right-0 after:w-10 after:h-1 after:bg-primary">روابط سريعة</h4>
            <ul className="space-y-4 text-slate-400 w-full">
              {['الرئيسية', 'عن الشركة', 'مشاريعنا', 'الوظائف', 'المدونة'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 py-1 md:py-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 hidden md:inline-block"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Footer */}
          <div className="flex flex-col items-center md:items-start">
            <h4 className="text-white text-lg font-bold mb-6 md:mb-8 relative inline-block md:block after:content-[''] after:absolute after:bottom-[-8px] after:right-1/2 after:translate-x-1/2 md:after:translate-x-0 md:after:right-0 after:w-10 after:h-1 after:bg-primary">الخدمات</h4>
            <ul className="space-y-4 text-slate-400 w-full">
              {['الزجاج الإنشائي', 'تكسية الألمنيوم', 'الهياكل الفولاذية', 'صيانة الواجهات', 'الاستشارات الهندسية'].map(item => (
                <li key={item}>
                  <a href="#" className="hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-2 py-1 md:py-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/30 hidden md:inline-block"></span>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Map / Location */}
          <div className="flex flex-col items-center md:items-start w-full">
            <h4 className="text-white text-lg font-bold mb-6 md:mb-8 relative inline-block md:block after:content-[''] after:absolute after:bottom-[-8px] after:right-1/2 after:translate-x-1/2 md:after:translate-x-0 md:after:right-0 after:w-10 after:h-1 after:bg-primary">
              موقعنا
            </h4>

            <a
              href="https://maps.app.goo.gl/EjgVkcjYY7rSW7dA6"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl overflow-hidden h-40 w-full bg-surface-dark relative mb-6 group cursor-pointer shadow-lg block transform transition-all hover:scale-105"
            >
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity"
                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCNwtW49pnHeBeX2LP-C411cAdtas76kbRmABYrYOxFoLYXloOK_WFqbSmO0epD8UJpxGx9U8JVHNMLUcOaX4noDL8l6-ROOiE5WUWQ0VMwnuW9Wqq5f2az-H9LXc5kTqErnharz9ZI68BwngXiN5iJe2ZFRWZipvqyjM2FUvXRUL5l-CeW5uKLNxb_KXRCj0MzRTY88E4Na6qJn46emc3MjTPPzDYNHm26vW7H4tRhEHBbBrG0m6luP0dRb3Dgx1zcCQwnhn2obMzj")` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <MapPin className="text-primary w-10 h-10 drop-shadow-lg animate-float" />
              </div>
            </a>

            <p className="text-slate-400 text-sm flex items-center justify-center md:justify-start gap-2">
              <MapPin size={14} className="text-primary" />
              الرياض، المملكة العربية السعودية
            </p>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 md:pt-10 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center md:text-right">
          <p className="text-slate-500 text-xs md:text-sm">© {new Date().getFullYear()} شركة القوة العاشرة. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
