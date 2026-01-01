import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import "../styles/AppLayout.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AppLayout() {
  const location = useLocation();

  // Reset scroll dan header saat route berubah
  useEffect(() => {
    window.scrollTo(0, 0);

    // Reset header visibility
    const headerEl = document.querySelector(".main-header");
    if (headerEl) {
      headerEl.classList.remove("header-hidden");
      headerEl.classList.add("header-visible");
    }

    // Trigger animation pada main content
    const mainContent = document.querySelector(".main-content");
    if (mainContent) {
      mainContent.classList.remove("content-visible");
      // Force reflow untuk trigger animasi ulang
      void mainContent.offsetWidth;
      mainContent.classList.add("content-visible");
    }
  }, [location.pathname]);

  useEffect(() => {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    });

    // Add animation on scroll
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver(function (entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("slide-up");
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document
      .querySelectorAll(".animate-on-scroll")
      .forEach((el) => observer.observe(el));

    // Back to top button
    const handleScroll = () => {
      const scrollTop = document.querySelector(".scroll-top");
      if (scrollTop) {
        if (window.pageYOffset > 300) {
          scrollTop.style.display = "flex";
        } else {
          scrollTop.style.display = "none";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <> 
      {/* Header Component */}
      <Header />

      {/* Main Content */}
      <main className="main-content fade-in">
        <Outlet />
      </main>

      {/* Footer Component */}
      <Footer />
    </>
  );
}
