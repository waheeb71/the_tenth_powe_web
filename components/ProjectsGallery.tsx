import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { Project, getImageUrl } from '../lib/api';

interface ProjectsGalleryProps {
    onClose: () => void;
    projects: Project[];
    onProjectSelect: (index: number) => void;
}

const ProjectsGallery: React.FC<ProjectsGalleryProps> = ({ onClose, projects, onProjectSelect }) => {
    return (
        <div className="fixed inset-0 z-[70] bg-[#0e161b] animate-in fade-in duration-300 overflow-y-auto">
            <div className="sticky top-0 z-10 flex justify-between items-center p-6 bg-[#0e161b]/90 backdrop-blur-md border-b border-white/10">
                <div>
                    <h2 className="text-2xl font-black text-white">معرض المشاريع</h2>
                    <p className="text-slate-400 text-sm">أكثر من {projects.length} مشروع منجز</p>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all hover:rotate-90"
                >
                    <X size={28} />
                </button>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <article
                            key={index}
                            className="group relative h-[300px] rounded-2xl overflow-hidden cursor-pointer"
                            onClick={() => onProjectSelect(index)}
                        >
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url("${getImageUrl(project.image_path)}")` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-90 transition-opacity" />

                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                <div className="flex justify-between items-end">
                                    <div>
                                        <span className="text-primary text-xs font-bold uppercase tracking-wider mb-1 block">{project.location}</span>
                                        <h3 className="text-white text-xl font-bold leading-tight mb-1">{project.title}</h3>
                                        <p className="text-slate-300 text-xs">{project.category}</p>
                                    </div>
                                    <div className="bg-white/10 p-2 rounded-full text-white group-hover:bg-primary group-hover:text-white transition-colors">
                                        <ExternalLink size={16} />
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>

                <div className="mt-12 text-center text-slate-500 text-sm">
                    نهاية القائمة
                </div>
            </div>
        </div>
    );
};

export default ProjectsGallery;
