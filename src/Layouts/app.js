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
// Observe elements with animation class
document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".animate-on-scroll").forEach((el) => {
        observer.observe(el);
    });
});
// Back to top button
window.addEventListener("scroll", function () {
    const scrollTop = document.querySelector(".scroll-top");
    if (scrollTop) {
        if (window.pageYOffset > 300) {
            scrollTop.style.display = "flex";
        } else {
            scrollTop.style.display = "none";
        }
    }
});
