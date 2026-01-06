import React, { useEffect, useState } from 'react';
import { X, Tag } from 'lucide-react';
import { Promotion, fetchPromotions, getImageUrl } from '../lib/api';

const AdPopup: React.FC = () => {
    const [ad, setAd] = useState<Promotion | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const loadAd = async () => {
            const promotions = await fetchPromotions();
            if (promotions.length > 0) {
                const latestAd = promotions[promotions.length - 1];
                // Check if user has already closed this specific ad
                const closedAdId = localStorage.getItem('closedAdId');

                if (closedAdId !== String(latestAd.id)) {
                    setAd(latestAd);
                    // Delay popup slightly for better UX
                    setTimeout(() => setIsOpen(true), 2000);
                }
            }
        };
        loadAd();
    }, []);

    const handleClose = () => {
        if (ad) {
            // Save the closed ad ID to localStorage
            localStorage.setItem('closedAdId', String(ad.id));
        }
        setIsOpen(false);
    };

    if (!isOpen || !ad) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative bg-surface-dark border border-border-dark w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all"
                >
                    <X size={20} />
                </button>

                {/* Ad Image */}
                {ad.image_path && (
                    <div className="w-full h-48 sm:h-64 relative">
                        <img
                            src={getImageUrl(ad.image_path)}
                            alt={ad.title}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark to-transparent"></div>
                    </div>
                )}

                {/* Content */}
                <div className={`p-8 relative ${!ad.image_path ? 'pt-20' : ''}`}>
                    {/* Discount Tag */}
                    {ad.discount_percentage && ad.discount_percentage > 0 && (
                        <div className={`absolute ${ad.image_path ? '-top-6' : 'top-6'} left-8 bg-red-500 text-white px-4 py-2 rounded-xl font-black shadow-lg flex items-center gap-2 animate-bounce z-20`}>
                            <Tag size={16} />
                            <span>خصم {ad.discount_percentage}%</span>
                        </div>
                    )}

                    <h3 className="text-2xl font-black text-white mb-3">{ad.title}</h3>
                    <p className="text-slate-300 leading-relaxed mb-6">
                        {ad.description}
                    </p>

                    <button
                        onClick={handleClose}
                        className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold transition-all"
                    >
                        مهتم بهذا العرض
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdPopup;
