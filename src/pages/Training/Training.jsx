import { useState, useEffect } from "react";
import "./training.css";

const TrainingPage = () => {
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch training data from JSON
    const fetchTrainings = async () => {
      try {
        const response = await fetch("/data/trainings.json");
        if (!response.ok) {
          throw new Error("Failed to fetch training data");
        }
        const data = await response.json();
        setTrainings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainings();
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
    const heroContent = document.querySelector(".latihan-hero-content");
    if (heroContent) {
      heroContent.classList.add("scroll-reveal");
      observer.observe(heroContent);
    }

    // Animasi untuk training cards
    const trainingCards = document.querySelectorAll(".latihan");
    trainingCards.forEach((card) => {
      card.classList.add("scroll-reveal", "staggered");
      observer.observe(card);
    });

    return () => {
      observer.disconnect();
    };
  }, [trainings]);

  return (
    <div className="training-page">
      {/* Hero Section */}
      <section className="latihan-hero-section">
        {/* Background Image */}
        <div className="latihan-hero-bg">
          <img
            src="/assets/image/image_training/baner_training.webp"
            alt="HVAC Background"
          />
        </div>

        {/* Blue Overlay */}
        <div className="latihan-hero-overlay"></div>

        {/* Content */}
        <div className="latihan-hero-container">
          <div className="latihan-hero-content">
            <h1 className="latihan-hero-title">
              Program Pelatihan HVAC Profesional
            </h1>
            <p className="latihan-hero-description">
              Tingkatkan skill dan pengetahuan Anda dalam bidang HVAC dengan
              program pelatihan komprehensif dari tim ahli kami.
            </p>
          </div>
        </div>
      </section>

      {/* Training Section */}
      <section className="latihan-section">
        <div className="latihan-grid">
          {loading ? (
            <div className="loading">
              <p>Loading training data...</p>
            </div>
          ) : error ? (
            <div className="error">
              <p>Error: {error}</p>
              <p>
                Periksa <code>public/data/training.json</code>
              </p>
            </div>
          ) : trainings.length === 0 ? (
            <div className="no-data">
              <p>
                Tidak ada data training. Periksa{" "}
                <code>public/data/training.json</code>.
              </p>
            </div>
          ) : (
            trainings.map((training, index) => (
              <div key={index} className="latihan">
                <div className="latihan-image">
                  <img
                    src={`/assets/image/image_training/${training.image}`}
                    alt={training.title}
                    onError={(e) => {
                      e.target.src = "/assets/image/placeholder.png";
                    }}
                  />
                </div>
                <div className="latihan-content">
                  <h3>{training.title}</h3>
                  <p>{training.description}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default TrainingPage;
