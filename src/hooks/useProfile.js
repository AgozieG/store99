import { useAuth } from '../context/AuthContext';
import { getSupabase } from '../lib/supabase';
export function useProfile(){const {user,profile,refreshProfile}=useAuth();async function updateProfile(v){const sb=getSupabase();if(!sb||!user)throw Error('You must be signed in.');const {error}=await sb.from('profiles').update({full_name:v.full_name,phone:v.phone,updated_at:new Date().toISOString()}).eq('id',user.id);if(error)throw error;await refreshProfile()}return {user,profile,updateProfile}}
