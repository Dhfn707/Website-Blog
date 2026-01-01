import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./about.css";

export default function About() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    // Fetch partners data
    fetch("/data/about.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("about.json loaded:", data);
        // Support two shapes: either an array (existing file) or an object with `partners` array
        if (Array.isArray(data)) {
          setPartners(data);
        } else if (data.partners && Array.isArray(data.partners)) {
          setPartners(data.partners);
        } else {
          console.warn("Unexpected about.json structure:", data);
        }
      })
      .catch((error) => console.error("Error loading partners:", error));

    // Setup Intersection Observer untuk scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");

          // Untuk grid items (mission cards), tambahkan delay berdasarkan index
          if (entry.target.classList.contains("staggered")) {
            const index = Array.from(
              entry.target.parentElement.children
            ).indexOf(entry.target);
            entry.target.style.transitionDelay = `${index * 0.1}s`;
          }
        }
      });
    }, observerOptions);

    // Animasi untuk About Section - semua dari bawah
    const aboutSection = document.querySelector(".about-section");
    if (aboutSection) {
      const sectionTitle = aboutSection.querySelector(".section-title");
      const aboutImage = aboutSection.querySelector(".about-image");
      const aboutText = aboutSection.querySelector(".about-text");

      if (sectionTitle) {
        sectionTitle.classList.add("scroll-reveal");
        observer.observe(sectionTitle);
      }

      if (aboutImage) {
        aboutImage.classList.add("scroll-reveal");
        observer.observe(aboutImage);
      }

      if (aboutText) {
        aboutText.classList.add("scroll-reveal");
        observer.observe(aboutText);
      }
    }

    // Animasi untuk AC Dikari Section - semua dari bawah
    const acSection = document.querySelector(".ac-section");
    if (acSection) {
      const sectionTitle = acSection.querySelector(".section-title-center");
      const acText = acSection.querySelector(".ac-text");
      const acImage = acSection.querySelector(".ac-image");

      if (sectionTitle) {
        sectionTitle.classList.add("scroll-reveal");
        observer.observe(sectionTitle);
      }

      if (acText) {
        acText.classList.add("scroll-reveal");
        observer.observe(acText);
      }

      if (acImage) {
        acImage.classList.add("scroll-reveal");
        observer.observe(acImage);
      }
    }

    // Animasi untuk Vision & Mission Section - semua dari bawah
    const visionMissionSection = document.querySelector(
      ".vision-mission-section"
    );
    if (visionMissionSection) {
      // Vision Container
      const visionContainer =
        visionMissionSection.querySelector(".vision-container");
      if (visionContainer) {
        visionContainer.classList.add("scroll-reveal");
        observer.observe(visionContainer);

        // Animasi untuk konten di dalam vision container
        const visionText = visionContainer.querySelector(".vision-text");
        const visionImage = visionContainer.querySelector(".vision-image");

        if (visionText) {
          visionText.classList.add("scroll-reveal");
          observer.observe(visionText);
        }

        if (visionImage) {
          visionImage.classList.add("scroll-reveal");
          observer.observe(visionImage);
        }
      }

      // Mission Title
      const sectionVision =
        visionMissionSection.querySelector(".section-vision");
      if (sectionVision) {
        sectionVision.classList.add("scroll-reveal");
        observer.observe(sectionVision);
      }

      // Mission Cards dengan stagger effect - semua dari bawah
      const missionCards =
        visionMissionSection.querySelectorAll(".mission-card");
      missionCards.forEach((card) => {
        card.classList.add("scroll-reveal", "staggered");
        observer.observe(card);
      });
    }

    // Animasi untuk Partner Title
    const partnerSection = document.querySelector(".partner-section");
    if (partnerSection) {
      const partnerTitle = partnerSection.querySelector(".partner-title");
      if (partnerTitle) {
        partnerTitle.classList.add("scroll-reveal");
        observer.observe(partnerTitle);
      }
    }

    // Animasi awal untuk first section (About) - langsung muncul saat page load
    const firstSection = document.querySelector(".about-section");
    if (firstSection) {
      // Trigger animasi untuk elemen yang sudah terlihat di viewport saat page load
      setTimeout(() => {
        const firstSectionElements =
          firstSection.querySelectorAll(".scroll-reveal");
        firstSectionElements.forEach((element) => {
          const rect = element.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.classList.add("revealed");
          }
        });
      }, 100);
    }

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, []);

  // Animasi untuk Partner Cards setelah data dimuat
  useEffect(() => {
    if (partners.length === 0) return;

    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
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
    }, observerOptions);

    const partnerCards = document.querySelectorAll(".partner-card");
    partnerCards.forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [partners]);

  return (
    <>
      {/* Tentang Kami Section */}
      <section className="about-section">
        <div className="about-container">
          <div className="about-wrap">
            <div className="about-header">
              <h3 className="section-subtitle">Tentang Kami</h3>
              <h2
                className="section-title"
                style={{
                  color: "var(--primary-color)",
                  marginBottom: 20,
                }}
                >
                PT Dikari Tata Udara Indonesia
              </h2>
            </div>
            <div className="about-content">
              <div className="about-image">
                <img
                  src="/assets/image/image_about/penjelasan_dikari.webp"
                  alt="Teknisi AC"
                />
              </div>
              <div className="about-text">
                <p>
                  PT. Dikari Tata Udara Indonesia adalah perusahaan solusi HVAC
                  yang berdiri sejak Juli 2001 dan berpusat di Bogor, Jawa Barat.
                  Kami bergerak di bidang refrigerasi dan pendingin udara untuk
                  berbagai skala proyek di seluruh Indonesia.
                </p>
                <p>
                  Dengan pengalaman lebih dari 20 tahun, kami menyediakan layanan
                  perencanaan, pemasangan, audit, perbaikan, pemeliharaan, hingga
                  penyediaan tenaga kerja. Kami menangani semua jenis unit HVAC —
                  mulai dari AC, AHU, hingga Chiller (Mechanical & Absorption).
                </p>
                <p>
                  Kami membuka kerja sama dengan instansi dan perusahaan dalam
                  pengembangan, pemeliharaan, dan kontrak berjangka untuk barang,
                  jasa, maupun tenaga kerja. Selain itu, kami juga menawarkan jasa
                  audit energi guna mendukung efisiensi dan kepedulian lingkungan.
                </p>
                <p>
                  Sebagai penyedia solusi pendingin udara untuk industri dan
                  residensial, kami berkomitmen menghadirkan layanan terbaik
                  dengan sistem kerja modern, peralatan canggih, dan tenaga
                  profesional terpercaya.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tentang AC Dikari Section */}
      <section className="ac-section">
        <div className="ac-container">
          <h2 className="section-title-center">Tentang AC Dikari</h2>
          <div className="ac-content">
            <div className="ac-text">
              <p>
                AC Dikari lahir dari Management yang berkomitmen untuk
                memberikan layanan jasa terkait dengan AC yang umumnya digunakan
                di perumahan, kantor, dan Kampus/Sekolah bahkan Industri.
              </p>
              <p>
                Pada tahun 2024 AC Dikari mulai mengembangkan bisnis layanan AC
                dengan menggunakan platform aplikasi berbasis mobile dengan
                platform milik sendiri.
              </p>
              <p>
                Fokus kami adalah bagaimana memberikan layanan terbaik bagi
                Asset Anda berupa AC Split yang dimiliki oleh masyarakat pada
                umumnya.
              </p>
            </div>
            <div className="ac-image">
              <img
                src="/assets/image/image_about/tentang_acdikari.webp"
                alt="Aplikasi AC Dikari"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Visi & Misi Section */}
      <section className="vision-mission-section">
        <div className="vision-container">
          <div className="vision-content">
            <div className="vision-image">
              <img
                src="/assets/image/image_about/visi_dikari.webp"
                alt="Visi Perusahaan"
              />
            </div>
            <div className="vision-text">
              <h2 className="section-vision">Visi</h2>
              <p>
                Menjadi perusahaan penyedia solusi HVAC terpercaya di Indonesia
                yang memberikan layanan berkualitas tinggi, berorientasi pada
                kepuasan pelanggan, dan berkomitmen terhadap efisiensi energi
                serta keberlanjutan lingkungan.
              </p>
            </div>
          </div>
        </div>

        <div className="mission-container">
          <h2 className="section-title-center">Misi</h2>
          <div className="mission-grid">
            <div className="mission-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#42A3EF"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-snowflake"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M10 4l2 1l2 -1" />
                <path d="M12 2v6.5l3 1.72" />
                <path d="M17.928 6.268l.134 2.232l1.866 1.232" />
                <path d="M20.66 7l-5.629 3.25l.01 3.458" />
                <path d="M19.928 14.268l-1.866 1.232l-.134 2.232" />
                <path d="M20.66 17l-5.629 -3.25l-2.99 1.738" />
                <path d="M14 20l-2 -1l-2 1" />
                <path d="M12 22v-6.5l-3 -1.72" />
                <path d="M6.072 17.732l-.134 -2.232l-1.866 -1.232" />
                <path d="M3.34 17l5.629 -3.25l-.01 -3.458" />
                <path d="M4.072 9.732l1.866 -1.232l.134 -2.232" />
                <path d="M3.34 7l5.629 3.25l2.99 -1.738" />
              </svg>
              <h6>
                Menyediakan layanan HVAC yang profesional dan inovatif untuk
                setiap kebutuhan pelanggan.
              </h6>
            </div>
            <div className="mission-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                role="img"
                aria-hidden="true"
              >
                <defs>
                  <radialGradient
                    id="fireGradMission"
                    cx="45%"
                    cy="30%"
                    r="80%"
                  >
                    <stop offset="0%" stopColor="#ffd700" />
                    <stop offset="55%" stopColor="#ff8c00" />
                    <stop offset="100%" stopColor="#ff3b30" />
                  </radialGradient>
                </defs>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  fill="url(#fireGradMission)"
                  d="M10 2c0 -.88 1.056 -1.331 1.692 -.722c1.958 1.876 3.096 5.995 1.75 9.12l-.08 .174l.012 .003c.625 .133 1.203 -.43 2.303 -2.173l.14 -.224a1 1 0 0 1 1.582 -.153c1.334 1.435 2.601 4.377 2.601 6.27c0 4.265 -3.591 7.705 -8 7.705s-8 -3.44 -8 -7.706c0 -2.252 1.022 -4.716 2.632 -6.301l.605 -.589c.241 -.236 .434 -.43 .618 -.624c1.43 -1.512 2.145 -2.924 2.145 -4.78"
                />
              </svg>
              <h6>
                Menjamin kualitas pekerjaan dengan tenaga ahli bersertifikat dan
                standar kerja tinggi.
              </h6>
            </div>
            <div className="mission-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-compass"
                role="img"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="needleGrad" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ff3b30" />
                    <stop offset="100%" stopColor="#2B78FF" />
                  </linearGradient>
                </defs>
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M8 16l2 -6l6 -2l-2 6l-6 2"
                  fill="url(#needleGrad)"
                  stroke="none"
                />
                <path
                  d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"
                  stroke="#2B78FF"
                  fill="none"
                />
                <path d="M12 3l0 2" stroke="#2B78FF" />
                <path d="M12 19l0 2" stroke="#2B78FF" />
                <path d="M3 12l2 0" stroke="#2B78FF" />
                <path d="M19 12l2 0" stroke="#2B78FF" />
              </svg>
              <h6>
                Mendukung efisiensi energi serta penerapan teknologi ramah
                lingkungan di setiap proyek.
              </h6>
            </div>
            <div className="mission-card">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="40"
                height="40"
                viewBox="0 0 24 24"
                role="img"
                aria-label="Ikon petir kuning"
                className="icon-lightning"
              >
                <path d="M13 2 3 14h7l-1 8 10-12h-7l1-6z" fill="#FFD300" />
              </svg>
              <h6>
                Membangun tim yang solid, profesional, dan berintegritas untuk
                mencapai tujuan bersama.
              </h6>
            </div>
          </div>
        </div>
      </section>

      {/* Partner Section */}
      <section className="partner-section">
        <h2 className="partner-title">Mitra</h2>

        <div className="partner-grid">
          {partners.length > 0 ? (
            partners.map((partner, index) => (
              <div key={index} className="partner-card partner-center">
                <img
                  src={partner.image}
                  alt={partner.name}
                  className="partner-logo"
                />
              </div>
            ))
          ) : (
            <p>Memuat data mitra...</p>
          )}
        </div>
      </section>
    </>
  );
}
