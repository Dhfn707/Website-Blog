import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./Layouts/AppLayout";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Equipment from "./pages/Equipment/Equipment";
import Service from "./pages/Service/Service";  
import Blog from "./pages/Blog/Blog";
import Training from "./pages/Training/Training";
import Karir from "./pages/Karir/Karir";
import Contact from "./pages/Contact/Contact";
import UserGuide from "./pages/User-guide/User-guide";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/equipment" element={<Equipment />} />
                    <Route path="/service" element={<Service />} />
                    <Route path="/blog" element={<Blog />} />
                    <Route path="/training" element={<Training />} />
                    <Route path="/karir" element={<Karir />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/user-guide" element={<UserGuide />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

