
import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { fetchServices, Service, getImageUrl } from '../lib/api';
import { ServiceCardSkeleton } from './SkeletonLoader';

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices().then(data => {
      if (data.length > 0) setServices(data);
      setLoading(false);
    }).catch(() => {
      setLoading(false);
    });
  }, []);

  // Display only fetched services (no fallback)
  const displayServices = services;

  return (
    <section id="services" className="py-12 relative overflow-hidden bg-background-dark">
      <div className="container mx-auto px-4 md:px-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-primary text-sm font-bold tracking-[0.2em] mb-3 uppercase">خدماتنا الهندسية</h2>
            <h3 className="text-white text-3xl md:text-5xl font-black leading-tight">
              حلول متكاملة للبناء الحديث
            </h3>
            <p className="text-slate-400 mt-6 text-lg leading-relaxed">
              نجمع بين القوة الجمالية والوظيفية لتقديم واجهات وهياكل تدوم طويلاً، مع الالتزام بأحدث التقنيات الهندسية.
            </p>
          </div>
          <button className="text-primary hover:text-white transition-all flex items-center gap-2 font-bold text-lg group">
            كل الخدمات
            <ArrowRight className="w-5 h-5 rtl:rotate-180 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <ServiceCardSkeleton count={4} />
        ) : displayServices.length === 0 ? (
          <div className="text-center text-slate-500 py-10 w-full border border-white/5 rounded-xl bg-white/5">
            <p>لا توجد خدمات مضافة حالياً</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayServices.map((service, index) => (
              <div
                key={index}
                className="group relative bg-surface-dark border border-border-dark rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 cursor-pointer shadow-lg hover:shadow-primary/10"
              >
                <div className="h-48 overflow-hidden relative">
                  <div className="absolute inset-0 bg-primary/10 z-10 group-hover:bg-transparent transition-colors duration-500" />
                  <img
                    src={getImageUrl(service.image_path)}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                </div>

                <div className="p-8">
                  <h4 className="text-white text-2xl font-bold mb-4">{service.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  <div className="flex items-center text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-all">
                    <span>اكتشف المزيد</span>
                    <ArrowRight size={16} className="mr-2 rtl:rotate-180" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
