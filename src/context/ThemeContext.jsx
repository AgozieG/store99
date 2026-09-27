import { createContext,useContext,useEffect,useState } from 'react';
const C=createContext(null);
export function ThemeProvider({children}){const [theme,setTheme]=useState(()=>localStorage.getItem('store99-theme')||'light');useEffect(()=>{document.documentElement.classList.toggle('dark',theme==='dark');localStorage.setItem('store99-theme',theme)},[theme]);return <C.Provider value={{theme,toggleTheme:()=>setTheme(t=>t==='dark'?'light':'dark')}}>{children}</C.Provider>}
export const useTheme=()=>useContext(C);
