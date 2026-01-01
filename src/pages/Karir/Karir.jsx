import { useEffect, useState, useRef } from "react";
import "./karir.css";

export default function Karir() {
  const [pageReady, setPageReady] = useState(false);
  const hasAnimated = useRef(false);

  // Tunggu halaman benar-benar stabil seperti Equipment
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageReady(true);
    }, 80); // sedikit delay agar DOM stabil

    return () => clearTimeout(timer);
  }, []);

  // Jalankan animasi setelah halaman siap (mirip Equipment useEffect kedua)
  useEffect(() => {
    if (!pageReady) return;
    if (hasAnimated.current) return;

    const elements = document.querySelectorAll(".animate-on-scroll");

    setTimeout(() => {
      elements.forEach((el) => el.classList.add("slide-up"));
    }, 60);

    hasAnimated.current = true;
  }, [pageReady]);

  // Jangan render sebelum ready (menghindari freeze)
  if (!pageReady) return null;

  return (
    <div className="karir-page">
      {/* Karir Hero Section */}
      <section className="karir-hero-section">
        <div className="karir-hero-bg">
          <img
            src="/assets/image/image_karir/baner_karir.webp"
            alt="HVAC Background"
          />
        </div>

        <div className="karir-hero-overlay"></div>

        <div className="karir-hero-container">
          <div className="karir-hero-content animate-on-scroll">
            <h1 className="karir-hero-title">Karir Bersama AC DIKARI</h1>
            <p className="karir-hero-description">
              Bergabunglah dengan tim profesional kami dan kembangkan karir Anda
              di industri HVAC yang dinamis dan menjanjikan.
            </p>
          </div>
        </div>
      </section>

      {/* Career Section */}
      <section className="career-section">
        <div className="career-container">
          <div className="career-intro-wrapper">
            <div className="career-intro-content animate-on-scroll">
              <h2>Kami Menerima Pekerja setiap tahun</h2>
              <p>
                Kami mencari talenta terbaik untuk bergabung dengan tim profesional
                AC DIKARI. Berbagai posisi tersedia di departemen teknis dan administrasi
                dengan kesempatan pengembangan karir yang menjanjikan.
              </p>
              <div className="career-intro-highlight">
                <div className="highlight-item">
                  <span className="highlight-number">3+</span>
                  <span className="highlight-text">Lowongan Terbuka</span>
                </div>
              </div>
            </div>

            <div className="career-intro-image animate-on-scroll">
              <img
                src="/assets/image/browsur.webp"
                alt="Career Opportunities"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
