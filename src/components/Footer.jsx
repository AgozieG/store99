import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
export default function Footer() {
  const wa = import.meta.env.VITE_WHATSAPP_NUMBER || '2349130730895';
  return <footer className="mt-16 border-t-4 border-black bg-gold text-black dark:border-white">
    <div className="container-x grid gap-9 py-12 md:grid-cols-4">
      <div><div className="font-black text-xl tracking-tighter">THE STORE <span>99</span></div><p className="mt-4 max-w-xs text-sm">Premium clothing and footwear for people who want their everyday rotation to say something.</p></div>
      <div><h3 className="mono-label mb-4 text-xs font-bold uppercase">Explore</h3><div className="grid gap-3 text-sm font-semibold"><Link to="/">Home</Link><Link to="/products">Products</Link><Link to="/contact">Contact</Link></div></div>
      <div><h3 className="mono-label mb-4 text-xs font-bold uppercase">Contact</h3><div className="grid gap-3 text-sm"><span><MapPin size={15} className="mr-2 inline"/>Lagos, Nigeria</span><a href="tel:+2349130730895"><Phone size={15} className="mr-2 inline"/>0913 073 0895</a><a href="mailto:georgeiwunna@gmail.com"><Mail size={15} className="mr-2 inline"/>georgeiwunna@gmail.com</a><a target="_blank" rel="noreferrer" href={'https://wa.me/' + wa}>WhatsApp us</a></div></div>
      <div><h3 className="mono-label mb-4 text-xs font-bold uppercase">Follow</h3><div className="flex gap-3"><a aria-label="Instagram" href="#" className="border-2 border-black bg-white p-3 hover:-translate-y-1"><Instagram size={18}/></a><a aria-label="Facebook" href="#" className="border-2 border-black bg-white p-3 hover:-translate-y-1"><Facebook size={18}/></a></div></div>
    </div>
    <div className="container-x flex justify-between gap-4 border-t-2 border-black py-5 text-xs"><span>© {new Date().getFullYear()} The Store 99.</span><span className="mono-label">Built for the next fit.</span></div>
  </footer>;
}
