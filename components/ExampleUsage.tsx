import React, { useState, useEffect } from 'react';
import { ServiceCardSkeleton, ProjectCardSkeleton, SkeletonLoader } from './SkeletonLoader';

// مثال 1: استخدام مع بطاقات الخدمات
export const ServicesExample: React.FC = () => {
    const [services, setServices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // جلب البيانات من API
        fetch('http://localhost:8000/api/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="services-section">
            <h2>خدماتنا</h2>

            {/* إظهار Skeleton أثناء التحميل */}
            {loading ? (
                <ServiceCardSkeleton count={6} />
            ) : (
                <div className="services-grid">
                    {services.map(service => (
                        <div key={service.id} className="service-card">
                            <img src={service.icon} alt={service.title} />
                            <h3>{service.title}</h3>
                            <p>{service.description}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// مثال 2: استخدام مع بطاقات المشاريع
export const ProjectsExample: React.FC = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:8000/api/projects')
            .then(res => res.json())
            .then(data => {
                setProjects(data);
                setLoading(false);
            });
    }, []);

    return (
        <div className="projects-section">
            <h2>مشاريعنا</h2>

            {loading ? (
                <ProjectCardSkeleton count={9} />
            ) : (
                <div className="projects-grid">
                    {projects.map(project => (
                        <div key={project.id} className="project-card">
                            <img src={project.image} alt={project.title} />
                            <div className="project-info">
                                <h3>{project.title}</h3>
                                <p>{project.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

// مثال 3: استخدام المكون العام للأشكال المخصصة
export const CustomExample: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setData({ title: 'تم التحميل!', content: 'هذا محتوى تجريبي' });
            setLoading(false);
        }, 2000);
    }, []);

    return (
        <div>
            {loading ? (
                <div>
                    {/* دائرة للصورة الشخصية */}
                    <SkeletonLoader type="circle" width="100px" height="100px" />

                    {/* عنوان */}
                    <SkeletonLoader type="text" height="24px" width="60%" />

                    {/* نص */}
                    <SkeletonLoader type="text" count={3} height="16px" />

                    {/* مستطيل للصورة */}
                    <SkeletonLoader type="rectangle" height="200px" />
                </div>
            ) : (
                <div>
                    <h1>{data.title}</h1>
                    <p>{data.content}</p>
                </div>
            )}
        </div>
    );
};
