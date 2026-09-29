import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import BackToTop from './BackToTop';
import CursorReactive from './CursorReactive';
export default function Layout(){return <><CursorReactive/><Navbar/><main><Outlet/></main><Footer/><WhatsAppWidget/><BackToTop/></>;}
