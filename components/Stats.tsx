
import React, { useEffect, useState } from 'react';
import { fetchContent } from '../lib/api';

const Stats: React.FC = () => {
  const [stats, setStats] = useState([
    { value: '15+', label: 'سنة خبرة', key: 'stat_exp' },
    { value: '250+', label: 'مشروع مكتمل', key: 'stat_projects' },
    { value: '100%', label: 'معدل أمان', key: 'stat_safety' },
    { value: '24/7', label: 'دعم فني', key: 'stat_support' },
  ]);

  useEffect(() => {
    fetchContent('stats').then(data => {
      if (Object.keys(data).length > 0) {
        setStats(prev => prev.map(s => ({
          ...s,
          value: data[s.key] || s.value
        })));
      }
    });
  }, []);

  return (
    <section id="stats" className="relative z-20 -mt-10 md:-mt-16 px-4">
      <div className="container mx-auto">
        <div className="bg-surface-dark/95 border border-border-dark backdrop-blur-xl rounded-2xl shadow-2xl p-6 md:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x md:divide-x-reverse md:divide-white/10">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <p className="text-primary text-3xl md:text-5xl font-black mb-2 group-hover:scale-110 transition-transform">
                  {stat.value}
                </p>
                <p className="text-slate-400 text-sm md:text-base font-bold uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Stats;
