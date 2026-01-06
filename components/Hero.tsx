
import React, { useEffect, useState } from 'react';
import { ArrowLeft, Hammer, ShieldCheck, ArrowDown } from 'lucide-react';
import { fetchContent, getImageUrl } from '../lib/api';

const DEFAULT_HERO_BG = "https://lh3.googleusercontent.com/aida-public/AB6AXuD_WU6kfj36UolPlgETV_8gh7F-rxurJ6Tlk209Eu1VAh7A9drJattvS5jGbL8ziX66Et5fZUpaCu9J7eGYaURzFkGyvHxyT13CVntEgAkBoqakFiihj-OF0LLJDr7U6bNiN7-I8DecP6Bf89QNsW_6mr5_FndJotCqfvQVkuSVbuCMo8ECA0j_IpiYE4-Lfpzfi64B1TAg9M4AvOEYr7ATXmuXQho_5ER_SgTPeUbLmZYctBrGN1WQjWJxNMNF1B9m6g_bc4Wz1-IQ";

const Hero: React.FC = () => {
  const [content, setContent] = useState<Record<string, string>>({
    hero_title: "شركة القوة العاشرة",
    hero_subtitle: "نحن في شركة القوة العاشرة متخصصون في تنفيذ أفضل أنواع زجاج الواجهات والهياكل الفولاذية بابتكار هندسي لا يضاهى في الرياض وكافة مدن المملكة.",
    hero_bg: DEFAULT_HERO_BG
  });

  useEffect(() => {
    fetchContent('hero').then(data => {
      if (Object.keys(data).length > 0) {
        // Only update fields that have actual values, preventing empty strings from overriding defaults
        setContent(prev => {
          const newContent = { ...prev };
          Object.keys(data).forEach(key => {
            if (data[key] && data[key].trim() !== '') {
              newContent[key] = data[key];
            }
          });
          return newContent;
        });
      }
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat z-0 "
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(16, 28, 34, 0.35) 0%, rgba(16, 28, 34, 0.65) 100%), url("${getImageUrl(content.hero_bg || DEFAULT_HERO_BG)}")`
        }}
        role="img"
        aria-label={content.hero_title}
      />

      <div className="container mx-auto px-4 md:px-10 relative z-10 flex flex-col items-center text-center max-w-5xl gap-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 backdrop-blur-sm animate-pulse">
          <Hammer className="text-primary w-4 h-4" />
          <h2 className="text-primary text-sm font-semibold">شركة القوة العاشرة - رواد زجاج الواجهات والإنشاءات</h2>
        </div>

        <h1 className="text-white text-4xl md:text-6xl lg:text-8xl font-black leading-tight tracking-tight drop-shadow-2xl">
          {content.hero_title}<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-l from-primary via-blue-400 to-white">زجاج القوة العاشرة</span>
        </h1>

        <p className="text-slate-300 text-base md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
          {content.hero_subtitle}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center pt-6">
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="flex items-center justify-center h-14 px-10 bg-primary hover:bg-primary-dark text-white rounded-xl text-lg font-bold transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1">
            استشارة مجانية للمشاريع
          </button>
          <a
            href="#projects"
            className="flex items-center justify-center h-14 px-10 bg-transparent border border-white/20 hover:border-white/40 text-white rounded-xl text-lg font-bold backdrop-blur-md transition-all group"
          >
            مشاريع القوة العاشرة
            <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
          </a>
        </div>
      </div>

      <a
        href="#stats"
        className="absolute bottom-10 left-0 right-0 mx-auto w-fit flex flex-col items-center gap-2 opacity-50 hover:opacity-100 transition-opacity animate-float z-20 cursor-pointer"
        aria-label="Scroll down"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
        </div>
        <span className="text-[10px] uppercase font-bold tracking-widest">مزيد من المعلومات</span>
      </a>
    </section>
  );
};

export default Hero;
