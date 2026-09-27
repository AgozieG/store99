import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
export default function BackToTop() {
  const [show,setShow]=useState(false);
  useEffect(()=>{const f=()=>setShow(scrollY>400);addEventListener('scroll',f);return()=>removeEventListener('scroll',f)},[]);
  return show ? <button onClick={()=>scrollTo({top:0,behavior:'smooth'})} className="fixed bottom-6 left-5 z-50 p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-xl"><ArrowUp size={18}/></button> : null;
}
