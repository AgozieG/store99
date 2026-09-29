import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
export default function BackToTop() {
  const [show,setShow]=useState(false);
  useEffect(()=>{const f=()=>setShow(scrollY>400);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);
  return show ? <button aria-label="Back to top" onClick={() => scrollTo({ top: 0, behavior: 'smooth' })} className="brutal-button fixed bottom-6 left-5 z-50 grid h-12 w-12 place-items-center bg-gold text-black"><ArrowUp size={18}/></button> : null;
}
