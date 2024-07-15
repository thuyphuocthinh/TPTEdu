const formSearch = document.querySelector("[form-search]");
if (formSearch) {
  formSearch.addEventListener("submit", (e) => {
    e.preventDefault();
    const inputSearch = formSearch.querySelector('[name="keyword"]');
    const keyword = inputSearch.value;
    const url = new URL(window.location.href + "search");
    if (keyword) {
      url.searchParams.set("keyword", keyword);
    } else {
      url.searchParams.delete("keyword");
    }
    window.location.href = url.href;
  });
}
