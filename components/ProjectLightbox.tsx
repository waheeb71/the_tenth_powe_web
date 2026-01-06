import React, { useEffect, useState, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project, getImageUrl } from '../lib/api';

interface ProjectLightboxProps {
    projects: Project[];
    initialIndex: number;
    onClose: () => void;
}

const ProjectLightbox: React.FC<ProjectLightboxProps> = ({ projects, initialIndex, onClose }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);
    const [isTouching, setIsTouching] = useState(false);
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    // Reset index if initialIndex receives a NEW legitimate value? 
    // Usually initialIndex is just for mounting. We'll rely on internal state.

    // Handle keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [currentIndex]); // Re-bind not strictly necessary if we use functional updates, but safe.

    const showNext = () => {
        setCurrentIndex((prev) => (prev + 1) % projects.length);
    };

    const showPrev = () => {
        setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsTouching(true);
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        setIsTouching(false);
        if (!touchStartX.current || !touchEndX.current) return;

        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            // Swiped Left -> Next
            showNext();
        } else if (distance < -minSwipeDistance) {
            // Swiped Right -> Prev
            showPrev();
        }

        // Reset
        touchStartX.current = 0;
        touchEndX.current = 0;
    };

    const currentProject = projects[currentIndex];

    // Prevent scrolling background when open
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!currentProject) return null;

    return (
        <div className="fixed inset-0 z-[80] bg-black/95 backdrop-blur-xl animate-in fade-in duration-300 flex flex-col items-center justify-between py-6">

            {/* Top Bar: Close & Counter */}
            <div className="w-full px-6 flex justify-between items-center text-white z-10">
                <span className="text-sm font-light text-white/50">{currentIndex + 1} / {projects.length}</span>
                <button
                    onClick={onClose}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={24} />
                </button>
            </div>

            {/* Main Content Area */}
            <div
                className="flex-1 w-full flex items-center justify-center relative px-4 md:px-16"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Nav Button Left */}
                <button
                    onClick={showPrev}
                    className="absolute left-4 hidden md:flex p-3 bg-black/50 text-white rounded-full hover:bg-primary transition-colors border border-white/10"
                >
                    <ChevronLeft size={32} />
                </button>

                {/* Main Image */}
                <div className="relative max-h-[65vh] w-full max-w-5xl flex flex-col items-center">
                    <img
                        src={getImageUrl(currentProject.image_path)}
                        alt={currentProject.title}
                        className="max-h-[60vh] md:max-h-[65vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                    />

                    {/* Caption / Info */}
                    <div className="mt-4 text-center">
                        <h2 className="text-2xl font-bold text-white mb-1">{currentProject.title}</h2>
                        <p className="text-primary text-sm uppercase tracking-widest">{currentProject.location}</p>
                    </div>
                </div>

                {/* Nav Button Right */}
                <button
                    onClick={showNext}
                    className="absolute right-4 hidden md:flex p-3 bg-black/50 text-white rounded-full hover:bg-primary transition-colors border border-white/10"
                >
                    <ChevronRight size={32} />
                </button>
            </div>

            {/* Bottom Thumbnails Strip */}
            <div className="w-full max-w-6xl px-4 mt-6 h-20 md:h-24">
                <div className="flex gap-3 overflow-x-auto pb-2 h-full justify-start md:justify-center items-center hide-scrollbar mask-thumbnails">
                    {projects.map((proj, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 relative h-16 w-24 md:h-20 md:w-32 rounded-lg overflow-hidden transition-all duration-300 border-2 ${idx === currentIndex
                                ? 'border-primary opacity-100 scale-105'
                                : 'border-transparent opacity-40 hover:opacity-100'
                                }`}
                        >
                            <img
                                src={getImageUrl(proj.image_path)}
                                alt=""
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default ProjectLightbox;
