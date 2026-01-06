
import React, { useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { fetchProjects, getImageUrl, Project } from '../lib/api';

const Projects: React.FC = () => {
  const [isGalleryOpen, setIsGalleryOpen] = React.useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetchProjects().then(data => {
      if (data.length > 0) setProjects(data);
    });
  }, []);

  // Display only fetched projects (no fallback to static)
  const displayProjects = projects;

  return (
    <>
      <section id="projects" className="py-12 bg-[#0e161b] overflow-hidden">
        <div className="container mx-auto px-4 md:px-10">
          <div className="mb-16">
            <header>
              <h2 className="text-primary text-sm font-bold tracking-[0.2em] mb-3 uppercase">معرض أعمال شركة القوة العاشرة</h2>
              <h3 className="text-white text-3xl md:text-5xl font-black">مشاريع زجاج القوة العاشرة الحديثة</h3>
            </header>
          </div>

          {/* Carousel Container */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0 min-h-[400px]">
            {displayProjects.length === 0 ? (
              <div className="w-full text-center text-slate-400 py-20 border border-white/10 rounded-2xl">
                <p className="text-xl">لا توجد مشاريع مضافة حالياً</p>
                <p className="text-sm mt-2">يمكنك إضافة مشاريع جديدة عبر بوت التليجرام</p>
              </div>
            ) : (
              displayProjects.map((project, index) => (
                <article
                  key={index}
                  className="group cursor-pointer min-w-[85%] md:min-w-[450px] snap-center select-none"
                  onClick={() => setLightboxIndex(index)}
                >
                  <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden mb-6 shadow-2xl">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url("${getImageUrl(project.image_path)}")` }}
                      role="img"
                      aria-label={project.alt_text || project.title}
                      title={project.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />

                    <div className="absolute top-6 right-6">
                      <span className="bg-primary/90 text-white text-xs font-bold px-4 py-2 rounded-full backdrop-blur-md">
                        {project.year}
                      </span>
                    </div>

                    <div className="absolute bottom-8 left-8 right-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                      <h4 className="text-white text-2xl md:text-3xl font-black mb-2 group-hover:text-primary transition-colors">
                        {project.title}
                      </h4>
                      <p className="text-slate-300 text-sm md:text-base font-medium opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                        {project.category} | {project.location}
                      </p>
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 bg-primary/10 backdrop-blur-[2px]">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-primary transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-200">
                        <ExternalLink size={24} />
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={() => setIsGalleryOpen(true)}
              className="w-full md:w-auto px-12 py-5 bg-transparent border border-white/10 hover:border-primary text-white font-bold rounded-2xl hover:bg-primary/10 transition-all text-lg shadow-lg hover:shadow-primary/10"
            >
              شاهد المزيد من مشاريع القوة العاشرة
            </button>
          </div>
        </div>
      </section>

      {isGalleryOpen && (
        <React.Suspense fallback={null}>
          <ProjectsGallery
            onClose={() => setIsGalleryOpen(false)}
            projects={displayProjects}
            onProjectSelect={(index) => setLightboxIndex(index)}
          />
        </React.Suspense>
      )}

      {lightboxIndex !== null && (
        <React.Suspense fallback={null}>
          <ProjectLightbox
            projects={displayProjects}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        </React.Suspense>
      )}
    </>
  );
};

// Lazy load the gallery for performance
const ProjectsGallery = React.lazy(() => import('./ProjectsGallery'));
// Lazy load lightbox
const ProjectLightbox = React.lazy(() => import('./ProjectLightbox'));

export default Projects;
