import Link from 'next/link'
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Star } from 'lucide-react'
import { MalarLogo } from '@/components/malar-logo'

export function Footer() {
  return (
    <footer className="bg-[#121212] text-white pt-32 pb-16 relative overflow-hidden border-t border-white/5">
      {/* Subtle Grainy Background Effect */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          {/* Brand Story */}
          <div className="md:col-span-4 space-y-8">
             <Link href="/" className="flex items-center gap-3 group">
              <div className="h-14 flex items-center justify-center transition-transform duration-500 group-hover:scale-105 bg-white p-1 rounded-lg">
                <img src="/images/logo.jpg" alt="Malar Silks Logo" className="h-full w-auto object-contain rounded-md" />
              </div>
              <div>
                <span className="block font-serif font-black text-2xl tracking-tight leading-none text-white">
                  MALAR
                </span>
                <span className="block text-[10px] font-bold uppercase tracking-[0.4em] text-primary mt-1">
                  Established 1995
                </span>
              </div>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed max-w-sm font-medium">
              Weaving stories of heritage and grace for over three generations. Our silks represent the pinnacle of artisanal craftsmanship, dedicated to the timeless elegance of the modern patron.
            </p>
            <div className="flex gap-4 pt-4">
              <a href="https://www.instagram.com/malarsilks2021?igsh=MWRvbmFudHp6aWo5OQ==" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-gradient-to-tr hover:from-yellow-400 hover:via-pink-500 hover:to-purple-500 hover:text-white transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="https://www.facebook.com/share/1DmHLVhrt4/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#1877F2] hover:border-[#1877F2] hover:text-white transition-all duration-300">
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">The Maison</h4>
            <ul className="space-y-4">
              {[
                { label: 'Shop', href: '/shop' },
                { label: 'Gallery', href: '/gallery' },
                { label: 'AI Advisor', href: '/outfit-advisor' },
                { label: 'Contact', href: '/contact' }
              ].map(item => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm font-medium text-white/60 hover:text-white transition-colors">{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Collections</h4>
            <ul className="space-y-4">
              {['Women', 'Men', 'Girls', 'Boys'].map(item => (
                <li key={item}>
                  <Link href={`/shop?category=${item.toLowerCase()}`} className="text-sm font-medium text-white/60 hover:text-white transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4 space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Contact Privé</h4>
            <div className="space-y-6">
               <div className="flex gap-4">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-medium text-white/60 leading-relaxed">
                    8/213, Rajapalayam Road<br/>
                    Karivalam, Tamil Nadu 627753
                  </p>
               </div>
               <div className="flex gap-4">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-medium text-white/60">poungracy@gmail.com</p>
               </div>
               <div className="flex gap-4">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <p className="text-sm font-medium text-white/60">+91 94432 50387</p>
               </div>
            </div>
          </div>
        </div>

        {/* Legal & Final Finish */}
        <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
           <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
             &copy; 2026 Malar Silks Private Limited. All Rights Reserved.
           </p>
           <div className="flex gap-8">
              {['Privacy', 'Terms', 'Sustainability'].map(item => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors">{item}</Link>
              ))}
           </div>
           <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Serving Excellence Since 1995
           </div>
        </div>
      </div>
    </footer>
  )
}
