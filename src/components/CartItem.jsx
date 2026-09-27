import { Minus, Plus, Trash2 } from 'lucide-react';
import { money } from '../lib/format';
import { useCart } from '../context/CartContext';
export default function CartItem({ item }) {
  const { updateQty, removeFromCart } = useCart();
  return <div className="flex gap-4 py-5 border-b"><img src={item.image} alt="" className="w-24 h-28 rounded-xl object-cover bg-surface"/><div className="min-w-0 flex-1"><div className="flex justify-between"><div><h3 className="font-bold truncate">{item.name}</h3><p className="text-xs text-muted mt-1">Size {item.size}</p></div><button onClick={()=>removeFromCart(item.key)} className="text-muted"><Trash2 size={17}/></button></div><div className="mt-5 flex items-center justify-between"><div className="flex items-center border rounded-full overflow-hidden"><button className="p-2" onClick={()=>updateQty(item.key,item.quantity-1)}><Minus size={14}/></button><span className="w-8 text-center text-sm">{item.quantity}</span><button className="p-2" onClick={()=>updateQty(item.key,item.quantity+1)}><Plus size={14}/></button></div><div className="font-black">{money(item.price*item.quantity)}</div></div></div></div>;
}
