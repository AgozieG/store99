import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import SkeletonCard from '../components/SkeletonCard';
import { CATEGORIES, CATEGORY_LABELS } from '../lib/constants';
import { setSEO } from '../lib/seo';

export default function Products() {
  const [params] = useSearchParams();
  const [category, setCategory] = useState(params.get('category') || 'all');
  const [search, setSearch] = useState('');
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(500000);
  const [sort, setSort] = useState('newest');
  const [mobile, setMobile] = useState(false);
  const { products, loading } = useProducts({ category, search, minPrice: min, maxPrice: max, sort });
  useEffect(() => setSEO('Shop | The Store 99', 'Browse clothing, shoes and accessories from The Store 99.'), []);

  return <section className="section-pad">
    <div className="container-x">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div><p className="mono-label text-xs font-black uppercase tracking-[.25em] text-gold">The collection / curated for rotation</p><h1 className="display mt-2 text-6xl">SHOP 99</h1></div>
        <button className="brutal-button flex items-center gap-2 bg-gold px-4 py-3 text-xs text-black md:hidden" onClick={() => setMobile(!mobile)}><SlidersHorizontal size={17}/>Filters</button>
      </div>
      <div className="grid gap-8 lg:grid-cols-[230px_1fr]">
        <aside className={(mobile ? 'block ' : 'hidden ') + 'lg:block'}>
          <div className="space-y-7 border-2 border-black bg-white p-5 shadow-[4px_4px_0_#D4AF37] dark:border-white dark:bg-darksurface lg:sticky lg:top-28">
            <div><h3 className="mono-label mb-3 text-xs font-black uppercase">Category / 01</h3>{['all', ...CATEGORIES].map(value => <label key={value} className="flex items-center gap-2 py-1.5 text-sm"><input type="checkbox" checked={category === value} onChange={() => setCategory(value)} className="accent-[#D4AF37]"/>{value === 'all' ? 'All' : CATEGORY_LABELS[value]}</label>)}</div>
            <div><h3 className="mono-label mb-3 text-xs font-black uppercase">Price / 02</h3><div className="flex gap-2"><input aria-label="Minimum price" type="number" value={min} onChange={event => setMin(Number(event.target.value))} className="brutal-input min-w-0 w-full bg-transparent px-2 py-2"/><input aria-label="Maximum price" type="number" value={max} onChange={event => setMax(Number(event.target.value))} className="brutal-input min-w-0 w-full bg-transparent px-2 py-2"/></div><input aria-label="Maximum price range" type="range" min="0" max="500000" step="5000" value={max} onChange={event => setMax(Number(event.target.value))} className="mt-3 w-full accent-[#D4AF37]"/></div>
            <select aria-label="Sort products" value={sort} onChange={event => setSort(event.target.value)} className="brutal-input w-full bg-transparent px-3 py-3"><option value="newest">Newest</option><option value="low">Price Low-High</option><option value="high">Price High-Low</option></select>
          </div>
        </aside>
        <div>
          <div className="mb-7 flex items-center gap-3 border-2 border-black bg-white px-4 py-2 shadow-[3px_3px_0_#D4AF37] dark:border-white dark:bg-darksurface"><Search size={18} className="text-muted"/><input aria-label="Search products" value={search} onChange={event => setSearch(event.target.value)} placeholder="Search products..." className="product-search-input min-w-0 flex-1 bg-transparent py-2 outline-none"/></div>
          {loading ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <SkeletonCard key={index}/>)}</div> : products.length ? <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{products.map(product => <ProductCard product={product} key={product.id}/>)}</div> : <div className="brutal-panel bg-white py-24 text-center text-muted dark:bg-darksurface">No products match those filters.</div>}
        </div>
      </div>
    </div>
  </section>;
}
