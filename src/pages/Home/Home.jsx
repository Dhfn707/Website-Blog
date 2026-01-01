import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./home.css";

export default function Home() {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [touchedIndex, setTouchedIndex] = useState(null);
  const touchTimeoutRef = useRef({});
  const TOUCH_DURATION = 4000; // 4 detik

  useEffect(() => {
    // Fetch equipment data
    fetch("/data/equipment.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("equipment.json loaded:", data);
        // Support array (existing file) or object with `equipmentItems` property
        if (Array.isArray(data)) {
          setEquipmentItems(data);
        } else if (data.equipmentItems && Array.isArray(data.equipmentItems)) {
          setEquipmentItems(data.equipmentItems);
        } else {
          console.warn("Unexpected equipment.json structure:", data);
        }
      })
      .catch((error) => console.error("Error loading equipment:", error));

    // Cleanup semua timeout saat component unmount
    return () => {
      Object.values(touchTimeoutRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      touchTimeoutRef.current = {};
    };
  }, []);

  const handleCardTouch = (index) => {
    // Set gambar menjadi GIF
    setTouchedIndex(index);

    // Hapus timeout lama jika ada
    if (touchTimeoutRef.current[index]) {
      clearTimeout(touchTimeoutRef.current[index]);
    }

    // Set timeout untuk kembali ke PNG setelah TOUCH_DURATION
    touchTimeoutRef.current[index] = setTimeout(() => {
      setTouchedIndex(null);
      delete touchTimeoutRef.current[index];
    }, TOUCH_DURATION);
  };

  useEffect(() => {
    // Animasi hero
    const heroElements = document.querySelectorAll(".hero-left > *");
    heroElements.forEach((el, i) => {
      el.classList.add("fade-in-up", `delay-${i + 1}`);
    });

    const heroIllustration = document.querySelector(".hero-illustration");
    heroIllustration?.classList.add("fade-in-up", "delay-3");

    // Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");

            if (entry.target.classList.contains("staggered")) {
              const index = Array.from(
                entry.target.parentElement.children
              ).indexOf(entry.target);
              entry.target.style.transitionDelay = `${index * 0.1}s`;
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    // Sections
    const sections = document.querySelectorAll(
      ".tentang-section, .solutions-section, .layanan-section, .features-section, .cta-section"
    );
    sections.forEach((sec) => {
      sec.classList.add("scroll-reveal");
      observer.observe(sec);
    });

    // About
    const aboutIllustration = document.querySelector(".tentang-illustration");
    const aboutContent = document.querySelector(".tentang-content");
    if (aboutIllustration) observer.observe(aboutIllustration);
    if (aboutContent) observer.observe(aboutContent);

    // Solutions
    document.querySelectorAll(".solution-card").forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    // Features
    document.querySelectorAll(".feature-card").forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    // CTA
    const ctaContainer = document.querySelector(".cta-container");
    if (ctaContainer) observer.observe(ctaContainer);
  }, []);

  return (
    <>
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-left">
              <div className="hero-card">
                <img
                  src="/assets/image/logo-putih.webp"
                  className="hero-logo"
                  alt=""
                />
              </div>

              <p className="hero-text">
                Untuk Kesejukan Dan Kenyamanan Keluarga Anda
              </p>

              <div className="hero-buttons">
                <a
                  href="https://play.google.com/store/apps/details?id=com.dikariapp.customer.twa"
                  className="button-try-app"
                >
                  Try App
                </a>
                <Link to="/user-guide" className="btn-user-guide">
                  User Guide
                </Link>
              </div>
            </div>

            <div className="hero-illustration">
              <img
                src="/assets/image/image_home/home_tron.jpg"
                className="banner-home"
                alt="banner_home"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="tentang-section">
        <div className="tentang-container">
          <div className="tentang-illustration">
            <img
              src="/assets/image/image_home/home_about.jpg"
              className="home_tentang"
              alt=""
            />
          </div>

          <div className="tentang-content">
            <div className="tentang-logo">
              <img
                className="img-tentang"
                src="/assets/image/logo_Dikari.png"
                alt=""
              />
            </div>

            <h2 className="tentang-title">
              PT DIKARI TATA UDARA INDONESIA, mempunyai solusi untuk HVAC.
            </h2>

            <p className="tentang-description" style={{ width: "90%" }}>
              Kami didirikan pada bulan Juli 2001 dan berpusat di Bogor, Jawa
              Barat, berfokus pada sistem refrigerasi dan pendingin udara.
            </p>

            <Link to="/about" className="btn-tentang">
              About us →
            </Link>
          </div>
        </div>
      </section>

      {/* SOLUTIONS SECTION */}
      <section className="solutions-section">
        <div className="solutions-container">
          <h2
            className="section-title"
            style={{ color: "var(--secondary-color)", marginBottom: 50 }}
          >
            Peralatan yang ditangani
          </h2>

          {equipmentItems.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "40px 20px",
                color: "var(--secondary-color)",
              }}
            >
              <p>Memuat data peralatan...</p>
            </div>
          ) : (
            <div className="solutions-grid">
              {equipmentItems.slice(0, 6).map((item, index) => (
                <div
                  key={index}
                  className="solution-card"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => handleCardTouch(index)}
                >
                  <div className="solution-main-content">
                    <img
                      src={`/assets/image/image_equipment/${
                        hoveredIndex === index || touchedIndex === index
                          ? item.imageGif
                          : item.image
                      }`}
                      className="solution-img"
                      alt={item.title}
                    />
                    <div className="solution-bottom">
                      <h3>{item.title}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <center>
        <Link
          to="/equipment"
          className="btn-service"
          style={{
            textAlign: "center",
            color: "var(--primary-dark)",
            fontSize: 20,
            padding: "10px 50px 10px",
            fontWeight: "bold",
          }}
        >
          Lihat Selengkapnya →
        </Link>
      </center>

      {/* SERVICE TITLE */}
      <p
        style={{
          textAlign: "center",
          fontSize: 30,
          fontWeight: "bold",
          marginTop: 80,
        }}
      >
        Menyediakan Layanan
      </p>

      {/* SERVICE SECTION */}
      <section className="layanan-section">
        <div className="layanan-grid">
          <div className="layanan-box">
            <div className="layanan-header">
              <span className="num">1.</span>
              <img
                width="80"
                src="https://img.icons8.com/ios-glyphs/30/broom.png"
                alt=""
              />
            </div>
            <h3 style={{ textAlign: "left", margin: "0 0 10px 0" }}>
              Pembersihan Reguler
            </h3>
            <p>Pembersihan rutin unit indoor & outdoor.</p>
          </div>

          <div className="layanan-box">
            <div className="layanan-header">
              <span className="num">2.</span>
              <img
                width="80"
                src="https://img.icons8.com/external-glyph-icons-maxicons/85/external-chemical-types-of-science-glyph-glyph-icons-maxicons.png"
                alt=""
              />
            </div>
            <h3 style={{ textAlign: "left", margin: "0 0 10px 0" }}>
              Pembersihan Mendalam
            </h3>
            <p>Pembersihan menggunakan bahan kimia dan mekanis.</p>
          </div>

          <div className="layanan-box">
            <div className="layanan-header">
              <span className="num">3.</span>
              <img
                width="80"
                src="https://img.icons8.com/ios-filled/50/worker-male.png"
                alt=""
              />
            </div>
            <h3 style={{ textAlign: "left", margin: "0 0 10px 0" }}>
              Tenaga Ahli AC
            </h3>
            <p>Teknisi profesional untuk instalasi & perawatan.</p>
          </div>
        </div>
      </section>
      <center>
        <Link
          to="/service"
          className="lihat-layanan"
          style={{
            textAlign: "center",
            color: "var(--primary-dark)",
            fontSize: 16,
            fontWeight: "bold",
            marginTop: 20,
          }}
        >
          Lihat Selengkapnya →
        </Link>
      </center>

      {/* FEATURES SECTION */}
      <section className="features-section">
        <div className="features-container">
          <h2
            className="section-title"
            style={{ color: "var(--secondary-color)", marginBottom: 50 }}
          >
            Fitur Aplikasi AC Dikari
          </h2>

          <div className="feature-grid">
            {/* 1 */}
            <div className="feature-card">
              <div className="feature-icon blue">
                <img
                  src="/assets/image/image_home/icon_memesan.webp"
                  className="icon-card"
                  alt=""
                />
              </div>
              <h3 style={{ color: "var(--primary-color)", marginBottom: 20 }}>
                Memesan layanan dengan mudah
              </h3>
              <p
                style={{
                  color: "var(--primary-color)",
                  marginBottom: 50,
                  textAlign: "center",
                }}
              >
                Pesan layanan HVAC dengan cepat melalui aplikasi.
              </p>
              <Link to="/user-guide" className="feature-link">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" />
                  <path
                    d="M10 8l4 4-4 4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>

            {/* 2 */}
            <div className="feature-card">
              <div className="feature-icon blue">
                <img
                  src="/assets/image/image_home/icon_jadwal.webp"
                  className="icon-card"
                  alt=""
                />
              </div>
              <h3 style={{ color: "var(--primary-color)", marginBottom: 20 }}>
                Menentukan jadwal dan lokasi
              </h3>
              <p
                style={{
                  color: "var(--primary-color)",
                  marginBottom: 50,
                  textAlign: "center",
                }}
              >
                Tentukan sendiri waktu dan lokasi layanan.
              </p>
              <Link to="/user-guide" className="feature-link">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" />
                  <path
                    d="M10 8l4 4-4 4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>

            {/* 3 */}
            <div className="feature-card">
              <div className="feature-icon blue">
                <img
                  src="/assets/image/image_home/icon_teknisi.webp"
                  className="icon-card"
                  alt=""
                />
              </div>
              <h3 style={{ color: "var(--primary-color)", marginBottom: 20 }}>
                Mendapat teknisi profesional
              </h3>
              <p
                style={{
                  color: "var(--primary-color)",
                  marginBottom: 50,
                  textAlign: "center",
                }}
              >
                Teknisi berpengalaman & bersertifikat.
              </p>
              <Link to="/user-guide" className="feature-link">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" />
                  <path
                    d="M10 8l4 4-4 4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>

            {/* 4 */}
            <div className="feature-card">
              <div className="feature-icon blue">
                <img
                  src="/assets/image/image_home/icon_harga.webp"
                  className="icon-card"
                  alt=""
                />
              </div>
              <h3 style={{ color: "var(--primary-color)", marginBottom: 20 }}>
                Transparan mengenai harga
              </h3>
              <p
                style={{
                  color: "var(--primary-color)",
                  marginBottom: 50,
                  textAlign: "center",
                }}
              >
                Harga jelas dan transparan tanpa biaya tersembunyi.
              </p>
              <Link to="/user-guide" className="feature-link">
                <svg viewBox="0 0 24 24" width="40" height="40">
                  <circle cx="12" cy="12" r="10" fill="#2196F3" />
                  <path
                    d="M10 8l4 4-4 4"
                    stroke="white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="cta-container">
          <h2 className="cta-title">Siap Merasakan Kenyamanan Maksimal?</h2>
          <p className="cta-text">
            Download aplikasi kami sekarang dan nikmati layanan HVAC profesional
            dengan mudah.
          </p>

          <div className="cta-buttons">
            <a
              href="https://play.google.com/store/apps/details?id=com.dikariapp.customer.twa"
              className="btn-download"
            >
              Download App
            </a>
            <Link to="/contact" className="btn-contact-us">
              Hubungi Kami
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
