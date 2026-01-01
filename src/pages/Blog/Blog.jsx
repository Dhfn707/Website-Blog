import { useState, useEffect, useRef } from "react";
import "./blog.css";

const Blog = () => {
  const [blogs, setBlogs] = useState({ featured: [], posts: [] });
  const [activeCategory, setActiveCategory] = useState("pengetahuan");
  const [featuredContent, setFeaturedContent] = useState({});
  const [reviews, setReviews] = useState([]);
  const [transitionDirection, setTransitionDirection] = useState(null);
  
  const sliderRef = useRef(null);
  const categoriesWrapperRef = useRef(null);
  const indicatorRef = useRef(null);
  const prevCategoryRef = useRef("pengetahuan");

  // Fetch blog data
  useEffect(() => {
    fetch("/data/blogs.json")
      .then((response) => response.json())
      .then((data) => {
        setBlogs({
          featured: data.featured || [],
          posts: data.posts || [],
        });
        setFeaturedContent(data.featuredContent || {});
        setReviews(data.reviews || []);
      })
      .catch((error) => console.error("Error loading blog:", error));
  }, []);

  // Hero Carousel Setup
  useEffect(() => {
    const slides = sliderRef.current?.querySelectorAll(".slide");
    if (!slides || slides.length === 0) return;

    let currentIndex = 1;
    let autoSlideInterval;
    const slideInterval = 2300;

    const updateSlides = () => {
      slides.forEach((slide, index) => {
        slide.classList.remove("prev", "active", "next", "hidden");

        if (index === currentIndex) {
          slide.classList.add("active");
        } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
          slide.classList.add("prev");
        } else if (index === (currentIndex + 1) % slides.length) {
          slide.classList.add("next");
        } else {
          slide.classList.add("hidden");
        }
      });
    };

    const nextSlide = () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateSlides();
    };

    const prevSlide = () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateSlides();
    };

    const startAutoSlide = () => {
      autoSlideInterval = setInterval(nextSlide, slideInterval);
    };

    const stopAutoSlide = () => {
      clearInterval(autoSlideInterval);
    };

    const restartAutoSlide = () => {
      stopAutoSlide();
      startAutoSlide();
    };

    // Click handler
    slides.forEach((slide, index) => {
      slide.addEventListener("click", function (e) {
        if (!slide.classList.contains("active")) {
          e.preventDefault();
          currentIndex = index;
          updateSlides();
          restartAutoSlide();
        }
      });
    });

    // Hover handlers
    const slider = sliderRef.current;
    if (slider) {
      slider.addEventListener("mouseenter", stopAutoSlide);
      slider.addEventListener("mouseleave", startAutoSlide);
    }

    // Touch handlers
    let touchStartX = 0;
    let touchEndX = 0;

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
    };

    if (slider) {
      slider.addEventListener(
        "touchstart",
        (e) => {
          touchStartX = e.changedTouches[0].screenX;
          stopAutoSlide();
        },
        { passive: true }
      );

      slider.addEventListener(
        "touchend",
        (e) => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe();
          restartAutoSlide();
        },
        { passive: true }
      );
    }

    updateSlides();
    startAutoSlide();

    return () => {
      stopAutoSlide();
    };
  }, [blogs.featured]);

  // Category Indicator Setup
  useEffect(() => {
    const wrapper = categoriesWrapperRef.current;
    if (!wrapper) return;

    const moveIndicatorTo = (btn) => {
      const indicator = indicatorRef.current;
      if (!indicator) return;

      const wRect = wrapper.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      const left = bRect.left - wRect.left + wrapper.scrollLeft;
      const width = bRect.width;
      indicator.style.left = left + "px";
      indicator.style.width = width + "px";
    };

    const activeBtn = wrapper.querySelector(".category-btn.active");
    if (activeBtn) {
      moveIndicatorTo(activeBtn);
    }

    const handleResize = () => {
      const activeBtn = wrapper.querySelector(".category-btn.active");
      if (activeBtn) moveIndicatorTo(activeBtn);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [activeCategory]);

  // Reviews Slider Setup - Smooth scrolling controlled by JS
  useEffect(() => {
    const track = document.querySelector(".reviews-track");
    if (!track || reviews.length === 0) return;

    let animationId;
    const speed = 0.5; // Pixel per frame - EDIT INI UNTUK UBAH KECEPATAN
    let isPaused = false;
    
    // Get single set width (original reviews only)
    const singleSetWidth = track.scrollWidth / 2;
    
    // Start from the end (right side) to scroll left to right
    let scrollPosition = singleSetWidth;

    const animate = () => {
      if (!isPaused) {
        scrollPosition -= speed; // Negative to go left to right
        
        // Reset to end when reaching start
        if (scrollPosition <= 0) {
          scrollPosition = singleSetWidth;
        }
        
        track.style.transform = `translateX(-${scrollPosition}px)`;
      }
      animationId = requestAnimationFrame(animate);
    };

    const handleMouseEnter = () => {
      isPaused = true;
    };

    const handleMouseLeave = () => {
      isPaused = false;
    };

    track.addEventListener("mouseenter", handleMouseEnter);
    track.addEventListener("mouseleave", handleMouseLeave);

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      track.removeEventListener("mouseenter", handleMouseEnter);
      track.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reviews]);

  const handleCategoryClick = (category) => {
    const categoriesOrder = ["pengetahuan", "tips", "hiburan", "promo"];
    const prevIndex = categoriesOrder.indexOf(prevCategoryRef.current);
    const newIndex = categoriesOrder.indexOf(category);
    let dir = null;
    if (newIndex > prevIndex) dir = "right";
    else if (newIndex < prevIndex) dir = "left";
    if (dir) setTransitionDirection(dir);
    prevCategoryRef.current = category;
    setActiveCategory(category);
  };

  // Clear transition direction after animation
  useEffect(() => {
    if (!transitionDirection) return;
    const t = setTimeout(() => setTransitionDirection(null), 420);
    return () => clearTimeout(t);
  }, [transitionDirection]);

  const filteredPosts = blogs.posts.filter((post) => {
    if (activeCategory === "semua" || activeCategory === "all") return true;
    return post.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  const fallbackPosts = blogs.posts.filter(
    (post) => post.category?.toLowerCase() === "pengetahuan"
  );

  const displayedPosts = filteredPosts.length > 0 ? filteredPosts : fallbackPosts;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const featuredForCategory = featuredContent[activeCategory] ||
    featuredContent.pengetahuan || { title: "", description: "" };

  return (
    <div className="blog-page">
      {/* Hero Section */}
      <section className="article-hero-section">
        <div className="article-hero-bg">
          <img src="/assets/image/image_blog/banner.webp" alt="HVAC Background" />
        </div>

        <div className="article-hero-overlay"></div>

        <div className="article-hero-container">
          <div className="article-hero-content">
            <h1 className="article-hero-title">BLOG</h1>
            <p className="article-hero-description">
              Dapatkan tips, info menarik, hiburan, dan promo seputar HVAC juga ada di sini.
            </p>
          </div>

          {/* Featured Slider */}
          <div className="featured-slider" ref={sliderRef}>
            {blogs.featured.map((f, idx) => (
              <a key={idx} href={f.link || "#"}>
                <img
                  className={`slide ${
                    idx === 0 ? "prev" : idx === 1 ? "active" : idx === 2 ? "next" : "hidden"
                  }`}
                  data-category={f.category || ""}
                  src={`/assets/image/image_blog/${f.image}`}
                  alt={f.alt || ""}
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Categories Section */}
      <section className="blog-categories-section">
        <div className="blog-categories-container">
          <div className="categories-wrapper" ref={categoriesWrapperRef}>
            <div className="category-indicator" ref={indicatorRef}></div>
            <button
              className={`category-btn ${activeCategory === "pengetahuan" ? "active" : ""}`}
              onClick={() => handleCategoryClick("pengetahuan")}
            >
              Pengetahuan
            </button>
            <button
              className={`category-btn ${activeCategory === "tips" ? "active" : ""}`}
              onClick={() => handleCategoryClick("tips")}
            >
              Tips
            </button>
            <button
              className={`category-btn ${activeCategory === "hiburan" ? "active" : ""}`}
              onClick={() => handleCategoryClick("hiburan")}
            >
              Hiburan
            </button>
            <button
              className={`category-btn ${activeCategory === "promo" ? "active" : ""}`}
              onClick={() => handleCategoryClick("promo")}
            >
              Promo
            </button>
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="blog-posts-section">
        <div className="blog-posts-container">
          {/* Featured Info */}
          <div className="featured-post">
            <h3>{featuredForCategory.title}</h3>
            <p>{featuredForCategory.description}</p>
          </div>

          {/* Blog Grid */}
          <div
            className={`blog-grid ${
              transitionDirection ? `slide-from-${transitionDirection}` : ""
            }`}
          >
            {displayedPosts.length > 0 ? (
              displayedPosts.map((post, index) => (
                <a
                  key={index}
                  href={`${post.link}`}
                  className="post"
                  data-category={post.category || ""}
                  style={{ ["--delay"]: `${index * 60}ms` }}
                >
                  <div className="post-header">
                    <p className="post-date">{formatDate(post.date)}</p>
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-excerpt">{post.excerpt}</p>
                  </div>
                  <div className="post-image">
                    <img
                      src={`/assets/image/image_blog/${post.image}`}
                      alt={post.title}
                    />
                  </div>
                </a>
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon">📝</div>
                <p className="empty-state-text">
                  Belum ada artikel untuk kategori ini
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="reviews-section">
        <div className="container">
          <h2>Reviews Costumer</h2>
          <div id="reviewsContainer">
            <div className="reviews-viewport">
              <div className="reviews-container">
                <div className="reviews-track">
                  {/* Original reviews */}
                  {reviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-header-top">
                        <div className="review-avatar-section">
                          <div className="review-avatar">
                            <img
                              src={`/assets/image/image_blog/${review.image}`}
                              alt={`${review.name} - review image`}
                            />
                          </div>
                          <div className="review-user-info">
                            <div className="review-name">{review.name}</div>
                            <div className="review-date">{review.date}</div>
                          </div>
                        </div>
                      </div>
                      <div className="review-text">{review.text}</div>
                      <div className="review-stars">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                  {/* Duplicate for seamless scroll */}
                  {reviews.map((review, index) => (
                    <div key={`dup-${index}`} className="review-card">
                      <div className="review-header-top">
                        <div className="review-avatar-section">
                          <div className="review-avatar">
                            <img
                              src={`/assets/image/image_blog/${review.image}`}
                              alt={`${review.name} - review image`}
                            />
                          </div>
                          <div className="review-user-info">
                            <div className="review-name">{review.name}</div>
                            <div className="review-date">{review.date}</div>
                          </div>
                        </div>
                      </div>
                      <div className="review-text">{review.text}</div>
                      <div className="review-stars">
                        {Array.from({ length: review.rating }, (_, i) => (
                          <span key={i} className="star">★</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;