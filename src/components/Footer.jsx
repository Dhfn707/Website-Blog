// src/components/Footer/Footer.jsx
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="footer-container">
                <div className="footer-content">

                    {/* Company Info Section */}
                    <div className="footer-section company-section">
                        <div className="footer-logo">
                            <img
                                style={{ marginTop: "55px", marginBottom: "20px" }}
                                src="/assets/image/logo-putih.webp"
                                alt="Logo Dikary"
                            />
                        </div>

                        <div className="company-info">
                            <div className="info-block">
                                <h4 className="info-title">Pusat</h4>
                                <p>Jl. Darul Quran No.31, RT.02/RW.02, Loji, Kec.</p>
                                <p>Bogor Bar., Kota Bogor, Jawa Barat 16117</p>
                            </div>

                            <div className="info-block">
                                <h4 className="info-title">Cabang</h4>
                                <p>Jakarta, Bogor, Bekasi, Tangerang, Serang,</p>
                                <p>Cilegon, Padang</p>
                            </div>

                            <div className="info-block contact-info">
                                <p className="phone"><strong>0877 4423 5065</strong></p>
                                <p className="email">services@acdikari.app</p>
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="footer-section links-section">
                        <h3 className="footer-heading">Links</h3>
                        <ul className="footer-links">
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/about">About Us</Link></li>
                            <li><Link to="/service">Our Services</Link></li>
                            <li><Link to="/blog">Blog</Link></li>
                            <li><Link to="/contact">Contact Us</Link></li>
                            <li><Link to="/user-guide">User Guide</Link></li>
                            <li><Link to="/equipment">Equipment</Link></li>
                        </ul>
                    </div>

                    {/* Media Section */}
                    <div className="footer-section media-section">
                        <h3 className="footer-heading">Media</h3>
                        <ul className="footer-links">
                            <li><a href="https://www.instagram.com/acdikari.app?igsh=MWFlcm96M2RmaGVkOA==" target="_blank">Instagram</a></li>
                            <li><a href="https://facebook.com/acdikariapp" target="_blank">Facebook</a></li>
                            <li><a href="https://youtube.com/@acservices-l6z?si=1nZi3F6pxVFmljQT" target="_blank">Youtube</a></li>
                        </ul>
                    </div>

                    {/* Download Section */}
                    <div className="footer-section download-section">
                        <a
                            href="https://play.google.com/store/apps/details?id=com.dikariapp.customer.twa"
                            className="download-button"
                        >
                            <div className="download-text">
                                <span className="download-label">Download</span>
                                <span className="download-now">Now</span>
                            </div>
                            <div className="download-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0,0,256,256">
                                    <g fill="#dff4ff"><g transform="scale(5.12,5.12)">
                                        <path d="M7.125,2l21.65625,21.5l5.9375,-5.9375l-26.25,-15.15625c-0.4375,-0.25391 -0.90625,-0.39453 -1.34375,-0.40625zM5.3125,3c-0.19531,0.34766 -0.3125,0.75781 -0.3125,1.21875v41.78125c0,0.33594 0.07031,0.63672 0.1875,0.90625l22.15625,-22zM36.53125,18.59375l-6.34375,6.3125l6.34375,6.28125l7.75,-4.4375c1.10156,-0.63672 1.25781,-1.44531 1.25,-1.875c-0.01172,-0.71094 -0.46094,-1.375 -1.21875,-1.78125c-0.66016,-0.35547 -5.5625,-3.21094 -7.78125,-4.5zM28.78125,26.3125l-21.84375,21.65625c0.36328,-0.01953 0.75781,-0.09766 1.125,-0.3125c0.85547,-0.49609 18.15625,-10.5 18.15625,-10.5l8.53125,-4.90625z"></path>
                                    </g></g>
                                </svg>
                            </div>
                        </a>

                        <div className="qr-section">
                            <p className="qr-label">SCAN ME TO DOWNLOAD</p>
                            <div className="qr-code">
                                <img
                                    src="/assets/image/Q.webp"
                                    alt="QR Code"
                                    className="qr"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <div className="footer-container">
                    <p className="copyright-text">
                        Designed By <a href="#">PT DIKARI TATA UDARA INDONESIA</a>
                    </p>
                </div>
            </div>
        </footer>
    );
}
