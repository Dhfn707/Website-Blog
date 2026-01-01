import { useEffect } from "react";
import "./contact.css";

export default function Contact() {
  useEffect(() => {
    const form = document.getElementById("contactForm");
    const sendEmailBtn = document.getElementById("sendEmailBtn");
    const formAlert = document.getElementById("formAlert");

    // Email penerima
    const recipientEmail = "acservicesmobapp@gmail.com";

    // Send Gmail
    function sendViaGmail(e) {
      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const message = document.getElementById("message").value.trim();

      if (!name || !message) {
        showAlert("Mohon lengkapi Nama dan Pesan!", "error");
        return;
      }

      sendEmailBtn.disabled = true;
      sendEmailBtn.innerHTML = `
        <svg class="spinner" width="20" height="20" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" opacity="0.25"/>
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round"/>
        </svg>
        Mengirim...
      `;

      let emailBody = `Halo,

Saya ingin menghubungi Anda melalui form contact di website.

INFORMASI PENGIRIM:
━━━━━━━━━━━━━━━━━━━━
Nama        : ${name}`;

      if (phone) emailBody += `\nNo. Telepon : ${phone}`;

      emailBody += `

PESAN:
━━━━━━━━━━━━━━━━━━━━
${message}

━━━━━━━━━━━━━━━━━━━━
Email ini dikirim melalui Contact Form
Tanggal: ${new Date().toLocaleString("id-ID")}`;

      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${recipientEmail}&su=${encodeURIComponent(
        "[Website Contact]"
      )}&body=${encodeURIComponent(emailBody)}`;

      showAlert("Mengarahkan ke Gmail...", "success");

      setTimeout(() => {
        window.open(gmailUrl, "_blank");
        form.reset();

        sendEmailBtn.disabled = false;
        sendEmailBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
            </svg>
            Kirim via Gmail
        `;

        setTimeout(() => hideAlert(), 3000);
      }, 800);
    }

    // Show / Hide alert
    function showAlert(message, type) {
      formAlert.textContent = message;
      formAlert.className = `form-alert ${type} show`;
    }

    function hideAlert() {
      formAlert.classList.remove("show");
      setTimeout(() => {
        formAlert.textContent = "";
        formAlert.className = "form-alert";
      }, 300);
    }

    // Phone auto-format
    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", function (e) {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length > 13) value = value.slice(0, 13);
      e.target.value = value;
    });

    // Focus animation
    const inputs = form.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      input.addEventListener("focus", function () {
        this.parentElement.classList.add("focused");
      });

      input.addEventListener("blur", function () {
        if (!this.value) {
          this.parentElement.classList.remove("focused");
        }
      });
    });

    // Bind Gmail button
    sendEmailBtn.addEventListener("click", sendViaGmail);
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

    // Animasi untuk contact title dan content
    const contactTitle = document.querySelector(".contact-section h2");
    if (contactTitle) {
      contactTitle.classList.add("scroll-reveal");
      observer.observe(contactTitle);
    }

    const contactInfo = document.querySelector(".contact-info-bruh");
    if (contactInfo) {
      contactInfo.classList.add("scroll-reveal");
      observer.observe(contactInfo);
    }

    const contactIllustration = document.querySelector(".contact-illustration");
    if (contactIllustration) {
      contactIllustration.classList.add("scroll-reveal");
      observer.observe(contactIllustration);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section
      className="contact-section"
      style={{
        backgroundImage: `url(/assets/image/image_contact/contact_banner.webp)`,
      }}
    >
      <div className="service-hero-overlay"></div>

      <div className="contact-container">
        <h2>Hubungi Kami</h2>

        <div className="contact-info-bruh">
          <p>
            Kami menghargai setiap kritik dan saran yang anda berikan, karena
            setiap kritik dan saran membuat kami berkembang menjadi lebih baik.
          </p>

          {/* FORM */}
          <form id="contactForm" className="contact-form">
            <label htmlFor="name">Nama</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Masukkan nama Anda"
              required
            />

            <label htmlFor="phone">No. Telepon (Opsional)</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="08xx xxxx xxxx"
            />

            <label htmlFor="message">Pesan</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Tulis pesan Anda di sini..."
              required
            ></textarea>

            <div className="contact-form-buttons">
              <button type="submit" id="sendEmailBtn" className="btn-email">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                Kirim via Gmail
              </button>
            </div>
          </form>

          <div id="formAlert" className="form-alert"></div>
        </div>

        <div className="contact-illustration">
          <img
            src="/assets/image/image_contact/contact.webp"
            alt="Contact Illustration"
          />
        </div>
      </div>
    </section>
  );
}
