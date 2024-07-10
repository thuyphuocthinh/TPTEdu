// header user
const headerButtons = document.querySelector(".header__buttons");
if (headerButtons) {
  headerButtons.addEventListener("click", () => {
    const headerDropdown = document.querySelector(".header__dropdown");
    headerDropdown.classList.toggle("hidden");
  });
}

document.addEventListener("click", (e) => {
  const headerDropdown = document.querySelector(".header__dropdown");
  if (!headerDropdown.contains(e.target) && !headerButtons.contains(e.target)) {
    headerDropdown.classList.add("hidden");
  }
});

// alert
const message = document.querySelector(".message.info");
const time = message.getAttribute("data-time");
const idTimeout = setTimeout(() => {
  message.style.animation = "fadeOut linear .5s forwards";
}, time);
const alertBtnClose = message.querySelector(".alert-btn-close");
if (alertBtnClose) {
  alertBtnClose.addEventListener("click", () => {
    clearTimeout(idTimeout);
    message.style.animation = "fadeOut linear .5s forwards";
  });
}
