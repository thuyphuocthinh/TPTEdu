const formSelectSort = document.querySelector("[form-select-sort]");
if (formSelectSort) {
  formSelectSort.addEventListener("change", (e) => {
    const { value } = e.target;
    const seperatorIndex = value.indexOf("-");
    const sortKey = value.slice(0, seperatorIndex);
    const sortValue = value.slice(seperatorIndex + 1, value.length);
    const url = new URL(window.location.href);
    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);
    window.location.href = url.href;
  });
}
