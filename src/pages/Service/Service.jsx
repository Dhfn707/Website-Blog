import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import "./service.css";

export default function Service() {
  const [services, setServices] = useState([]);
  const [activeModal, setActiveModal] = useState(null);
  const cardRefs = useRef({});

  useEffect(() => {
    // Fetch services data (support both /data/service.json and /data/data.json)
    fetch("/data/data.json")
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
      })
      .then((data) => {
        console.log("services loaded:", data);
        // support two shapes: object with `services` or array directly
        if (Array.isArray(data)) {
          setServices(data);
        } else if (data.services && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          console.warn("Unexpected services structure:", data);
        }
      })
      .catch((error) => console.error("Error loading services:", error));
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
    const heroContent = document.querySelector(".service-hero-content");
    if (heroContent) {
      heroContent.classList.add("scroll-reveal");
      observer.observe(heroContent);
    }

    // Animasi untuk service cards
    const serviceCards = document.querySelectorAll(".service-box");
    serviceCards.forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [services]);

  const handleCardClick = (e, serviceId) => {
    e.stopPropagation();

    const card = cardRefs.current[serviceId];
    if (!card) return;

    const modalContent = card.querySelector(".modal-content");
    if (!modalContent) return;

    const modal = card.querySelector(".modal-overlay");
    if (!modal) return;

    // Simpan tinggi card original
    const cardRect = card.getBoundingClientRect();

    // Tampilkan modal hidden untuk measure tinggi
    modal.style.visibility = "hidden";
    modal.style.display = "flex";

    const contentHeight = modalContent.scrollHeight;

    modal.style.visibility = "";
    modal.style.display = "";

    // Hitung tinggi target
    const targetHeight = Math.max(contentHeight + 80, cardRect.height);

    // Set tinggi awal
    card.style.height = cardRect.height + "px";
    card.style.minHeight = cardRect.height + "px";

    // Set active modal
    setActiveModal(serviceId);

    // Animasi
    requestAnimationFrame(() => {
      card.classList.add("card-open");
      card.style.height = targetHeight + "px";
      card.style.minHeight = targetHeight + "px";

      requestAnimationFrame(() => {
        void modalContent.offsetWidth;
        modalContent.classList.add("card-active");
      });
    });
  };

  const closeModal = (e, serviceId) => {
    if (e) {
      e.stopPropagation();
    }

    const card = cardRefs.current[serviceId];
    if (!card) return;

    const Modal = card.querySelector(".modal-overlay");
    const modalContent = card.querySelector(".modal-content");

    if (modalContent) {
      modalContent.classList.remove("card-active");
    }

    requestAnimationFrame(() => {
      card.classList.remove("card-open");
      card.style.height = "";
      card.style.minHeight = "";

      // Reset active modal setelah animasi
      setTimeout(() => {
        setActiveModal(null);
      }, 420);
    });
  };

  const handleModalContentClick = (e, serviceId) => {
    e.stopPropagation();
    closeModal(e, serviceId);
  };

  return (
    <>
      {/* Service Hero Section */}
      <section className="service-hero-section">
        {/* Background Image */}
        <div className="service-hero-bg">
          <img
            src="/assets/image/image_service/service_banner.webp"
            alt="HVAC Background"
          />
        </div>

        {/* Blue Overlay */}
        <div className="service-hero-overlay"></div>

        {/* Content */}
        <div className="service-hero-container">
          <div className="service-hero-content">
            <h1 className="service-hero-title">
              Menyediakan jasa Untuk HVAC
            </h1>
            <p className="service-hero-description">
              Kami mempunyai solusi untuk masalah HVAC anda. Tim teknisi
              profesional kami siap datang dan memastikan udara sejuk kembali ke
              ruangan Anda.
            </p>
          </div>
        </div>
      </section>

      {/* Service Section */}
      <section className="service-section">
        <div className="service-grid">
          {services.length === 0 ? (
            <p>Memuat data layanan...</p>
          ) : (
            services.map((svc) => (
              <div
                key={svc.id}
                className={`service-box product-card ${
                  activeModal === svc.id ? "card-open" : ""
                }`}
                ref={(el) => (cardRefs.current[svc.id] = el)}
                onClick={(e) => handleCardClick(e, svc.id)}
                data-modal={`modal-${svc.id}`}
              >
                <div className="service-header">
                  <span className="num">{svc.id}.</span>
                  {svc.icon &&
                    (svc.icon.startsWith("svg:") ? (
                      <img
                        width="36"
                        height="36"
                        src="/assets/image/icons/default.svg"
                        alt="icon"
                      />
                    ) : (
                      <img
                        width="80"
                        height="80"
                        src={svc.icon}
                        alt={svc.title}
                      />
                    ))}
                </div>
                <h3>{svc.title}</h3>
                <p>{svc.description}</p>

                {/* Modal Overlay */}
                {svc.details && (
                  <div
                    className={`modal-overlay ${
                      activeModal === svc.id ? "active card-modal" : ""
                    }`}
                    id={`modal-${svc.id}`}
                  >
                    <div
                      className={`modal-content ${
                        activeModal === svc.id ? "card-active" : ""
                      }`}
                      onClick={(e) => handleModalContentClick(e, svc.id)}
                    >
                      <button
                        className="modal-close"
                        onClick={(e) => closeModal(e, svc.id)}
                      >
                        ×
                      </button>
                      <h2>{svc.title}</h2>
                      <div className="modal-body">
                        {svc.details.map((detail, index) => (
                          <div key={index} className="detail-item">
                            <h4>{detail.subtitle}</h4>
                            <p>{detail.content}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}
