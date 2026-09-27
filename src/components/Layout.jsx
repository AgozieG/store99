import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppWidget from './WhatsAppWidget';
import BackToTop from './BackToTop';
export default function Layout(){return <><Navbar/><main><Outlet/></main><Footer/><WhatsAppWidget/><BackToTop/></>;}
