import { useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';
import { getConfig } from '../lib/config';

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');

  async function send(event) {
    event.preventDefault();
    if (!msg.trim()) return;
    const config = await getConfig();
    window.open('https://wa.me/' + String(config.whatsappNumber).replace(/\D/g, '') + '?text=' + encodeURIComponent(msg.trim()), '_blank');
    setMsg('');
  }

  return <div className="fixed bottom-6 right-5 z-50">
    {open && <div className="mb-4 flex h-[280px] w-[min(320px,calc(100vw-2rem))] flex-col overflow-hidden border-2 border-black bg-white shadow-[6px_6px_0_#D4AF37] dark:border-white dark:bg-darksurface">
      <div className="flex justify-between bg-[#25D366] px-4 py-3 text-sm font-bold text-white"><span>● Chat with us</span><button aria-label="Close WhatsApp chat" onClick={() => setOpen(false)}><X size={18}/></button></div>
      <div className="flex-1 p-4 text-sm">Hi! Welcome to The Store 99 👋 How can we help you today?</div>
      <form onSubmit={send} className="flex gap-2 border-t-2 border-black p-3 dark:border-white">
        <input value={msg} onChange={event => setMsg(event.target.value)} className="min-w-0 flex-1 border-2 border-black bg-surface px-4 py-2 text-black outline-none" placeholder="Type a message..." aria-label="WhatsApp message"/>
        <button aria-label="Send WhatsApp message" className="grid h-10 w-10 shrink-0 place-items-center border-2 border-black bg-[#25D366] text-white"><Send size={16}/></button>
      </form>
    </div>}
    <button aria-label={open ? 'Close chat' : 'Open WhatsApp chat'} aria-expanded={open} onClick={() => setOpen(!open)} className="grid h-14 w-14 place-items-center border-2 border-black bg-[#25D366] text-white shadow-[4px_4px_0_#0a0a0a] transition hover:-translate-y-1"><MessageCircle size={28}/></button>
  </div>;
}
