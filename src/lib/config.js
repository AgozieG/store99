import { api } from './api';
let cached;
export async function getConfig(){if(cached)return cached;const env={supabaseUrl:import.meta.env.VITE_SUPABASE_URL||'',supabaseAnonKey:import.meta.env.VITE_SUPABASE_ANON_KEY||'',paystackPublicKey:import.meta.env.VITE_PAYSTACK_PUBLIC_KEY||'',whatsappNumber:import.meta.env.VITE_WHATSAPP_NUMBER||'2349130730895',ownerEmail:import.meta.env.VITE_OWNER_EMAIL||'agozieiwunna@gmail.com'};try{const {data}=await api.get('/api/config');cached={...env,...(data||{})}}catch{cached=env}return cached}
