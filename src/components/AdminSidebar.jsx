import { LayoutDashboard, Package, ShoppingCart, Boxes } from 'lucide-react';
export default function AdminSidebar({ section, setSection }) {
  const items = [['dashboard','Dashboard',LayoutDashboard],['products','Products',Package],['orders','Orders',ShoppingCart],['stock','Stock Manager',Boxes]];
  return <aside className="lg:w-56 shrink-0 lg:sticky lg:top-24 h-fit"><div className="flex lg:grid gap-2 overflow-x-auto no-scrollbar">{items.map(([id,label,I]) => <button key={id} onClick={() => setSection(id)} className={'whitespace-nowrap flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-bold ' + (section === id ? 'bg-gold text-black' : 'bg-surface dark:bg-darksurface')}><I size={16}/>{label}</button>)}</div></aside>;
}
