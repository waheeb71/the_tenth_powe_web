
import React, { useState, useEffect } from 'react';
import { Menu, X, Triangle } from 'lucide-react';

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'خدماتنا', href: '#services' },
    { name: 'مشاريعنا', href: '#projects' },
    { name: 'من نحن', href: '#about' },
    { name: 'اتصل بنا', href: '#contact' },
  ];

  return (
    <header
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
    isScrolled
      ? 'bg-background-dark/80 border-b border-border-dark backdrop-blur-md py-3'
      : 'bg-transparent py-5'
  }`}
    >
      <div className="container mx-auto px-4 md:px-10 flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center cursor-pointer">
  <img src="/logo.png" alt="شعار الشركة" className="w-full h-full object-contain" />
</div>

          <div className="flex flex-col">
            <h1 className="text-white text-lg md:text-xl font-bold leading-tight">شركة القوة العاشرة</h1>
            <span className="text-[#92b7c9] text-[10px] md:text-xs font-semibold tracking-widest uppercase">The Tenth Power</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white hover:text-primary transition-colors text-sm font-medium"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
       

          <a
            href="#contact"
            className="hidden sm:flex items-center justify-center rounded-lg h-10 px-5 bg-primary hover:bg-primary-dark transition-all text-white text-sm font-bold shadow-[0_0_15px_rgba(19,164,236,0.3)] hover:scale-105"
          >
            اطلب عرض سعر
          </a>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-background-dark flex flex-col justify-center animate-in slide-in-from-right duration-300">

          {/* Close Button */}
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 left-6 p-3 bg-white/5 border border-white/10 rounded-full text-white hover:bg-primary hover:border-primary transition-all duration-300 hover:rotate-90 group shadow-lg"
            aria-label="Close Menu"
          >
            <X size={24} className="group-hover:scale-110 transition-transform" />
          </button>

          <div className="flex flex-col gap-8 p-8 items-center text-center">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className="text-3xl font-black text-white hover:text-primary transition-colors hover:scale-110 transform duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}

            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent my-4"></div>

            <a
              href="#contact"
              className="w-full max-w-xs h-16 bg-gradient-to-r from-primary to-primary-dark hover:from-white hover:to-white hover:text-primary transition-all text-white rounded-2xl flex items-center justify-center font-bold text-xl shadow-[0_0_30px_rgba(19,164,236,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)] transform hover:-translate-y-1"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              اطلب عرض سعر
            </a>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
