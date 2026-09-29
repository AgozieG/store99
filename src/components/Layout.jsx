import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import BackToTop from './BackToTop';
import CursorReactive from './CursorReactive';
import ScrollMotion from './ScrollMotion';
export default function Layout(){const location=useLocation();return <><CursorReactive/><ScrollMotion/><Navbar/><main><div key={location.pathname+location.search} className="page-enter"><Outlet/></div></main><Footer/><WhatsAppWidget/><BackToTop/></>;}
