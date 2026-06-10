/* ================= toggle style switcher ============== */
const styleSwitcherToggle = document.querySelector(".style-switcher-toggler");
styleSwitcherToggle.addEventListener("click", () => {
    document.querySelector(".style-switcher").classList.toggle("open");
})
// hidden style switcher on scroll
window.addEventListener("scroll", () => {
    if(document.querySelector(".style-switcher").classList.contains("open"))
    {
document.querySelector(".style-switcher").classList.remove("open");
    }
})
/* ================= theme colors ============== */
const alternateStyles = document.querySelectorAll(".alternate-style");
function setActiveStyle(color)
{
    alternateStyles.forEach((style) => {
        if(color === style.getAttribute("title"))
        {
            style.removeAttribute("disabled");
        }
        else
        {
            style.setAttribute("disabled","true");
        }
    })
}

/* ================= theme light and dark mode ============== */
// Day / Night toggle — FIXED
const dayNight = document.querySelector(".day-night");
if (dayNight) {
  dayNight.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    const icon = dayNight.querySelector("i");
    if (icon) {
      icon.classList.toggle("fa-moon", !isDark);
      icon.classList.toggle("fa-sun", isDark);
    }
  });
}
