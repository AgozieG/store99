import { createClient } from '@supabase/supabase-js';
let client=null;
export function initSupabase(url,key){if(url&&key&&!client)client=createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});return client}
export function getSupabase(){return client}
