import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { money } from '../lib/format';
export default function ProductCard({ product }) {
  const img = product.product_images?.find(i => i.is_primary)?.image_url || product.product_images?.[0]?.image_url || product.image;
  return <article className="group cursor-lift">
    <Link to={'/products/' + product.id}>
      <div className="relative aspect-[4/5] overflow-hidden border-2 border-black dark:border-white bg-surface dark:bg-darksurface shadow-[4px_4px_0_#D4AF37]">
        {img && <img src={img} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/>}
        <span className="mono-label absolute left-2 top-2 border-2 border-black bg-white px-2 py-1 text-[9px] font-bold uppercase text-black">{product.category}</span>
        {product.stock === 0 && <span className="absolute bottom-2 left-2 bg-red-500 px-3 py-1 text-xs font-bold text-white">Out of Stock</span>}
        {product.stock > 0 && product.stock < 5 && <span className="mono-label absolute bottom-2 left-2 border-2 border-black bg-gold px-2 py-1 text-[10px] font-bold text-black">Only {product.stock} left!</span>}
      </div>
      <div className="flex justify-between gap-4 border-x-2 border-b-2 border-black bg-white p-3 dark:border-white dark:bg-darksurface">
        <div className="min-w-0"><h3 className="truncate font-bold">{product.name}</h3><p className="mt-1 font-black text-gold">{money(product.price)}</p></div>
        <span className="grid h-9 w-9 shrink-0 place-items-center border-2 border-black bg-gold text-black transition group-hover:translate-x-1 group-hover:-translate-y-1"><ArrowUpRight size={16}/></span>
      </div>
    </Link>
  </article>;
}
