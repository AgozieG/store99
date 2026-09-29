import { LayoutDashboard, Package, ShoppingCart, Boxes } from 'lucide-react';
export default function AdminSidebar({ section, setSection }) {
  const items = [['dashboard','Dashboard',LayoutDashboard],['products','Products',Package],['orders','Orders',ShoppingCart],['stock','Stock Manager',Boxes]];
  return <aside className="lg:w-56 shrink-0 lg:sticky lg:top-24 h-fit"><div className="flex gap-2 overflow-x-auto no-scrollbar lg:grid">{items.map(([id, label, I]) => <button key={id} onClick={() => setSection(id)} className={'mono-label whitespace-nowrap flex items-center gap-2 border-2 px-4 py-3 text-left text-xs font-bold uppercase ' + (section === id ? 'border-black bg-gold text-black shadow-[3px_3px_0_#0a0a0a]' : 'border-black/20 bg-surface dark:border-white/20 dark:bg-darksurface')}><I size={16}/>{label}</button>)}</div></aside>;
}
