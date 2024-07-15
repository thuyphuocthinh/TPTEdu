const paginationBtns = document.querySelectorAll("[button-pagination]");
if (paginationBtns.length > 0) {
  paginationBtns.forEach((btn) => {
    const page = btn.getAttribute("button-pagination");
    btn.addEventListener("click", () => {
      const url = new URL(window.location.href);
      url.searchParams.set("page", page);
      window.location.href = url.href;
    });
  });
}
