import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, Menu, Moon, Search, ShoppingBag, Sun, UserRound, X } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { cartCount } = useCart();
  const { user, profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [account, setAccount] = useState(false);
  const navigate = useNavigate();
  const links = [['Home', '/'], ['Products', '/products'], ['Contact', '/contact']];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `mono-label text-xs font-bold uppercase transition-colors ${isActive ? 'text-gold' : 'opacity-70 hover:opacity-100'}`;

  return (
    <header className={`sticky top-0 z-40 border-b-2 border-black dark:border-white ${scrolled ? 'bg-white/90 dark:bg-ink/90 backdrop-blur-xl shadow-[0_4px_0_#D4AF37]' : 'bg-white dark:bg-ink'}`}>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
        <Link to="/" className="flex shrink-0 items-center gap-2" aria-label="The Store 99 home">
          <img src="/resources/store-99-logo.png" alt="" className="h-10 w-10 border-2 border-black dark:border-white object-contain" onError={event => { event.currentTarget.style.display = 'none'; }} />
          <span className="font-black tracking-tighter text-sm sm:text-base">THE STORE <span className="text-gold">99</span><span className="block h-1 bg-gold w-10"/></span>
        </Link>

        <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
          {links.map(([name, path]) => <NavLink key={path} to={path} className={navLinkClass}>{name}</NavLink>)}
        </nav>

        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gold hover:text-black" onClick={() => navigate('/products')} aria-label="Search products"><Search size={19}/></button>
          <Link to="/cart" className="relative p-2 hover:bg-gold hover:text-black" aria-label={`Shopping bag${cartCount ? `, ${cartCount} items` : ''}`}>
            <ShoppingBag size={20}/>
            {cartCount > 0 && <span className="absolute -top-1 -right-1 min-w-4 h-4 grid place-items-center border border-black bg-gold text-black text-[10px] font-black">{cartCount}</span>}
          </Link>
          <button className="p-2 hover:bg-gold hover:text-black" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            {theme === 'dark' ? <Sun size={19}/> : <Moon size={19}/>}
          </button>
          {user ? (
            <div className="relative hidden sm:block">
              <button onClick={() => setAccount(!account)} className="p-2 border-2 border-current hover:bg-gold hover:text-black" aria-label="Account menu" aria-expanded={account}><UserRound size={18}/></button>
              {account && <div className="absolute right-0 mt-2 w-48 brutal-panel bg-white dark:bg-darksurface p-2 shadow-luxury">
                <Link className="block p-3 hover:bg-gold hover:text-black" to="/profile">Profile</Link>
                {profile?.is_admin && <Link className="block p-3 hover:bg-gold hover:text-black" to="/admin">Admin</Link>}
                <button className="w-full text-left p-3 text-red-500 hover:bg-red-500/10" onClick={signOut}><LogOut size={15} className="inline mr-2"/>Logout</button>
              </div>}
            </div>
          ) : <div className="hidden sm:flex gap-2">
            <Link to="/login" className="px-3 py-2 text-sm font-bold hover:text-gold">Login</Link>
            <Link to="/signup" className="brutal-button bg-gold px-3 py-2 text-xs font-bold text-black">Sign up</Link>
          </div>}
          <button className="md:hidden p-2 border-2 border-current" onClick={() => setOpen(!open)} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open}>{open ? <X/> : <Menu/>}</button>
        </div>
      </div>

      {open && <div className="md:hidden border-t-2 border-black dark:border-white bg-white dark:bg-ink">
        <div className="container-x grid gap-1 py-4">
          {links.map(([name, path]) => <Link key={path} onClick={() => setOpen(false)} className="mono-label border-b border-black/15 dark:border-white/15 py-3 text-sm uppercase" to={path}>{name}</Link>)}
          {user ? <>
            <Link onClick={() => setOpen(false)} className="py-3" to="/profile">Profile</Link>
            {profile?.is_admin && <Link onClick={() => setOpen(false)} className="py-3" to="/admin">Admin</Link>}
            <button className="py-3 text-left text-red-500" onClick={() => { signOut(); setOpen(false); }}>Logout</button>
          </> : <div className="flex gap-3 pt-3">
            <Link onClick={() => setOpen(false)} to="/login" className="flex-1 border-2 border-current py-3 text-center">Login</Link>
            <Link onClick={() => setOpen(false)} to="/signup" className="brutal-button flex-1 bg-gold py-3 text-center text-black">Sign up</Link>
          </div>}
        </div>
      </div>}
    </header>
  );
}
