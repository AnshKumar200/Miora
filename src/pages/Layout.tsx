import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Layout() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className="flex flex-col bg-background p-5 gap-5 text-white font-poppins min-h-screen">
            <Navbar />
            <Outlet />
            <Footer />
        </div>
    );
}

