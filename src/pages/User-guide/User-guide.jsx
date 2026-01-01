import React, { useState, useEffect, useRef } from "react";
import "./user-guide.css"; // Anda perlu memindahkan CSS dari user-guide.css

const UserGuide = () => {
  const [activeTab, setActiveTab] = useState("tutorial");
  const [searchQuery, setSearchQuery] = useState("");
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(false);
  const tabContainerRef = useRef(null);
  const tabButtonsRef = useRef({});
  const videoControlsTimeoutRef = useRef(null);
  const videoRef = useRef(null);

  // Move indicator function
  const moveIndicator = (buttonElement) => {
    if (!buttonElement || !tabContainerRef.current) return;

    const buttonRect = buttonElement.getBoundingClientRect();
    const containerRect = tabContainerRef.current.getBoundingClientRect();

    setIndicatorStyle({
      left: `${buttonRect.left - containerRect.left}px`,
      width: `${buttonRect.width}px`,
    });
  };

  // Initialize and handle resize
  useEffect(() => {
    const activeButton = tabButtonsRef.current[activeTab];
    if (activeButton) {
      moveIndicator(activeButton);
    }

    const handleResize = () => {
      const activeButton = tabButtonsRef.current[activeTab];
      if (activeButton) {
        moveIndicator(activeButton);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeTab]);

  // Scroll shadow effect
  useEffect(() => {
    const handleScroll = () => {
      const tabNav = document.getElementById("tabNav");
      if (tabNav) {
        if (window.pageYOffset > 100) {
          tabNav.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.15)";
        } else {
          tabNav.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Scroll animations observer
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = "1";
          entry.target.style.transform = "translateY(0)";
        }
      });
    }, observerOptions);

    const elements = document.querySelectorAll(
      ".step-card, .feature-box, .order-step-card"
    );
    elements.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [activeTab]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const button = tabButtonsRef.current[tab];
    if (button) {
      moveIndicator(button);
    }
  };

  const handleTabHover = (tab) => {
    const button = tabButtonsRef.current[tab];
    if (button && activeTab !== tab) {
      moveIndicator(button);
    }
  };

  const handleTabLeave = () => {
    const activeButton = tabButtonsRef.current[activeTab];
    if (activeButton) {
      moveIndicator(activeButton);
    }
  };

  const performSearch = () => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) {
      alert("Silakan masukkan kata kunci pencarian");
      return;
    }

    let found = false;
    let foundElement = null;
    let foundTab = null;

    // Search logic (simplified for demo)
    const sections = {
      tutorial: document.getElementById("tutorial-content"),
      order: document.getElementById("order-content"),
      professional: document.getElementById("professional-content"),
    };

    for (const [tab, section] of Object.entries(sections)) {
      if (section && section.textContent.toLowerCase().includes(query)) {
        found = true;
        foundTab = tab;
        foundElement = section.querySelector(
          ".step-card, .order-step-card, .feature-box"
        );
        break;
      }
    }

    if (found && foundElement && foundTab) {
      setActiveTab(foundTab);

      setTimeout(() => {
        const originalBackground = foundElement.style.background;
        const originalTransform = foundElement.style.transform;

        if (foundTab === "tutorial") {
          foundElement.style.background = "rgba(255, 255, 255, 0.35)";
        } else if (foundTab === "professional") {
          foundElement.style.background = "#e3f2fd";
        }
        foundElement.style.transform = "scale(1.02)";

        foundElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        setTimeout(() => {
          foundElement.style.background = originalBackground;
          foundElement.style.transform = originalTransform;
        }, 2000);
      }, 500);

      setSearchQuery("");
    } else {
      alert(
        `Hasil untuk "${query}" tidak ditemukan. Silakan coba kata kunci lain.`
      );
    }
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  // Listen to video play/pause events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
    };
  }, []);

  // Video Controls - Maju/Mundur 10 detik
  const handleVideoForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleVideoBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(
        0,
        videoRef.current.currentTime - 10
      );
    }
  };

  // Handle video container click/touch to show/hide controls
  const handleVideoContainerInteraction = () => {
    setShowControls(true);

    // Auto-hide controls after 3 seconds on mobile
    if (videoControlsTimeoutRef.current) {
      clearTimeout(videoControlsTimeoutRef.current);
    }

    videoControlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  return (
    <div className="user-guide-page">
      {/* Hero Section */}
      <section className="guide-hero-section">
        <div className="guide-hero-bg">
          <img
            src="/assets/image/image_user-guide/user_guide.png"
            alt="HVAC Background"
          />
        </div>
        <div className="guide-hero-overlay"></div>
        <div className="guide-hero-container">
          <div className="guide-hero-content">
            <h1 className="guide-hero-title">Cara Penggunaan Aplikasi ACD</h1>
            <p className="guide-hero-description">
              Kami akan membantu Anda dalam mengoperasikan Aplikasi kami, agar
              anda dapat memesan layanan kami dengan baik dan benar.
            </p>

            {/* Search Bar */}
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Cari panduan atau pertanyaan"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
              />
              <button className="search-button" onClick={performSearch}>
                <p>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <line
                      x1="16.6569"
                      y1="16.6569"
                      x2="21"
                      y2="21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </p>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="tab-navigation-section" id="tabNav">
        <div
          className="tab-container"
          ref={tabContainerRef}
          onMouseLeave={handleTabLeave}
        >
          <div className="tab-indicator" style={indicatorStyle}></div>

          <button
            ref={(el) => (tabButtonsRef.current["tutorial"] = el)}
            className={`tab-button ${activeTab === "tutorial" ? "active" : ""}`}
            onClick={() => handleTabClick("tutorial")}
            onMouseEnter={() => handleTabHover("tutorial")}
          >
            <svg
              className="tab-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M12 14L12 16M12 8V10M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Tutorial Login</span>
          </button>

          <button
            ref={(el) => (tabButtonsRef.current["order"] = el)}
            className={`tab-button ${activeTab === "order" ? "active" : ""}`}
            onClick={() => handleTabClick("order")}
            onMouseEnter={() => handleTabHover("order")}
          >
            <svg
              className="tab-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L20 21H4L5 9Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Cara Memesan</span>
          </button>

          <button
            ref={(el) => (tabButtonsRef.current["professional"] = el)}
            className={`tab-button ${
              activeTab === "professional" ? "active" : ""
            }`}
            onClick={() => handleTabClick("professional")}
            onMouseEnter={() => handleTabHover("professional")}
          >
            <svg
              className="tab-icon"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span>Teknisi Profesional</span>
          </button>
        </div>
      </section>

      {/* Tutorial Login Content */}
      <section
        className={`content-section ${
          activeTab === "tutorial" ? "active" : ""
        }`}
        id="tutorial-content"
      >
        <div className="content-container">
          <div className="steps-section">
            <h2 className="steps-title">Langkah-langkah Login</h2>
            <p className="steps-subtitle">Proses login yang mudah dan cepat</p>

            <div className="steps-container">
              <div className="step-card">
                <div className="step-number-circle">
                  <span className="step-number">1</span>
                </div>
                <div className="step-content-wrapper">
                  <h4 className="step-title">Download Aplikasi AC Dikari</h4>
                  <p className="step-description">
                    Download aplikasi AC Dikari dari Google Play Store
                    (Android).
                  </p>
                </div>
                <img
                  src="/assets/image/image_user-guide/playstore_acd.jpg"
                  alt=""
                  className="step-image-placeholder"
                />
              </div>

              <div className="step-card">
                <div className="step-number-circle">
                  <span className="step-number">2</span>
                </div>
                <div className="step-content-wrapper">
                  <h4 className="step-title">Buka Aplikasi ACD</h4>
                  <p className="step-description">
                    Setelah berhasil terinstall, buka aplikasi AC Dikari. Klik
                    tombol Login sekarang untuk melanjutkan
                  </p>
                </div>
                <img
                  src="/assets/image/image_user-guide/sign_in.jpg"
                  alt=""
                  className="step-image-placeholder"
                />
              </div>

              <div className="step-card">
                <div className="step-number-circle">
                  <span className="step-number">3</span>
                </div>
                <div className="step-content-wrapper">
                  <h4 className="step-title">Masukkan Alamat Gmail</h4>
                  <p className="step-description">
                    Setelah aplikasi terbuka, Masuk dengan gmail Anda terlebih
                    dahulu
                  </p>
                </div>
                <img
                  src="/assets/image/image_user-guide/with_email.jpg"
                  alt=""
                  className="step-image-placeholder"
                />
              </div>

              <div className="step-card">
                <div className="step-number-circle">
                  <span className="step-number">4</span>
                </div>
                <div className="step-content-wrapper">
                  <h4 className="step-title">Berhasil Login!</h4>
                  <p className="step-description">
                    Setelah Anda berhasil login, anda akan dibawa ke Aplikasi AC
                    Dikari. <br />
                    Sekarang Anda dapat memesan layanan kami
                  </p>
                </div>
                <img
                  src="/assets/image/image_user-guide/setelah_login.jpg"
                  alt=""
                  className="step-image-placeholder"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cara Memesan Content */}
      <section
        className={`content-section ${activeTab === "order" ? "active" : ""}`}
        id="order-content"
      >
        <div className="content-container">
          {/* Video Tutorial */}
          <div className="video-tutorial-card">
            <div
              className="video-placeholder"
              onClick={handleVideoContainerInteraction}
              onTouchStart={handleVideoContainerInteraction}
            >
              <div className="video-container">
                <video
                  ref={videoRef}
                  width="100%"
                  height="auto"
                  controls
                  style={{ borderRadius: "12px" }}
                >
                  <source
                    src="/assets/image/image_user-guide/tutorial.mp4"
                    type="video/mp4"
                  />
                  <p>
                    Browser Anda tidak mendukung video HTML5. Kunjungi video ini
                    di{" "}
                    <a
                      href="https://youtube.com/shorts/Z8_0IPHaKaI?si=El5O5too_15zSv1q"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2175f3", textDecoration: "underline" }}
                    >
                      YouTube
                    </a>
                  </p>
                </video>
                <div
                  className={`video-controls ${showControls ? "visible" : ""}`}
                >
                  <button
                    className="video-btn video-rewind"
                    onClick={handleVideoBackward}
                    title="Mundur 10 detik"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                      <path d="M7.5 7.5c-1.5 1.5-2.5 3.5-2.5 5.5" />
                    </svg>
                    <span>10s</span>
                  </button>

                  <button
                    className="video-btn video-play-pause"
                    onClick={() => {
                      if (videoRef.current) {
                        if (videoRef.current.paused) {
                          videoRef.current.play();
                        } else {
                          videoRef.current.pause();
                        }
                      }
                    }}
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <rect x="6" y="4" width="4" height="16" />
                        <rect x="14" y="4" width="4" height="16" />
                      </svg>
                    ) : (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        stroke="none"
                      >
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    )}
                  </button>

                  <button
                    className="video-btn video-forward"
                    onClick={handleVideoForward}
                    title="Maju 10 detik"
                  >
                    <span>10s</span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                      <path d="M16.5 7.5c1.5 1.5 2.5 3.5 2.5 5.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div className="video-info">
              <h3>Cara Memesan Di Aplikasi AC Dikari</h3>
              <p style={{ textAlign: "left" }}>
                Ikuti langkah-langkah dibawah ini untuk menggunakan aplikasi
                dengan fitur-fitur aplikasi Dikari
              </p>
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Pilih jasa/layanan yang Anda butuhkan</h2>
              <p style={{ textAlign: "left" }}>
                Temukan layanan yang sesuai dengan kebutuhan anda, mulai dari
                cuci regular, cuci fast, dll. cukup anda klik layanan yang anda
                butuhkan untuk ke tahap selanjutnya.
              </p>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/test.jpg"
                alt="Service Selection"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Tambahkan alamat dan kontak anda</h2>
              <ol>
                <li>
                  Tambahkan nama dan kontak baru anda yang aktif yang dapat
                  dihubungi teknisi kami.
                </li>
                <li>
                  Tambahkan alamat lengkap lokasi layanan agar tim kami bisa
                  datang tepat waktu ke tempat Anda.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/test_2.jpg"
                alt="Contact Form"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Pilih kapasitas AC yang anda butuhkan</h2>
              <ol>
                <li>
                  Pilih kapasitas AC sesuai kebutuhan ruangan Anda — tersedia
                  mulai dari 0.5 PK hingga 2.5 PK.
                </li>
                <li>
                  Pastikan jumlah unit dan jenis layanan sudah sesuai sebelum
                  melanjutkan ke tahap berikutnya.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/layanan pasang baru ac.jpg"
                alt="Capacity Selection"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Tentukan jadwal yang anda inginkan</h2>
              <ol>
                <li>
                  Pilih tanggal dan jam kunjungan sesuai dengan waktu yang anda
                  tentuka.
                </li>
                <li>
                  Pastikan jadwal yang dipilih sudah sesuai agar teknisi kami
                  dapat datang tepat waktu ke lokasi Anda.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/test_3.jpg"
                alt="Schedule Selection"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Selesaikan pembayaran anda</h2>
              <ol>
                <li>
                  Periksa kembali detail pesanan, alamat, dan total biaya
                  layanan sebelum melakukan pembayaran.
                </li>
                <li>
                  Pilih metode pembayaran yang Anda inginkan, seperti transfer
                  bank, e-wallet, dll.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/pembayaran.jpg"
                alt="Payment"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Keranjang pesanan anda</h2>
              <ol>
                <li>
                  Semua layanan yang telah Anda pilih akan tersimpan di
                  keranjang pesanan.
                </li>
                <li>
                  Periksa kembali detail layanan, jumlah unit, dan total harga
                  sebelum melanjutkan ke tahap pembayaran.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/keranjang.jpg"
                alt="Cart"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Tracking status pesanan</h2>
              <ol>
                <li>
                  Pantau progres pesanan Anda secara real-time mulai dari
                  konfirmasi, penjadwalan, hingga teknisi tiba di lokasi.
                </li>
                <li>
                  Dengan fitur ini, Anda dapat memastikan setiap langkah layanan
                  berjalan dengan lancar tanpa harus menghubungi admin.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/tracking pesanan.jpg"
                alt="Tracking"
              />
            </div>
          </div>

          <div className="order-step-card">
            <div className="order-step-header">
              <h2>Profil pengguna</h2>
              <ol>
                <li>
                  Kelola data pribadi Anda seperti nama, nomor telepon, dan
                  alamat dengan mudah di menu profil.
                </li>
                <li>
                  Akses riwayat pesanan, pusat bantuan, dan pengaturan akun
                  untuk pengalaman layanan yang lebih nyaman.
                </li>
              </ol>
            </div>
            <div className="order-preview-box">
              <img
                src="/assets/image/image_user-guide/profil penguna .jpg"
                alt="Profile"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Teknisi Professional Content */}
      <section
        className={`content-section ${
          activeTab === "professional" ? "active" : ""
        }`}
        id="professional-content"
      >
        <div className="content-container">
          <div className="professional-hero">
            <div className="professional-illustration">
              <img
                src="/assets/image/image_user-guide/teknisi ac.jpg"
                alt="Teknisi"
              />
            </div>
            <div className="professional-content">
              <h2>Teknisi Profesional</h2>
              <p>
                Setelah Anda memesan layanan melalui aplikasi AC Dikari, teknisi
                profesional kami akan segera datang sesuai waktu dan lokasi yang
                telah Anda tentukan. Kami memastikan setiap pekerjaan dilakukan
                tepat waktu, rapi, dan dengan standar kualitas terbaik.
              </p>
            </div>
          </div>

          <div className="features-grid">
            <div className="feature-box">
              <div className="feature-icon-circle">
                <svg
                  className="feature-icon-svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 14l9-5-9-5-9 5 9 5z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Bersertifikat & Berpengalaman</h4>
                <p>
                  Semua teknisi kami telah melewati pelatihan khusus dan
                  memiliki sertifikasi resmi di bidangnya
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle">
                <svg
                  className="feature-icon-svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Terpercaya & Aman</h4>
                <p>
                  Kami menjamin keamanan dan privasi Anda selama proses
                  perbaikan berlangsung
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle">
                <svg
                  className="feature-icon-svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <path d="M12 6v6l4 2" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Tepat Waktu</h4>
                <p>
                  Teknisi kami berkomitmen untuk datang sesuai jadwal yang telah
                  disepakati dengan Anda
                </p>
              </div>
            </div>

            <div className="feature-box">
              <div className="feature-icon-circle">
                <svg
                  className="feature-icon-svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="feature-content">
                <h4>Hasil Terjamin</h4>
                <p>
                  Pekerjaan kami dilindungi garansi untuk memastikan kepuasan
                  Anda
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UserGuide;
