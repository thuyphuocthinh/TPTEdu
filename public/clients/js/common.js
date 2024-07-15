// header user
const headerButtons = document.querySelectorAll(".header__buttons");
if (headerButtons.length > 0) {
  headerButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const closestParent = btn.closest("div");
      const headerDropdown = closestParent.querySelector(".header__dropdown");
      headerDropdown.classList.toggle("hidden");
    });
  });
}

document.addEventListener("click", (e) => {
  const headerDropdowns = document.querySelectorAll(".header__dropdown");
  headerDropdowns.forEach((item, index) => {
    if (!item.contains(e.target) && !headerButtons[index].contains(e.target)) {
      item.classList.add("hidden");
    }
  });
});

// alert
const message = document.querySelector(".message.info");
let time, alertBtnClose, idTimeout;
if (message) {
  time = message.getAttribute("data-time");
  idTimeout = setTimeout(() => {
    message.style.animation = "fadeOut linear .5s forwards";
  }, time);
  alertBtnClose = message.querySelector(".alert-btn-close");
  if (alertBtnClose) {
    alertBtnClose.addEventListener("click", () => {
      clearTimeout(idTimeout);
      message.style.animation = "fadeOut linear .5s forwards";
    });
  }
}

// carousel
$(document).ready(function () {
  $("#myCarousel").owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: {
        items: 1,
      },
      600: {
        items: 1,
      },
      1000: {
        items: 1,
      },
    },
  });
});