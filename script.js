// ============================================================
//  PORTFOLIO — script.js
//  FIXES: 1) Dark mode instant toggle  2) Mobile name display
// ============================================================


// ===== DARK MODE — inject styles FIRST before anything else =====
// This must run before page renders to avoid flash of wrong theme
(function initTheme() {
  const style = document.createElement("style");
  style.id = "dark-mode-style";
  style.textContent = `
    body.dark {
      --bg-black-900: #151515 !important;
      --bg-black-100: #222222 !important;
      --bg-black-50:  #393939 !important;
      --text-black-900: #ffffff !important;
      --text-black-700: #e9e9e9 !important;
    }
    body.dark .aside,
    body.dark .section,
    body.dark .service-item-inner,
    body.dark .timeline,
    body.dark .contact-form,
    body.dark .form-control,
    body.dark .style-switcher {
      background-color: var(--bg-black-100) !important;
      color: var(--text-black-900) !important;
    }
    body.dark .form-control {
      color: var(--text-black-900) !important;
      border-color: var(--bg-black-50) !important;
    }
    body.dark .form-control::placeholder {
      color: var(--text-black-700) !important;
    }
  `;
  document.head.appendChild(style);

  // Apply saved theme IMMEDIATELY — no waiting for DOMContentLoaded
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
  }
})();


// ===== TYPING ANIMATION =====
const typingText = document.querySelector(".typing");
const words = ["Web Developer ", "UI/UX Designer ", "Frontend Developer "];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  if (!typingText) return;
  const currentWord = words[wordIndex];

  typingText.textContent = isDeleting
    ? currentWord.substring(0, charIndex--)
    : currentWord.substring(0, charIndex++);

  if (!isDeleting && charIndex === currentWord.length) {
    isDeleting = true;
    setTimeout(type, 1500);
    return;
  }
  if (isDeleting && charIndex < 0) {
    isDeleting = false;
    charIndex = 0;
    wordIndex = (wordIndex + 1) % words.length;
  }
  setTimeout(type, isDeleting ? 70 : 110);
}
type();


// ===== NAVIGATION =====
const navLinks = document.querySelectorAll(".aside .nav a");
const sections = document.querySelectorAll(".section");

navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth" });
    }
    navLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });
});


// ===== MOBILE NAV TOGGLER =====
const navToggler = document.querySelector(".nav-toggler");
const aside = document.querySelector(".aside");

if (navToggler) {
  navToggler.addEventListener("click", () => {
    aside.classList.toggle("open");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1199) {
      aside.classList.remove("open");
    }
  });
});


// ===== DARK / LIGHT MODE TOGGLE — FIXED =====
// Runs after DOM is ready so the button element exists
document.addEventListener("DOMContentLoaded", () => {

  const dayNightBtn  = document.querySelector(".day-night");
  const dayNightIcon = dayNightBtn?.querySelector("i");

  // Sync icon with current saved theme on load
  if (localStorage.getItem("theme") === "dark") {
    dayNightIcon?.classList.remove("fa-moon");
    dayNightIcon?.classList.add("fa-sun");
  }

  // ✅ FIXED: Toggle works instantly on first click — no refresh needed
  if (dayNightBtn) {
    dayNightBtn.addEventListener("click", () => {
      const isDark = document.body.classList.toggle("dark");

      // Save preference
      localStorage.setItem("theme", isDark ? "dark" : "light");

      // Swap icon instantly
      if (dayNightIcon) {
        if (isDark) {
          dayNightIcon.classList.remove("fa-moon");
          dayNightIcon.classList.add("fa-sun");
        } else {
          dayNightIcon.classList.remove("fa-sun");
          dayNightIcon.classList.add("fa-moon");
        }
      }
    });
  }


  // ===== CONTACT FORM VALIDATION =====
  const form = document.querySelector(".contact-form");

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showError(input, msg) {
    clearFeedback(input);
    input.style.border = "1.5px solid #e74c3c";
    const err = document.createElement("small");
    err.className = "form-error";
    err.style.cssText = "color:#e74c3c;font-size:12px;margin-left:15px;display:block;margin-top:4px;";
    err.textContent = msg;
    input.parentElement.appendChild(err);
  }

  function showSuccess(input) {
    clearFeedback(input);
    input.style.border = "1.5px solid #2ecc71";
  }

  function clearFeedback(input) {
    input.style.border = "";
    input.parentElement.querySelector(".form-error")?.remove();
  }

  if (form) {
    const nameInput    = form.querySelector("input[name='name']");
    const emailInput   = form.querySelector("input[name='email']");
    const subjectInput = form.querySelector("input[name='subject']");
    const messageInput = form.querySelector("textarea[name='message']");

    [nameInput, emailInput, subjectInput, messageInput].forEach((inp) => {
      inp.addEventListener("input", () => {
        const val = inp.value.trim();
        if (!val) { clearFeedback(inp); return; }
        if (inp === emailInput && !isValidEmail(val)) {
          showError(inp, "Enter a valid email address.");
        } else {
          showSuccess(inp);
        }
      });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let isValid = true;

      [nameInput, emailInput, subjectInput, messageInput].forEach(clearFeedback);

      if (!nameInput.value.trim()) {
        showError(nameInput, "Full name is required."); isValid = false;
      } else { showSuccess(nameInput); }

      if (!emailInput.value.trim()) {
        showError(emailInput, "Email is required."); isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showError(emailInput, "Enter a valid email address."); isValid = false;
      } else { showSuccess(emailInput); }

      if (!subjectInput.value.trim()) {
        showError(subjectInput, "Subject is required."); isValid = false;
      } else { showSuccess(subjectInput); }

      if (!messageInput.value.trim()) {
        showError(messageInput, "Message is required."); isValid = false;
      } else if (messageInput.value.trim().length < 10) {
        showError(messageInput, "Message must be at least 10 characters."); isValid = false;
      } else { showSuccess(messageInput); }

      if (!isValid) return;

      const sendBtn = form.querySelector("button[type='submit']");
      sendBtn.textContent = "Sending...";
      sendBtn.disabled = true;

      try {
        const res = await fetch("https://portfolio-backend-n1rs.onrender.com/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            subject: subjectInput.value.trim(),
            message: messageInput.value.trim()
          })
        });

        if (res.ok) {
          showToast("✅ Message sent successfully! I'll get back to you soon.");
          form.reset();
          [nameInput, emailInput, subjectInput, messageInput].forEach(clearFeedback);
        } else {
          showToast("❌ Failed to send message. Please try again.");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        showToast("⚠️ Server is waking up, please wait 30 seconds and try again.");
      }

      sendBtn.textContent = "Send Message";
      sendBtn.disabled = false;
    });
  }


  // ===== SKILL BAR ANIMATION =====
  const skillBars = document.querySelectorAll(".progress-in");

  skillBars.forEach((bar) => {
    bar.setAttribute("data-width", bar.style.width || "0%");
    bar.style.width = "0%";
    bar.style.transition = "none";
  });

  function animateSkillBars() {
    skillBars.forEach((bar) => {
      if (bar.getBoundingClientRect().top < window.innerHeight - 60) {
        bar.style.transition = "width 1.2s ease";
        bar.style.width = bar.getAttribute("data-width");
      }
    });
  }

  window.addEventListener("scroll", animateSkillBars);
  animateSkillBars();


  // ===== PROJECT IMAGE LIGHTBOX =====
  const lbStyle = document.createElement("style");
  lbStyle.textContent = `
    .lb-overlay { display:none; position:fixed; inset:0;
      background:rgba(0,0,0,0.88); z-index:9999;
      align-items:center; justify-content:center; }
    .lb-overlay.active { display:flex; }
    .lb-overlay img { max-width:90vw; max-height:90vh;
      border-radius:8px; box-shadow:0 0 40px rgba(0,0,0,0.5); }
    .lb-close { position:absolute; top:20px; right:30px;
      color:#fff; font-size:42px; cursor:pointer; font-weight:700; }
    .lb-close:hover { color:var(--skin-color,#ec1839); }
  `;
  document.head.appendChild(lbStyle);

  const lb = document.createElement("div");
  lb.className = "lb-overlay";
  lb.innerHTML = `<span class="lb-close">&times;</span><img src="" alt="Project Preview">`;
  document.body.appendChild(lb);

  const lbImg = lb.querySelector("img");
  document.querySelectorAll(".Projects-img img").forEach((img) => {
    img.style.cursor = "zoom-in";
    img.addEventListener("click", () => {
      lbImg.src = img.src;
      lb.classList.add("active");
    });
  });
  lb.querySelector(".lb-close").addEventListener("click", () => lb.classList.remove("active"));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.classList.remove("active"); });


  // ===== TOAST NOTIFICATION =====
  const toastStyle = document.createElement("style");
  toastStyle.textContent = `
    @keyframes toastIn  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
    @keyframes toastOut { from{opacity:1} to{opacity:0} }
    .toast-msg      { animation: toastIn  0.4s ease forwards; }
    .toast-msg.hide { animation: toastOut 0.4s ease forwards; }
  `;
  document.head.appendChild(toastStyle);

}); // end DOMContentLoaded


function showToast(msg) {
  document.querySelector(".toast-msg")?.remove();
  const t = document.createElement("div");
  t.className = "toast-msg";
  t.textContent = msg;
  t.style.cssText = `
    position:fixed; bottom:30px; right:30px;
    background:var(--skin-color,#ec1839); color:#fff;
    padding:14px 24px; border-radius:10px; font-size:15px;
    font-weight:500; z-index:9999; max-width:320px;
    box-shadow:0 5px 20px rgba(0,0,0,0.2);
  `;
  document.body.appendChild(t);
  setTimeout(() => {
    t.classList.add("hide");
    setTimeout(() => t.remove(), 400);
  }, 4000);
}
