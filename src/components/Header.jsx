import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "./header.css";

export default function Header() {
  const location = useLocation();

  useEffect(() => {
    const mobileToggle = document.getElementById("mobileToggle");
    const mainNav = document.getElementById("mainNav");
    const headerEl = document.querySelector(".main-header");

    if (!mobileToggle || !mainNav || !headerEl) return;

    // Create overlay
    let overlay = document.getElementById("mobileOverlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "mobile-overlay";
      overlay.id = "mobileOverlay";
      document.body.appendChild(overlay);
    }

    function isMobile() {
      return window.innerWidth <= 968;
    }

    function toggleMenu() {
      if (!isMobile()) return;

      const isActive = mainNav.classList.toggle("active");
      mobileToggle.classList.toggle("active");
      overlay.classList.toggle("active");
      document.body.style.overflow = isActive ? "hidden" : "";
    }

    function closeMenu() {
      mobileToggle.classList.remove("active");
      mainNav.classList.remove("active");
      overlay.classList.remove("active");
      document.body.style.overflow = "";
    }

    function resetMenuForDesktop() {
      if (!isMobile()) {
        closeMenu();
        mainNav.removeAttribute("style");
        overlay.removeAttribute("style");
      }
    }

    // Click burger
    const handleToggleClick = (e) => {
      e.stopPropagation();
      toggleMenu();
    };
    mobileToggle.addEventListener("click", handleToggleClick);

    // Click overlay
    const handleOverlayClick = () => {
      closeMenu();
    };
    overlay.addEventListener("click", handleOverlayClick);

    // Click nav link auto close
    const navLinks = mainNav.querySelectorAll(".nav-link");
    const handleNavLinkClick = () => {
      if (isMobile()) {
        closeMenu();
      }
    };
    navLinks.forEach((link) => {
      link.addEventListener("click", handleNavLinkClick);
    });

    // Resize handler dengan debounce
    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resetMenuForDesktop();
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    // ============================================
    // SCROLL HEADER - VERSI DIPERBAIKI & DISEDERHANAKAN
    // ============================================
    let lastScrollY = window.scrollY;
    let isScrolling = false;

    const handleScroll = () => {
      if (isScrolling) return;
      
      isScrolling = true;
      
      requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const scrollDifference = currentScrollY - lastScrollY;
        
        // Cek apakah mobile menu sedang terbuka
        const isMobileMenuOpen = mainNav.classList.contains("active");
        
        // Jangan ubah header jika mobile menu terbuka
        if (!isMobileMenuOpen) {
          // Scroll DOWN - hide header (minimal sudah scroll 150px)
          if (scrollDifference > 0 && currentScrollY > 150) {
            headerEl.classList.add("header-hidden");
            headerEl.classList.remove("header-visible");
          }
          // Scroll UP - show header
          else if (scrollDifference < 0) {
            headerEl.classList.remove("header-hidden");
            headerEl.classList.add("header-visible");
          }
        }
        
        lastScrollY = currentScrollY;
        isScrolling = false;
      });
    };

    // Set initial state
    headerEl.classList.add("header-visible");
    
    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial check
    resetMenuForDesktop();

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      mobileToggle.removeEventListener("click", handleToggleClick);
      overlay.removeEventListener("click", handleOverlayClick);
      navLinks.forEach((link) => {
        link.removeEventListener("click", handleNavLinkClick);
      });
    };
  }, []);

  // Reset saat route berubah
  useEffect(() => {
    const mainNav = document.getElementById("mainNav");
    const mobileToggle = document.getElementById("mobileToggle");
    const overlay = document.getElementById("mobileOverlay");
    const headerEl = document.querySelector(".main-header");

    if (window.innerWidth <= 968 && mainNav) {
      mobileToggle?.classList.remove("active");
      mainNav.classList.remove("active");
      overlay?.classList.remove("active");
      document.body.style.overflow = "";
    }

    // Reset header visibility
    if (headerEl) {
      headerEl.classList.remove("header-hidden");
      headerEl.classList.add("header-visible");
    }

    // Scroll to top saat pindah halaman
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <header className="main-header">
      <div className="header-container">
        <div className="header-wrapper">
          <Link to="/" className="logo">
            <img
              src="/assets/image/logo-hitam.webp"
              alt="Logo"
              style={{ width: "200px" }}
            />
          </Link>

          <button
            className="mobile-toggle"
            id="mobileToggle"
            aria-label="Toggle menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>

          <nav className="main-nav" id="mainNav">
            <ul className="nav-list">
              <li>
                <Link to="/" className={`nav-link ${isActive("/")}`}>
                  HOME
                </Link>
              </li>
              <li>
                <Link to="/about" className={`nav-link ${isActive("/about")}`}>
                  ABOUT
                </Link>
              </li>
              <li>
                <Link
                  to="/equipment"
                  className={`nav-link ${isActive("/equipment")}`}
                >
                  EQUIPMENT
                </Link>
              </li>
              <li>
                <Link
                  to="/service"
                  className={`nav-link ${isActive("/service")}`}
                >
                  SERVICE
                </Link>
              </li>
              <li>
                <Link to="/blog" className={`nav-link ${isActive("/blog")}`}>
                  BLOG
                </Link>
              </li>
              <li>
                <Link
                  to="/training"
                  className={`nav-link ${isActive("/training")}`}
                >
                  TRAINING
                </Link>
              </li>
              <li>
                <Link to="/karir" className={`nav-link ${isActive("/karir")}`}>
                  CARIER
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`nav-link ${isActive("/contact")}`}
                >
                  CONTACT
                </Link>
              </li>
              <li>
                <Link
                  to="/user-guide"
                  className={`nav-link ${isActive("/user-guide")}`}
                >
                  USER GUIDE
                </Link>
              </li>
              <li>
                <a
                  href="https://play.google.com/store/apps/details?id=com.dikariapp.customer.twa"
                  className="btn-try-app"
                >
                  Try App
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}