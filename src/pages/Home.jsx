import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RotateCcw, ShieldCheck, Truck } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { CATEGORY_IMAGES, CATEGORY_LABELS, HERO_IMAGE, CATEGORIES } from '../lib/constants';
import { setSEO } from '../lib/seo';

export default function Home() {
  const { products, loading } = useProducts();
  useEffect(() => setSEO('The Store 99 | Premium Streetwear', 'Shop premium clothing and footwear from The Store 99.'), []);
  const arrivals = products.slice(0, 6);
  const trending = [...products].sort((a, b) => Number(b.stock || 0) - Number(a.stock || 0)).slice(0, 6);

  return <div>
    <section className="motion-hero relative min-h-[calc(100vh-4.5rem)] overflow-hidden bg-black">
      <img data-parallax="0.12" src={HERO_IMAGE} className="parallax-layer absolute inset-0 h-full w-full object-cover opacity-75" alt="Streetwear collection"/>
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"/>
      <div data-parallax="0.04" className="hero-grid absolute inset-0"/>
      <div className="motion-orb -right-16 top-16"/><div className="motion-orb -bottom-20 left-[35%]"/>
      <div className="container-x relative z-10 flex min-h-[calc(100vh-4.5rem)] items-end pb-16 pt-20">
        <div data-reveal="up" className="max-w-4xl text-white">
          <p className="mono-label mb-5 inline-block border-2 border-gold bg-black px-3 py-2 text-xs font-bold uppercase text-gold">THE STORE 99 / LAGOS</p>
          <h1 className="display text-6xl sm:text-8xl md:text-[9rem]">DEFINE<br/><span className="text-gold">YOUR STYLE</span></h1>
          <p className="mt-7 max-w-lg text-base text-white/85 sm:text-lg">Premium clothing & footwear built for everyday rotation, late nights and loud entrances.</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link to="/products" className="brutal-button bg-gold px-7 py-4 font-black text-black">Shop Now <ArrowRight size={17} className="ml-2 inline"/></Link>
            <a href="#collection" className="border-2 border-white px-7 py-4 font-bold text-white hover:bg-white hover:text-black">Explore Collection</a>
          </div>
          <div className="mono-label mt-12 flex flex-wrap gap-3 text-[10px] font-bold uppercase tracking-widest text-white/80">
            <span className="border border-white/50 px-2 py-1">Built different</span><span className="border border-white/50 px-2 py-1">Always in rotation</span><span className="border border-white/50 px-2 py-1">Lagos, Nigeria</span>
          </div>
        </div>
      </div>
      <span className="mono-label absolute right-5 top-8 hidden rotate-90 border-2 border-gold bg-black px-3 py-2 text-xs font-bold text-gold sm:block">STYLE FILE / 01</span>
    </section>

    <div className="overflow-hidden border-y-2 border-black bg-gold py-3 text-black dark:border-white">
      <div className="ticker-marquee ticker-track whitespace-nowrap text-xs font-bold uppercase tracking-[.2em]"><span>THE NEXT FIT STARTS HERE ✳ THE NEXT FIT STARTS HERE ✳ THE NEXT FIT STARTS HERE ✳</span><span aria-hidden="true">THE NEXT FIT STARTS HERE ✳ THE NEXT FIT STARTS HERE ✳ THE NEXT FIT STARTS HERE ✳</span></div>
    </div>

    <section className="section-pad" id="collection">
      <div className="container-x">
        <div data-reveal="up" className="mb-7 flex items-end justify-between gap-4">
          <div><p className="mono-label text-xs font-black uppercase tracking-[.2em] text-gold">Fresh off the rack / 01</p><h2 className="display mt-2 text-5xl">New Arrivals</h2></div>
          <Link to="/products" className="hidden items-center gap-2 border-b-2 border-gold pb-1 font-bold sm:flex">View all <ArrowRight size={17}/></Link>
        </div>
        <div className="no-scrollbar flex gap-5 overflow-x-auto pb-3">
          {loading ? Array.from({ length: 4 }).map((_, i) => <div className="min-w-[260px]" key={i}><SkeletonCard/></div>) : arrivals.map(product => <div className="min-w-[260px]" key={product.id}><ProductCard product={product}/></div>)}
        </div>
      </div>
    </section>

    <section className="section-pad border-y-2 border-black bg-gold text-black dark:border-white" id="categories">
      <div data-reveal="up" className="container-x">
        <p className="mono-label text-xs font-black uppercase tracking-[.2em]">Shop by mood / 02</p><h2 className="display mt-2 mb-8 text-5xl">Categories</h2>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {CATEGORIES.map((category, index) => <Link data-reveal="card" style={{ '--reveal-delay': `${index * 45}ms` }} to={'/products?category=' + category} key={category} className="group relative aspect-[1.25] overflow-hidden border-2 border-black shadow-[4px_4px_0_#0a0a0a]">
            <img src={CATEGORY_IMAGES[category]} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-black/35 transition group-hover:bg-black/15"/>
            <span className="mono-label absolute left-3 top-3 bg-white px-2 py-1 text-[10px] font-bold text-black">0{index + 1}</span>
            <span className="absolute bottom-4 left-4 text-xl font-black text-white sm:text-2xl">{CATEGORY_LABELS[category]}</span>
          </Link>)}
        </div>
      </div>
    </section>

    <section className="section-pad">
      <div className="container-x">
        <div data-reveal="up" className="mb-10 max-w-2xl"><p className="mono-label text-xs font-black uppercase tracking-[.2em] text-gold">The 99 standard / 03</p><h2 className="display mt-2 text-5xl">Why Shop With Us</h2></div>
        <div className="grid gap-4 md:grid-cols-3">
          {[[Truck, '01 / Delivery', 'Selected orders are handled with speed and care.'], [ShieldCheck, '02 / Authentic', 'We focus on genuine pieces and quality you can feel.'], [RotateCcw, '03 / Easy returns', 'A straightforward return process when something is not right.']].map(([Icon, title, description]) =>
            <div data-reveal="card" key={title} className="brutal-panel cursor-lift bg-white p-6 dark:bg-darksurface"><Icon className="text-gold" size={30}/><h3 className="mt-5 font-black text-xl">{title}</h3><p className="mt-2 leading-7 text-muted">{description}</p></div>)}
        </div>
      </div>
    </section>

    <section className="section-pad border-y-2 border-black bg-black text-white dark:border-white">
      <div data-reveal="up" className="container-x"><p className="mono-label text-xs font-black uppercase tracking-[.2em] text-gold">Moving fast / 04</p><h2 className="display mt-2 mb-8 text-5xl">Trending Now</h2><div className="grid grid-cols-2 gap-4 md:grid-cols-3">{trending.map(product => <ProductCard product={product} key={product.id}/>)}</div></div>
    </section>

    <section className="section-pad">
      <div className="container-x grid items-center gap-10 lg:grid-cols-2">
        <div data-reveal="card" data-parallax="0.05" className="relative"><img src={CATEGORY_IMAGES.HOODIES} className="aspect-[4/3] w-full border-2 border-black object-cover shadow-[6px_6px_0_#D4AF37] dark:border-white" alt="The Store 99"/><span className="mono-label absolute -bottom-4 right-4 border-2 border-black bg-gold px-3 py-2 text-xs font-bold text-black">MADE FOR THE ROTATION</span></div>
        <div data-reveal="up"><p className="mono-label text-xs font-black uppercase tracking-[.2em] text-gold">About the brand / 05</p><h2 className="display mt-2 text-5xl">Built for the rotation.</h2><p className="mt-6 leading-8 text-muted">The Store 99 is a Nigerian fashion destination for clean essentials, statement pieces and footwear that can move from ordinary Tuesday to main-character Saturday without changing the plot.</p><Link to="/products" className="mt-7 inline-flex items-center gap-2 border-b-2 border-gold pb-2 font-black">Enter the collection <ArrowRight size={18}/></Link></div>
      </div>
    </section>
  </div>;
}
