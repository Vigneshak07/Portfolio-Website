// ===== TYPING ANIMATION =====
const typingText = document.querySelector(".typing");
const words = ["Web Developer", "UI/UX Designer", "Frontend Developer"];
let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;

function type() {
  const currentWord = words[wordIndex];

  if (isDeleting) {
    typingText.textContent = currentWord.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typingText.textContent = currentWord.substring(0, charIndex + 1);
    charIndex++;
  }

  if (!isDeleting && charIndex === currentWord.length) {
    setTimeout(() => (isDeleting = true), 1500);
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
  }

  setTimeout(type, isDeleting ? 80 : 120);
}
type();


// ===== SMOOTH SCROLLING + ACTIVE NAV =====
const navLinks = document.querySelectorAll(".aside .nav a");
const sections = document.querySelectorAll(".section");
navLinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    const href = this.getAttribute("href");

    // Only handle hash links
    if (href.startsWith("#")) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    }

    // Set active
    navLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// Highlight nav on scroll
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 100;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute["id"];
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
const navToggler = document.querySelector(".nav.toggler");
const aside = document.querySelector(".aside");

if (navToggler) {
  navToggler.addEventListener("click", () => {
    aside.classList.toggle("open");
  });
}

// Close aside when a nav link is clicked on mobile
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (window.innerWidth <= 1199) {
      aside.classList.remove("open");
    }
  });
});


// ===== CONTACT FORM VALIDATION =====
const sendBtn = document.querySelector(".contact .btn");
const formInputs = document.querySelectorAll(".contact .form-control");

// Get individual fields
const nameInput   = formInputs[0];
const emailInput  = formInputs[1];
const subjectInput = formInputs[2];
const messageInput = formInputs[3];

// Create error message helper
function showError(input, message) {
  clearError(input);
  input.style.border = "1.5px solid #e74c3c";

  const error = document.createElement("small");
  error.classList.add("form-error");
  error.style.cssText =
    "color:#e74c3c; font-size:12px; margin-left:15px; display:block; margin-top:5px;";
  error.textContent = message;
  input.parentElement.appendChild(error);
}

function clearError(input) {
  input.style.border = "";
  const existing = input.parentElement.querySelector(".form-error");
  if (existing) existing.remove();
}

function showSuccess(input) {
  clearError(input);
  input.style.border = "1.5px solid #2ecc71";
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


// Real-time validation on input
[nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
  if (input) {
    input.addEventListener("input", () => {
      if (input.value.trim() !== "") {
        if (input === emailInput && !isValidEmail(input.value)) {
          showError(input, "Enter a valid email address.");
        } else {
          showSuccess(input);
        }
      } else {
        clearError(input);
      }
    });
  }
});

// On Send button click
if (sendBtn) {
  sendBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let isValid = true;

    // Name
    if (!nameInput || nameInput.value.trim() === "") {
      showError(nameInput, "Name is required.");
      isValid = false;
    } else {
      showSuccess(nameInput);
    }

    // Email
    if (!emailInput || emailInput.value.trim() === "") {
      showError(emailInput, "Email is required.");
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, "Enter a valid email address.");
      isValid = false;
    } else {
      showSuccess(emailInput);
    }

    // Subject
    if (!subjectInput || subjectInput.value.trim() === "") {
      showError(subjectInput, "Subject is required.");
      isValid = false;
    } else {
      showSuccess(subjectInput);
    }

    // Message
    if (!messageInput || messageInput.value.trim() === "") {
      showError(messageInput, "Message cannot be empty.");
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, "Message must be at least 10 characters.");
      isValid = false;
    } else {
      showSuccess(messageInput);
    }

    // If all valid — show success popup
    if (isValid) {
      showToast("✅ Message sent successfully! I'll get back to you soon.");
      // Reset form
      [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
        input.value = "";
        input.style.border = "";
      });
    }
  });
}

// ===== TOAST NOTIFICATION =====
function showToast(message) {
  // Remove existing toast
  const existingToast = document.querySelector(".toast-msg");
  if (existingToast) existingToast.remove();

  const toast = document.createElement("div");
  toast.classList.add("toast-msg");
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    background: var(--skin-color, #ec1839);
    color: #fff;
    padding: 15px 25px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 500;
    z-index: 9999;
    box-shadow: 0 5px 20px rgba(0,0,0,0.2);
    animation: slideIn 0.4s ease;
  `;

  // Slide-in animation
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.5s ease";
    setTimeout(() => toast.remove(), 500);
  }, 4000);
}


// ===== SKILL BAR ANIMATION ON SCROLL =====
const skillItems = document.querySelectorAll(".progress-in");

const animateSkills = () => {
  skillItems.forEach((bar) => {
    const rect = bar.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      bar.style.transition = "width 1s ease";
      bar.style.width = bar.style.width; // trigger
    }
  });
};

// Save original widths and reset for animation
skillItems.forEach((bar) => {
  const originalWidth = bar.style.width;
  bar.setAttribute("data-width", originalWidth);
  bar.style.width = "0%";
});

window.addEventListener("scroll", () => {
  skillItems.forEach((bar) => {
    const rect = bar.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      bar.style.transition = "width 1.2s ease";
      bar.style.width = bar.getAttribute("data-width");
    }
  });
});
// Select all sections and nav links

// Hide all sections except active
function showSection(targetId) {
    sections.forEach(section => {
        section.classList.add("hidden");
    });

    document.querySelector(targetId).classList.remove("hidden");
}

// Active nav highlight
function updateNav(target) {
    navLinks.forEach(link => {
        link.classList.remove("active");
    });
    target.classList.add("active");
}

// Click event
navLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        const targetId = this.getAttribute("href");

        updateNav(this);
    });
});