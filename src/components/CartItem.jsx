import { Minus, Plus, Trash2 } from 'lucide-react';
import { money } from '../lib/format';
import { useCart } from '../context/CartContext';
export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();
  return <div className="flex gap-4 border-b-2 border-black/20 py-5 dark:border-white/20">
    <img src={item.image} alt="" className="h-28 w-24 border-2 border-black object-cover bg-surface dark:border-white"/>
    <div className="min-w-0 flex-1">
      <div className="flex justify-between gap-3"><div><h3 className="truncate font-bold">{item.name}</h3><p className="mono-label mt-1 text-[10px] text-muted">Size {item.size}</p></div><button onClick={() => removeFromCart(item.key)} className="text-muted hover:text-red-500" aria-label={`Remove ${item.name}`}><Trash2 size={17}/></button></div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-center border-2 border-black dark:border-white"><button className="p-2 hover:bg-gold hover:text-black" onClick={() => updateQty(item.key, item.quantity - 1)} aria-label={`Decrease quantity of ${item.name}`}><Minus size={14}/></button><span className="w-8 text-center text-sm">{item.quantity}</span><button className="p-2 hover:bg-gold hover:text-black" onClick={() => updateQty(item.key, item.quantity + 1)} aria-label={`Increase quantity of ${item.name}`}><Plus size={14}/></button></div>
        <div className="font-black">{money(item.price * item.quantity)}</div>
      </div>
    </div>
  </div>;
}
