import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./equipment.css";

export default function Equipment() {
  const [equipmentItems, setEquipmentItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [touchedIndex, setTouchedIndex] = useState(null);
  const touchTimeoutRef = useRef({});
  const pageSize = 9;

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

    // Mark that JS is enabled (used in CSS for fallback)
    // Guard access to `document` to avoid ReferenceError in non-browser environments
    if (
      typeof document !== "undefined" &&
      document.documentElement &&
      document.documentElement.classList &&
      typeof document.documentElement.classList.add === "function"
    ) {
      document.documentElement.classList.add("js-enabled");
    }

    // Smooth scroll untuk anchor links
    const handleAnchorClick = (e) => {
      const target = e.target.closest('a[href^="#"]');
      if (target) {
        const targetElement = document.querySelector(
          target.getAttribute("href")
        );
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      // Cleanup semua timeout saat component unmount
      Object.values(touchTimeoutRef.current).forEach((timeout) =>
        clearTimeout(timeout)
      );
      touchTimeoutRef.current = {};
    };
  }, []);

  // Scroll reveal animations
  useEffect(() => {
    // Setup Intersection Observer untuk scroll animations
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

    // Animasi untuk hero content
    const heroContent = document.querySelector(".barang-hero-content");
    if (heroContent) {
      heroContent.classList.add("scroll-reveal");
      observer.observe(heroContent);
    }

    // Animasi untuk equipment cards
    const equipmentCards = document.querySelectorAll(".equipment-card");
    equipmentCards.forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [equipmentItems]);

  const totalPages = Math.ceil(equipmentItems.length / pageSize);
  const startIndex = currentPage * pageSize;
  const endIndex = startIndex + pageSize;
  const currentItems = equipmentItems.slice(startIndex, endIndex);

  const goToPage = (page) => {
    const newPage = Math.max(0, Math.min(page, totalPages - 1));
    setCurrentPage(newPage);

    // Preserve scroll position
    const scrollY = window.scrollY || window.pageYOffset;
    requestAnimationFrame(() => window.scrollTo(0, scrollY));
  };

  const handlePrevClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    goToPage(currentPage - 1);
  };

  const handleNextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    goToPage(currentPage + 1);
  };

  const handleDotClick = (e, page) => {
    e.preventDefault();
    goToPage(page);
  };

  // TOUCH HANDLER - untuk perangkat tanpa cursor (mobile/tablet)
  // CATATAN: Ubah TOUCH_DURATION (4000) sesuai kebutuhan Anda (dalam millisecond)
  const TOUCH_DURATION = 4000; // 4 detik

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

  return (
    <>
      {/* Equipment Hero Section */}
      <section className="barang-hero-section">
        {/* Background Image */}
        <div className="barang-hero-bg">
          <img
            src="/assets/image/image_equipment/equipment_baner.png"
            alt="Equipment HVAC"
          />
        </div>

        {/* Blue Overlay */}
        <div className="barang-hero-overlay"></div>

        {/* Content */}
        <div className="barang-hero-container">
          <div className="barang-hero-content animate-on-scroll">
            <h1 className="barang-hero-title">
              Peralatan HVAC yang Kami Tangani
            </h1>
            <p className="barang-hero-description">
              Kami memiliki keahlian dalam menangani berbagai jenis peralatan
              HVAC. Tim teknisi profesional kami siap memberikan solusi terbaik
              untuk kebutuhan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Equipment Section */}
      <section className="equipment-section">
        <div className="equipment-container">
          {/* Equipment Items - Grid (2-2-1 Layout) */}
          {equipmentItems.length === 0 ? (
            <div className="equipment-no-data">
              <p>Memuat data peralatan...</p>
            </div>
          ) : (
            <div className="equipment-items">
              {currentItems.map((item, index) => (
                <div
                  key={startIndex + index}
                  className="equipment-card animate-on-scroll slide-up"
                  data-index={startIndex + index}
                  onMouseEnter={() => setHoveredIndex(startIndex + index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onTouchStart={() => handleCardTouch(startIndex + index)}
                >
                  <div className="card-image">
                    <img
                      src={`/assets/image/image_equipment/${
                        hoveredIndex === startIndex + index ||
                        touchedIndex === startIndex + index
                          ? item.imageGif
                          : item.image
                      }`}
                      alt={item.title}
                    />
                  </div>
                  <div className="card-body">
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="equipment-pager">
              <button
                type="button"
                className="pager-btn pager-prev"
                onClick={handlePrevClick}
                disabled={currentPage === 0}
              >
                ← Sebelumnya
              </button>

              <div className="pager-dots" id="pagerDots">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`pager-dot ${i === currentPage ? "active" : ""}`}
                    onClick={(e) => handleDotClick(e, i)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="pager-btn pager-next"
                onClick={handleNextClick}
                disabled={currentPage === totalPages - 1}
              >
                Selanjutnya →
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
