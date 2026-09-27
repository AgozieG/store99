import { useEffect,useState } from 'react';
import { getSupabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
export function useOrders(){const {user,profile}=useAuth();const [orders,setOrders]=useState([]),[loading,setLoading]=useState(false);useEffect(()=>{(async()=>{const sb=getSupabase();if(!sb||!user)return;setLoading(true);let q=sb.from('orders').select('*,order_items(*)').order('created_at',{ascending:false});if(!profile?.is_admin)q=q.eq('user_id',user.id);const {data}=await q;setOrders(data||[]);setLoading(false)})()},[user?.id,profile?.is_admin]);return {orders,loading}}
